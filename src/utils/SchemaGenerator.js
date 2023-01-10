// schemaGenerator.js
const path = require("path");
const tjs = require("typescript-json-schema");
const fs = require("fs");

const settings = {
  required: true,
  ref: false,
};
const compilerOptions = {
  strictNullChecks: true,
};

const modelFileNames = fs.readdirSync("src/models");

modelFileNames.forEach(modelFileName => {
  const program = tjs.getProgramFromFiles([path.resolve(`src/models/${modelFileName}`)], compilerOptions, "./");
  const schema = tjs.generateSchema(program, "*", settings);

  for (const [key, value] of Object.entries(schema.definitions)) {
    fs.writeFileSync(
      `src/schemas/${key}Schema.ts`,
      `const schema = ${JSON.stringify(value, null, 4)} as const;\nexport default schema;`
    );
  }
});