import cron from 'node-cron';
import { db } from '../db/init';
import { sendFollowUpMessage } from './automation-service';

// Run every hour to check for follow-ups
export function startScheduler() {
  cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled follow-up check...');
    
    try {
      // Get profiles that need follow-up messages
      // SQLite uses datetime('now', '-3 days') instead of NOW() - INTERVAL '3 days'
      const profiles = db.prepare(`
        SELECT p.*, 
               MAX(m.sent_at) as last_message_sent
        FROM profiles p
        LEFT JOIN messages m ON p.id = m.profile_id AND m.status = 'sent'
        WHERE p.connection_accepted = 1
          AND p.status IN ('first_message_sent', 'second_message_sent', 'third_message_sent')
        GROUP BY p.id
        HAVING MAX(m.sent_at) IS NOT NULL
          AND datetime(MAX(m.sent_at)) < datetime('now', '-3 days')
      `).all();

      for (const profile of profiles as any[]) {
        const status = profile.status;
        let nextMessageType: 'followup_1' | 'followup_2' | 'followup_3' | null = null;
        let nextStatus: string | null = null;

        if (status === 'first_message_sent') {
          nextMessageType = 'followup_1';
          nextStatus = 'second_message_sent';
        } else if (status === 'second_message_sent') {
          nextMessageType = 'followup_2';
          nextStatus = 'third_message_sent';
        } else if (status === 'third_message_sent') {
          nextMessageType = 'followup_3';
          nextStatus = 'no_reply';
        }

        if (nextMessageType && nextStatus) {
          // Check if message already sent
          const existingMessage = db.prepare(
            'SELECT id FROM messages WHERE profile_id = ? AND message_type = ? AND status = ?'
          ).get(profile.id, nextMessageType, 'sent');

          if (!existingMessage) {
            console.log(`Sending ${nextMessageType} to profile ${profile.id}`);
            await sendFollowUpMessage(profile.id, nextMessageType);
          }
        }
      }
    } catch (error) {
      console.error('Error in scheduler:', error);
    }
  });

  console.log('Scheduler started - checking for follow-ups every hour');
}
