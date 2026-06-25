// ============================================================
// 🔐 UNIFIED ENCRYPTION UTILITY - ARKEE PLATFORM
// ============================================================
// Handles:
//   1. Payment Data Encryption (Cards, UPI, Wallets)
//   2. Bank Details Encryption (AES-256 via Web Crypto API)
//   3. Data Masking & Validation
//   4. Security Utilities
// ============================================================

// ============================================================
// 🔑 ENCRYPTION KEYS & CONSTANTS
// ============================================================

const PAYMENT_ENCRYPTION_KEY = 'ARKEE_SECURE_PAY_2024_KEY_V1';

const BANK_ENCRYPTION_CONFIG = {
  algorithm: 'AES-GCM',
  keyLength: 256,
  ivLength: 12,
  tagLength: 128,
};

// ============================================================
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 SECTION 1: PAYMENT DATA ENCRYPTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// XOR-based encryption for payment data (browser-safe)
// Used for: Card details, UPI, Wallets
// ============================================================

// Convert string to array of char codes
const stringToCharCodes = (str) => [...str].map((c) => c.charCodeAt(0));

// XOR-based encryption with key rotation
const xorEncrypt = (data, key) => {
  const dataBytes = stringToCharCodes(data);
  const keyBytes = stringToCharCodes(key);
  return dataBytes.map((byte, i) => byte ^ keyBytes[i % keyBytes.length]);
};

// Convert bytes to Base64-safe string
const bytesToBase64 = (bytes) => {
  return btoa(String.fromCharCode(...bytes));
};

// SHA-256-like checksum (browser-safe simplified version)
const generateChecksum = (data) => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
};

/**
 * 💳 Encrypt payment data (Cards, UPI, etc.)
 * Uses double XOR encryption with timestamp
 * @param {Object} paymentData - Payment data object
 * @returns {Object} Encrypted payload with checksum
 */
export const encryptPaymentData = (paymentData) => {
  try {
    const jsonStr = JSON.stringify(paymentData);
    const timestamp = Date.now().toString(36);
    const dataWithTimestamp = `${timestamp}|${jsonStr}`;

    // Double encryption layer
    const firstPass = xorEncrypt(dataWithTimestamp, PAYMENT_ENCRYPTION_KEY);
    const firstPassStr = String.fromCharCode(
      ...firstPass.map((b) => (b % 94) + 33)
    );
    const secondPass = xorEncrypt(
      firstPassStr,
      PAYMENT_ENCRYPTION_KEY.split('').reverse().join('')
    );

    const encrypted = bytesToBase64(secondPass);

    return {
      encryptedData: encrypted,
      checksum: generateChecksum(jsonStr),
      timestamp,
      version: 'v2',
    };
  } catch (error) {
    console.error('❌ Payment encryption failed:', error);
    throw new Error('Payment encryption failed');
  }
};

// ============================================================
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 SECTION 2: BANK DATA ENCRYPTION (AES-256 via Web Crypto)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Military-grade AES-256-GCM encryption
// Used for: Bank account numbers, IFSC, holder names
// ============================================================

// Generate a fresh AES-256-GCM key
const generateAESKey = async () => {
  return await window.crypto.subtle.generateKey(
    {
      name: BANK_ENCRYPTION_CONFIG.algorithm,
      length: BANK_ENCRYPTION_CONFIG.keyLength,
    },
    true,   // extractable - needed to store/transport
    ['encrypt', 'decrypt']
  );
};

/**
 * 🏦 Encrypt sensitive bank data using AES-256-GCM
 * @param {string} plainText - Sensitive data to encrypt
 * @returns {Object} Encrypted bundle with key, iv, and hash
 */
