# JSON-Based CMS Kit Spec

## Features
- JSON file storage (no database).
- REST API for CRUD operations.
- TypeScript types for content.
- Content versioning metadata.
- Multi-page content support.

## Constraints
- File-based storage only.
- Designed for Git-based workflows.
- Editor UI remains lightweight.

## Assumptions
- Content is stored in the repo.
- Editors are internal users.
- Deployment allows filesystem reads.

## Open questions
- Which WYSIWYG editor should we use?
- How should schema validation be configured?
- Do we need scheduled publishing in v1?
