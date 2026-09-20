# ARCHITECTURE.md

# Engineering Architecture Standard

**Living standard — reconstructed from the latest project standards, 29 August 2026**

## Purpose

This is the default engineering contract for small web properties and applications.

Project-specific briefs may override it explicitly, but coding agents must not silently invent a different architecture.

Optimize for **speed to a maintainable operational MVP**, not speed to disposable code.

A visually successful result with poor architecture is not successful.

---

## 1. Understand Before Editing

Before significant implementation:

1. Inspect the existing repository.
2. Understand the framework, build/deploy system, routing, content/data model, styling system, components, layouts, dependencies, tests, SEO implementation, configuration, environments, and existing conventions.
3. Identify sound systems worth preserving.
4. Identify duplication, dead code, temporary code, inconsistent patterns, unnecessary dependencies, and architectural debt relevant to the task.
5. Reuse sound infrastructure rather than creating parallel systems.
6. Do not rewrite working infrastructure merely because another approach is possible.
7. Prefer incremental improvement over gratuitous rewrites.

For greenfield work, establish the smallest maintainable architecture before producing large amounts of implementation.

The audit exists to prevent expensive wrong turns, not to create ceremonial analysis.

---

## 2. Choose the Stack From the Product

Choose technology based on the product being built.

### Content-heavy / SEO-led properties

For mostly static, content-heavy, search-oriented properties:

- strongly consider Astro/static generation;
- ship HTML first;
- hydrate only meaningful interaction;
- prefer content/data-driven pages and static generation where practical.

### Application-like products

For products with substantial:

- client state;
- authentication;
- workflows;
- dashboards;
- dynamic interaction;
- application-style behavior;

prefer a React-based application architecture, typically React/Next.js when appropriate.

### Rules

- Do not force Astro onto an application merely because another property uses Astro.
- Do not force React onto a static content property merely because React is familiar.
- Explain material stack choices and tradeoffs when establishing or materially changing architecture.
- Respect a sound existing stack unless the project has a real architectural reason to change it.

---

## 3. Data and Persistence

Prefer the simplest persistence model that naturally fits the data and expected scale.

- For small static datasets, typed local data/content collections may be better than a database.
- MongoDB is a reasonable general choice when document-oriented/no-SQL storage naturally fits.
- Use PostgreSQL/SQL when relationships, integrity, transactions, joins, reporting, or the data model make relational storage materially better.
- Do not introduce persistence merely because it might be useful someday.
- Do not build enterprise infrastructure for tens or hundreds of records.
- Avoid structures that obviously block reasonable later growth.

Cross-cutting data concepts should be identified before large-scale content/data creation.

Examples include:

- publication/update state;
- draft/noindex state;
- images and alt text;
- attribution/licensing;
- related-content identifiers;
- product/provider identifiers;
- sponsorship/affiliate state;
- verification state;
- disclosures.

Add genuinely cross-cutting concepts to shared schemas/configuration before content proliferates, but do not prebuild speculative future systems.

---

## 4. DRY Is a Hard Requirement

Do not solve the same problem independently in multiple places.

Prefer:

- shared layouts;
- reusable components;
- centralized design tokens;
- shared utilities;
- common content/data schemas;
- reusable metadata/SEO helpers;
- data-driven rendering;
- configuration instead of repeated literals;
- common responsive patterns.

Before creating a new component, utility, style, content structure, or abstraction, determine whether an existing implementation already solves the problem.

Do not over-apply DRY when two things merely look similar. Reuse should represent a genuinely shared concept.

---

## 5. Content and Page Architecture

For content-heavy sites, individual pages should primarily contain content/data rather than duplicate structural markup.

Preferred flow:

**content/data → validated schema → shared layout/page archetype → reusable components → rendered page**

Adding the 50th article, provider, or page should be nearly as simple as adding the 5th.

Create a small set of page archetypes rather than hand-building every route.

Shared systems should own concepts such as:

- global shell;
- navigation;
- footer;
- metadata;
- breadcrumbs;
- disclosures;
- ad slots;
- recommendations;
- repeated content modules.

Avoid page-specific hacks and parallel implementations of existing capabilities.

---

## 6. Component Architecture

Components should:

- have one understandable responsibility;
- have clear APIs;
- be reusable where reuse is real;
- avoid hidden side effects;
- avoid unnecessary client-side JavaScript;
- avoid excessive nesting and abstraction;
- remain understandable without tracing through many layers.

Prefer composition over sprawling conditional components.

Do not create components merely to reduce line counts.

Do not create giant components that own unrelated responsibilities.

---

## 7. Styling Architecture

Use one coherent styling strategy.

Centralize appropriate design tokens:

- colors;
- typography;
- spacing;
- widths;
- breakpoints;
- radii;
- shadows;
- component states.

Avoid:

- unexplained magic numbers;
- repeated inline styles;
- copied media queries;
- competing styling systems;
- excessive `!important`;
- deeply coupled selectors;
- one-off CSS patches that hide structural problems.

If SCSS is part of the project, organize it deliberately. Do not migrate an entire working styling system during unrelated feature work unless explicitly requested.

