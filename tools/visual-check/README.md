Temporary helper: renders the built site in a headless browser (GitHub Actions has
network + a browser, this sandbox has neither) and commits screenshots of the
Section 05 arena cards in both themes.

Push a change under `tools/visual-check/**` to trigger it. Removed before merge.

(out/ paths must be absolute — the shots script runs from /tmp/pw.)

Re-run after trimming the 7ouma crest and dropping its emblem frame.