export const encryptData = async (plainText) => {
  try {
    if (!plainText || typeof plainText !== 'string') {
      throw new Error('Invalid input: plainText must be a non-empty string');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);

    // Generate unique key and IV per encryption
    const key = await generateAESKey();
    const iv = window.crypto.getRandomValues(
      new Uint8Array(BANK_ENCRYPTION_CONFIG.ivLength)
    );

    // Encrypt
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: BANK_ENCRYPTION_CONFIG.algorithm,
        iv,
        tagLength: BANK_ENCRYPTION_CONFIG.tagLength,
      },
      key,
      data
    );

    // Export key so it can be stored/transported securely
    const exportedKey = await window.crypto.subtle.exportKey('raw', key);

    return {
      encryptedData: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv),
      key: Array.from(new Uint8Array(exportedKey)),
      timestamp: Date.now(),
      hash: await hashData(plainText),         // Integrity check
      algorithm: BANK_ENCRYPTION_CONFIG.algorithm,
      version: 'aes-v1',
    };
  } catch (error) {
    console.error('🔒 Bank data encryption failed:', error);
    throw new Error('ENCRYPTION_FAILED');
  }
};

/**
 * 🔓 Decrypt AES-256-GCM encrypted bank data
 * @param {Object} encryptedObj - Encrypted bundle from encryptData()
 * @returns {string} Decrypted plain text
 */
export const decryptData = async (encryptedObj) => {
  try {
    const { encryptedData, iv, key } = encryptedObj;

    if (!encryptedData || !iv || !key) {
      throw new Error('Invalid encrypted object: missing required fields');
    }

    // Re-import the key
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      new Uint8Array(key),
      { name: BANK_ENCRYPTION_CONFIG.algorithm },
      false,    // not extractable after re-import
      ['decrypt']
    );

    // Decrypt
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: BANK_ENCRYPTION_CONFIG.algorithm,
        iv: new Uint8Array(iv),
        tagLength: BANK_ENCRYPTION_CONFIG.tagLength,
      },
      cryptoKey,
      new Uint8Array(encryptedData)
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('🔓 Bank data decryption failed:', error);
    throw new Error('DECRYPTION_FAILED');
  }
};

// ============================================================
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 SECTION 3: HASHING & INTEGRITY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ============================================================

/**
 * 🔍 SHA-256 hash via Web Crypto API
 * Used for data integrity verification
 * @param {string} data - Data to hash
 * @returns {string} Hex string hash
 */
export const hashData = async (data) => {
  try {
    const encoder = new TextEncoder();
    const hashBuffer = await window.crypto.subtle.digest(
      'SHA-256',
      encoder.encode(data)
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('❌ Hashing failed:', error);
    // Fallback to simple checksum if Web Crypto not available
    return generateChecksum(data);
  }
};

/**
 * ✅ Validate data integrity against a stored hash
 * @param {string} data - Data to verify
 * @param {string} expectedHash - Hash to compare against
 * @returns {boolean}
 */
export const validateIntegrity = async (data, expectedHash) => {
  const currentHash = await hashData(data);
  return currentHash === expectedHash;
};

// ============================================================
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 SECTION 4: SESSION & TOKEN UTILITIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ============================================================

/**
 * 🎫 Generate cryptographically secure session token
 * @returns {string} 64-char hex token
 */
export const generateSessionToken = () => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * 🔑 Generate a short nonce for request signing
 * @returns {string} 16-char alphanumeric nonce
 */
export const generateNonce = () => {
  const array = new Uint8Array(8);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) =>
    byte.toString(36).padStart(2, '0')
  ).join('').slice(0, 16);
};

// ============================================================
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 SECTION 5: MASKING UTILITIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Visual masking for display - data is still encrypted in state
// ============================================================

/**
 * 🏦 Mask bank account number for display
 * Shows only last 4 digits
 * @param {string} accNum - Full account number
 * @returns {string} Masked account number
 */
export const maskAccountNumber = (accNum) => {
  if (!accNum || accNum.length < 4) return '●●●●';
  const lastFour = accNum.slice(-4);
  const maskedPart = '●●●● ●●●● ';
  return `${maskedPart}${lastFour}`;
};

/**
 * 🏛️ Mask IFSC code for display
 * Shows only first 4 chars (bank code)
 * @param {string} ifsc - Full IFSC code
 * @returns {string} Masked IFSC
 */
export const maskIFSC = (ifsc) => {
  if (!ifsc || ifsc.length < 4) return '●●●●●●●●●●●';
  return ifsc.slice(0, 4) + '●●●●●●●';
};

