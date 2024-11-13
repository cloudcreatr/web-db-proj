
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai';


import { z } from 'zod';
import { DbConnection } from './connection';
import { author_post, authors, categories, comments, post_category, posts, tags } from '~/db';
export async function action() {
   try{ console.log("action ai")
    const google = createGoogleGenerativeAI({
        // custom settings
        apiKey: "AIzaSyD1BQxnCSrVZ05AbEq62jiG1VQf6DzU0u0"
    });
    const model = google("gemini-1.5-pro-002")
    const { object } = await generateObject({
        model: model,
        schemaName: 'Recipe',
        schemaDescription: 'A recipe for a dish.',
        schema: z.object({
            title: z.string().describe("title of the blog post"),
            category: z.string().describe("category of the blog post"),
            labels: z.array(z.string()).describe("labels for the blog post"),
            authorName: z.string().describe("name of the author"),
            aboutTheAuthor: z.string().describe("about the author"),
            comments: z.array(z.string()).describe("comments for the blog post"),
            date: z.string().describe("date of the blog post"),
            content: z.string().describe("content of the blog post, should be a markdown string"),
            categoryDescription: z.string().describe("description of the category"),

        }),
        topK: 2,
        topP: 0.9,
        prompt: 'Generate a Blog post with its category, labels, author name and about the author. few comments. markdown is not supported, should be unique',
    });


    const db = await DbConnection()
    const post = await db.insert(posts).values({
        title: object.title,
        content: object.content,
        date: object.date,
    }).$returningId()
    const author = await db.insert(authors).values({
        name: object.authorName,
        description: object.aboutTheAuthor
    }).$returningId()

    await db.insert(author_post).values({
        post_id: post[0].id,
        author_id: author[0].author_id
    })
    const category = await db.insert(categories).values({
        category: object.category,
        description: object.categoryDescription
    }).$returningId()
    await db.insert(post_category).values({
        post_id: post[0].id,
        category_id: category[0].category_id
    })
    object.comments.map(async (comment) => {
        await db.insert(comments).values({
            post_id: post[0].id,
            comment: comment
        })
    })
    object.labels.map(async (label) => {


        await db.insert(tags).values({
            post_id: post[0].id,
            tag: label
        })
    })
    return {
        message: "Hello from the server!"
    }}catch(e){
        console.log(e)
        return {
            message: "Hello from the server!"
        }
    }
}


