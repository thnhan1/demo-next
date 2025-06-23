# Prisma with pnpm Cheatsheet

## Setup

```sh
pnpm add -D prisma
pnpm add @prisma/client
pnpm prisma init
```

## Common Commands

| Command                        | Description                       |
|---------------------------------|-----------------------------------|
| `pnpm prisma init`              | Initialize Prisma in project      |
| `pnpm prisma generate`          | Generate Prisma client            |
| `pnpm prisma migrate dev`       | Run & apply migrations (dev)      |
| `pnpm prisma migrate deploy`    | Apply migrations (prod)           |
| `pnpm prisma migrate reset`     | Reset DB & apply all migrations   |
| `pnpm prisma studio`            | Open Prisma Studio (GUI)          |
| `pnpm prisma db seed`           | Run seed script                   |

## Example Workflow

1. **Define schema** in `prisma/schema.prisma`
2. **Generate migration**  
    ```sh
    pnpm prisma migrate dev --name init
    ```
3. **Generate client**  
    ```sh
    pnpm prisma generate
    ```
4. **Use Prisma Client** in your code:
    ```js
    import { PrismaClient } from '@prisma/client'
    const prisma = new PrismaClient()
    ```

## Useful Links

- [Prisma Docs](https://www.prisma.io/docs/)
- [pnpm Docs](https://pnpm.io/)
