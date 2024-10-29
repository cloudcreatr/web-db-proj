import { defineConfig } from "drizzle-kit";
export default defineConfig({
    dialect: "mysql",
    schema: "./app/db.ts",
    dbCredentials: {
        user: "omnaidu",
        password: "omtech23",
        host: "ls-26a1ac3f3efdbfb194d6622c7b186c31a03404cf.cjmq28yyuto4.ap-south-1.rds.amazonaws.com",
        port: 3306,
        database: "blog_db"
    }
});