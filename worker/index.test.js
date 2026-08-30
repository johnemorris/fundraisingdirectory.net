import assert from "node:assert/strict";
import test from "node:test";
import { legacyRoutes } from "../src/data/legacyRoutes.js";
import worker, { resolveLegacyCanonicalPath } from "./index.js";

const assets = {
  fetch() {
    return new Response("Not found", { status: 404 });
  },
};

test("normalizes known legacy route variants to one canonical URL", () => {
  const cases = new Map([
    ["/Educational-Resources.html/", "/Educational-Resources.html"],
    ["/Educational-reSources.html/", "/Educational-Resources.html"],
    ["/educational-Resources.html", "/Educational-Resources.html"],
    ["/Gymnastics-Fundraising", "/Gymnastics-Fundraising.html"],
    ["/gymnastics-fundraising/", "/Gymnastics-Fundraising.html"],
    ["/4-h-fundraising", "/4-H-Fundraising.html"],
  ]);

  for (const [input, expected] of cases) {
    assert.equal(resolveLegacyCanonicalPath(input), expected);
  }
});

test("does not match unrelated or ambiguous paths", () => {
  const unknownPaths = [
    "/Educational-Resources-extra.html",
    "/Educational-Resources.html/extra",
    "/not-a-real-route",
    "/",
  ];

  for (const pathname of unknownPaths) {
    assert.equal(resolveLegacyCanonicalPath(pathname), null);
  }
});

test("the full legacy inventory has unique, extensionless-safe matches", () => {
  const lowercasePaths = legacyRoutes.map((route) => route.path.toLowerCase());

  assert.equal(new Set(lowercasePaths).size, legacyRoutes.length);

  for (const route of legacyRoutes) {
    assert.equal(
      resolveLegacyCanonicalPath(`/${route.path}`),
      `/${route.path}.html`,
    );
    assert.equal(
      resolveLegacyCanonicalPath(`/${route.path}.html/`),
      `/${route.path}.html`,
    );
  }
});

test("redirects permanently without dropping the query string", async () => {
  const response = await worker.fetch(
    new Request(
      "https://fundraisingdirectory.net/educational-resources.html/?source=legacy",
    ),
    { ASSETS: assets },
  );

  assert.equal(response.status, 301);
  assert.equal(
    response.headers.get("location"),
    "https://fundraisingdirectory.net/Educational-Resources.html?source=legacy",
  );
});

test("passes unknown paths through to asset 404 handling", async () => {
  const response = await worker.fetch(
    new Request("https://fundraisingdirectory.net/not-a-real-route"),
    { ASSETS: assets },
  );

  assert.equal(response.status, 404);
});
