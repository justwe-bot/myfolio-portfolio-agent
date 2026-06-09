# Security

The Agent Token maps API calls to the logged-in MyFolio user who generated it.

Rules:

- Store the token only in local agent secrets or environment variables.
- Never commit the token to source control.
- Never include the token in public prompts, screenshots, logs, or bug reports.
- Reset the token immediately if it may have leaked.
- Treat all write actions as portfolio-record changes only, not financial trades.
- Confirm destructive actions before calling the delete API.

The MyFolio backend never accepts `userId` from Agent API calls. User identity is derived from the token.
