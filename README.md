# Site Layer 4 Project Record

Public-records website for the proposed Site Layer 4 project near Wheatland, Wyoming.

## Repository and release boundary

`public/` contains the 54 approved website inputs only: pages, assets, and original downloadable records. Internal research, correspondence beyond the approved public excerpts/records, backups, review reports and credentials are not part of this repository.

Original public-record PDFs and ZIP must remain byte-for-byte unchanged. `approved-manifest.json` records the approved input hashes. The build fails on any unexpected file or altered input.

## Build and hosting

Use Node.js 24. No third-party packages are needed.

```sh
npm run check
npm run build
```

Vercel serves only generated `dist/`, never the repository root. The build preserves all content and records; its only transformation updates canonical, sitemap and robots URLs to the origin in `site.config.json`. The original approved inputs retain their original metadata for traceability.

The public hostname is `site-layer-4-project-record.vercel.app`, subject to its Vercel domain assignment. Existing `.html` links and fragment identifiers are retained; clean URLs are enabled.

## Future changes

Edit approved website inputs deliberately, preserving factual qualifications and original records. Review and update the manifest when approving a content revision; do not blindly regenerate it to bypass a failed check. Pushes to the connected production branch may deploy automatically, so review before pushing.

The previous Sites publication remains available separately as a rollback/reference copy. The current repository does not modify or deactivate it.
