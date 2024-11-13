import { LoaderFunctionArgs, ActionFunction, json } from "@remix-run/node";
import { DbConnection } from "./connection"
import { comments, posts, tags } from "~/db";
import { eq } from "drizzle-orm";
import { Await, Link, useLoaderData, useNavigation, Form } from "@remix-run/react";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";

import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";

async function fetchPost(id: number) {
  const db = await DbConnection();
  return await db.select().from(posts).where(eq(posts.id, id));
}

async function fetchComments(id: number) {
  const db = await DbConnection();
  return await db.select().from(comments).where(eq(comments.post_id, id));
}

async function fetchTags(id: number) {
  const db = await DbConnection();
  return await db.select().from(tags).where(eq(tags.post_id, id));
}

export async function loader({ params }: LoaderFunctionArgs) {
  const postId = Number(params.id);
  return {
    post: fetchPost(postId),
    comments: fetchComments(postId),
    tags: fetchTags(postId),
  };
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const comment = formData.get("comment") as string;
  const postId = Number(params.id);

  if (!comment) {
    return json({ error: "Comment is required" }, { status: 400 });
  }

  const db = await DbConnection();
  await db.insert(comments).values({
    comment,
    post_id: postId,
  });

  return json({ success: true });
};

export default function Post() {
  const { post, comments, tags } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <motion.div layout className="mt-6 max-w-4xl mx-auto p-6">
      <Link to="/" className="text-blue-600 hover:underline mb-4 block">&larr; Back to posts</Link>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={post}>
          {(post) => (
            <motion.div layout className="bg-white rounded-xl p-6 shadow-md shadow-blue-200 mb-6">
              <motion.h1 layout className="text-5xl font-bold mb-4">{post[0].title}</motion.h1>
              <motion.span layout className="text-sm text-gray-500 italic">
                {new Date(post[0].date).toLocaleDateString()}
              </motion.span>
              <motion.p layout className="font-medium mt-4">{post[0].content}</motion.p>
              <Suspense fallback={<div>Loading tags...</div>}>
                <Await resolve={tags}>
                  {(tags) => (
                    <motion.div layout className="mt-4 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag.tag_id} variant="secondary">{tag.tag}</Badge>
                      ))}
                    </motion.div>
                  )}
                </Await>
              </Suspense>
            </motion.div>
          )}
        </Await>
      </Suspense>

      <motion.h2 layout className="text-2xl font-semibold mb-4">Comments</motion.h2>
      <Suspense fallback={<div>Loading comments...</div>}>
        <Await resolve={comments}>
          {(comments) => (
            <motion.div layout className="space-y-4 mb-6">
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
                  <p>{comment.comment}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </Await>
      </Suspense>

      <motion.div layout className="bg-white rounded-xl p-6 shadow-md shadow-blue-200">
        <h3 className="text-xl font-semibold mb-4">Add a Comment</h3>
        <Form method="post">
          <div className="space-y-4">
            <div>
              <Textarea
                name="comment"
                placeholder="Write your comment here..."
                required
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Comment"}
            </Button>
          </div>
        </Form>
      </motion.div>
    </motion.div>
  );
}