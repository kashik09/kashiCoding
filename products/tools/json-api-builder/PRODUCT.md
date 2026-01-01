# JSON API Builder Spec

## Features
- Visual schema builder and validation.
- Automatic REST API generation.
- API versioning and documentation.
- Authentication and rate limiting.
- Exports to OpenAPI and Postman.

## Constraints
- Schema validation must be strict.
- Versioning strategy required from day one.
- Multi-tenant isolation is mandatory.

## Assumptions
- Users need quick iteration on schemas.
- Usage-based billing model.
- Hosted SaaS delivery.

## Open questions
- Which UI framework should power the builder?
- How will custom domains be provisioned?
- What storage layer backs generated APIs?
