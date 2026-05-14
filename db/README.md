# Local Database

This project uses local SQLite for development.

```sh
npm run db:init
npm run db:reset
```

The database file is created at `data/locallens.sqlite` and is intentionally ignored by Git.

Schema lives in `db/schema.sql`; seed data converted from `src/lib/mockData.ts` lives in `db/seed.sql`.

Useful checks:

```sh
sqlite3 data/locallens.sqlite ".tables"
sqlite3 data/locallens.sqlite "select * from users;"
```
