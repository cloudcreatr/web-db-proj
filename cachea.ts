import { readdir } from "node:fs/promises";

// read all the files in the current directory, recursively
const files = await readdir("/workspaces/web-db-proj/build/client", { recursive: true });

await Bun.write("build/client/cachea.json", JSON.stringify(files, null, 2));