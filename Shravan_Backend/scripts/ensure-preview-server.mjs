import { access, writeFile } from "node:fs/promises";
import path from "node:path";

const distServerDir = path.resolve("dist", "server");
const indexPath = path.join(distServerDir, "index.js");
const serverPath = path.join(distServerDir, "server.js");

await access(indexPath);

const contents = `export { default } from "./index.js";\nexport * from "./index.js";\n`;
await writeFile(serverPath, contents, "utf8");

