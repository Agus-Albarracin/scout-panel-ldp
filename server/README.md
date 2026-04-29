cd server
docker compose up -d
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
