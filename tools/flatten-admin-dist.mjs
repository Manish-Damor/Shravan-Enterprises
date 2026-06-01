import fs from "fs";
import path from "path";

const distRoot = path.resolve(process.cwd(), "dist");
const distClient = path.join(distRoot, "client");
const distServer = path.join(distRoot, "server");
const serverManifest = path.join(distServer, ".vite", "manifest.json");

if (!fs.existsSync(distClient)) {
  console.error("Admin dist client folder not found:", distClient);
  process.exit(1);
}

if (!fs.existsSync(serverManifest)) {
  console.error("Admin server manifest not found:", serverManifest);
  process.exit(1);
}

function findClientEntryScript(assetsDir) {
  const assetFiles = fs
    .readdirSync(assetsDir)
    .filter((name) => name.endsWith(".js"))
    .sort();

  for (const fileName of assetFiles) {
    const filePath = path.join(assetsDir, fileName);
    const source = fs.readFileSync(filePath, "utf8");

    if (source.includes("hydrateRoot(document")) {
      return `assets/${fileName}`;
    }
  }

  return null;
}

const manifest = JSON.parse(fs.readFileSync(serverManifest, "utf8"));
const stylesEntry = Object.values(manifest).find(
  (entry) => entry && typeof entry === "object" && entry.src?.endsWith("/src/styles.css"),
);

const clientEntryScript = findClientEntryScript(path.join(distClient, "assets"));

if (!clientEntryScript) {
  console.error("Admin client entry script could not be determined.");
  process.exit(1);
}

const stylesheetHref = stylesEntry?.file ? `./${stylesEntry.file}` : null;
const clientHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Admin Panel</title>
    <meta name="description" content="Business admin panel" />
${stylesheetHref ? `    <link rel="stylesheet" href="${stylesheetHref}" />` : ""}
  </head>
  <body>
    <script type="module" src="./${clientEntryScript}"></script>
  </body>
</html>
`;

fs.writeFileSync(path.join(distClient, "index.html"), clientHtml, "utf8");

for (const name of fs.readdirSync(distClient)) {
  const src = path.join(distClient, name);
  const dest = path.join(distRoot, name);

  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }

  fs.renameSync(src, dest);
}

fs.rmSync(distClient, { recursive: true, force: true });
fs.rmSync(distServer, { recursive: true, force: true });

console.log("flatten-admin-dist: completed, dist contains only frontend files at", distRoot);
