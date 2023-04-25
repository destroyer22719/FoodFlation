import fs from "fs";
import { buildSchema } from "graphql";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaString = fs.readFileSync(
  path.join(__dirname, "../", "../", "src", "model", "schema.gql"),
  "utf8"
);

export const schema = buildSchema(schemaString);
