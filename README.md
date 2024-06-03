# Setup project

Create .env file

```
DATABASE_URL="mysql://root:@localhost:3306/learn_typescript_restful_api"
```

```shell
npm install
npx prisma migrate dev
npx prisma generate
npm run build
npm run start
```