/**
 * 💳 Mask card number for display
 * Shows last 4 digits with spaces
 * @param {string} cardNumber - Full card number
 * @returns {string} Masked card number e.g. •••• •••• •••• 4242
 */
export const maskCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length < 4) return cleaned;
  const lastFour = cleaned.slice(-4);
  const masked = cleaned.slice(0, -4).replace(/./g, '•');
  return `${masked}${lastFour}`.replace(/(.{4})/g, '$1 ').trim();
};

/**
 * 📲 Mask UPI ID for display
 * Masks middle characters of the VPA
 * @param {string} upiId - Full UPI ID e.g. john@upi
 * @returns {string} Masked UPI e.g. j••n@upi
 */
export const maskUPIId = (upiId) => {
  if (!upiId || !upiId.includes('@')) return upiId;
  const [name, provider] = upiId.split('@');
  if (!provider) return upiId;
  const maskedName =
    name.charAt(0) +
    '•'.repeat(Math.max(name.length - 2, 1)) +
    name.charAt(name.length - 1);
  return `${maskedName}@${provider}`;
};

/**
 * 👤 Mask account holder name
 * Shows first and last char of each word
 * @param {string} name - Full name
 * @returns {string} Masked name e.g. J••• D••
 */
export const maskHolderName = (name) => {
  if (!name) return '●●●●● ●●●●●';
  return name
    .split(' ')
    .map((word) => {
      if (word.length <= 2) return word;
      return word[0] + '•'.repeat(word.length - 2) + word[word.length - 1];
    })
    .join(' ');
};

// ============================================================
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 SECTION 6: CARD UTILITIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ============================================================

/**
 * ✅ Validate card number using Luhn Algorithm
 * @param {string} number - Card number (with or without spaces)
 * @returns {boolean}
 */
export const validateCardNumber = (number) => {
  const cleaned = number.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleaned)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * 🔍 Detect card network from number prefix
 * @param {string} number - Card number
 * @returns {string} Card type: 'visa' | 'mastercard' | 'amex' | 'rupay' | 'maestro' | 'unknown'
 */
export const detectCardType = (number) => {
  const cleaned = number.replace(/\s/g, '');

  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    rupay: /^(508|60|65|81|82)/,
    maestro: /^(5018|5020|5038|6304)/,
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(cleaned)) return type;
  }
  return 'unknown';
};

/**
 * 🖊️ Format card number with spaces every 4 digits
 * @param {string} value - Raw card number input
 * @returns {string} Formatted e.g. "4242 4242 4242 4242"
 */
export const formatCardNumber = (value) => {
  const cleaned = value.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
};

/**
 * 📅 Format expiry date as MM/YY
 * @param {string} value - Raw expiry input
 * @returns {string} Formatted e.g. "12/26"
 */
export const formatExpiry = (value) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};

/**
 * ✅ Validate expiry date
 * @param {string} expiry - Formatted expiry "MM/YY"
 * @returns {boolean}
 */
export const validateExpiry = (expiry) => {
  if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) return false;
  const [month, year] = expiry.split('/').map(Number);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
};

/**
 * ✅ Validate CVV
 * @param {string} cvv - CVV string
 * @param {string} cardType - Card type (amex has 4-digit CVV)
 * @returns {boolean}
 */
export const validateCVV = (cvv, cardType = 'visa') => {
  const length = cardType === 'amex' ? 4 : 3;
  return new RegExp(`^\\d{${length}}$`).test(cvv);
};

// ============================================================
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 SECTION 7: UPI UTILITIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ============================================================

/**
 * ✅ Validate UPI ID format
 * @param {string} upiId - UPI VPA e.g. john@okicici
 * @returns {boolean}
 */
export const validateUPIId = (upiId) => {
  return /^[\w.-]+@[\w]+$/.test(upiId); // ✅ just - at end or use literal
};

/**
 * 🏦 Detect UPI provider from handle
 * @param {string} upiId - UPI VPA
 * @returns {Object} Provider info with name and icon
 */
