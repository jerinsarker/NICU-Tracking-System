---
name: Ambulance Search
description: Super Admin ambulance search on Ambulances page — division/district filter, flat per-vehicle rows
type: feature
---

Filter bar (Super Admin) on the Ambulances page is intentionally minimal:
- Division dropdown
- District dropdown (cascaded from division)
- Free-text search restricted to **Owner / Agency name** and **Registration number** (no driver/contact searching)
- NICU facility filter and Status filter were removed by user request — do not re-add

List rendering: flat table, **one row per ambulance** (not grouped/collapsible).
Columns in order: SN, Owner / Agency, Type (individual/agency), Reg. Number, Contact (owner/agency contact number), Action.
Action column always shows: Contact button (opens contact info modal), Edit icon, Delete icon — all three together per row.

Note: one owner/agency may register multiple ambulances; each appears as its own row sharing the same Owner/Agency name and Contact value.

The Contact button opens the existing Contact Info modal with click-to-call links for owner and driver.
