import { chromium, Browser, Page, BrowserContext } from 'playwright';
import { pool } from '../db/init';
import dotenv from 'dotenv';

dotenv.config();

let browser: Browser | null = null;
let context: BrowserContext | null = null;
let page: Page | null = null;
let isLoggedIn = false;

const HEADLESS = process.env.PLAYWRIGHT_HEADLESS === 'true';
const SLOW_MO = parseInt(process.env.PLAYWRIGHT_SLOW_MO || '1000');

export async function initializeBrowser() {
  if (browser) return;

  browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: SLOW_MO,
  });

  context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  });

  page = await context.newPage();
  console.log('Browser initialized');
}

export async function loginToLinkedIn(email?: string, password?: string) {
  if (!page) await initializeBrowser();
  if (!page) throw new Error('Failed to initialize browser');

  try {
    await page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle' });
    
    // If credentials provided, auto-login
    if (email && password) {
      await page.fill('#username', email);
      await page.fill('#password', password);
      await page.click('button[type="submit"]');
      await page.waitForURL('**/feed**', { timeout: 30000 });
    } else {
      // Manual login - wait for user to login
      console.log('Please login to LinkedIn in the browser window...');
      await page.waitForURL('**/feed**', { timeout: 300000 }); // 5 minutes timeout
    }

    // Save cookies for future sessions
    const cookies = await context!.cookies();
    // Store cookies in database or file for persistence
    
    isLoggedIn = true;
    console.log('Successfully logged in to LinkedIn');
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function getProfileInfo(profileUrl: string) {
  if (!page || !isLoggedIn) {
    throw new Error('Not logged in to LinkedIn');
  }

  try {
    await page.goto(profileUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Extract profile information
    const name = await page.textContent('h1.text-heading-xlarge').catch(() => null);
    const headline = await page.textContent('.text-body-medium.break-words').catch(() => null);
    
    // Try to get company and position from headline or experience
    let company = null;
    let position = null;
    
    if (headline) {
      const parts = headline.split(' at ');
      if (parts.length > 1) {
        position = parts[0].trim();
        company = parts[1].trim();
      } else {
        position = headline;
      }
    }

    return {
      name: name || null,
      company: company || null,
      position: position || null,
    };
  } catch (error) {
    console.error('Error getting profile info:', error);
    return { name: null, company: null, position: null };
  }
}

export async function sendConnectionRequest(profileUrl: string): Promise<boolean> {
  if (!page || !isLoggedIn) {
    throw new Error('Not logged in to LinkedIn');
  }

  try {
    await page.goto(profileUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Check if "Connect" button exists
    const connectButton = await page.$('button:has-text("Connect")').catch(() => null);
    
    if (!connectButton) {
      // Check if already connected or connection sent
      const connectedText = await page.textContent('body').catch(() => '');
      if (connectedText.includes('Pending') || connectedText.includes('Message')) {
        return true; // Already connected or request sent
      }
      return false;
    }

    await connectButton.click();
    await page.waitForTimeout(1000);

    // Handle "Add a note" modal if it appears
    const addNoteButton = await page.$('button:has-text("Add a note")').catch(() => null);
    if (addNoteButton) {
      await addNoteButton.click();
      await page.waitForTimeout(500);
      // Close without note for now (can be customized)
      const sendButton = await page.$('button:has-text("Send")').catch(() => null);
      if (sendButton) {
        await sendButton.click();
      }
    } else {
      // Direct send
      const sendButton = await page.$('button:has-text("Send")').catch(() => null);
      if (sendButton) {
        await sendButton.click();
      }
    }

    await page.waitForTimeout(2000);
    return true;
  } catch (error) {
    console.error('Error sending connection request:', error);
    return false;
  }
}

export async function sendMessage(profileUrl: string, message: string): Promise<boolean> {
  if (!page || !isLoggedIn) {
    throw new Error('Not logged in to LinkedIn');
  }

  try {
    await page.goto(profileUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Click on Message button
    const messageButton = await page.$('button:has-text("Message")').catch(() => null);
    if (!messageButton) {
      throw new Error('Message button not found - connection may not be accepted');
    }

    await messageButton.click();
    await page.waitForTimeout(1000);

    // Wait for message box to appear
    const messageBox = await page.$('div[contenteditable="true"][aria-label*="message"]').catch(() => null);
    if (!messageBox) {
      throw new Error('Message box not found');
    }

    await messageBox.fill(message);
    await page.waitForTimeout(500);

    // Send message
    const sendButton = await page.$('button:has-text("Send")').catch(() => null);
    if (sendButton) {
      await sendButton.click();
      await page.waitForTimeout(2000);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
}

export async function checkIfMessagingOpen(profileUrl: string): Promise<boolean> {
  if (!page || !isLoggedIn) {
    return false;
  }

  try {
    await page.goto(profileUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Check if "Message" button is available (not grayed out)
    const messageButton = await page.$('button:has-text("Message"):not([disabled])').catch(() => null);
    return messageButton !== null;
  } catch (error) {
    return false;
  }
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
    context = null;
    page = null;
    isLoggedIn = false;
  }
}

export function getIsLoggedIn() {
  return isLoggedIn;
}

