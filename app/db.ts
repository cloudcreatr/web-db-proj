

import { int, mysqlTable, primaryKey, text } from "drizzle-orm/mysql-core";


export const test = mysqlTable("test", {
    id: int("ID").autoincrement().primaryKey(),
})




export const posts = mysqlTable("posts", {
    id: int("id").autoincrement().primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    date: text("date").notNull(),


})

export const author_post = mysqlTable("post_auhtor", {
    post_id: int("post_id").notNull().references(() => posts.id),
    author_id: int("author_id").notNull().references(() => authors.author_id),
}, (t) => {
    return {
        unique2: primaryKey({ columns: [t.post_id, t.author_id] }),

    }
})


export const tags = mysqlTable("tags", {
    tag_id: int("tag_id").autoincrement().primaryKey(),
    tag: text("tag").notNull(),
    post_id: int("post_id").notNull().references(() => posts.id),

}, (t) => {
    return {
        pk: primaryKey({ columns: [t.tag_id, t.post_id] }),
    }
})


export const categories = mysqlTable("categories", {
    category_id: int("category_id").autoincrement().primaryKey(),
    category: text("category").notNull(),
    description: text("description").notNull(),
})


export const post_category = mysqlTable("post_category", {
    post_id: int("post_id").notNull().references(() => posts.id),
    category_id: int("category_id").notNull().references(() => categories.category_id),
}, (t) => {
    return {
        unique2: primaryKey({ columns: [t.post_id, t.category_id] }),
    }
})


export const authors = mysqlTable("authors", {
    author_id: int("author_id").autoincrement().primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),

})

export const comments = mysqlTable("comments", {
    comment_id: int("comment_id").autoincrement().primaryKey(),
    comment: text("comment").notNull(),
    post_id: int("post_id").notNull().references(() => posts.id),

})