import {
  json,
  type ActionFunction,
  type LoaderFunction,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useNavigation,
  useLoaderData,
} from "@remix-run/react";
import { useState, useEffect } from "react";
import { DbConnection } from "./connection";
import {
  posts,
  categories,
  authors,
  tags,
  post_category,
  author_post,
  notifications,
} from "~/db";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { sendNotifications } from "@remix-pwa/push";

export const loader: LoaderFunction = async () => {
  const db = await DbConnection();

  const [existingCategories, existingAuthors] = await Promise.all([
    db
      .select({
        category_id: categories.category_id,
        category: categories.category,
        description: categories.description,
      })
      .from(categories),

    db
      .select({
        author_id: authors.author_id,
        name: authors.name,
        description: authors.description,
      })
      .from(authors),
  ]);

  return json({ categories: existingCategories, authors: existingAuthors });
};

export const action: ActionFunction = async ({ request }) => {
  const db = await DbConnection();
  const formData = await request.formData();

  try {
    await db.transaction(async (tx) => {
      // Handle new category
      const newCategoryName = formData.get("new_category_name")?.toString();
      const newCategoryDesc = formData
        .get("new_category_description")
        ?.toString();
      let categoryIds = formData
        .getAll("categories")
        .map((id) => parseInt(id.toString()))
        .filter((id) => !isNaN(id));

      // Create post
      const [postResult] = await tx.insert(posts).values({
        title: formData.get("title")?.toString() ?? "",
        content: formData.get("content")?.toString() ?? "",
        date: new Date().toISOString(),
      });
      const postId = postResult.insertId;

      // Handle new category if provided
      if (newCategoryName && newCategoryDesc) {
        const [categoryResult] = await tx.insert(categories).values({
          category: newCategoryName,
          description: newCategoryDesc,
        });
        if (categoryResult.insertId) {
          categoryIds.push(categoryResult.insertId);
        }
      }

      // Link categories
      if (categoryIds.length > 0) {
        await tx.insert(post_category).values(
          categoryIds.map((catId) => ({
            post_id: postId,
            category_id: catId,
          }))
        );
      }

      // Handle new author
      const newAuthorName = formData.get("new_author_name")?.toString();
      const newAuthorDesc = formData.get("new_author_description")?.toString();
      let authorIds = formData
        .getAll("authors")
        .map((id) => parseInt(id.toString()))
        .filter((id) => !isNaN(id)); // Filter out invalid IDs

      if (newAuthorName && newAuthorDesc) {
        const [authorResult] = await tx.insert(authors).values({
          name: newAuthorName,
          description: newAuthorDesc,
        });
        if (authorResult.insertId) {
          authorIds.push(authorResult.insertId);
        }
      }

      // Link authors
      if (authorIds.length > 0) {
        await tx.insert(author_post).values(
          authorIds.map((authorId) => ({
            post_id: postId,
            author_id: authorId,
          }))
        );
      }

      // Handle tags
      const tagList =
        formData.get("tags")?.toString().split(",").filter(Boolean) || [];
      if (tagList.length) {
        await tx.insert(tags).values(
          tagList.map((tag) => ({
            tag,
            post_id: postId,
          }))
        );
      }

      return json({ success: true });
    });

    const title = formData.get("title") as string;
    const body = "New Post Created";
    const subcribers = await db.select().from(notifications);
    subcribers.forEach(async (sub) => {
      sendNotifications({
        notification: {
          title: title,

          options: [
            {
              body: body,
            },
          ],
        },
        subscriptions: [sub.payload],
        vapidDetails: {
          publicKey:
            "BJtquP48ha3nCWpv7acvTUFn1TH6QDl6_Cs6-Ia4-EXIWYmVf4rvT0zVeU4Gqr3Q7HWAtigOXoLFY-qYHbSsF3g",
          privateKey: "x7ION_xzkz050XkVIbcu0ZpVOqXcxkU9T4ShhqWAazw",
        },
      });
    });
    return json({ success: true });
  } catch (error) {
    console.error("Error creating post:", error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create post",
      },
      { status: 500 }
    );
  }
};
export default function NewPost() {
  const { categories, authors } = useLoaderData<typeof loader>();
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [showNewAuthor, setShowNewAuthor] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newAuthor, setNewAuthor] = useState({ name: "", description: "" });
  const [tagInput, setTagInput] = useState("");
  const [tagList, setTagList] = useState<string[]>([]);
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setTagList([...tagList, tagInput.trim()]);
      setTagInput("");
    }
  };

  useEffect(() => {
    if (actionData?.success) {
      setTagList([]);
      setNewCategory({ name: "", description: "" });
      setNewAuthor({ name: "", description: "" });
      setShowNewCategory(false);
      setShowNewAuthor(false);
    }
  }, [actionData]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-white rounded-xl shadow-md shadow-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" name="content" required rows={6} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="categories">Categories</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewCategory(!showNewCategory)}
                >
                  {showNewCategory ? "Cancel" : "Add New Category"}
                </Button>
              </div>

              {showNewCategory && (
                <div className="space-y-2 p-4 border rounded-md">
                  <Input
                    placeholder="Category Name"
                    name="new_category_name"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                  />
                  <Textarea
                    placeholder="Category Description"
                    name="new_category_description"
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              <Select name="categories" multiple>
                <SelectTrigger>
                  <SelectValue placeholder="Select categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.category_id}
                      value={category.category_id.toString()}
                    >
                      {category.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="authors">Authors</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewAuthor(!showNewAuthor)}
                >
                  {showNewAuthor ? "Cancel" : "Add New Author"}
                </Button>
              </div>

              {showNewAuthor && (
                <div className="space-y-2 p-4 border rounded-md">
                  <Input
                    placeholder="Author Name"
                    name="new_author_name"
                    value={newAuthor.name}
                    onChange={(e) =>
                      setNewAuthor({ ...newAuthor, name: e.target.value })
                    }
                  />
                  <Textarea
                    placeholder="Author Description"
                    name="new_author_description"
                    value={newAuthor.description}
                    onChange={(e) =>
                      setNewAuthor({
                        ...newAuthor,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              <Select name="authors" multiple>
                <SelectTrigger>
                  <SelectValue placeholder="Select authors" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem
                      key={author.author_id}
                      value={author.author_id.toString()}
                    >
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tagInput"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddTag())
                  }
                />
                <Button type="button" onClick={handleAddTag}>
                  Add Tag
                </Button>
              </div>
              <input type="hidden" name="tags" value={tagList.join(",")} />
              <div className="mt-2 flex flex-wrap gap-2">
                {tagList.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Post"}
            </Button>
          </Form>

          {actionData?.success && (
            <p className="mt-4 text-green-600">Post created successfully!</p>
          )}
          {actionData?.error && (
            <p className="mt-4 text-red-600">{actionData.error}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
