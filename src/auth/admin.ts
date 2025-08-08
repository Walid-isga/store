export const ADMIN_PASSWORD_HASH = "0040647c62845407cf8a6864ecdac6d6c5d2060671ef153eae823ff2a98e5489";

// Hash utilitaire (Web Crypto)
export async function sha256(text: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  try {
    const hash = await sha256(password);
    return hash === ADMIN_PASSWORD_HASH;
  } catch {
    return false;
  }
}

// ---- Session ----
// Utilise sessionStorage pour expirer à la fermeture de l’onglet.
// Si tu préfères persister après redémarrage du navigateur, remplace par localStorage.
const FLAG = "is_admin";

export function setAdminSession() {
  sessionStorage.setItem(FLAG, "1");
}

export function isAdmin(): boolean {
  return sessionStorage.getItem(FLAG) === "1";
}

export function logoutAdmin() {
  sessionStorage.removeItem(FLAG);
}