---

## 8. JavaScript and Hydration

For static/content-oriented sites:

- prefer HTML/CSS and static/server rendering;
- use client JavaScript only where it provides meaningful behavior;
- avoid hydrating components that do not need interactivity.

Performance and simplicity take priority over flashy implementation.

For application-like products, use the client architecture appropriate to the product rather than artificially avoiding client state.

---

## 9. Dependencies

Every dependency has maintenance cost.

Before adding one:

1. Determine whether the platform/framework already provides the capability.
2. Determine whether a small local implementation is clearer.
3. Confirm the dependency is maintained and appropriate.
4. Avoid large packages for trivial functionality.

Do not add a UI framework, state manager, analytics library, utility package, or other major dependency merely for convenience.

Document significant new dependencies and why they exist.

---

## 10. URLs and Routing

Treat public URLs as durable interfaces.

- Do not casually change existing URLs.
- Preserve valuable historical URLs where sensible.
- Use intentional redirects.
- Avoid redirect chains.
- Never blindly redirect unrelated missing content to the homepage.
- Visual redesign must not unnecessarily dictate URL changes.

A permanent redirect should point to a destination that substantially satisfies the original user intent or represents a clear replacement.

When no suitable destination exists, prefer:

1. restoring useful content at the historical URL;
2. recording the topic for later restoration; or
3. returning a genuine 404/410 as appropriate.

Historical preservation does not override semantic correctness.

---

## 11. SEO Architecture

SEO must be systematic, not implemented page by page.

Use shared mechanisms for:

- titles;
- descriptions;
- canonical URLs;
- Open Graph/social metadata;
- sitemap generation;
- robots directives;
- structured data where useful;
- breadcrumbs;
- internal linking.

Do not generate indexable thin pages merely because a taxonomy/filter combination exists.

Before completion, check the site as a coherent system for:

- noindex/sitemap contradictions;
- canonicals conflicting with redirects;
- redirect chains;
- weak redirect destinations;
- duplicate/inconsistent canonical paths;
- trailing-slash inconsistencies;
- orphaned indexable content;
- metadata drift across equivalent page families.

Prefer consistent, defensible SEO signals over maximizing SEO features.

---

## 12. Responsive Design

Responsive behavior is part of component architecture.

Do not build desktop first and later patch mobile with a pile of one-off overrides.

Components should have intentional behavior across:

- desktop;
- laptop;
- tablet;
- mobile.

Avoid duplicating markup solely to create desktop/mobile versions unless strongly justified.

Mobile should preserve usefulness and interaction priority, not merely shrink the desktop composition.

---

## 13. Accessibility

Accessibility is baseline implementation quality.

Use:

- semantic HTML;
- logical heading hierarchy;
- keyboard accessibility;
- visible focus states;
- appropriate labels;
- adequate contrast;
- meaningful alt text;
- reasonable touch targets;
- reduced-motion support where relevant.

Do not sacrifice semantics for styling convenience.

Use native HTML behavior instead of unnecessary ARIA where possible.

---

## 14. Performance

Prefer:

- static generation where appropriate;
- optimized assets;
- efficient images;
- lean CSS;
- minimal JavaScript;
- sensible caching;
- limited third-party scripts;
- no unnecessary network requests.

Do not solve hypothetical performance problems with complicated architecture, but do not knowingly introduce obvious bloat.

---

## 15. Maintainability Over Cleverness

Prefer boring, conventional, readable solutions.

Avoid:

- clever abstractions;
- premature generalization;
- unnecessary factories;
- excessive indirection;
- hidden global behavior;
- overly generic components;
- novel patterns without clear benefit.

A future experienced developer should be able to locate a feature and understand how it works without reverse-engineering the application.

Build as if the owner will personally maintain the project a year from now.

---

## 16. Configuration and Constants

Do not scatter reusable values throughout the repository.

Centralize appropriate:

- site metadata;
- navigation definitions;
- social links;
- business/site information;
- feature configuration;
- affiliate configuration;
- sponsored state/configuration;
- environment-dependent settings;
- reusable labels/constants.

Do not centralize values that are genuinely local merely for the sake of centralization.

---

## 17. Monetization Architecture

Prepare monetization structurally without allowing it to dominate usefulness or design.

Affiliate/product/provider data, merchant URLs, sponsored state, disclosures, and ad configuration should be centralized and DRY.

Rules:

- editorial ranking and paid placement remain distinguishable;
- sponsored placements are clearly labeled;
- never invent an affiliate relationship, price, provider fact, claim, or link;
- normal useful links may exist before affiliate participation;
- converting a normal merchant/provider link to an affiliate URL later should not require editing dozens of pages;
- monetization must not secretly purchase editorial trust.

---

## 18. Error and Empty States

Design expected failure states intentionally.

Consider:

- 404s;
- missing content;
- malformed content;
- absent images;
- empty categories;
- unavailable optional data;
- failed external integrations.

Do not allow silent broken states.

---

## 19. Security and Privacy

Follow normal secure-development practices.

Do not:

