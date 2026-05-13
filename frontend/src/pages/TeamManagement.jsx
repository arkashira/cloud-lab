{
  "TeamManagement.jsx": "<full file content here>",
  "ui_changes": [
    "Add ‘Generate Invite Link’ button next to the ‘Add Member’ button in the header.",
    "Show a modal with the generated link and copy‑to‑clipboard button.",
    "Display a table of users filtered by the current lab namespace.",
    "Hide the ‘Role’ column for users with the ‘viewer’ role; show edit/delete actions only for admins."
  ],
  "api_details": {
    "generateInvite": {
      "method": "POST",
      "endpoint": "/api/labs/{labId}/invite",
      "response": "{ inviteUrl: string }"
    },
    "listUsers": {
      "method": "GET",
      "endpoint": "/api/labs/{labId}/users",
      "response": "[{ id, email, role }]"
    }
  },
  "style_guidelines": "Uses Tailwind classes; modal component is `Modal` from `@/components/Modal`.",
  "tests_needed": true
}