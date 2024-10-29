import { LoaderFunctionArgs } from "@remix-run/node";
import { DbConnection } from "./connection";
import {  comments, posts } from "~/db";
import { eq } from "drizzle-orm";
import { Await, Link, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { motion } from "framer-motion";


async function fetchPost(id: number) {
    const db = await DbConnection()
    return await db.select().from(posts).where(eq(posts.id, id));
}

async function fetchComments(id: number) {
    const db = await DbConnection()
    return await db.select().from(comments).where(eq(comments.post_id, id));
}



export async function loader({ params }: LoaderFunctionArgs) {

    const post = fetchPost(Number(params.id))
    return {
        post: post,
        comments: fetchComments(Number(params.id))
    }
}
export default function Post() {
    const { post, comments } = useLoaderData<typeof loader>();

    return (
        <motion.div layout className="mt-6">
            <Link to="/" className="text-blue-600 hover:underline mb-4 block">&larr; Back to posts</Link>
            <Suspense fallback={<div>Loading...</div>}>
                <Await resolve={post}>
                    {(post) => (
                        <motion.div layout>
                            <motion.h1 layout className="text-5xl font-bold mb-4 mt-6">{post[0].title}</motion.h1>
                            <motion.span layout className="text-1xl font-normal italic">
                                {post[0].date}
                            </motion.span>
                            <motion.p layout className="font-medium mt-4">{post[0].content}</motion.p>
                        </motion.div>
                    )}
                </Await>
            </Suspense>

            <motion.h2 layout className="mb-5 font-semibold underline mt-5">Comments</motion.h2>
            <Suspense fallback={<div>Loading...</div>}>
                <Await resolve={comments}>
                    {(comments) => (
                        <motion.div layout className="space-y-4">
                            {comments.map((comment) => (
                                <motion.div
                                    key={comment.comment_id}
                                    layout
                                    className="bg-blue-100 p-4 shadow-md shadow-blue-200 rounded-xl"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3>{comment.comment}</h3>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </Await>
            </Suspense>
        </motion.div>
    );
}