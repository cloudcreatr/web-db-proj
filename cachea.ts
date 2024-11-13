import { readdir } from "node:fs/promises";

// read all the files in the current directory, recursively
const files = await readdir("/workspaces/web-db-proj/build/client", {
  recursive: true,
});

const files2 = files.filter(
  (file) =>
    file !== "assets" &&
    file !== "cachea.json" &&
    file !== "service-worker.js" &&
    file !== "entry.worker.js"
);
files2.push("/");

await Bun.write("build/client/cachea.json", JSON.stringify(files2, null, 2));
