import { motion } from "framer-motion"
import { categories } from "~/db";
import { DbConnection } from "./connection";
import { Await, Link, useFetcher, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { ActionFunctionArgs } from "@remix-run/node";
import { like } from "drizzle-orm";
import { Spinner } from "./search";
async function getCategory() {
  const db = await DbConnection();
  const ListCategory = db.select().from(categories);
  return ListCategory;
}
export async function loader() {
  return {
    categories: getCategory(),
  };
}



export function CategoryCard({
  cat,
}: {
  cat: {
    category_id: number;
    category: string;
    description: string;
  };
}) {
  return (
    <motion.div
      key={cat.category_id}
      className="bg-white p-6 shadow-2xl shadow-blue-200 rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={`/?category=${cat.category_id}`} className="block">
        <motion.div
          className="font-semibold text-2xl mb-2 flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {cat.category}
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            whileHover={{ rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
            />
          </motion.svg>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {cat.description}
        </motion.div>
      </Link>
    </motion.div>
  );
}
export default function Page() {
  const { categories } = useLoaderData<typeof loader>();
  const f = useFetcher<typeof action>();
  const isSub = f.state === "submitting";
  const searchResult = f.data;
  return (
    <div className="space-y-5 p-4">
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
        <>
          {searchResult.map((cat) => (
            <CategoryCard cat={cat} key={cat.category_id} />
          ))}
        </>
      ) : (
        <Suspense fallback={<div>loading...</div>}>
          <Await resolve={categories}>
            {(categories) => (
              <>
                {categories.map((cat) => (
                  <CategoryCard cat={cat} key={cat.category_id} />
                ))}
              </>
            )}
          </Await>
        </Suspense>
      )}
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
    .from(categories)
    .where(like(categories.category, `%${search}%`));
  return data;
}
