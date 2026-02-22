# Vercel: Site password (onboarding gate)

The onboarding Step 1 uses a password that is checked by the API route. The password must be set as an **environment variable** so it is never in your repo or client bundle.

## 1. Set the password in Vercel

1. Open your project in the [Vercel dashboard](https://vercel.com/dashboard).
2. Go to **Settings** → **Environment Variables**.
3. Add a variable:
   - **Name:** `SITE_PASSWORD`
   - **Value:** your chosen password (the one visitors must enter to unlock the site)
   - **Environments:** check **Production**, **Preview**, and **Development** (or only Production if you prefer).
4. Click **Save**.
5. **Redeploy** the project (Deployments → ⋮ on latest → Redeploy) so the new variable is applied.

## 2. Local development

Create a file `.env.local` in the project root (it is gitignored):

```
SITE_PASSWORD=your_chosen_password
```

Use the same password as in Vercel so behaviour matches. Restart `npm run dev` after adding or changing it.

## 3. Security note

- Do **not** commit `.env.local` or put the real password in any file that is committed.
- Only set the real password in Vercel and in local `.env.local`.
- `.env.example` contains a placeholder only; replace it with your real password only in the places above.
