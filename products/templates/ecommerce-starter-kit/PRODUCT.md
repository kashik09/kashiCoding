# E-Commerce Starter Kit Spec

## Features
- Catalog, cart, and checkout flow.
- Stripe integration with webhooks.
- Order management and admin UI.
- License-aware product types.
- Multi-currency support (USD/UGX baseline).

## Constraints
- Stripe is the default payment provider.
- Requires database-backed product data.
- Inventory tracking is optional, not default.

## Assumptions
- Products are primarily digital.
- Users will add their own branding and copy.
- Deployment uses modern Node hosting.

## Open questions
- Will physical shipping be supported in v1?
- Which tax provider should be integrated?
- Do we need inventory tracking by default?
