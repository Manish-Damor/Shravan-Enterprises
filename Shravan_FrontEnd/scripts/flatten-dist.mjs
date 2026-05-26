import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const distDir = path.resolve("dist");
const clientDir = path.join(distDir, "client");
const serverDir = path.join(distDir, "server");

async function copyDirectoryContents(sourceDir, targetDir) {
  await mkdir(targetDir, { recursive: true });

  const entries = await readdir(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await copyDirectoryContents(sourcePath, targetPath);
      continue;
    }

    await cp(sourcePath, targetPath, { force: true });
  }
}

async function flattenBuildOutput() {
  try {
    await copyDirectoryContents(clientDir, distDir);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return;
    }
    throw error;
  }

  const serverEntryUrl = pathToFileURL(path.join(serverDir, "index.js")).href;
  const serverEntry = await import(serverEntryUrl);
  const response = await serverEntry.default.fetch(new Request("http://localhost/"), {}, {});
  const html = await response.text();

  await writeFile(path.join(distDir, "index.html"), html, "utf8");

  await rm(clientDir, { recursive: true, force: true });
  await rm(serverDir, { recursive: true, force: true });
  await rm(path.join(distDir, ".assetsignore"), { force: true });
}

await flattenBuildOutput();