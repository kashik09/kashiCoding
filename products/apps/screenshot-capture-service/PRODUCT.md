# Screenshot Capture Service Spec

## Features
- Multiple viewport sizes and full-page capture.
- Custom delays and wait conditions.
- Batch capture and webhook support.
- Usage analytics and quota limits.
- API key authentication.

## Constraints
- Headless browser infrastructure required.
- Rate limiting to control costs.
- Storage and CDN required for delivery.

## Assumptions
- Billing handled via Stripe.
- Users provide accessible URLs.
- Retention policy is configurable.

## Open questions
- Which browser runtime should we standardize on?
- What is the default retention period?
- Which regions should be supported first?
