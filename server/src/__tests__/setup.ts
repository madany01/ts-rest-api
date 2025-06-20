/* eslint-disable import/no-extraneous-dependencies */
import '../conf/index.js'
import { vi } from 'vitest'

import truncateTables from './utils/truncateTables.js'
import prisma from '../prisma/index.js'

vi.mock('../prisma/index.ts')

await truncateTables(prisma)
