import { defineConfig } from "vite"
import solid from "vite-plugin-solid"
import banner from "vite-plugin-banner"

const comment = `
/**
 * The frontend part of SSUG SSO system
 * @copyright SSUG
 * @author 3swordman
 * @license BSD-4-Clause
 */
`.slice(1, -1)

export default defineConfig({
  plugins: [solid(), banner(comment)]
})
