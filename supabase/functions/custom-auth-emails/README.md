
# Custom Auth Emails Function

This Edge Function handles custom email templates for Supabase authentication using ActiveCampaign.

## Environment Variables

- `ACTIVECAMPAIGN_API_URL`: Your ActiveCampaign API URL
- `ACTIVECAMPAIGN_API_KEY`: Your ActiveCampaign API Key

## Features

- Custom email templates for:
  - Sign up confirmation
  - Password reset
  - Magic link authentication
  - User invitations
- Branding customization (FSW Engenharia)
- Mobile-responsive email templates

## Usage

The function expects a POST request with the following JSON body:

```json
{
  "type": "signup | magiclink | recovery | invite",
  "email": "user@example.com",
  "data": {
    // URL fields based on the type of email
    "confirmationURL": "https://example.com/confirm?token=xyz",
    "recoveryURL": "https://example.com/reset?token=xyz",
    "magicLinkURL": "https://example.com/auth?token=xyz",
    "inviteURL": "https://example.com/invite?token=xyz"
  }
}
```

## Notes

This function needs to be called explicitly, as it doesn't automatically intercept Supabase auth emails.
