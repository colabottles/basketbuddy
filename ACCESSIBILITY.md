# Accessibility Statement

**BasketBuddy** is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards throughout the application.

---

## Conformance Status

BasketBuddy aims to conform to the [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/) at **Level AA**. WCAG defines requirements for designers and developers to improve accessibility for people with disabilities. Conformance with these guidelines helps make the web more accessible to people with blindness and low vision, deafness and hearing loss, limited movement, speech disabilities, photosensitivity, and combinations of these and other disabilities.

---

## Measures Taken

BasketBuddy takes the following measures to ensure accessibility:

- Accessibility is considered a core requirement, not an afterthought, at every stage of development
- All new features are evaluated against WCAG 2.2 AA criteria before release
- The application is tested with keyboard navigation and screen readers
- Automated accessibility checks are performed during development using axe DevTools
- Semantic HTML5 is used throughout — no `<div>` chowder

---

## Technical Specifications

BasketBuddy relies on the following technologies for conformance:

- HTML5
- CSS3 with custom properties
- WAI-ARIA
- JavaScript (Vue 3 / Nuxt 4)

---

## Accessibility Features

### Keyboard Navigation

- All interactive elements are reachable and operable by keyboard
- Logical focus order is maintained throughout the application
- Focus is visible at all times via a consistent focus ring
- Focus is managed correctly when dialogs open and close
- Keyboard shortcuts: `Escape` closes open dialogs and drawers

### Screen Reader Support

- All pages use semantic HTML5 landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`, `<section>`)
- All interactive elements have accessible names via `aria-label`, `aria-labelledby`, or visible text
- Dynamic content updates use `aria-live` regions to announce changes
- Status messages use `role="status"` and error messages use `role="alert"`
- Dialogs use `role="dialog"` or `role="alertdialog"` with `aria-modal="true"` and `aria-labelledby`
- Decorative images and icons use `aria-hidden="true"`
- Form inputs are associated with labels via `for`/`id` pairing
- Required fields are indicated with `aria-required="true"`
- Invalid fields use `aria-invalid="true"` and `aria-describedby` to associate error messages

### Visual Design

- Color is never used as the sole means of conveying information
- Text meets minimum contrast ratios — 4.5:1 for normal text, 3:1 for large text
- Interactive elements meet minimum contrast ratios in all states
- Focus indicators meet WCAG 2.2 minimum contrast requirements
- All touch targets are a minimum of 44×44 pixels
- Text can be resized up to 200% without loss of content or functionality

### Motion and Animation

- Respects the `prefers-reduced-motion` media query
- All animations are disabled or reduced significantly when the user has enabled reduced motion in their OS settings

### Color Scheme

- Supports both light and dark mode
- Respects the `prefers-color-scheme` media query for automatic mode detection
- Manual toggle available for user preference override
- High contrast mode is supported via `prefers-contrast: high` media query

### Forms

- All form fields have visible, associated labels
- Error messages are descriptive and associated with their relevant field
- Required fields are clearly indicated both visually and programmatically
- Password fields include a show/hide toggle with appropriate accessible label

### Navigation

- A "Skip to main content" link is the first focusable element on every page
- The mobile navigation drawer can be opened and closed via keyboard
- The drawer closes on `Escape` key press
- Navigation links have descriptive accessible names

---

## Known Limitations

The following items are known accessibility limitations we are working to address:

- The drag-and-drop reordering of list items currently relies on mouse/touch interaction. Keyboard-based reordering is planned for a future release.
- The PWA install prompt behavior varies by browser and operating system and is outside our direct control.

---

## Feedback and Contact

We welcome feedback on the accessibility of BasketBuddy. If you experience any accessibility barriers or have suggestions for improvement, please contact us:

- **Support page:** [basketbuddyapp.netlify.app/support](https://basketbuddyapp.netlify.app/support)

We aim to respond to accessibility feedback within 2 business days.

---

## Assessment Approach

BasketBuddy assessed the accessibility of this application by the following approaches:

- Self-evaluation during development
- Automated testing with axe DevTools browser extension
- Manual keyboard navigation testing
- Manual screen reader testing (NVDA on Windows, VoiceOver on iOS)
- Testing across Chrome, Firefox, Safari, and Edge on desktop and mobile

---

## Formal Complaints

If you are not satisfied with our response to your accessibility feedback, you may contact the relevant national or regional accessibility authority in your jurisdiction.

---

*This accessibility statement was last updated: March 2026.*
*This statement covers: [basketbuddyapp.netlify.app](https://basketbuddyapp.netlify.app)*
