const CONSENT_KEY = "fdn_analytics_consent";

type AnalyticsParameter = string | number | boolean;
type AnalyticsParameters = Record<string, AnalyticsParameter>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fdnAnalytics?: {
      setConsent: (granted: boolean) => void;
      track: (eventName: string, parameters?: AnalyticsParameters) => void;
    };
  }

  interface DocumentEventMap {
    "fdn:analytics": CustomEvent<{ eventName: string; parameters?: AnalyticsParameters }>;
  }
}

let measurementId: string | null = null;
let enabled = false;
let scriptRequested = false;

const validMeasurementId = (value: string | undefined) =>
  value && /^G-[A-Z0-9]+$/.test(value) ? value : null;

const ensureGoogleTag = () => {
  if (!measurementId || scriptRequested) return;
  scriptRequested = true;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("config", measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    anonymize_ip: true,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.append(script);
};

export const setAnalyticsConsent = (granted: boolean) => {
  if (!measurementId) return;
  enabled = granted;
  try {
    window.localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
  } catch {
    // Consent still applies for this page when storage is unavailable.
  }

  if (granted) {
    ensureGoogleTag();
    window.gtag?.("consent", "update", { analytics_storage: "granted" });
  } else {
    window.gtag?.("consent", "update", { analytics_storage: "denied" });
  }
};

export const trackAnalyticsEvent = (eventName: string, parameters: AnalyticsParameters = {}) => {
  if (!enabled || !measurementId || !window.gtag) return;
  window.gtag("event", eventName, { ...parameters, transport_type: "beacon" });
};

export const initializeAnalytics = (configuredMeasurementId?: string) => {
  measurementId = validMeasurementId(configuredMeasurementId);
  if (!measurementId) return;

  try {
    enabled = window.localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    enabled = false;
  }
  if (enabled) ensureGoogleTag();

  window.fdnAnalytics = { setConsent: setAnalyticsConsent, track: trackAnalyticsEvent };

  document.addEventListener("fdn:analytics", (event) => {
    trackAnalyticsEvent(event.detail.eventName, event.detail.parameters);
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>("[data-analytics-provider-outbound]");
    if (!link) return;
    trackAnalyticsEvent("provider_outbound_click", {
      provider_id: link.dataset.providerId ?? "unknown",
      provider_slug: link.dataset.providerSlug ?? "unknown",
      placement: link.dataset.placement ?? "unknown",
    });
  });
};
