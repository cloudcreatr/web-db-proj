
import { DbConnection } from "./connection";
import { authors } from "~/db";
import { Await, Link, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion"

async function fetchAuthors() {
    const db = await DbConnection()
    return await db.select().from(authors)
}

export function loader() {
    return {
        authors: fetchAuthors()
    };
}






export default function Authors() {
    const { authors } = useLoaderData<typeof loader>()

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h1
                className="font-semibold text-2xl mb-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                Authors
            </motion.h1>
            <Suspense fallback={
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    Loading...
                </motion.div>
            }>
                <Await resolve={authors}>
                    {(authors) => (
                        <motion.div
                            className="flex gap-4 flex-col"
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                            initial="hidden"
                            animate="show"
                        >
                            <AnimatePresence>
                                {authors.map((author) => (
                                    <motion.div
                                        key={author.author_id}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            show: { opacity: 1, y: 0 }
                                        }}
                                        exit={{ opacity: 0, y: -20 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Link to={`/?author=${author.author_id}`}>
                                            <motion.div
                                                className="bg-white p-6 rounded-2xl shadow-md"
                                                whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <motion.h2
                                                    className="font-semibold"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.1 }}
                                                >
                                                    {author.name}
                                                </motion.h2>
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    {author.description}
                                                </motion.p>
                                            </motion.div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </Await>
            </Suspense>
        </motion.div>
    )
}