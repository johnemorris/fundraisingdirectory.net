import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createAnalyticsBuildConfig } from "../scripts/analytics-config.mjs";

test("analytics build configuration is optional in development and required in production", () => {
  assert.deepEqual(createAnalyticsBuildConfig({ env: {}, location: "development" }), {
    measurementId: null,
    required: false,
  });
  assert.throws(
    () => createAnalyticsBuildConfig({ env: {}, location: "production" }),
    /PUBLIC_GA_MEASUREMENT_ID is required/,
  );
  assert.throws(
    () => createAnalyticsBuildConfig({ env: { ANALYTICS_REQUIRED: "1" }, location: "preview" }),
    /PUBLIC_GA_MEASUREMENT_ID is required/,
  );
});

test("analytics build configuration validates and normalizes a supplied GA4 ID", () => {
  assert.deepEqual(createAnalyticsBuildConfig({
    env: { PUBLIC_GA_MEASUREMENT_ID: "  G-TEST123  " },
    location: "production",
  }), {
    measurementId: "G-TEST123",
    required: true,
  });
  assert.throws(
    () => createAnalyticsBuildConfig({
      env: { PUBLIC_GA_MEASUREMENT_ID: "UA-123" },
      location: "development",
    }),
    /valid GA4 Measurement ID/,
  );
});

test("consent UI is first party, reversible, and reuses the existing analytics API", async () => {
  const [component, footer, layout, analytics, privacy] = await Promise.all([
    readFile("src/components/AnalyticsConsent.astro", "utf8"),
    readFile("src/components/SiteFooter.astro", "utf8"),
    readFile("src/layouts/SiteLayout.astro", "utf8"),
    readFile("src/lib/analytics.ts", "utf8"),
    readFile("src/pages/privacy.astro", "utf8"),
  ]);

  assert.match(component, /data-analytics-choice="denied">Decline/);
  assert.match(component, /data-analytics-choice="granted">Accept analytics/);
  assert.match(component, /window\.fdnAnalytics\?\.setConsent\(granted\)/);
  assert.match(component, /if \(!readPreference\(\)\) openPreferences\(\)/);
  assert.match(footer, /data-analytics-preferences hidden>Cookie preferences/);
  assert.match(layout, /<SiteFooter \/>\s*<AnalyticsConsent \/>/);
  assert.match(analytics, /if \(enabled\) ensureGoogleTag\(\)/);
  assert.match(analytics, /clearGoogleAnalyticsCookies\(\)/);
  assert.match(analytics, /ga-disable-/);
  assert.match(privacy, /Before that[\s\S]*does not request the Google Analytics script/);
});

test("analytics queues page views and custom events only after consent", async () => {
  const stored = new Map();
  const appendedScripts = [];
  const expiredCookies = [];
  const listeners = new Map();
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalCustomEvent = globalThis.CustomEvent;

  const documentMock = {
    addEventListener: (name, listener) => listeners.set(name, listener),
    createElement: () => ({}),
    dispatchEvent: () => true,
    head: { append: (script) => appendedScripts.push(script) },
  };
  Object.defineProperty(documentMock, "cookie", {
    get: () => "_ga=one; _ga_TEST=two; app_session=keep",
    set: (value) => expiredCookies.push(value),
  });
  globalThis.document = documentMock;
  globalThis.window = {
    localStorage: {
      getItem: (key) => stored.get(key) ?? null,
      setItem: (key, value) => stored.set(key, value),
    },
    location: { hostname: "fundraisingdirectory.net" },
  };
  globalThis.CustomEvent = class CustomEvent {
    constructor(type) { this.type = type; }
  };

  try {
    const analytics = await import("../src/lib/analytics.ts?analytics-integration");
    analytics.initializeAnalytics("G-TEST123");
    assert.equal(appendedScripts.length, 0);
    assert.equal(globalThis.window.dataLayer, undefined);

    analytics.setAnalyticsConsent(true);
    assert.equal(appendedScripts[0].src, "https://www.googletagmanager.com/gtag/js?id=G-TEST123");
    assert.ok(globalThis.window.dataLayer.some((entry) => entry[0] === "config" && entry[1] === "G-TEST123"));

    analytics.trackAnalyticsEvent("provider_search", { query_length: 5 });
    assert.ok(globalThis.window.dataLayer.some((entry) => (
      entry[0] === "event"
      && entry[1] === "provider_search"
      && entry[2].query_length === 5
    )));

    analytics.setAnalyticsConsent(false);
    assert.equal(stored.get("fdn_analytics_consent"), "denied");
    assert.equal(globalThis.window["ga-disable-G-TEST123"], true);
    assert.ok(expiredCookies.some((cookie) => cookie.startsWith("_ga=")));
    assert.ok(expiredCookies.some((cookie) => cookie.startsWith("_ga_TEST=")));
    assert.ok(expiredCookies.every((cookie) => !cookie.startsWith("app_session=")));
  } finally {
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
    globalThis.CustomEvent = originalCustomEvent;
  }
});
