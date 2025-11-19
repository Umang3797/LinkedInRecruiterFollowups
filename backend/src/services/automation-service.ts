import { db } from '../db/init';
import {
  getProfileInfo,
  sendConnectionRequest,
  sendMessage,
  checkIfMessagingOpen,
  checkIfConnectionAccepted,
  getIsLoggedIn,
} from './linkedin-automation';

export async function processProfile(profileUrl: string) {
  try {
    // Check if profile already exists
    const existing = db.prepare('SELECT * FROM profiles WHERE linkedin_url = ?').get(profileUrl) as any;

    let profileId: number;

    if (existing) {
      profileId = existing.id;
      
      // SPECIAL CASE: If profile already has connection request sent, check if accepted and send 1st message
      if (existing.status === 'connection_request_sent' && existing.connection_request_sent === 1) {
        console.log(`Profile ${profileId} already has connection request. Checking if accepted...`);
        
        // Check if connection is now accepted
        const connectionAccepted = await checkIfConnectionAccepted(profileUrl);
        
        if (connectionAccepted) {
          // Connection accepted! Send 1st message immediately
          const template = db.prepare('SELECT value FROM settings WHERE key = ?').get('initial_message') as any;

          if (template) {
            let messageContent = template.value;
            messageContent = messageContent.replace('{name}', existing.name || 'there');

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

              return { success: true, profileId, message: 'Connection was already accepted, 1st message sent' };
            }
          }
        } else {
          // Still pending, return without doing anything
          return { success: true, profileId, message: 'Connection request still pending' };
        }
      }
      
      // If profile exists but already has messages sent, just return
      if (existing.status !== 'pending' && existing.status !== 'connection_request_sent') {
        return { success: true, profileId, message: 'Profile already processed' };
      }
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

    // Check if messaging is open BEFORE sending connection request
    const messagingOpen = await checkIfMessagingOpen(profileUrl);

    // Send connection request
    const connectionSent = await sendConnectionRequest(profileUrl);

    if (connectionSent) {
      db.prepare(
        `UPDATE profiles 
         SET connection_request_sent = 1,
             connection_request_attempts = connection_request_attempts + 1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      ).run(profileId);

      // SCENARIO 1: If messaging is open, send message immediately (this is the 1st message)
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
          } else {
            // Message failed but connection sent
            db.prepare(
              `UPDATE profiles 
               SET status = 'connection_request_sent',
                   updated_at = CURRENT_TIMESTAMP
               WHERE id = ?`
            ).run(profileId);
          }
        }
      } else {
        // SCENARIO 2: Messaging is disabled - wait for connection acceptance
        // Set status to connection_request_sent (will check for acceptance later)
        db.prepare(
          `UPDATE profiles 
           SET status = 'connection_request_sent',
               updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`
        ).run(profileId);
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

// Function to check and send first message after connection acceptance
export async function checkAndSendFirstMessage(profileId: number) {
  try {
    const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(profileId) as any;
    if (!profile) {
      return { success: false, error: 'Profile not found' };
    }

    // Only process if status is connection_request_sent (waiting for acceptance)
    if (profile.status !== 'connection_request_sent') {
      return { success: false, error: 'Profile not in correct status' };
    }

    // Check if connection is now accepted
    const connectionAccepted = await checkIfConnectionAccepted(profile.linkedin_url);

    if (connectionAccepted) {
      // Connection accepted, now send the 1st message
      const template = db.prepare('SELECT value FROM settings WHERE key = ?').get('initial_message') as any;

      if (template) {
        let messageContent = template.value;
        messageContent = messageContent.replace('{name}', profile.name || 'there');

        const messageSent = await sendMessage(profile.linkedin_url, messageContent);

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

          return { success: true, message: 'First message sent after connection acceptance' };
        } else {
          return { success: false, error: 'Failed to send message' };
        }
      } else {
        return { success: false, error: 'Message template not found' };
      }
    } else {
      return { success: false, message: 'Connection not yet accepted' };
    }
  } catch (error) {
    console.error('Error checking and sending first message:', error);
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
