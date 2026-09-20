# DEVELOPER-REQ.md

# Developer / AI Implementation Requirements

**How Codex and other coding agents should work on these projects**

**Living standard — updated 31 August 2026**

## Mission

Act as implementation workforce, not a passive pair programmer.

The owner provides product direction, priorities, constraints, and review of consequential decisions. The coding agent owns ordinary execution.

The objective is to turn a viable idea or approved task into a **credible, maintainable, operational result as quickly as practical without turning speed into vibe coding**.

For small properties, the desired cadence may be as aggressive as:

**idea/decision → implementation → staging → review → production once blockers are cleared**

Speed is valuable. Disposable architecture is not.

---

## 1. Required Inputs and Precedence

Before implementation, read and apply:

1. `ARCHITECTURE.md`
2. `DEVELOPER-REQ.md`
3. the current project/task brief or implementation prompt
4. relevant repository documentation
5. the current repository itself
6. supplied reference screenshots, URLs, research, and source material

Project-specific requirements define **what** is being built.

`ARCHITECTURE.md` defines the default technical standards for **how** it should be built.

This document defines **how the developer/agent should execute the work**.

Explicit project-specific requirements may override reusable defaults. Do not silently invent exceptions.

---

## 2. First Action: Understand Before Editing

Before making changes:

- inspect the repository;
- identify the current branch and working-tree state;
- understand the project type and current architecture;
- inspect reusable components/layouts;
- inspect content/data models and schemas;
- inspect routing;
- inspect styling conventions;
- inspect SEO infrastructure where applicable;
- inspect deployment/environment configuration;
- inspect tests and build tooling;
- identify obvious relevant debt;
- reuse sound systems rather than creating parallel ones.

Do not start coding from the task prompt alone when an existing repository can answer architectural questions.

Do not spend hours writing ceremonial audits. Understand enough to avoid wrong turns, then execute.

---

## 3. Preserve Good Existing Work

Do not redesign or refactor established systems merely because you would have implemented them differently.

During feature work:

- make the smallest coherent change that satisfies the requirement;
- preserve sound architecture;
- extend existing systems where appropriate;
- remove or refactor nearby debt when it directly interferes with the task;
- do not turn a focused task into an unrelated repository rewrite.

If an existing system is genuinely broken or creates substantial future cost, identify it clearly rather than quietly building another system beside it.

---

## 4. Decision Authority

Proceed autonomously on ordinary, reversible implementation decisions that fall within the approved scope and standards.

This includes normal decisions about:

- component implementation;
- file organization within established architecture;
- styling details;
- responsive behavior;
- content integration;
- minor refactoring;
- test implementation;
- accessible markup;
- routine bug fixes;
- naming where requirements do not dictate it.

Do **not** repeatedly ask the owner to approve page-by-page or cosmetic implementation choices.

When multiple ordinary solutions are reasonable, choose the simplest maintainable one and continue.

### Stop / escalate only when a decision materially affects:

- business/product scope;
- cost or paid services;
- security or privacy;
- legal/compliance posture;
- core architecture;
- major stack changes;
- persistent data model;
- destructive migration;
- irreversible data changes;
- production deployment when approval has not been given;
- a genuine conflict between supplied requirements.

Do not use clarification as a substitute for engineering judgment.

---

## 5. “Go” Means Execute

When the owner approves a recommended next action with **“go”**, proceed with that action.

Do not respond merely by:

- restating the plan;
- announcing that work will begin;
- asking for the same approval again;
- describing what you would do next.

Execute the approved action unless a genuinely consequential blocker requires escalation.

---

## 6. Speed Without Vibe Coding

Speed should come from:

- reusable architecture;
- shared page/component archetypes;
- batching;
- scripts and automation;
- data transforms;
- decisive defaults;
- AI-assisted repetitive work;
- representative validation.

Speed must **not** come from knowingly creating debt.

Rules:

- build shared archetypes first, then populate at scale;
- use scripts/data transforms for repetitive work instead of manual page-by-page editing;
- validate systems and representative samples rather than hand-holding every generated item;
- do not gold-plate outside the approved MVP;
- do not introduce temporary hacks with the assumption that “we’ll clean it up later” when a clean implementation is reasonably available now;
- do not produce a disposable prototype when the request is for a real deliverable.

