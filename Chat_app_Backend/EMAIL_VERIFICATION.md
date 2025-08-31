# Email Verification Setup

This document explains how to set up email verification for the Chat Sentinel application.

## Overview

Email verification ensures that users provide valid email addresses when signing up. The system sends a verification code to the email address, which the user must enter to complete registration.

## Required Environment Variables

Add the following environment variables to your `.env` file:

```
# Email Service Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-email-app-password
```

## Notes on Email Service Setup

### For Gmail

1. Go to your Google Account settings
2. Navigate to Security > 2-Step Verification > App Passwords
3. Create a new app password and use it as EMAIL_PASSWORD (not your regular Gmail password)

### For Other Email Services

Adjust the EMAIL_SERVICE value to match your provider:
- 'hotmail'
- 'yahoo'
- etc.

Or for custom SMTP setup:
```
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
EMAIL_SECURE=false
```

## Workflow

1. User registers with email, username, password
2. A 6-digit verification code is sent to their email
3. User enters the code to verify their account
4. After verification, users can log in and use the application
5. If the code expires (after 30 minutes), users can request a new one

## Testing

You can test the email verification system by:
1. Creating a new user account
2. Checking the console logs for the verification code (in development)
3. Entering the code to verify the account
4. Attempting to log in (which should now work)
