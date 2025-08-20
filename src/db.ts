import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: ['warn', 'error'] // set to ['query','info','warn','error'] if you need verbose logs
});
