cd server
docker compose up -d
npm install
npx prisma migrate dev
npm run db:seed
npm run dev

Usuario demo creado por el seed:

Email: scout@ldp.test
Password: Scout1234

Las rutas de datos requieren:

Authorization: Bearer <token>
