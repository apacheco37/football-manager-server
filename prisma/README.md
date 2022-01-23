Dev workflow:

1. Make change in schema.prisma
2. Run npm run db:migrate (creates migration file, updates db and runs generate to update prisma client)
3. Update graphql code