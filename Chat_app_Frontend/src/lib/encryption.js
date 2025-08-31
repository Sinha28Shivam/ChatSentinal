// src/lib/encryption.js
import { Buffer } from 'buffer';

// Helper function to convert a string to an ArrayBuffer
function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// Helper function to decode URL-safe Base64
function urlSafeBase64Decode(str) {
  let standardBase64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (standardBase64.length % 4) {
    standardBase64 += '=';
  }
  return atob(standardBase64);
}

// Helper function to encode to URL-safe Base64
function urlSafeBase64Encode(buffer) {
    return Buffer.from(buffer).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export async function generateAESKey() {
  return await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptWithAES(text, aesKey, iv) {
  const encoder = new TextEncoder();
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encoder.encode(text)
  );
  return urlSafeBase64Encode(encrypted);
}

export async function encryptAESKeyWithRSA(aesKey, publicKeyPem) {
  const rawKey = await window.crypto.subtle.exportKey("raw", aesKey);
  const publicKey = await importRSAPublicKey(publicKeyPem);
  const encryptedKey = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    rawKey
  );
  return urlSafeBase64Encode(encryptedKey);
}

export async function importRSAPublicKey(pem) {
  const pemBody = pem.replace(/-----.*-----/g, "").replace(/\s/g, "");
  const binaryDer = str2ab(atob(pemBody));
  return window.crypto.subtle.importKey(
    "spki",
    binaryDer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  );
}

export async function importRSAPrivateKey(pem) {
  const pemBody = pem.replace(/-----.*-----/g, "").replace(/\s/g, "");
  const binaryDer = str2ab(atob(pemBody));
  return window.crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["decrypt"]
  );
}

export async function decryptAESKeyWithRSA(encryptedKeyBase64, privateKey) {
  const encryptedKey = str2ab(urlSafeBase64Decode(encryptedKeyBase64));
  const decryptedKey = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    encryptedKey
  );
  return window.crypto.subtle.importKey(
    "raw",
    decryptedKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function decryptWithAES(encryptedBase64, aesKey, ivBase64) {
  const encrypted = str2ab(urlSafeBase64Decode(encryptedBase64));
  const iv = str2ab(urlSafeBase64Decode(ivBase64));
  
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encrypted
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}