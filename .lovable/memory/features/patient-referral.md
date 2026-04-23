---
name: Patient Referral
description: Super Admin patient refer flow originates from Hospitals page; explicit From → To hospital UI
type: feature
---

Refer trigger location: **Hospitals page** — every NICU-enabled hospital row has a "Refer" button (NOT on Patient List).

Flow:
1. Click "Refer" on a hospital row → that hospital becomes the **From** hospital.
2. Modal shows a clear From → To banner. The current hospital is locked as the source.
3. To-hospital list = all OTHER hospitals where `nicuAvailable === true` AND has at least 1 available bed.
4. Filters in modal: Division, District (cascaded), and free-text hospital name search.
5. Click "Refer Here" on a destination → AlertDialog confirms transfer with From → To summary.
6. On confirm, toast shows "Patient referred from {A} → {B}".

Both sides of the transfer must be visible at every step so the operator never confuses source and destination.
