import { defineConfig } from "vite"
import solid from "vite-plugin-solid"
import banner from "vite-plugin-banner"

const comment = `
/**
 * The frontend part of SSUG SSO system
 * 
 * Copyright (C) 2024 SSUG
 * This program is free software: you can redistribute it and/or modify it under the terms of the BSD 4-Clause License.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the BSD 4-Clause License for more details.
 * You should have received a copy of the BSD 4-Clause License along with this program. If not, see <https://directory.fsf.org/wiki/License:BSD-4-Clause>.
 * 
 * @copyright SSUG
 * @author 3swordman
 * @license BSD-4-Clause
 */
`.slice(1, -1)

export default defineConfig({
  plugins: [solid(), banner(comment)]
})
