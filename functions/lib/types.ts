export interface Env {
  TURNSTILE_SECRET: string;
  RESEND_API_KEY?: string;
  CONTACT_EMAIL: string;
  RETREATS_LOG_KV?: KVNamespace;
}
