import { Link } from "@remix-run/react";
import { motion } from "framer-motion";


export function PostCard({ post }: { post: { id: number; title: string; content: string; date: string } }) {
    return (
        <motion.div
            layout
            key={post.id}
            className="bg-white p-6 rounded-2xl shadow-md shadow-blue-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Link to={`/posts/${post.id}`} className="block">
                <motion.h2
                    layout
                    className="text-3xl font-bold mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    {post.title}
                </motion.h2>
                <motion.p
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="truncate ..."
                >
                    {post.content}
                </motion.p>
                <motion.div
                    layout
                    className="mt-4 text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {new Date(post.date).toLocaleDateString()}
                </motion.div>
            </Link>
        </motion.div>
    );
}