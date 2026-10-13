# Learning Progress

## Auth architecture
- Requirements: learner chose Auth first and retained Zod.
- Demonstrated understanding: business logic belongs in service; storage needs email lookup and creation.
- Chosen design: role management in a separate module.
- Implementation approved: Auth/Roles ports and Prisma adapters; global Zod validation; preserve unexpected errors and handle duplicate registration.
- Implemented: AuthService uses repository port and RolesService; RolesModule owns role lookup; ORM errors translated in adapter.
- Verification: build passed; 7 focused service/HTTP tests passed with mocked persistence. No live database integration test.
- Remaining: login, refresh lifecycle, real OTP, response serialization integration.

## Test organization
- User directly requested moving existing Auth tests out of src/auth.
- Implemented: test/auth holds service and HTTP controller tests; Jest discovers src and test and resolves src aliases.

## Login credential fix
- User requested direct fix for password missing on AuthUser.
- Implemented AuthCredentials and findCredentialsByEmail port/Prisma adapter; login strips password before returning user.
- Existing public user lookup still excludes password and TOTP secret.
