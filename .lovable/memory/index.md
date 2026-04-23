# Memory: index.md
Updated: now

# Project Memory

## Core
Nationwide Real-Time NICU Bed Tracking System (React, Tailwind CSS, Recharts, Lucide).
Visuals: Medical blues, clean whites, soft teal accents.
Bangladesh context: default to +880 phone prefixes.
Destructive actions (e.g., deletes) must require explicit safety confirmation popups.

## Memories
- [NICU Bed Tracking](mem://features/nicu-bed-tracking) — QR code bed management and Quick Admission bypass workflows
- [Hospital Management](mem://features/hospital-management) — Registration conditional logic, dynamic bed management, table structure
- [Patient Management](mem://features/patient-management) — Registration modal UI patterns, dashboard metrics (formerly Consumers)
- [Patient Referral](mem://features/patient-referral) — Refer trigger lives on Hospitals page (per row) with explicit From → To hospital flow; only NICU hospitals with available beds shown as "To"; division/district filter; confirmation popup
- [Ambulance Tracking](mem://features/ambulance-tracking) — Two-section registration, division/district service area selection
- [Ambulance Search](mem://features/ambulance-search) — Super Admin filters: Division + District only; search by Owner/Agency or Reg. Number; rows grouped by owner with expandable vehicles list; Contact modal with click-to-call
- [Transaction Analytics](mem://features/transaction-analytics) — Donut: Occupied vs Available NICU Beds; Bar: NICU Beds by Division; row-level CSV/PDF exports
- [Settings Administration](mem://features/settings-administration) — Admin tabs (Users, System, My Profile), Super Admin restrictions
- [Navigation Structure](mem://ui/navigation-structure) — Collapsible sidebar links and layout
- [Role Based Access Control](mem://auth/role-based-access-control) — CRUD mapping for Hospital, Ambulance, Patient roles
- [Regional Constraints](mem://constraints/regional-settings) — Division/District administrative hierarchy for service areas
