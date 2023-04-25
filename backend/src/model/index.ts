import fs from "fs";
import { buildSchema } from "graphql";
import path from "path";

const schemaString = fs.readFileSync(
  path.join(__dirname, "schema.gql"),
  "utf8"
);

export const schema = buildSchema(schemaString);
