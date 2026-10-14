# Aaron Jhade Elmedo — Vercel portfolio

Includes the supplied portrait, all 12 badges, category filters, and an inquiry form addressed to elmedo541@gmail.com. Badge images are cropped from the supplied screenshot, so original downloads will improve sharpness. Individual badge verification links are not yet available.

## Deploy

1. Extract this ZIP. Upload the contents of `aaron-portfolio-vercel` to a new GitHub repository. `package.json`, `vercel.json`, `api`, and `public` must be at the repository root. Include `.gitignore`; never upload secrets.
2. In Vercel, select **Add New → Project**, import that repository, and choose **Other** as the framework. Leave build/install commands unset. Output directory is `public` (also declared in vercel.json).
3. Create a Resend account using **elmedo541@gmail.com** and create an API key with sending permission. Do not put the key in the source code or share it in chat.
4. In Vercel → Project → Settings → Environment Variables add:
   - `RESEND_API_KEY`: your Resend API key (server-side only).
   - `INQUIRY_FROM`: `Portfolio <onboarding@resend.dev>` for initial testing to your own Resend account email. For ongoing use, verify a domain in Resend and replace this with a sender on that domain.
5. Deploy or redeploy after adding environment variables.
6. Open your Vercel URL. Submit a real test inquiry; confirm the message arrives in Gmail (check Spam) and Reply targets the visitor. A successful API acceptance does not guarantee inbox delivery.

Without the API key the form shows an explicit configuration error, and the direct email link remains available. No inquiry database or admin dashboard is included. Set up Vercel Firewall rate limiting for `/api/inquiry` before broad promotion; the included honeypot and origin checks are basic controls, not a distributed rate limiter.

The existing ChatGPT-hosted private portfolio is separate and was not updated by this export. This project has not been deployed to your Vercel account yet.

## Reference documentation

- https://vercel.com/docs/functions/runtimes/node-js
- https://resend.com/docs/api-reference/emails/send-email
- https://resend.com/docs/dashboard/domains/introduction

## Checks

Run `node --test tests/inquiry.test.mjs` for mocked API checks; no real emails are sent by these tests.
