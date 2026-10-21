# Atharva Ajmera — Portfolio

Personal portfolio built with Next.js, Tailwind CSS, and Framer Motion.

## Live site

- GitHub Pages: https://atharvaajmera.github.io/atharva.github.io/
- Contact API (Vercel): https://atharva-portfolio-liart.vercel.app/api/contact

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

The site is automatically deployed to GitHub Pages by the workflow in
`.github/workflows/deploy.yml` on every push to `main`.

GitHub Pages only serves static files, so the build uses Next.js
`output: "export"`. The contact form still uses the API route running on
Vercel; CORS is restricted to the portfolio's origins in
`app/api/contact/route.ts`.

### Build the static export locally

```bash
GITHUB_PAGES=true \
NEXT_PUBLIC_BASE_PATH=/atharva.github.io \
NEXT_PUBLIC_SITE_URL=https://atharvaajmera.github.io/atharva.github.io \
NEXT_PUBLIC_CONTACT_API_URL=https://atharva-portfolio-liart.vercel.app/api/contact \
npm run build
```

The generated site is written to `out/`.

### Changing the deployment URL

The site URL is configured through environment variables in the workflow:

- `NEXT_PUBLIC_BASE_PATH` — URL path prefix (for example `/portfolio`), or empty
  for a user site such as `https://atharvaajmera.github.io`.
- `NEXT_PUBLIC_SITE_URL` — canonical URL used by metadata, `sitemap.xml`, and
  `robots.txt`.
- `NEXT_PUBLIC_CONTACT_API_URL` — absolute URL of the contact API.
