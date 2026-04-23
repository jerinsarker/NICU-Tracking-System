---
name: Ambulance Search
description: Super Admin ambulance search on Ambulances page — division/district filter only, owner-grouped rows
type: feature
---

Filter bar (Super Admin) on the Ambulances page is intentionally minimal:
- Division dropdown
- District dropdown (cascaded from division)
- Free-text search restricted to **Owner / Agency name** and **Registration number** (no driver/contact searching)
- NICU facility filter and Status filter were removed by user request — do not re-add

List rendering: rows are **grouped by Owner / Agency** because one owner/agency can register multiple ambulances.
- Each owner = one collapsible parent row (chevron toggle) showing Owner name, Type (individual/agency), contact number, and total vehicle count.
- Expanding reveals each ambulance underneath with Reg number, Vehicle, Driver + driver contact, Service Area, Status, and per-vehicle Contact / Edit / Delete actions.

Selecting "Contact" opens the existing Contact Info modal with click-to-call links.