- commit secrets;
- expose private environment values;
- trust unsanitized input;
- add unnecessary third-party tracking;
- create insecure form handling;
- weaken framework security defaults without a documented reason.

Project-specific legal/compliance requirements may add further constraints.

---

## 20. Git, Environments, and Deployment

Use a staging-first workflow for Git-based projects that deploy to the web.

Preferred flow:

**feature/work branch → staging/test environment → owner review/validation → production branch**

Rules:

- routine development should not be pushed directly to the production branch;
- validate risky or meaningful work in staging/preview first;
- merge/promote to production only after approval;
- do not casually change working Cloudflare/build/deployment configuration;
- keep deployment configuration simple and documented;
- a site does not need to be “finished” to ship—it needs to be operational, credible, and free of launch blockers.

Before production, verify:

- production build;
- important routes;
- HTTPS/canonical host;
- sitemap;
- robots/noindex state;
- redirects/404s;
- navigation;
- representative desktop/mobile pages;
- major interactive behavior.

---

## 21. Documentation

Do not produce documentation for documentation's sake.

Document:

- non-obvious architecture;
- important conventions;
- unusual decisions;
- deployment requirements;
- environment variables;
- content-authoring workflow;
- significant dependencies;
- extension points future developers need to understand.

Keep documentation close to the implementation where practical.

This file is a living standard. When repeated implementation corrections reveal a general engineering preference, update the standard instead of relearning the lesson on every project.

---

## 22. Testing and Validation

Use validation appropriate to project complexity.

At minimum:

- run the production build;
- fix build errors and meaningful warnings;
- validate important routes;
- check internal links where tooling permits;
- test representative responsive layouts;
- test navigation;
- verify 404/redirect behavior;
- verify major interactive behavior;
- ensure there are no obvious console/runtime errors.

Automate broad checks where useful, including routes, sitemap, metadata, redirects, links, and obvious image failures.

Add automated tests where they provide real maintenance value.

Do not create a massive test framework around trivial static markup.

---

## 23. Refactoring / Tech-Debt Pass

Before declaring work complete, perform a dedicated maintainability pass.

Look for:

- duplicated markup;
- duplicated styles;
- repeated constants;
- dead code;
- abandoned components;
- unused dependencies;
- temporary debug code;
- inconsistent naming;
- page-specific hacks;
- needless abstractions;
- avoidable client JavaScript;
- inconsistent architectural patterns.

Refactor avoidable debt before completion rather than knowingly handing it to the owner.

---

## 24. Architecture Approval Gate

Before a **large implementation or material architecture change**, present an architecture proposal when the project brief requires owner approval.

Cover:

- repository/current-state assessment;
- proposed folder organization;
- page families/layouts;
- content/data model;
- reusable component strategy;
- styling strategy;
- routing strategy;
- SEO architecture;
- dependency changes;
- testing/validation approach;
- known tradeoffs;
- tech-debt risks.

Flag anything that could create substantial future maintenance cost.

Once architecture and scope have been approved, do not repeatedly stop for approval on ordinary reversible implementation decisions.

---

## 25. Plan Fidelity

An approved implementation plan is a delivery contract unless the owner explicitly changes it.

Before declaring completion, reconcile every material planned item as:

- **IMPLEMENTED** — completed and validated.
- **CHANGED INTENTIONALLY** — differs for a documented reason while satisfying the underlying requirement.
- **NOT IMPLEMENTED** — incomplete; state why and classify it.

Do not silently shrink scope.

Do not omit planned infrastructure and then declare completion because the implemented subset works.

Quality may justify changing a quantity target, but that is an intentional scope change and must be reported.

---

## 26. Definition of Engineering Done

Engineering is not done because the site renders.

It is done when:

- the production build succeeds;
- agreed MVP functionality works;
- architecture is coherent and understandable;
- repeated patterns are shared appropriately;
- content/data uses shared structures where appropriate;
- unnecessary duplication has been removed;
- responsive behavior is intentional;
- accessibility fundamentals are addressed;
- important routes work;
- redirects/404s behave correctly;
- obvious dead code is removed;
- unnecessary dependencies are removed;
- no known launch-critical issue is hidden;
- remaining work is explicitly classified;
- plan fidelity has been reconciled.

Classify remaining work as:

- **BLOCKER** — must fix before production;
- **V1** — should be addressed shortly after launch;
- **BACKLOG** — legitimate future enhancement.

Never relabel avoidable unfinished implementation as a “future enhancement” merely to declare the project complete.

Immediately before saying **complete**, **finished**, **production-ready**, or equivalent:

1. Re-read the approved architecture/project plan.
2. Compare it against the repository and generated product.
3. Reconcile material planned items.
4. Run the production build and agreed validation.
5. Run the DRY/dead-code/dependency/maintainability review.
6. Review cross-cutting schemas/configuration.
7. Run SEO consistency and redirect-semantic checks where applicable.
8. Confirm that known launch-critical problems are BLOCKERS rather than hidden in prose.

---

# Final Principle

Optimize for how easily the resulting system can be understood, changed, expanded, debugged, and trusted.

**Speed comes from reusable standards, decisive defaults, automation, and good architecture—not from disposable code.**
