import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { FUNDRAISING_METHODS } from "../src/data/taxonomies/methods.ts";
import { ORGANIZATION_TYPES } from "../src/data/taxonomies/organizations.ts";
import {
  buildProviderInquiry,
  PROVIDER_AUDIENCE_OPTIONS,
  PROVIDER_METHOD_OPTIONS,
  providerInquiryEmail,
  providerInquiryReview,
} from "../src/lib/providerSubmission.ts";

test("provider wizard maps friendly choices to canonical method and audience IDs", () => {
  const data = new FormData();
  data.set("organization_name", "Example Fundraising");
  data.set("website", "https://example.com/");
  data.set("introduction", "We help community groups raise funds.");
  data.append("fundraising_methods", "product-sales");
  data.append("fundraising_methods", "collection-reuse-fundraising");
  data.append("fundraising_methods", "not-a-method");
  data.set("fundraising_other_selected", "true");
  data.append("best_fit", "schools");
  data.append("best_fit", "clubs-community");
  data.append("best_fit", "not-an-audience");
  data.set("contact_name", "Taylor Example");
  data.set("contact_email", "taylor@example.com");

  const inquiry = buildProviderInquiry(data);
  assert.deepEqual(inquiry.fundraising.methods, ["product-sales", "collection-reuse-fundraising"]);
  assert.equal(inquiry.fundraising.otherSelected, true);
  assert.deepEqual(inquiry.bestFit.organizations, ["schools", "clubs-community"]);
  assert.equal(inquiry.contact.email, "taylor@example.com");
});

test("wizard options are sourced from complete canonical taxonomies", () => {
  assert.deepEqual(PROVIDER_METHOD_OPTIONS.map(({ id }) => id), [...FUNDRAISING_METHODS]);
  assert.deepEqual(PROVIDER_AUDIENCE_OPTIONS.map(({ id }) => id), [...ORGANIZATION_TYPES]);
  assert.equal(PROVIDER_METHOD_OPTIONS.find(({ id }) => id === "direct-donations")?.label, "Online donations");
  assert.equal(PROVIDER_AUDIENCE_OPTIONS.find(({ id }) => id === "individuals-personal-causes")?.label, "Individuals & families");
});

test("review and email output remain human-readable", () => {
  const data = new FormData();
  data.set("organization_name", "Example Fundraising");
  data.set("website", "https://example.com/");
  data.set("introduction", "A concise introduction.");
  data.append("fundraising_methods", "direct-donations");
  data.append("best_fit", "nonprofits-charities");
  data.set("contact_name", "Taylor Example");
  data.set("contact_email", "taylor@example.com");
  const inquiry = buildProviderInquiry(data);
  const review = JSON.stringify(providerInquiryReview(inquiry));
  const email = providerInquiryEmail(inquiry);

  assert.match(review, /Online donations/);
  assert.match(review, /Nonprofits & charities/);
  assert.doesNotMatch(`${review}\n${email.body}`, /direct-donations|nonprofits-charities|taxonomy|canonical|slug|schema/i);
  assert.match(email.body, /does not automatically create or publish a listing/);
});

test("wizard renders exactly one initial step and avoids provider-facing internal jargon", async () => {
  const component = await readFile("src/components/ProviderListingWizard.astro", "utf8");
  const stepTags = component.match(/<section class="wizard-step" data-wizard-step(?: hidden)?>/g) ?? [];
  assert.equal(stepTags.length, 5);
  assert.equal(stepTags.filter((tag) => !tag.includes(" hidden")).length, 1);
  const visibleCopy = component
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ");
  assert.doesNotMatch(visibleCopy, /taxonomy|slug|canonical|provenance|editorial boundary|repository-aware|verification|completeness|schema/i);
});

test("provider profile keeps logos secondary to its full-width identity row", async () => {
  const [page, styles, visual, logo] = await Promise.all([
    readFile("src/pages/providers/[slug].astro", "utf8"),
    readFile("src/styles/providers.css", "utf8"),
    readFile("src/components/ProviderVisual.astro", "utf8"),
    readFile("src/components/ProviderLogo.astro", "utf8"),
  ]);
  assert.ok(page.indexOf('class="provider-identity"') < page.indexOf('class="provider-hero-main"'));
  assert.match(page, /identity\.name\.length > 14/);
  assert.match(page, /!identity\.name\.includes\(" "\) && identity\.name\.length > 10/);
  assert.match(styles, /\.provider-identity\s*\{[\s\S]*?grid-column:\s*1 \/ -1/);
  assert.match(styles, /word-break:\s*normal/);
  assert.match(styles, /overflow-wrap:\s*normal/);
  assert.match(styles, /hyphens:\s*none/);
  assert.doesNotMatch(visual, /initials|provider-identity-art|provider-visual-fallback/);
  assert.match(visual, /object-fit:\s*contain/);
  assert.ok(page.indexOf("<ProviderLogo") > page.indexOf('class="hero-summary"'));
  assert.ok(page.indexOf("<ProviderLogo") < page.indexOf('class="hero-methods"'));
  assert.match(page, /const hasVisual = Boolean\(visual\)/);
  assert.match(logo, /width:\s*9rem/);
  assert.match(logo, /height:\s*3\.75rem/);
  assert.match(logo, /object-fit:\s*contain/);
  assert.match(logo, /object-position:\s*center/);
  const ctaGroup = page.match(/<div class="external-cta-group">([\s\S]*?)<\/div>/)?.[1] ?? "";
  assert.match(ctaGroup, /external-note/);
  assert.match(ctaGroup, /verified-date/);
});

test("the shared canvas and default surface use cool neutral and white tokens", async () => {
  const globalStyles = await readFile("src/styles/global.css", "utf8");
  assert.match(globalStyles, /--page-canvas:\s*#f5f7fa/);
  assert.match(globalStyles, /--surface-elevated:\s*#ffffff/);
  assert.doesNotMatch(globalStyles, /#f3f0e8|#fffdf8/i);
});

test("public provider calls to action lead to the live wizard", async () => {
  const [home, footer, contact] = await Promise.all([
    readFile("src/pages/index.astro", "utf8"),
    readFile("src/components/SiteFooter.astro", "utf8"),
    readFile("src/pages/contact.astro", "utf8"),
  ]);
  assert.match(home, /Get Listed/);
  assert.doesNotMatch(home, /Coming soon|button-unavailable/i);
  assert.match(footer, /Get Listed/);
  assert.match(contact, /Get listed/);
});
