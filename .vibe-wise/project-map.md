# Project Map

## Purpose
Multi-seller ecommerce backend inspired by Shopee.

## Requirements
User wants features similar to Shopee. Exact MVP scope remains unresolved.

## Components
Verified on 2026-10-10: NestJS modules auth, users, shared; Prisma PostgreSQL schema; bcrypt; JWT; Zod DTO schemas.
Auth registration implementation exists. OTP endpoint was a stub. Login and profile were commented at inspection. Current inspection confirms these endpoints remain unchanged.

## Main Flow
Verified: HTTP register -> AuthController -> AuthService -> AuthRepository -> Prisma -> PostgreSQL.

## Data and Trust Boundaries
Database configuration in .env (no secrets recorded). JWT helper and access-token guard exist; complete session lifecycle was not implemented at inspection.

## Build and Deployment
package.json: build, start:dev, test, test:e2e. Deployment not verified.

## Unknowns
MVP scope; learner experience and learning scope. Hexagonal architecture and CASL were discussed, not confirmed or implemented.

## Implemented Auth refactor
AuthController -> AuthService -> AuthRepository port -> PrismaAuthRepository -> PostgreSQL.
AuthService -> RolesService -> RoleRepository port -> PrismaRoleRepository.
ZodValidationPipe registered globally in main.ts. Auth domain types do not depend on Prisma.
Compatibility re-exports remain in auth.repo.ts and roles.services.ts. No mapper needed for the current structurally compatible domain/Prisma result.
Login controller had been uncommented without a service method; restored to commented state for the approved scope.