export const detectUPIProvider = (upiId) => {
  if (!upiId || !upiId.includes('@')) return null;
  const handle = upiId.split('@')[1]?.toLowerCase();

  const providers = {
    okicici:    { name: 'ICICI Bank',     icon: '🟠', color: '#f37920' },
    okhdfcbank: { name: 'HDFC Bank',      icon: '🔷', color: '#004c8f' },
    oksbi:      { name: 'State Bank',     icon: '🏛️', color: '#1a237e' },
    okaxis:     { name: 'Axis Bank',      icon: '🟣', color: '#97144d' },
    ybl:        { name: 'PhonePe',        icon: '💜', color: '#5f259f' },
    ibl:        { name: 'PhonePe',        icon: '💜', color: '#5f259f' },
    axl:        { name: 'PhonePe',        icon: '💜', color: '#5f259f' },
    paytm:      { name: 'Paytm',          icon: '💙', color: '#00baf2' },
    gpay:       { name: 'Google Pay',     icon: '🔵', color: '#4285f4' },
    apl:        { name: 'Amazon Pay',     icon: '🟡', color: '#ff9900' },
    upi:        { name: 'BHIM UPI',       icon: '🇮🇳', color: '#138808' },
    icici:      { name: 'ICICI Bank',     icon: '🟠', color: '#f37920' },
    hdfcbank:   { name: 'HDFC Bank',      icon: '🔷', color: '#004c8f' },
    sbi:        { name: 'State Bank',     icon: '🏛️', color: '#1a237e' },
  };

  return providers[handle] || { name: handle?.toUpperCase(), icon: '💳', color: '#607d8b' };
};

// ============================================================
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 SECTION 8: BANK ACCOUNT UTILITIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ============================================================

/**
 * ✅ Validate IFSC code format
 * @param {string} ifsc - IFSC code
 * @returns {boolean}
 */
export const validateIFSC = (ifsc) => {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc?.toUpperCase());
};

/**
 * ✅ Validate bank account number
 * @param {string} accountNumber - Account number
 * @returns {{ valid: boolean, message: string }}
 */
export const validateAccountNumber = (accountNumber) => {
  const cleaned = accountNumber?.replace(/\s/g, '');
  if (!cleaned) return { valid: false, message: 'Account number is required' };
  if (!/^\d+$/.test(cleaned)) return { valid: false, message: 'Only digits allowed' };
  if (cleaned.length < 9) return { valid: false, message: 'Minimum 9 digits required' };
  if (cleaned.length > 18) return { valid: false, message: 'Maximum 18 digits allowed' };
  return { valid: true, message: 'Valid account number' };
};

/**
 * 🏦 Extract bank code from IFSC
 * @param {string} ifsc - IFSC code
 * @returns {string} 4-char bank code
 */
export const getBankCodeFromIFSC = (ifsc) => {
  if (!ifsc || ifsc.length < 4) return '';
  return ifsc.substring(0, 4).toUpperCase();
};

// ============================================================
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 SECTION 9: SECURITY UTILITIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ============================================================

/**
 * 🔒 Sanitize input - strip dangerous characters
 * @param {string} input - Raw user input
 * @param {'text'|'numeric'|'alphanumeric'|'name'} type - Input type
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input, type = 'text') => {
  if (!input) return '';
  const sanitizers = {
    text:         (v) => v.replace(/<[^>]*>/g, '').trim(),
    numeric:      (v) => v.replace(/\D/g, ''),
    alphanumeric: (v) => v.replace(/[^A-Za-z0-9]/g, '').toUpperCase(),
    name:         (v) => v.replace(/[^A-Za-z\s.]/g, '').trim(),
    ifsc:         (v) => v.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 11),
    upi:          (v) => v.replace(/[^A-Za-z0-9@._-]/g, '').toLowerCase(),
  };
  return (sanitizers[type] || sanitizers.text)(String(input));
};

/**
 * 🔐 Check if Web Crypto API is available
 * @returns {boolean}
 */
export const isWebCryptoAvailable = () => {
  return !!(
    window.crypto &&
    window.crypto.subtle &&
    typeof window.crypto.subtle.encrypt === 'function'
  );
};

