import crypto from 'crypto-browserify';
import { Buffer } from 'buffer';

window.Buffer = Buffer; // Ensure Buffer is globally available

// Helper: Encrypt message
async function encryptMessage(plainText, receiverPublicKeyPem) {
  // 1. Generate AES key and IV
  const aesKey = crypto.randomBytes(32); // AES-256
  const iv = crypto.randomBytes(16);     // AES IV

  // 2. Encrypt message using AES
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
  let encryptedMessage = cipher.update(plainText, 'utf8', 'base64');
  encryptedMessage += cipher.final('base64');

  // 3. Encrypt AES key using RSA (receiver's public key)
  const encryptedAesKey = crypto.publicEncrypt(
    { key: receiverPublicKeyPem, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
    aesKey
  ).toString('base64');

  return {
    encryptedMessage,
    encryptedAesKey,
    iv: iv.toString('base64')
  };
}
