# Authentication & User Management Boilerplate Spec

## Features
- NextAuth.js integration.
- Roles: USER, ADMIN, OWNER.
- Social + email/password login.
- Protected routes and API endpoints.
- User profile management.

## Constraints
- Requires database-backed user storage.
- NextAuth v4 baseline.
- App Router compatible APIs.

## Assumptions
- Project uses Prisma or a supported adapter.
- Email provider configured by the user.
- Basic auth UI is acceptable for v0.

## Open questions
- Which database adapters ship by default?
- Should MFA be included in v1?
- What level of audit logging is required?