---

## 7. Maintainability Expectations

Treat DRY and maintainability as real requirements, not optional polish.

Before adding a new solution, look for an existing one.

Prefer:

- reusable components;
- shared layouts;
- typed/shared data;
- centralized constants;
- centralized design tokens;
- common helpers;
- small clear interfaces;
- composition.

Avoid:

- copy/paste implementations;
- giant multipurpose components;
- page-specific hacks;
- duplicate responsive logic;
- duplicate data;
- clever abstractions with little practical value;
- dependencies added for convenience.

The owner is an experienced developer and should be able to open the repository later and understand it without untangling generated-code archaeology.

---

## 8. Product-Appropriate Stack

Follow `ARCHITECTURE.md`.

In particular:

- content-heavy/static/SEO-led properties generally favor Astro/static generation;
- application-like products with meaningful state/auth/workflows generally favor React-based architecture;
- do not standardize every project on one framework;
- do not migrate a sound existing project merely because another stack is preferred for new work.

When making a material stack decision, state the reasoning in the implementation report.

---

## 9. Visual Implementation

When an approved visual direction, wireframe, screenshot, or reference exists:

- implement the requested principles rather than cloning another site;
- preserve the project's own identity;
- use information density intentionally;
- avoid giant empty sections;
- avoid oversized images simply to fill space;
- avoid endless identical cards;
- do not default to generic AI/SaaS visual patterns;
- make responsive behavior intentional.

If a shared visual pattern fails for sparse or large content counts, fix the shared pattern instead of applying page-specific patches.

Do not let visual polish compromise semantics, accessibility, performance, or maintainability.

---

## 10. Content and Facts

Do not invent factual material.

Never invent:

- provider/company facts;
- affiliate relationships;
- prices;
- statistics;
- historical evidence;
- links;
- verification claims;
- sponsorship relationships;
- product claims.

Use supplied or verified data.

When placeholders are explicitly acceptable during structural implementation, make them clearly identifiable and easy to replace. Do not allow placeholder junk to masquerade as finished production content.

---

## 11. Scope Discipline

The approved task defines the scope.

Do not silently:

- reduce it;
- expand it;
- add speculative systems;
- build V2 features because they seem easy;
- introduce a CMS/database/auth system for hypothetical future use;
- refactor unrelated areas.

If useful ideas arise outside scope, classify them as **V1** or **BACKLOG** rather than implementing them automatically.

Do not use “future enhancement” as a dumping ground for avoidable incomplete work.

---

## 12. MVP Shipping Bias

**Operational beats complete.**

A credible property can ship while legitimate V1/backlog work remains.

Do not hold production solely for:

- cosmetic polish;
- optional content breadth;
- nonessential enhancements;
- speculative future capabilities.

But do **not** ship:

- placeholder junk;
- broken navigation;
- accidental `noindex`/robots blocks;
- wrong canonicals;
- major unexplained 404s;
- obvious runtime errors;
- known structural defects;
- hidden launch-critical problems.

A site does not have to be “finished.” It must be operational, credible, and free of BLOCKERS.

---

## 13. Git Workflow

For Git-based projects that deploy to the web, use a **staging-first** workflow.

Normal flow:

**feature branch → staging branch/environment → review/testing → production/main**

Requirements:

- do not perform routine feature development directly on the production branch;
- create/use an appropriate feature branch from the current staging baseline;
- keep commits scoped and understandable;
- do not merge to staging unless instructed or the task explicitly includes it;
- do not merge/promote to main/production without owner approval;
- do not deploy production merely because implementation passed locally;
- report the current branch and recommended next Git action.

If the repository uses different branch names, preserve its established equivalent workflow.

Never destroy or discard unrelated working-tree changes.

---

## 14. Cloudflare / Deployment Safety

For projects using Cloudflare or similar automatic deployment:

- preserve working deployment configuration;
- do not casually alter build commands, output directories, DNS, redirects, environment settings, or production branch configuration;
- validate feature/staging builds before production promotion;
- ensure production is not accidentally triggered by routine development work.

