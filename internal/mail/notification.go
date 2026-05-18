package mail

import (
    "fmt"
    "log"
    "time"
)

// Sender abstracts the underlying mail delivery mechanism.
type Sender interface {
    // Send delivers an email.
    // to - recipient address
    // subject - email subject line
    // body - plain-text email body
    Send(to, subject, body string) error
}

// MailSender is the concrete implementation used at runtime.
// It is set by the application bootstrap (e.g., using the existing mail service).
// Tests replace this with a mock.
var MailSender Sender

// NotifyTeardownWarning sends an email to the user warning them that their
// sandbox will be terminated due to inactivity. The email is sent 15 minutes
// before the scheduled teardown.
//
// Parameters:
//   - email: the recipient's email address
//   - sandboxID: identifier of the sandbox that will be torn down
//   - teardownAt: the exact time the sandbox will be terminated
//
// Returns any error produced by the underlying mail service.
func NotifyTeardownWarning(email, sandboxID string, teardownAt time.Time) error {
    if MailSender == nil {
        return fmt.Errorf("mail sender not configured")
    }

    subject := fmt.Sprintf("Sandbox %s will be terminated soon", sandboxID)
    body := fmt.Sprintf(
        "Hello,\n\n"+
        "Your sandbox \"%s\" is scheduled for automatic termination at %s (UTC) due to 4 hours of inactivity.\n"+
        "This notification is sent 15 minutes before the teardown. If you wish to keep the sandbox, please access it before the scheduled time.\n\n"+
        "Best regards,\n"+
        "The Cloud Lab Team",
        sandboxID,
        teardownAt.UTC().Format(time.RFC3339),
    )

    if err := MailSender.Send(email, subject, body); err != nil {
        log.Printf("failed to send teardown warning to %s for sandbox %s: %v", email, sandboxID, err)
        return err
    }

    log.Printf("teardown warning sent to %s for sandbox %s (scheduled at %s)", email, sandboxID, teardownAt)
    return nil
}