describe('cleanupExpiredSandboxes', () => {
  test('terminates sandbox with past expiresAt', async () => {
    const sandbox = { id: 's1', expiresAt: pastDate(), status: 'active' };
    const result = await processExpiration(sandbox);
    expect(result.status).toBe('terminated');
  });

  test('skips already terminated sandbox', async () => {
    const sandbox = { id: 's1', expiresAt: pastDate(), status: 'terminated' };
    const result = await processExpiration(sandbox);
    expect(result.status).toBe('terminated'); // unchanged
  });
});

describe('sendExpiryWarning', () => {
  test('sends email when warning not sent and expiring soon', async () => {
    const sandbox = { id: 's1', expiryWarningSent: false, expiresAt: soonDate() };
    await sendExpiryWarning(sandbox);
    expect(emailService.send).toHaveBeenCalledWith(sandbox.userId, 'expiry-warning');
  });

  test('skips when warning already sent', async () => {
    const sandbox = { id: 's1', expiryWarningSent: true, expiresAt: soonDate() };
    await sendExpiryWarning(sandbox);
    expect(emailService.send).not.toHaveBeenCalled();
  });
});