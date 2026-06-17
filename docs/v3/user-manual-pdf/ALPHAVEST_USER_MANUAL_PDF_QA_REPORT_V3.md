# AlphaVest WealthOS User Manual PDF QA Report V3

Date: 2026-06-17

## Result

Generated `output/pdf/alphavest-wealthos-user-manual-v3.pdf` from the current user-manual source package.

## Coverage

- Format: A4 PDF
- Page count: 38
- Manual tasks covered: 14 of 14
- Workflow references covered: 14 of 14
- Field references covered: 19
- Live screenshot references used: 14
- Rendered QA pages: 38 PNG pages
- Contact sheet: `output/pdf/rendered/alphavest-wealthos-user-manual-v3-contact-sheet.png`

## Checks performed

- `pdfinfo` confirmed title, A4 page size, 38 pages, no encryption, and PDF version 1.4.
- `pypdf` text extraction confirmed the manual title, demo boundary wording, and all task IDs `MT-001` through `MT-014`.
- HTML source validation confirmed 14 image references, zero missing image references, zero failed-run screenshot references, and zero missing task IDs.
- Route-led instruction scan found no matches for imperative path instructions such as `go to /...`.
- ASCII scan over the PDF source package returned no non-ASCII text in generated source files.
- Poppler rendering produced PNG output for all 38 pages.
- Visual inspection covered the contact sheet, cover page, representative task detail pages, screenshot task pages, and appendix page.

## Visual QA notes

The rendered PDF uses a consistent AlphaVest print style with navy headings, gold accents, ivory page surfaces, readable tables, and a stable header/footer system. Screenshot task pages keep the task metadata, UI screenshot, figure caption, and procedure together. Reference and appendix pages render without clipped tables in the sampled pages.

## Known limitations

- The PDF is not tagged; `pdfinfo` reports `Tagged: no`. Do not claim PDF/UA conformance from this artifact.
- The manual reflects the current demo-data-first application and source package. It does not claim production authentication, final persistence, or real client-data behavior beyond what the current source package supports.
- Browser-rendered PDFs should be revalidated after any visual, content, or screenshot-source change.

