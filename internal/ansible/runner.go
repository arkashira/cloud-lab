package ansible

// NewRunner creates a ready‑to‑use Runner.
func NewRunner(opts ...Option) *Runner

// Run executes the playbook and returns a parsed Result.
// The context can be used to cancel the execution.
func (r *Runner) Run(ctx context.Context) (*Result, error)

// ValidatePlaybook checks a playbook with ansible‑lint.
func ValidatePlaybook(path string) error

// UploadPlaybook stores a user‑provided playbook in a temp file.
func UploadPlaybook(src io.Reader) (string, error)

// ExecutePlaybook runs a playbook with the given inventory & extra‑vars.
func ExecutePlaybook(ctx context.Context, playbookPath, inventory string,
    extraVars map[string]interface{}) (*Result, error)

// ExecutePlaybookWithSandbox does the same but forces sandbox execution.
func ExecutePlaybookWithSandbox(ctx context.Context, playbookPath, inventory string,
    extraVars map[string]interface{}) (*Result, error)