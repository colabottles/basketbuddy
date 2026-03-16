# 🛒 BasketBuddy

> A privacy-first, accessible collaborative grocery list app. No ads. No tracking. No data selling. Ever.

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://basketbuddyapp.netlify.app)
[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG-2.2%20AA-green)](https://www.w3.org/TR/WCAG22/)
[![Built with Nuxt](https://img.shields.io/badge/Built%20with-Nuxt%204-00DC82)](https://nuxt.com)

**Live app:** [basketbuddyapp.netlify.app](https://basketbuddyapp.netlify.app)

---

## What is BasketBuddy?

BasketBuddy is a collaborative grocery list web app built for real people. Create lists, share them with family or housemates, sync in real time, and use it offline — all without being tracked, shown ads, or having your data sold to third parties.

---

## Features

- **Real-time sync** — changes appear instantly across all devices
- **Offline support** — works as a PWA, functions without an internet connection
- **List sharing** — invite others by email to view or edit your lists
- **Rewards card storage** — save your store loyalty cards in one place
- **Item photos** — attach photos to list items so the right product gets bought
- **Categories** — organise items into colour-coded categories
- **Drag to reorder** — sort list items by drag and drop
- **Pull to refresh** — mobile-native refresh gesture
- **Dark and light mode** — respects system preference, toggleable manually
- **WCAG 2.2 AA accessible** — keyboard navigable, screen reader friendly, high contrast

---

## Plans

| Plan | Lists | Members | Sharing | Price |
| ------ | ------- | --------- | --------- | ------- |
| Free | 2 | 1 | No | $0 |
| Solo | 5 | 1 | Yes | $4/mo or $40/yr |
| Family | 12 | 6 | Yes | $8/mo or $80/yr |
| Super User *(coming soon)* | Unlimited | Unlimited | Yes | $20/mo or $200/yr |

---

## Tech Stack

| Layer | Technology |
| ------- | ----------- |
| Framework | [Nuxt 4](https://nuxt.com) + [Vue 3](https://vuejs.org) |
| Language | TypeScript |
| Database | [Supabase](https://supabase.com) (PostgreSQL) |
| Auth | Supabase Auth |
| Payments | [Stripe](https://stripe.com) |
| Hosting | [Netlify](https://netlify.com) |
| State | [Pinia](https://pinia.vuejs.org) |
| Offline | IndexedDB + Workbox PWA |
| Email | Proton Mail SMTP |

---

## Architecture

```bash
basketbuddy/
├── app/
│   ├── components/        # AppHeader, AppFooter
│   ├── composables/       # useSubscription, useLogout, useUserAvatar, useTheme
│   ├── middleware/        # auth, guest, requireSubscription
│   ├── pages/             # index, list/[id], pricing, settings, rewards, faq, privacy, terms, support, signup, login
│   └── assets/css/        # main.css (design tokens, global styles)
├── server/
│   ├── api/
│   │   ├── stripe/        # checkout.post.ts, webhook.post.ts, cancel.post.ts
│   │   ├── account/       # delete.post.ts
│   │   └── share-invite.post.ts
│   └── utils/             # rateLimit.ts, indexedDB.ts
├── stores/                # listStore.ts, rewardsStore.ts
└── types/                 # models.ts, database.types.ts
```

---

## Security

- Row Level Security (RLS) on all Supabase tables
- Stripe webhook signature verification
- Rate limiting on all API routes
- Input validation and HTML sanitisation on server routes
- Content Security Policy headers
- HSTS, X-Frame-Options, X-Content-Type-Options headers
- Service role key server-side only, never exposed to the client

---

## Accessibility

BasketBuddy is built to meet WCAG 2.2 AA standards throughout. See the full [Accessibility Statement](ACCESSIBILITY.md) for details.

---

## Release Notes

All major features, milestones, and changes to BasketBuddy are documented here.

---

## v1.0.0 — Initial Public Release

### March 2026

### 🚀 Launch

BasketBuddy launches as a production-ready, privacy-first collaborative grocery list app.

### Core Features

- **Grocery list management** — create, rename, delete, and reorder lists
- **List items** — add, edit, delete, check off, and drag to reorder items
- **Item categories** — color-coded category chips for organizing items
- **Item photos** — attach photos to list items
- **Item notes** — add notes to individual items
- **Real-time collaboration** — share lists with others via email invitation
- **Rewards cards** — store loyalty card numbers with reveal/hide toggle
- **Pull to refresh** — native mobile gesture support
- **Offline support** — full PWA with IndexedDB caching and sync queue
- **Dark/light mode** — system preference detection with manual toggle

### Authentication

- Email and password sign up and sign in
- Email confirmation flow
- Password change and reset
- Email address change with confirmation
- Avatar upload and removal
- Account deletion

### Subscriptions

- Stripe-powered subscription management
- Solo plan ($4/month or $40/year) — up to 5 lists, list sharing
- Family plan ($8/month or $80/year) — up to 12 lists, up to 6 members
- Free tier — up to 2 lists, no sharing
- Free forever accounts (manually granted, unlimited access)
- Promo/coupon code support at checkout
- Subscription status visible in account settings
- Downgrade to free at end of billing period
- Webhook-driven subscription lifecycle management

### Plan Enforcement

- Free tier gated to 2 lists with upgrade prompt on limit
- Sharing disabled on free tier
- Family plan limited to 6 members per list
- Grandfathering of existing lists on downgrade

### Pages

- My Lists (home)
- List detail with full item management
- Pricing with monthly/annual toggle and plan comparison
- Settings (profile, email, password, subscription, account deletion)
- Rewards cards
- FAQ with accessible accordion
- Privacy Policy
- Terms of Service
- Support
- Sign up / Sign in

### Accessibility Implementations

- WCAG 2.2 AA compliant throughout
- Semantic HTML5 landmarks on every page
- Full keyboard navigation
- Screen reader tested
- Skip to main content link
- Focus management on dialogs
- ARIA roles, labels, and live regions
- Reduced motion support
- High contrast mode support
- Minimum 44×44px touch targets

### Security Checks

- Row Level Security on all Supabase tables
- Stripe webhook signature verification
- Rate limiting on checkout and share invite endpoints
- Input validation and HTML sanitisation on all server routes
- Content Security Policy headers
- HSTS, referrer policy, permissions policy, X-Frame-Options headers
- Service role key server-side only

### Infrastructure

- Nuxt 4 with SSR disabled (client-side PWA)
- Supabase (PostgreSQL + Auth + Storage + Realtime)
- Stripe (payments, subscriptions, webhooks)
- Netlify (hosting, edge functions, environment variables)
- Proton Mail SMTP for transactional email

---

## Upcoming

### v1.1.0 — Super User Plan *(planned)*

- Unlimited lists and members
- Item price tracking (quantity × price per item)
- Running total per list
- Budget calculator per list
- Priority support
- $20/month or $200/year

### Future Considerations

- Recipe import
- Multiple household management
- Export lists to PDF/CSV
- Voice input
- Apple Watch / wearable support