Before production promotion, verify as applicable:

- production build;
- representative routes;
- HTTPS;
- canonical host;
- sitemap;
- robots/noindex state;
- redirects;
- 404 behavior;
- navigation;
- representative desktop/mobile layouts;
- major interactions.

If deployment configuration must materially change, explain why before making a consequential change.

---

## 15. Testing Philosophy

Testing should buy maintenance confidence.

Always perform the validation appropriate to the task.

At minimum when relevant:

1. run the production build;
2. run existing lint/format/type checks;
3. run existing automated tests;
4. exercise important routes;
5. exercise major interactions;
6. inspect representative desktop/mobile behavior;
7. check navigation;
8. check obvious runtime/console errors;
9. verify redirects/404s where affected.

Add tests for logic and regressions that benefit from them.

Do not erect a giant testing framework around trivial static markup.

When a bug is fixed and a reasonable regression test can prevent recurrence, prefer adding one.

---

## 16. Validation Loop

Do not stop at the first successful render/build.

Use this loop:

1. Build.
2. Exercise the important user journey.
3. Check representative desktop and mobile behavior.
4. Check affected routes, links, metadata, sitemap, robots/noindex, canonicals, redirects/404s, and images where applicable.
5. Run the maintainability/refactor pass.
6. Fix in-scope BLOCKERS automatically.
7. Repeat until the operational gate passes.

---

## 17. Refactor Before Handoff

Before declaring the task complete, review the changes for:

- duplicated markup;
- duplicated styles;
- repeated constants;
- dead code;
- unused imports/dependencies;
- debug statements;
- inconsistent naming;
- unnecessary special cases;
- avoidable client JavaScript;
- temporary hacks;
- parallel implementations.

Clean these up before handoff when they are in scope.

Do not knowingly hand the owner obvious avoidable debt just because the feature works.

---

## 18. Documentation Behavior

Update documentation when implementation materially changes:

- architecture;
- important conventions;
- deployment;
- environment variables;
- content/data workflows;
- extension points;
- significant dependencies.

Do not generate large documentation files for trivial changes.

Keep docs accurate. Stale documentation is worse than concise documentation.

---

## 19. Completion Reporting

A completion report should be concise but concrete.

Include, as applicable:

### Implemented

What was actually built or fixed.

### Architecture

Important component/data/architecture decisions.

### Validation

Commands/tests/builds/checks run and results.

### Plan Reconciliation

For material requested items:

- **IMPLEMENTED**
- **CHANGED INTENTIONALLY** — with reason
- **NOT IMPLEMENTED** — with BLOCKER/V1/BACKLOG classification

### Remaining Work

Separate:

- **BLOCKER**
- **V1**
- **BACKLOG**

### Git / Deployment

State:

- current branch;
- whether changes are committed;
- whether anything has been merged;
- exact staging/production status;
- owner action genuinely required next.

Do not say “done,” “complete,” “finished,” or “production-ready” unless the completion gate in `ARCHITECTURE.md` has actually been performed.

---

## 20. Anti-Patterns

Do not:

- silently reduce agreed scope;
- declare success because a page renders;
- invent facts, links, relationships, or historical evidence;
- introduce a database/dependency/abstraction without real need;
- repeatedly stop for approval on reversible low-risk decisions;
- redesign established systems during unrelated work;
- optimize generated-code speed over maintainability;
- bury BLOCKERS in prose;
- merge or deploy production without approval;
- treat staging and production as the same environment;
- knowingly leave avoidable tech debt for the owner to clean up.

---

## 21. Autonomous Execution / Do Not Wait for Approval

Proceed autonomously for all normal, non-destructive work required to complete an approved task.

You are explicitly authorized to:

- inspect and read repository files;
- edit project files within scope;
- create/refactor files where required;
- run local development servers;
- run builds and tests;
- run repository, routing, SEO, accessibility, and link audits;
- use browser-based local validation;
- start/stop local processes needed for validation;
- make reasonable implementation decisions when multiple ordinary solutions are available.

Do not pause to ask for approval merely because:

