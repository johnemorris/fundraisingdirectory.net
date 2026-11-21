export const ANALYTICS_CONSENT_KEY = "fdn_analytics_consent";
export const ANALYTICS_CONSENT_GRANTED = "granted";
export const ANALYTICS_CONSENT_DENIED = "denied";

export type AnalyticsConsent = typeof ANALYTICS_CONSENT_GRANTED | typeof ANALYTICS_CONSENT_DENIED;