/**
 * 📊 Calculate password / data strength score
 * @param {string} data - Any string to evaluate
 * @returns {{ score: number, label: string, color: string }}
 */
export const calculateStrength = (data) => {
  if (!data) return { score: 0, label: 'Empty', color: '#e0e0e0' };
  let score = 0;
  if (data.length >= 8)  score++;
  if (data.length >= 12) score++;
  if (/[A-Z]/.test(data)) score++;
  if (/[0-9]/.test(data)) score++;
  if (/[^A-Za-z0-9]/.test(data)) score++;

  const levels = [
    { score: 0, label: 'Very Weak', color: '#f44336' },
    { score: 1, label: 'Weak',      color: '#ff5722' },
    { score: 2, label: 'Fair',      color: '#ff9800' },
    { score: 3, label: 'Good',      color: '#ffc107' },
    { score: 4, label: 'Strong',    color: '#4caf50' },
    { score: 5, label: 'Very Strong', color: '#2196f3' },
  ];

  return levels[Math.min(score, 5)];
};

// ============================================================
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 SECTION 10: RATE LIMITING (Client-side helper)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚠️ Server-side rate limiting is the real protection.
// This is a UX helper to prevent accidental rapid calls.
// ============================================================

const rateLimitMap = new Map();

/**
 * 🚦 Client-side rate limit check
 * @param {string} key - Action identifier
 * @param {number} maxAttempts - Max allowed in window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {{ allowed: boolean, remainingAttempts: number, resetIn: number }}
 */
export const checkRateLimit = (key, maxAttempts = 5, windowMs = 900000) => {
  const now = Date.now();
  const record = rateLimitMap.get(key) || { attempts: [], windowStart: now };

  // Remove expired attempts outside the window
  record.attempts = record.attempts.filter((t) => now - t < windowMs);

  if (record.attempts.length >= maxAttempts) {
    const oldestAttempt = record.attempts[0];
    const resetIn = Math.ceil((windowMs - (now - oldestAttempt)) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      resetIn,                  // seconds until reset
    };
  }

  record.attempts.push(now);
  rateLimitMap.set(key, record);

  return {
    allowed: true,
    remainingAttempts: maxAttempts - record.attempts.length,
    resetIn: 0,
  };
};

/**
 * 🗑️ Clear rate limit for a key
 * @param {string} key - Action identifier
 */
export const clearRateLimit = (key) => {
  rateLimitMap.delete(key);
};

// ============================================================
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 SECTION 11: EXPORTS QUICK REFERENCE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// PAYMENT:
//   encryptPaymentData()     → Encrypt card/UPI/wallet data
//
// BANK:
//   encryptData()            → AES-256 encrypt bank fields
//   decryptData()            → AES-256 decrypt bank fields
//   validateAccountNumber()  → Validate account number
//   validateIFSC()           → Validate IFSC format
//   getBankCodeFromIFSC()    → Extract bank code
//
// CARD:
//   validateCardNumber()     → Luhn algorithm check
//   detectCardType()         → Visa/MC/Amex/RuPay/Maestro
//   formatCardNumber()       → Add spaces every 4 digits
//   formatExpiry()           → Format as MM/YY
//   validateExpiry()         → Validate not expired
//   validateCVV()            → Validate CVV length
//
// UPI:
//   validateUPIId()          → Check VPA format
//   detectUPIProvider()      → GPay/PhonePe/Paytm etc.
//
// MASKING:
//   maskAccountNumber()      → Show last 4 of account
//   maskIFSC()               → Show only bank code
//   maskCardNumber()         → Show last 4 of card
//   maskUPIId()              → Mask VPA name
//   maskHolderName()         → Mask name chars
//
// HASHING:
//   hashData()               → SHA-256 hash string
//   validateIntegrity()      → Check hash matches
//
// SECURITY:
//   generateSessionToken()   → 64-char secure token
//   generateNonce()          → 16-char request nonce
//   sanitizeInput()          → Strip dangerous chars
//   isWebCryptoAvailable()   → Check browser support
//   calculateStrength()      → Data strength score
//   checkRateLimit()         → Client-side rate limit
//   clearRateLimit()         → Reset rate limit key
// ============================================================