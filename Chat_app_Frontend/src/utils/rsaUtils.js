// src/utils/rsaUtils.js

export async function generateRSAKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  return keyPair;
}

export async function exportPublicKeyToPEM(publicKey) {
  const exported = await window.crypto.subtle.exportKey("spki", publicKey);
  const exportedAsString = String.fromCharCode(...new Uint8Array(exported));
  const exportedAsBase64 = window.btoa(exportedAsString);
  return `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64.match(/.{1,64}/g).join("\n")}\n-----END PUBLIC KEY-----`;
}

export async function exportPrivateKeyToPEM(privateKey) {
  const exported = await window.crypto.subtle.exportKey("pkcs8", privateKey);
  const exportedAsString = String.fromCharCode(...new Uint8Array(exported));
  const exportedAsBase64 = window.btoa(exportedAsString);
  return `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64.match(/.{1,64}/g).join("\n")}\n-----END PRIVATE KEY-----`;
}
