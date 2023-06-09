import { join } from "https://deno.land/std@0.182.0/path/mod.ts";
import island from "../templates/islands/counter.ts";
import route from "../templates/routes/route.ts";
import * as kv from "../templates/utils/kv.ts";

export default async function generate(
  type: string,
  name: string,
  resolvedDirectory: string,
) {
  if (type === "island" || type === "i") {
    const filePath = join(resolvedDirectory, "islands", `${name}.tsx`);
    const contents = island(capitalizeFirst(name));
    await Deno.mkdir(join(resolvedDirectory, "islands"), {
      recursive: true,
    });
    await write(filePath, contents);
  }

  if (type === "route" || type === "r") {
    const filePath = join(resolvedDirectory, "routes", `${name}.tsx`);

    const answer = window.confirm("Do you want to create a handler?");

    const contents = route(capitalizeFirst(name), answer);
    await Deno.mkdir(join(resolvedDirectory, "routes"), {
      recursive: true,
    });
    await write(filePath, contents);
  }

  if (type === "kv") {
    const filePath = join(resolvedDirectory, "utils", `${name}.ts`);
    const kvName = capitalizeFirst(name);
    const fields: kv.Field[] = [
      { name: "title", type: "string", nullable: false },
      { name: "body", type: "string", nullable: false },
    ];

    const contents = [
      "const kv = await Deno.openKv();",
      kv.typeCode(kvName, fields),
      kv.listCode(kvName),
      kv.addCode(kvName, fields),
      kv.getCode(kvName),
      kv.updateCode(kvName, fields),
      kv.deleteCode(kvName),
    ].join("\n");

    await Deno.mkdir(join(resolvedDirectory, "utils"), {
      recursive: true,
    });
    await write(filePath, contents);
  }
}

async function confirmWrite(filePath: string) {
  try {
    if ((await Deno.stat(filePath)).isFile) {
      return window.confirm(`Overwrite ${filePath}?`);
    }
  } catch (_) {
    // none
  }
  return true;
}

async function write(filePath: string, contents: string) {
  console.log("------------------");
  console.log(contents);
  console.log("------------------");
  console.log("Write to :" + filePath);
  console.log("------------------");

  if (await confirmWrite(filePath)) {
    await Deno.writeTextFileSync(filePath, contents);
    console.log(`Created ${filePath}`);
  }
}

function capitalizeFirst(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}