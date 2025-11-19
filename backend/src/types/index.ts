export interface Profile {
  id: number;
  linkedin_url: string;
  name: string | null;
  company: string | null;
  position: string | null;
  status: ProfileStatus;
  connection_request_sent: boolean;
  connection_accepted: boolean;
  connection_request_attempts: number;
  created_at: Date;
  updated_at: Date;
}

export type ProfileStatus = 
  | 'pending'
  | 'connection_request_sent'
  | 'connection_accepted'
  | 'first_message_sent'
  | 'second_message_sent'
  | 'third_message_sent'
  | 'no_reply'
  | 'error';

export interface Message {
  id: number;
  profile_id: number;
  message_type: MessageType;
  content: string;
  sent_at: Date | null;
  status: 'pending' | 'sent' | 'failed';
  error_message: string | null;
  created_at: Date;
}

export type MessageType = 'initial' | 'followup_1' | 'followup_2' | 'followup_3';

export interface ConnectionAttempt {
  id: number;
  profile_id: number;
  attempt_number: number;
  status: 'success' | 'failed';
  error_message: string | null;
  attempted_at: Date;
}

export interface MessageTemplate {
  key: string;
  value: string;
}

