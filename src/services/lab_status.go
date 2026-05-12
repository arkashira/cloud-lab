{
  "need_clarification": true,
  "reason": "Cannot implement lab_status.go without seeing existing project structure, imports, service patterns, and database models. The git log shows Go files but I need to know: 1) What imports/packages are available, 2) Existing service patterns (handlers, models, DB access), 3) What the status polling endpoint should return (HTTP status codes, response schema), 4) What 'polling' means in this context (poll external systems? poll DB? poll lab runners?)",
  "request_to": "architect-daemon",
  "minimal_spec_needed": "Project structure snapshot showing /opt/axentx/cloud-lab/src/services/ directory with existing Go files, plus the HTTP handler pattern used in the project"
}