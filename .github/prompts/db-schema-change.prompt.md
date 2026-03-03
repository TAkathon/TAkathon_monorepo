---
mode: "agent"
description: "Add or modify a Prisma schema field and propagate the change through gateway + shared types"
---

# Prisma Schema Change

Make a schema change and propagate it consistently through the full stack.

## Context files to read first

#file:prisma/schema.prisma
#file:apps/core-gateway/src/lib/prisma.ts
#file:libs/shared/types/src/index.ts

## Steps to follow (in order)

1. **Edit `prisma/schema.prisma`** — add/modify the field with correct type, `@map`, and `@db.*` attributes.
2. **Run `npm run db:generate`** to regenerate the Prisma client after schema edits (remind the user to do this).
3. **For dev**: `npm run db:push` to sync the schema to the running database.
4. **For production**: create a named migration with `npx prisma migrate dev --name <description>`.
5. **Update `libs/shared/types/src/index.ts`** — add the new TypeScript type/interface that mirrors the schema change.
6. **Update the service file** (`apps/core-gateway/src/services/<role>/<feature>.service.ts`) to include the new field in its Prisma queries.
7. **Update gateway route validation** (Zod schema) to accept or return the new field.
8. **Update frontend** — update the relevant page and shared API function to pass/display the new field.

## Schema conventions

- Table names: `snake_case` in the DB via `@@map("table_name")`
- Column names: `camelCase` in Prisma → `@map("snake_case")` for the DB column
- JsonB fields: `Json? @db.JsonB` for flexible nested data (e.g., `availability`)
- Enums: `SCREAMING_SNAKE_CASE` values

## Describe your change

<!-- What model/field is changing, and why? What is the new field type and shape? -->
