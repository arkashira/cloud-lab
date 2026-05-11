import { prisma } from '@/lib/prisma';
import { calculateExpiryDate, isExpired, isAboutToExpire } from '../../lib/sandbox-expiry';

export async function runSandboxCleanup(): Promise<{
  expired: number;
  warnings: number;
}> {
  const now = new Date();
  let expiredCount = 0;
  let warningCount = 0;

  // Process expired sandboxes
  const expiredSandboxes = await prisma.sandbox.findMany({
    where: {
      expiresAt: { lte: now },
      status: 'active',
    },
  });

  for (const sandbox of expiredSandboxes) {
    await handleExpiredSandbox(sandbox);
    expiredCount++;
  }

  // Send warnings to sandboxes expiring soon
  const warningDeadline = new Date(now.getTime() + WARNING_THRESHOLD_MS);
  const sandboxesNeedingWarning = await prisma.sandbox.findMany({
    where: {
      expiresAt: { lte: warningDeadline },
      status: 'active',
      expiryWarningSent: false,
    },
  });

  for (const sandbox of sandboxesNeedingWarning) {
    await sendExpirationWarning(sandbox);
    warningCount++;
  }

  return { expired: expiredCount, warnings: warningCount };
}

async function handleExpiredSandbox(sandbox: any): Promise<void> {
  // 1. Update status to terminated
  await prisma.sandbox.update({
    where: { id: sandbox.id },
    data: { status: 'terminated' },
  });

  // 2. Send expiration notification
  await sendEmail({
    to: sandbox.userEmail,
    subject: 'Your Sandbox Has Expired',
    body: `Your sandbox (${sandbox.id}) has been terminated due to inactivity.`,
  });

  // 3. Clean up cloud resources (placeholder)
  await cleanupSandboxResources(sandbox.id);
  
  console.log(`[Cleanup] Terminated sandbox ${sandbox.id}`);
}

async function sendExpirationWarning(sandbox: any): Promise<void> {
  await sendEmail({
    to: sandbox.userEmail,
    subject: 'Sandbox Expiring Soon',
    body: `Your sandbox will expire in 1 hour. Save your work or extend your session.`,
  });

  // Mark warning as sent to prevent duplicates
  await prisma.sandbox.update({
    where: { id: sandbox.id },
    data: { expiryWarningSent: true },
  });

  console.log(`[Warning] Sent expiry warning for sandbox ${sandbox.id}`);
}

async function cleanupSandboxResources(sandboxId: string): Promise<void> {
  // TODO: Implement actual VM termination, disk cleanup, etc.
  console.log(`[Resources] Would clean up resources for sandbox ${sandboxId}`);
}