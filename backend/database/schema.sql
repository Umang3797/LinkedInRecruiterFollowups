-- LinkedIn Recruiter Followups Database Schema
-- SQLite Database Schema

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  linkedin_url TEXT UNIQUE NOT NULL,
  name TEXT,
  company TEXT,
  position TEXT,
  status TEXT DEFAULT 'pending',
  connection_request_sent INTEGER DEFAULT 0,
  connection_accepted INTEGER DEFAULT 0,
  connection_request_attempts INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER NOT NULL,
  message_type TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_at DATETIME,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Connection attempts table
CREATE TABLE IF NOT EXISTS connection_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER NOT NULL,
  attempt_number INTEGER NOT NULL,
  status TEXT NOT NULL,
  error_message TEXT,
  attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Settings table (for message templates)
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Default message templates
INSERT OR IGNORE INTO settings (key, value) VALUES 
  ('initial_message', 'Hi {name}, I came across your profile and would love to connect!'),
  ('followup_1', 'Hi {name}, I wanted to follow up on my previous message. Would you be open to a quick conversation?'),
  ('followup_2', 'Hi {name}, I understand you''re busy. If you have a moment, I''d appreciate the opportunity to connect.'),
  ('followup_3', 'Hi {name}, this will be my last message. If you''re interested in connecting, please let me know.');

