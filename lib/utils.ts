import * as kv from "../templates/utils/kv.ts";

export function generateExampleFromFields(fields: kv.Field[]) {
  const example: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.type === "boolean") {
      example[field.name] = false;
      continue;
    }
    if (field.type === "number") {
      example[field.name] = 0;
      continue;
    }
    if (field.type === "string") {
      example[field.name] = "";
      continue;
    }
    if (field.type === "string[]") {
      example[field.name] = ["a", "b", "c"];
      continue;
    }
    if (field.type === "number[]") {
      example[field.name] = [1, 2, 3];
      continue;
    }
    if (field.type === "boolean[]") {
      example[field.name] = [false, true];
      continue;
    }
  }
  return example;
}

export function capitalizeFirst(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