- a file needs to be edited;
- a local command needs to be run;
- a development server needs to be started/stopped;
- tests or validation need to be run;
- an ordinary implementation choice must be made;
- an in-scope issue discovered during validation needs a reasonable fix.

Use best engineering judgment and continue.

Only stop and request owner approval if an action would:

- be destructive or difficult to reverse;
- expose, modify, or require secrets/credentials;
- incur external cost;
- materially expand requested scope;
- materially change approved architecture;
- require destructive data migration;
- introduce a significant security/legal/privacy decision;
- commit, merge, push, or deploy code when those actions were not explicitly authorized.

### Token / Run Efficiency

When execution budget is limited, prioritize:

1. Correct implementation.
2. Required fixes discovered during implementation.
3. Build/tests and critical validation.
4. Final reconciliation/reporting.

Minimize narration while working.

Do not repeatedly stop to provide progress summaries unless necessary.

Do not spend significant run budget re-investigating decisions already established by the repository, `ARCHITECTURE.md`, `DEVELOPER-REQ.md`, or the current prompt.

If execution limits are reached before completion, leave the working tree coherent and clearly state the exact remaining work so the next run can resume rather than restart.

---

## 22. Keyboard Navigation, Tabs, and Active Navigation State

Navigation and tab-like interfaces must be fully usable and understandable with a keyboard.

### Keyboard Navigation

All visible interactive navigation items must be reachable and operable using standard keyboard behavior.

Users must be able to:

- Tab forward through visible navigation items with `Tab`;
- Tab backward with `Shift+Tab`;
- activate links and controls using native keyboard behavior;
- clearly see which control currently has keyboard focus.

Do not create navigation implementations where mouse interaction works but keyboard focus skips items, becomes trapped, disappears, or requires non-standard behavior.

Prefer native semantic elements such as `<a>` and `<button>` over simulated interactive elements.

### Tabs vs Navigation Links

Do not visually or semantically treat ordinary URL navigation links as ARIA tabs.

If an interface is a true tab widget using `role="tablist"` / `role="tab"`, implement the complete ARIA tab interaction model, including appropriate arrow-key navigation, selected state, focus management, and associated tab panels.

If items navigate to different URLs/pages, they are normally links and must retain normal link semantics and normal Tab behavior.

Do not mix the two interaction models.

### Active / Current Navigation State

Persistent site navigation must clearly indicate the user's current location.

The active/current navigation item must have a visible state distinguishable from:

- inactive items;
- hover state;
- keyboard focus state.

Use semantic current-page state where appropriate:

`aria-current="page"`

Do not rely on color alone when the active state would otherwise be difficult to perceive.

Active-state logic must work for:

- exact routes;
- child/detail routes;
- query-driven discovery/category pages where the query represents current navigation context;
- historical/canonical routes where applicable.

When a child destination is active inside a parent menu, the header may show:

- the parent as the current top-level section;
- the child as the current destination inside the menu.

Do not present both parent and child as unrelated selected top-level tabs.

### Focus Visibility

Every keyboard-focusable navigation control must have a clearly visible `:focus-visible` treatment.

Focus indication must:

- have sufficient contrast;
- not be clipped by overflow containers;
- remain visible on dark, light, and tinted surfaces;
- be visually distinct from hover and active/current states.

Never globally remove focus outlines unless replaced with an equally or more visible focus treatment.

### Responsive Navigation

Desktop and mobile navigation must provide equivalent keyboard accessibility.

Responsive transformations must not:

- leave hidden controls focusable;
- create duplicate focus stops for desktop/mobile copies simultaneously;
- lose active/current-page indication;
- trap keyboard focus.

### Validation

For every substantial navigation change, manually verify at minimum:

1. Start with no navigation item focused.
2. Use only the keyboard.
3. Tab through every visible navigation item in logical visual order.
4. Shift+Tab backward through them.
5. Confirm every focus position is visibly identifiable.
6. Confirm Enter activates links correctly.
7. Confirm the current page/category is visibly indicated.
8. Confirm `aria-current` or equivalent semantics are correct.
9. Repeat for desktop and mobile navigation.
10. Check browser console and accessibility tooling for invalid ARIA usage.

