import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Await, useFetcher, useLoaderData } from "@remix-run/react";

import { useState, Suspense } from 'react'

import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

import { author_post, authors, categories, post_category, posts } from "~/db";

import { like, eq } from "drizzle-orm";
import { Spinner } from "./search";
import { PostCard } from "./PostCard";
import { DbConnection } from "./connection";






export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

interface PostData {
  post: {
    id: number;
    title: string;
    content: string;
    date: string;
    category?: string;
    category_description?: string;
    authorName?: string;
    authorDescription?: string;
  }[];
}

async function fetchPosts(category: string | null, author: string | null): Promise<PostData> {
  const db = await DbConnection();
  const data: PostData = { post: [] };

  if (category !== null) {
    const cat = parseInt(category);
    data.post = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        date: posts.date,
        category: categories.category,
        category_description: categories.description,
      })
      .from(post_category)
      .innerJoin(posts, eq(post_category.post_id, posts.id))
      .innerJoin(
        categories,
        eq(post_category.category_id, categories.category_id)
      )
      .where(eq(post_category.category_id, cat));

    return data;
  }

  if (author !== null) {
    const auth = parseInt(author);
    data.post = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        date: posts.date,
        authorName: authors.name,
        authorDescription: authors.description,
      })
      .from(author_post)
      .innerJoin(posts, eq(author_post.post_id, posts.id))
      .innerJoin(
        authors,
        eq(author_post.author_id, authors.author_id)
      )
      .where(eq(author_post.author_id, auth));
    return data;
  }

  data.post = await db.select().from(posts);
  return data;
}
export async function loader({ request }: LoaderFunctionArgs) {
  const url = request.url;
  const category = new URL(url).searchParams.get("category");
  const author = new URL(url).searchParams.get("author");

  const postsPomise = fetchPosts(category, author);
  return {
    posts: postsPomise,
  };
}

function Loading() {
  return <div>Loading...</div>;
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const f = useFetcher<typeof action>({
    key: "search",
  });
  const isSub = f.state === "submitting";

  const searchResult = f.data;
  return (
    <div className="h-screen mt-6">
      <f.Form method="post" className="w-full flex justify-between mb-5">
        <input
          type="search"
          required
          placeholder="Title of Post"
          name="search"
          className="p-4 w-[80%] rounded-2xl focus-visible:shadow-lg shadow-blue-200 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-950 text-white w-[18%] rounded-2xl font-semibold flex justify-center items-center"
        >
          {isSub ? <Spinner /> : "Search"}
        </button>
      </f.Form>
      {searchResult ? (
        <div className="space-y-6">
          {searchResult.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Suspense fallback={<Loading />}>
          <Await resolve={data.posts}>
            {(posts) => {
              const categories = posts.post[0];
              const author = posts.post[0];
              return (
                <motion.div  layout className="space-y-6">
                  {categories.category && (
                    <div className="p-6 border-2 rounded-2xl hover:shadow-2xl ">
                      <span className="text-gray-500 capitalize mb-4 font-semibold text-sm tracking-wide">
                        about the category
                      </span>
                      <h2 className="font-semibold text-2xl">
                        {categories.category}
                      </h2>
                      <p className="mt-4">{categories.category_description}</p>
                    </div>
                  )}

                  {author.authorName && (
                    <div className="p-6 border-2 rounded-2xl hover:shadow-2xl ">
                      <span className="text-gray-500 capitalize mb-4 font-semibold text-sm tracking-wide">
                        about the author
                      </span>
                      <h2 className="font-semibold text-2xl">
                        {author.authorName}
                      </h2>
                      <p className="mt-4">{author.authorDescription}</p>
                    </div>
                  )}

                  {posts.post.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </motion.div>
              );
            }}
          </Await>
        </Suspense>
      )}
      <GeneratePost />
    </div>
  );
}





export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  console.log("action");
  const search = formData.get("search")?.toString() || "";

  const db = await DbConnection();
  const data = await db
    .select()
    .from(posts)
    .where(like(posts.title, `%${search}%`));
  return data;
}



export function GeneratePost() {
  const f = useFetcher()
  const [isHovered, setIsHovered] = useState(false)
  const isSub = f.state === "submitting"

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <motion.button
        disabled={isSub}
        className="bg-blue-600 text-white p-4 rounded-full font-bold text-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
        onClick={() => {
          f.submit({
            "test": "test"
          }, {
            action: "/ai",
            method: "POST",
          })
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        layout
      >
        <AnimatePresence mode="wait">
          {isSub ? (
            <motion.div
              key="spinner"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center justify-center"
            >
              <Loader2 className="w-6 h-6 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="text"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center space-x-2"
            >
              <span>Generate Post</span>
              <motion.span
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                ✨
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}