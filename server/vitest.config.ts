/* eslint-disable import/no-extraneous-dependencies */

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    clearMocks: true,
    threads: false,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
})
