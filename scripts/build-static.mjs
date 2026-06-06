import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { transformAsync } from "@babel/core";

const root = process.cwd();
const distDir = path.join(root, "dist");
const assetsDir = path.join(distDir, "assets");

const packageVersion = async (name) => {
  const packageJson = JSON.parse(
    await readFile(path.join(root, "node_modules", name, "package.json"), "utf8")
  );
  return packageJson.version;
};

const [reactVersion, framerVersion] = await Promise.all([
  packageVersion("react"),
  packageVersion("framer-motion"),
]);

await rm(distDir, { recursive: true, force: true });
await mkdir(assetsDir, { recursive: true });

const source = await readFile(path.join(root, "scholarspace-2.jsx"), "utf8");
const transformed = await transformAsync(source, {
  filename: "scholarspace-2.jsx",
  babelrc: false,
  configFile: false,
  presets: [
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  sourceMaps: false,
  comments: false,
  compact: false,
});

await writeFile(path.join(assetsDir, "scholarspace.js"), transformed.code, "utf8");
await writeFile(
  path.join(assetsDir, "main.js"),
  `import React from "react";\nimport { createRoot } from "react-dom/client";\nimport ScholarSpace from "./scholarspace.js";\n\ncreateRoot(document.getElementById("root")).render(\n  React.createElement(React.StrictMode, null, React.createElement(ScholarSpace))\n);\n`,
  "utf8"
);

await writeFile(
  path.join(distDir, "index.html"),
  `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <meta name="description" content="ScholarSpace helps students protect their GPA, reclaim time, and get expert assignment support." />\n    <title>ScholarSpace</title>\n    <script type="importmap">\n      {\n        "imports": {\n          "react": "https://esm.sh/react@${reactVersion}",\n          "react/jsx-runtime": "https://esm.sh/react@${reactVersion}/jsx-runtime",\n          "react-dom/client": "https://esm.sh/react-dom@${reactVersion}/client",\n          "framer-motion": "https://esm.sh/framer-motion@${framerVersion}?external=react,react-dom"\n        }\n      }\n    </script>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="./assets/main.js"></script>\n  </body>\n</html>\n`,
  "utf8"
);

console.log("Built dist/ with static ESM assets.");
