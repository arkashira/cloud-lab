import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export type SandboxStatus = 'active' | 'expired' | 'terminated' | 'deleted';

export interface Sandbox {
  id: string;
  userId: string;
  userEmail: string;
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  status: SandboxStatus;
  expiryWarningSent: boolean;
}

// Configuration constants
const EXPIRY_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const WARNING_THRESHOLD_MS = 60 * 60 * 1000;    // 1 hour