import { db } from '../db/init';
import {
  getProfileInfo,
  sendConnectionRequest,
  sendMessage,
  checkIfMessagingOpen,
  getIsLoggedIn,
} from './linkedin-automation';

export async function processProfile(profileUrl: string) {
  try {
    // Check if profile already exists
    const existing = db.prepare('SELECT * FROM profiles WHERE linkedin_url = ?').get(profileUrl);

    let profileId: number;

    if (existing) {
      profileId = (existing as any).id;
    } else {
      // Get profile info
      const profileInfo = await getProfileInfo(profileUrl);

      // Insert profile
      const insert = db.prepare(
        `INSERT INTO profiles (linkedin_url, name, company, position, status)
         VALUES (?, ?, ?, ?, 'pending')`
      );
      const result = insert.run(profileUrl, profileInfo.name, profileInfo.company, profileInfo.position);
      profileId = result.lastInsertRowid as number;
    }

    // Check if messaging is open
    const messagingOpen = await checkIfMessagingOpen(profileUrl);

    // Send connection request
    const connectionSent = await sendConnectionRequest(profileUrl);

    if (connectionSent) {
      db.prepare(
        `UPDATE profiles 
         SET connection_request_sent = 1,
             connection_request_attempts = connection_request_attempts + 1,
             status = 'connection_request_sent',
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      ).run(profileId);

      // If messaging is open, send initial message
      if (messagingOpen) {
        const template = db.prepare('SELECT value FROM settings WHERE key = ?').get('initial_message') as any;

        if (template) {
          const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(profileId) as any;
          let messageContent = template.value;
          messageContent = messageContent.replace('{name}', profile.name || 'there');

          const messageSent = await sendMessage(profileUrl, messageContent);

          if (messageSent) {
            db.prepare(
              `UPDATE profiles 
               SET connection_accepted = 1,
                   status = 'first_message_sent',
                   updated_at = CURRENT_TIMESTAMP
               WHERE id = ?`
            ).run(profileId);

            db.prepare(
              `INSERT INTO messages (profile_id, message_type, content, sent_at, status)
               VALUES (?, 'initial', ?, CURRENT_TIMESTAMP, 'sent')`
            ).run(profileId, messageContent);
          }
        }
      }
    } else {
      // Log failed attempt
      db.prepare(
        `INSERT INTO connection_attempts (profile_id, attempt_number, status, error_message)
         VALUES (?, ?, 'failed', 'Connection request failed')`
      ).run(profileId, 1);
    }

    return { success: true, profileId };
  } catch (error) {
    console.error('Error processing profile:', error);
    throw error;
  }
}

export async function sendFollowUpMessage(profileId: number, messageType: 'followup_1' | 'followup_2' | 'followup_3') {
  try {
    const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(profileId) as any;
    if (!profile) {
      throw new Error('Profile not found');
    }

    const template = db.prepare('SELECT value FROM settings WHERE key = ?').get(messageType) as any;

    if (!template) {
      throw new Error('Message template not found');
    }

    let messageContent = template.value;
    messageContent = messageContent.replace('{name}', profile.name || 'there');

    const messageSent = await sendMessage(profile.linkedin_url, messageContent);

    if (messageSent) {
      let nextStatus: string;
      if (messageType === 'followup_1') {
        nextStatus = 'second_message_sent';
      } else if (messageType === 'followup_2') {
        nextStatus = 'third_message_sent';
      } else {
        nextStatus = 'no_reply';
      }

      db.prepare(
        `UPDATE profiles 
         SET status = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      ).run(nextStatus, profileId);

      db.prepare(
        `INSERT INTO messages (profile_id, message_type, content, sent_at, status)
         VALUES (?, ?, ?, CURRENT_TIMESTAMP, 'sent')`
      ).run(profileId, messageType, messageContent);

      return { success: true };
    } else {
      db.prepare(
        `INSERT INTO messages (profile_id, message_type, content, status, error_message)
         VALUES (?, ?, ?, 'failed', 'Failed to send message')`
      ).run(profileId, messageType, messageContent);

      return { success: false, error: 'Failed to send message' };
    }
  } catch (error) {
    console.error('Error sending follow-up message:', error);
    throw error;
  }
}