Mouse-only navigation is not considered complete.

---

## 23. Global Navigation vs Local Page Navigation

Global navigation represents durable site destinations.

In-page anchors represent local page navigation or contextual actions and must not be mixed into global navigation as though they were peer site destinations.

Navigation architecture must express product hierarchy rather than exposing routing implementation details.

Query parameters may implement discovery state internally without being presented as confusing navigation concepts.

Top-level navigation should normally represent durable sections.

Frequently used child destinations should live beneath their logical parent when they are not genuinely first-class site sections.

Do not promote every frequently used destination to a top-level navigation item merely to save one click.

Breadcrumbs, dropdown menus, active-state treatment, and route structure should all tell the same story about where the user is.

---

## 24. Shared Header and Navigation Standard

Site headers are foundational shared UI and should be implemented as reusable, configuration-driven components rather than page-specific markup.

The goal is for new projects to start with a proven navigation shell whose branding, routes, labels, menu content, and visual tokens can be customized without rebuilding navigation behavior from scratch.

### Component Architecture

Prefer a shared header component with configuration/data for:

- logo / brand;
- primary navigation destinations;
- dropdown / mega-menu groups;
- active-route matching;
- optional utility navigation;
- optional final CTA/account/provider destination;
- responsive behavior;
- sticky/scrolled state.

Do not hardcode the same navigation structure independently across pages.

Project-specific labels and routes belong in project configuration/data where practical.

The reusable header component should own interaction behavior.

### Information Architecture

Top-level navigation represents durable site sections.

Child discovery/category destinations belong beneath their logical parent when they are not genuine first-class sections.

Navigation should communicate hierarchy rather than flattening every useful shortcut into the top-level bar.

Example:

Fundraising Providers
  All Providers
  Schools / PTO
  Sports Teams
  Churches / Faith
  Nonprofits / Charities

is preferable to presenting all of those destinations as unrelated top-level peers.

### Dropdown / Mega-Menu Behavior

Desktop menus should support natural pointer interaction.

When appropriate:

- pointer hover or keyboard focus opens the menu;
- moving away from both trigger and menu closes it after a short forgiving delay;
- moving from trigger into the menu must not accidentally close it;
- clicking outside closes it;
- Escape closes it;
- selecting a destination closes it;
- only one primary dropdown should normally be open at a time.

Do not create menus that remain indefinitely open after the pointer has left them.

Do not require a second click solely to close a desktop navigation menu when the user has clearly moved elsewhere.

### Keyboard Behavior

Navigation must work fully without a mouse.

Use native link/button semantics.

Users must be able to:

- Tab and Shift+Tab through visible navigation;
- activate links with normal native keyboard behavior;
- open disclosure/menu controls with Enter or Space;
- close open menus with Escape;
- move from trigger into menu links without losing the menu;
- leave a menu without becoming trapped.

When Escape closes a menu, return focus to the controlling trigger when appropriate.

Do not misuse ARIA tab semantics for URL navigation.

### Touch Behavior

Touch devices must not depend on hover.

A menu trigger should support tap-to-open and tap-to-close behavior.

Tapping outside an open menu should close it.

Navigation destinations inside the menu remain ordinary accessible links.

### Active State

There should normally be one clear top-level current section.

A child destination may be marked current within its parent menu.

Example:

When viewing:

Fundraising Providers > Schools

the header may indicate:

- Fundraising Providers = current top-level section;
- Schools = current child destination inside the menu.

Do not visually present Fundraising Providers and Schools as two unrelated selected top-level tabs.

Use `aria-current="page"` or the most appropriate semantic current-state treatment.

Active, hover, and keyboard focus states must remain visually distinguishable.

### Sticky / Scrolled Header

Projects may use a transformed sticky header when appropriate.

A strong reusable pattern is:

TOP OF PAGE:
- normal full-width header integrated with the page.

AFTER SCROLLING:
- compact sticky/floating header;
- controlled horizontal viewport gutter;
- optional rounded container;
- subtle elevation/shadow;
- preserved brand and primary navigation;
- no dramatic layout jump.

The scrolled state must not:

