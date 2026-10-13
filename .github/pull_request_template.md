## What changed

-

## Why

-

## Verification

- [ ] `dotnet test GTAMapQuant.slnx --configuration Release`
- [ ] `npm run lint` (in `frontend`)
- [ ] `npm run test:coverage` (in `frontend`)
- [ ] `npm run build` (in `frontend`)
- [ ] I checked the affected UI manually.

## Security and migrations

- [ ] No secrets, tokens, or passwords were added to the repository.
- [ ] A migration was added when the EF Core model changed.
- [ ] Admin API endpoints require authorization.
