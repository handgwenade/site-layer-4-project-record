# Site Layer 4 Project Record

Public-records website for the proposed Site Layer 4 project near Wheatland, Wyoming.

## Repository and release boundary

`public/` contains the 57 approved website inputs only: pages, assets, and original downloadable records. Internal research, correspondence beyond the approved public excerpts/records, backups, review reports and credentials are not part of this repository.

Original public-record PDFs and ZIP must remain byte-for-byte unchanged. `approved-manifest.json` records the approved input hashes. The build fails on any unexpected file or altered input.

## Build and hosting

Use Node.js 24. No third-party packages are needed.

```sh
npm run check
npm run build
```

Vercel serves only generated `dist/`, never the repository root. The build preserves visible content and records, updates canonical/sitemap/robots URLs to the origin in `site.config.json`, and renders page-specific descriptions and social metadata into the initial HTML. The original approved inputs retain their original metadata for traceability.

The public hostname is `site-layer-4-project-record.vercel.app`, subject to its Vercel domain assignment. Existing `.html` links and fragment identifiers are retained; clean URLs are enabled.

## Future changes

### Social-sharing metadata

`social-sharing.json` holds page-specific titles/descriptions and the shared image reference. `scripts/social-sharing.mjs` writes Open Graph and Twitter/X tags into the initial built HTML, with clean HTTPS canonical URLs on the configured production origin. Visible page content and original input HTML are unchanged. The shared artwork at `public/social/site-layer-4-share-v1.png` is a 1200 × 630 PNG recomposed from the user's map screenshot, with Site Layer 4 branding, an approximate-location qualification, and OpenStreetMap attribution. It is a sharing illustration, not new geographic evidence; the original screenshot and interactive map remain unchanged.

The user approved this sharing image and metadata for publication on September 21, 2026. Run `npm run build` and `npm run check:social -- --production` to verify the production output, or `npm run preview:build` and `npm run check:social` for local review. Missing artwork is reported as incomplete (exit 2), not a successful image check. For a future unapproved sharing revision, set `releaseStatus: local-review` to block production builds until the revision is approved.

### Participation-guide release and local review workflow

The user approved publication of the participation-guide redesign and final disclosure/return-navigation refinements on September 21, 2026. The approved manifest includes the revised guide HTML and its page-scoped CSS/JavaScript; original records are unchanged.

For subsequent local guide reviews, `npm run preview:build` verifies the approved manifest plus the three explicitly scoped files in an ignored `preview-manifest.json`, then writes `preview-dist/` for loopback serving. This optional review overlay does not authorize publication. Test artifacts stay outside this repository. Publication requires deliberate review and approval of the changed manifest entries.

Edit approved website inputs deliberately, preserving factual qualifications and original records. Review and update the manifest when approving a content revision; do not blindly regenerate it to bypass a failed check. Pushes to the connected production branch may deploy automatically, so review before pushing.

The previous Sites publication remains available separately as a rollback/reference copy. The current repository does not modify or deactivate it.
