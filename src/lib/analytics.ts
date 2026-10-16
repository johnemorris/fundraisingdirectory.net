import {
  ANALYTICS_CONSENT_DENIED,
  ANALYTICS_CONSENT_GRANTED,
  ANALYTICS_CONSENT_KEY,
} from "./analyticsConsent.ts";

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

const setGoogleAnalyticsDisabled = (disabled: boolean) => {
  if (!measurementId) return;
  (window as Window & Record<string, unknown>)[`ga-disable-${measurementId}`] = disabled;
};

const clearGoogleAnalyticsCookies = () => {
  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0]?.trim())
    .filter((name): name is string => Boolean(name && (/^_ga(?:_|$)/.test(name) || /^_gi[dt]$/.test(name) || /^_gat(?:_|$)/.test(name))));
  const hostname = window.location.hostname;
  const labels = hostname.split(".").filter(Boolean);
  const rootDomain = labels.length > 1 ? labels.slice(-2).join(".") : null;
  const domains = new Set([hostname, `.${hostname}`, rootDomain, rootDomain ? `.${rootDomain}` : null]);

  cookieNames.forEach((name) => {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    domains.forEach((domain) => {
      if (domain && domain !== "localhost") {
        document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${domain}; SameSite=Lax`;
      }
    });
  });
};

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
    window.localStorage.setItem(
      ANALYTICS_CONSENT_KEY,
      granted ? ANALYTICS_CONSENT_GRANTED : ANALYTICS_CONSENT_DENIED,
    );
  } catch {
    // Consent still applies for this page when storage is unavailable.
  }

  if (granted) {
    setGoogleAnalyticsDisabled(false);
    ensureGoogleTag();
    window.gtag?.("consent", "update", { analytics_storage: "granted" });
  } else {
    window.gtag?.("consent", "update", { analytics_storage: "denied" });
    setGoogleAnalyticsDisabled(true);
    clearGoogleAnalyticsCookies();
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
    enabled = window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === ANALYTICS_CONSENT_GRANTED;
  } catch {
    enabled = false;
  }
  setGoogleAnalyticsDisabled(!enabled);
  if (enabled) ensureGoogleTag();

  window.fdnAnalytics = { setConsent: setAnalyticsConsent, track: trackAnalyticsEvent };
  document.dispatchEvent(new CustomEvent("fdn:analytics-ready"));

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
