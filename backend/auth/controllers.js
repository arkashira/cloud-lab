   # Initiate reset
   POST /auth/reset
   Body: { "email": "user@example.com" }

   # Complete reset
   POST /auth/reset/<valid_token>
   Body: { "password": "newSecurePassword123!" }