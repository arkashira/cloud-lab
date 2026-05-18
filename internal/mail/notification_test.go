package mail

import (
    "errors"
    "sync"
    "testing"
    "time"
)

// mockSender records sent emails for verification.
type mockSender struct {
    mu   sync.Mutex
    sent []struct {
        to      string
        subject string
        body    string
    }
    fail bool // if true, Send returns an error
}

func (m *mockSender) Send(to, subject, body string) error {
    m.mu.Lock()
    defer m.mu.Unlock()
    if m.fail {
        return errors.New("mock send failure")
    }
    m.sent = append(m.sent, struct {
        to      string
        subject string
        body    string
    }{to, subject, body})
    return nil
}

func TestNotifyTeardownWarning(t *testing.T) {
    mock := &mockSender{}
    MailSender = mock
    defer func() { MailSender = nil }()

    email := "user@example.com"
    sandboxID := "sandbox-123"
    teardownAt := time.Date(2026, 5, 20, 14, 30, 0, 0, time.UTC)

    if err := NotifyTeardownWarning(email, sandboxID, teardownAt); err != nil {
        t.Fatalf("unexpected error: %v", err)
    }

    if len(mock.sent) != 1 {
        t.Fatalf("expected 1 email sent, got %d", len(mock.sent))
    }

    sent := mock.sent[0]
    if sent.to != email {
        t.Errorf("expected recipient %s, got %s", email, sent.to)
    }

    expectedSubject := "Sandbox sandbox-123 will be terminated soon"
    if sent.subject != expectedSubject {
        t.Errorf("expected subject %q, got %q", expectedSubject, sent.subject)
    }

    if !contains(sent.body, sandboxID) || !contains(sent.body, teardownAt.UTC().Format(time.RFC3339)) {
        t.Errorf("email body does not contain expected sandbox ID or timestamp")
    }
}

func TestNotifyTeardownWarning_NilSender(t *testing.T) {
    MailSender = nil
    err := NotifyTeardownWarning("user@example.com", "sandbox-123", time.Now())
    if err == nil {
        t.Fatal("expected error when MailSender is nil")
    }
}

func TestNotifyTeardownWarning_SendFailure(t *testing.T) {
    mock := &mockSender{fail: true}
    MailSender = mock
    defer func() { MailSender = nil }()

    err := NotifyTeardownWarning("user@example.com", "sandbox-123", time.Now())
    if err == nil {
        t.Fatal("expected error from mock sender")
    }
}

// Helper function to check if a string contains a substring
func contains(s, substr string) bool {
    return len(s) >= len(substr) && (len(substr) == 0 || (len(s) > 0 && (s == substr || contains(s[1:], substr))))
}