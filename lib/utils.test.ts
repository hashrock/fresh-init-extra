// example_test.ts
import { assertSnapshot } from "https://deno.land/std@0.188.0/testing/snapshot.ts";
import { generateExampleFromFields } from "./utils.ts";
import * as kv from "../templates/utils/kv.ts";

Deno.test("generate example json", async function (t): Promise<void> {
  const fields: kv.Field[] = [
    { name: "title", type: "string", nullable: false },
    { name: "body", type: "string", nullable: false },
    { name: "tags", type: "string[]", nullable: false },
    { name: "score", type: "number", nullable: false },
  ];
  const generated = generateExampleFromFields(fields);
  await assertSnapshot(t, generated);
});
