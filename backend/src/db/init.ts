import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Create database directory if it doesn't exist
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Database file path
const dbPath = path.join(dbDir, 'linkedin_followups.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export function initializeDatabase() {
  try {
    // Create tables
    db.exec(`
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
      )
    `);

    db.exec(`
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
      )
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS connection_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER NOT NULL,
        attempt_number INTEGER NOT NULL,
        status TEXT NOT NULL,
        error_message TEXT,
        attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
      )
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default message templates
    const insertTemplate = db.prepare(`
      INSERT OR IGNORE INTO settings (key, value) 
      VALUES (?, ?)
    `);

    insertTemplate.run('initial_message', 'Hi {name}, I came across your profile and would love to connect!');
    insertTemplate.run('followup_1', 'Hi {name}, I wanted to follow up on my previous message. Would you be open to a quick conversation?');
    insertTemplate.run('followup_2', "Hi {name}, I understand you're busy. If you have a moment, I'd appreciate the opportunity to connect.");
    insertTemplate.run('followup_3', "Hi {name}, this will be my last message. If you're interested in connecting, please let me know.");

    console.log('Database initialized successfully at:', dbPath);
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export { db };
