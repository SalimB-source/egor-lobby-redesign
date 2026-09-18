# Fetch original EGOR lobby assets

The sandbox this project is edited in has no direct outbound internet access, so
the original `https://egorgaming.com/lobby` markup and the arena icons it renders
are pulled through a short-lived GitHub Actions job instead.

Push a change touching `tools/fetch-egor/**` (this file works) and the
`Fetch original EGOR lobby assets` workflow will:

1. download the original lobby HTML,
2. slice out the `Top Arenas` block for inspection,
3. download every arena avatar (icon) it finds into `client/public/arenas/`,
4. commit the result with `[skip ci]`.

The workflow is a build-time helper only — it is not shipped with the site.

Run: re-triggered after the first attempt hit a blocked/challenged response.

Run 2: SSR shell is a Next.js skeleton — switching to a Playwright render.
