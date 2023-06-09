import { join } from "https://deno.land/std@0.182.0/path/mod.ts";
import island from "../templates/islands/counter.ts";
import route from "../templates/routes/route.ts";
import * as kv from "../templates/utils/kv.ts";
import {
  Checkbox,
  Confirm,
  Input,
  Number,
  prompt,
  Select,
} from "https://deno.land/x/cliffy@v0.25.7/prompt/mod.ts";
import { resolve } from "https://deno.land/std@0.182.0/path/mod.ts";

export default async function generate() {
  const type = await Select.prompt({
    message: "What do you want to generate?",
    options: [
      {
        name: "Island - Preact components that are rendered on the client",
        value: "island",
      },
      {
        name: "Route - JSX element that is rendered on the server",
        value: "route",
      },
      {
        name: "KV Glue Code - Code that connects to the Deno KV store",
        value: "kv",
      },
      Select.separator("--------"),
      { name: "Exit", value: "exit" },
    ],
  });

  let nameDefault = "";
  if (type === "island") {
    nameDefault = "MyCounter";
  } else if (type === "route") {
    nameDefault = "hello";
  } else if (type === "kv") {
    nameDefault = "posts";
  } else {
    Deno.exit(0);
  }

  const name = await Input.prompt({
    message: "What's the name of the file?",
    default: nameDefault,
  });

  const resolvedDirectory = resolve(".");

  if (type === "island") {
    await createIsland(resolvedDirectory, name);
  }

  if (type === "route") {
    await createRoute(resolvedDirectory, name);
  }

  if (type === "kv") {
    await createKvGlue(resolvedDirectory, name);
  }
}

async function createRoute(resolvedDirectory: string, name: string) {
  const filePath = join(resolvedDirectory, "routes", `${name}.tsx`);

  const answer = window.confirm("Do you want to create a handler?");

  const contents = route(capitalizeFirst(name), answer);
  await Deno.mkdir(join(resolvedDirectory, "routes"), {
    recursive: true,
  });
  await write(filePath, contents);
}
async function createKvGlue(resolvedDirectory: string, name: string) {
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

async function createIsland(resolvedDirectory: string, name: string) {
  const filePath = join(resolvedDirectory, "islands", `${name}.tsx`);
  const contents = island(capitalizeFirst(name));
  await Deno.mkdir(join(resolvedDirectory, "islands"), {
    recursive: true,
  });
  await write(filePath, contents);
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
