import withNuxt from './.nuxt/eslint.config.mjs'


// eslint.config.mjs
// @ts-check

let withNuxt = (config) => config

try {
  withNuxt = (await import('./.nuxt/eslint.config.mjs')).default
} catch {
  // Nuxt not ready yet (dev / vue-tsc)
}

export default withNuxt({
  // your rules here
})
