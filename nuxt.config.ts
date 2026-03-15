export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' },
      ],
      meta: [
        { name: 'theme-color', content: '#4f46e5' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'BasketBuddy' },
      ]
    }
  },

  // Disable SSR for client-side PWA
  ssr: false,

  modules: [
    '@vite-pwa/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/supabase'
  ],

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/*'],
    }
  },

  typescript: {
    strict: true,
    typeCheck: true,
    tsConfig: {
      exclude: ['../../supabase', '../../supabase/**/*']
    }
  },

  css: ['~/assets/css/main.css'],

  nitro: {
  routeRules: {
    '/**': {
      headers: {
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://js.stripe.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: blob: https://*.supabase.co https://xsrijgvbcvaxrclohfpu.supabase.co",
          "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://checkout.stripe.com",
          "frame-src https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
          "worker-src 'self' blob:",
          "base-uri 'self'",
          "form-action 'self'",
          "object-src 'none'",
        ].join('; '),
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      }
    }
  }
},

  vite: {
    build: {
      rollupOptions: {
        external: [/supabase\/functions\/.*/]
      }
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'BasketBuddy',
      short_name: 'BasketBuddy',
      description: 'Collaborative grocery list app with real-time sharing',
      theme_color: '#6626AF',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      clientsClaim: true,
      navigateFallback: 'null',
      navigateFallbackDenylist: [/^\/api/, /^\/faq/, /^\/privacy/, /^\/terms/, /^\/support/, /^\/pricing/, /^\/login/, /^\/signup/],
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    injectManifest: {
      injectionPoint: undefined,
    },
    devOptions: {
      enabled: false,
    },
  },

  runtimeConfig: {
    smtpUser: process.env.SMTP_USER,
    smtpToken: process.env.SMTP_TOKEN,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_KEY,
      stripeSoloMonthly: process.env.STRIPE_SOLO_MONTHLY_PRICE_ID,
      stripeSoloAnnual: process.env.STRIPE_SOLO_ANNUAL_PRICE_ID,
      stripeFamilyMonthly: process.env.STRIPE_FAMILY_MONTHLY_PRICE_ID,
      stripeFamilyAnnual: process.env.STRIPE_FAMILY_ANNUAL_PRICE_ID,
      appUrl: process.env.APP_URL,
    }
  }
})