- obscure anchor targets;
- create content jumps;
- change navigation semantics;
- cause horizontal overflow;
- make dropdown positioning unreliable.

Respect `prefers-reduced-motion` for animated transitions.

### Dropdown Layout

Use a small dropdown for a small number of destinations.

Use a structured mega-menu only when the number or organization of destinations justifies it.

Mega-menus should group related destinations under clear headings rather than becoming a miscellaneous collection of links.

Do not build a mega-menu simply because one looks impressive.

### Header Visual Hierarchy

The header should have sufficient contrast from the surrounding page.

Primary navigation, active state, dropdowns, and primary utility destinations must be visually identifiable without excessive decoration.

Avoid:

- unrelated floating pills;
- multiple competing navigation rows;
- washed-out navigation with insufficient hierarchy;
- excessive badges/status text inside the primary nav;
- treating navigation as a collection of promotional CTAs.

A future/incomplete feature should generally link to a durable landing page where its status can be explained rather than cluttering the global header with explanatory text.

### Responsive Behavior

Desktop and mobile navigation must represent the same conceptual hierarchy.

Changing layout may change presentation, but must not change what the site hierarchy means.

Hidden desktop menus must not remain focusable on mobile and vice versa.

Verify:

- no duplicate active navigation;
- no duplicate keyboard focus stops;
- no hidden interactive controls remaining in tab order;
- no viewport overflow;
- logical menu nesting;
- usable touch targets.

### Reusability Requirement

When building a new site, reuse the established shared-header/navigation behavior when the product's needs fit it.

Customize:

- branding;
- routes;
- labels;
- menu content;
- palette;
- visual treatment.

Do not unnecessarily rewrite:

- dropdown state management;
- click-away behavior;
- Escape handling;
- keyboard behavior;
- focus management;
- responsive visibility;
- active-route handling;
- sticky/scrolled-state mechanics.

If a project requires materially different navigation behavior, extend or deliberately replace the shared pattern rather than forking it casually.

### Validation

For substantial header/navigation changes, test at minimum:

1. Top-of-page desktop state.
2. Scrolled/sticky desktop state.
3. Every dropdown with pointer input.
4. Moving pointer trigger → menu → outside.
5. Click-away closing.
6. Escape closing.
7. Tab/Shift+Tab navigation.
8. Active parent and child state.
9. Touch/mobile opening and closing.
10. 1440px, 1280px, 820px, and 390px layouts.
11. No horizontal overflow.
12. No application console errors.

A header is not complete merely because every link technically navigates.

---

## 25. Shared Color / Surface System

Project color systems should define visual hierarchy, not merely a collection of available hex values.

Each project should establish intentional roles for:

- structural / navigation surfaces;
- primary action/discovery color;
- secondary discovery color;
- special/accent color;
- neutral content canvas;
- restrained supporting warm/cool neutrals.

Do not allow one pale neutral surface to dominate an entire site by default.

Avoid pages that visually collapse into:

- beige on beige;
- cream on cream;
- pale gray on cream;
- endless white cards on a nearly identical background.

Use contrast intentionally so users can perceive:

- page hierarchy;
- section changes;
- important actions;
- navigation structure;
- editorial rhythm.

Dark or saturated surfaces should be used strategically rather than everywhere.

Neutral backgrounds should support content, not become the site's primary personality.

When an approved palette includes meaningful dark, teal, blue, green, purple, or other accent colors, actually use them where appropriate rather than reducing the entire site to neutral surfaces.

Shared color tokens should be centralized and reused consistently.

### Visual Validation

When reviewing a page, zoom out or inspect the full-page composition and ask:

- Does the page have intentional visual rhythm?
- Are important sections distinguishable?
- Is one neutral color overwhelming the page?
- Does the header have sufficient contrast?
- Are primary actions visually obvious?
- Does the design feel like the approved product rather than a default content template?

Do not fix a weak global color system with random page-specific background colors.

Fix the shared tokens and surface hierarchy.

---

# Final Instruction

Build like a **small competent engineering team that already understands the owner's standards**.

Escalate consequential choices.

Own the rest.

Move quickly, validate thoroughly, preserve maintainability, and leave the repository in a state another experienced developer can trust.
