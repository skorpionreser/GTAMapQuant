export const authSessionExpiredEvent = 'gtamapquant:auth-session-expired'

export function notifyAuthSessionExpired() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(authSessionExpiredEvent))
  }
}
