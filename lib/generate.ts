import { join } from "https://deno.land/std@0.188.0/path/mod.ts";
import island from "../templates/islands/counter.ts";
import route from "../templates/routes/route.ts";
import * as kv from "../templates/utils/kv.ts";
import * as api from "../templates/routes/api.ts";
import {
  Input,
  Select,
} from "https://deno.land/x/cliffy@v0.25.7/prompt/mod.ts";
import { resolve } from "https://deno.land/std@0.188.0/path/mod.ts";
import generateAdminPanel from "../templates/islands/AdminPanel.ts";
import { capitalizeFirst, generateExampleFromFields } from "./utils.ts";

export async function fromCli(args: string[]) {
  if (args[0] === "rest") {
    const name = args[1];
    const fields = args.slice(2).map((f) => {
      const [name, type] = f.split(":");
      return { name, type, nullable: false };
    });
    await createRest(resolve("."), name, fields);
  }
}

export async function generate() {
  const type = await Select.prompt({
    message: "What do you want to generate?",
    options: [
      {
        name: "Island - Preact components that are rendered on the client",
        value: "island",
      },
      {
        name: "Route - handles API requests or render HTML pages",
        value: "route",
      },
      {
        name: "KV Glue Code - Code that connects to the Deno KV store",
        value: "kv",
      },
      {
        name: "REST API - JSON Endpoints and Admin UI",
        value: "rest",
      },
      Select.separator("--------"),
      {
        name: "Template - GitHub auth with KV store",
        value: "ghauth",
      },
      Select.separator("--------"),
      { name: "Exit", value: "exit" },
    ],
  });

  const resolvedDirectory = resolve(".");

  if (type === "island") {
    await createIsland(resolvedDirectory);
  }

  if (type === "route") {
    await createRoute(resolvedDirectory);
  }

  if (type === "kv") {
    await createKvGlue(resolvedDirectory);
  }

  if (type === "rest") {
    await createRest(resolvedDirectory, null, null);
  }

  if (type === "ghauth") {
    await addGitHubAuth(resolvedDirectory);
  }
}

async function createIsland(resolvedDirectory: string) {
  const name = await Input.prompt({
    message: "What's the name of the file?",
    default: "MyCounter",
  });

  const filePath = join(resolvedDirectory, "islands", `${name}.tsx`);
  const contents = island(capitalizeFirst(name));
  await Deno.mkdir(join(resolvedDirectory, "islands"), {
    recursive: true,
  });
  await write(filePath, contents);
}

async function createRoute(resolvedDirectory: string) {
  const name = await Input.prompt({
    message: "What's the name of the file?",
    default: "hello",
  });

  const filePath = join(resolvedDirectory, "routes", `${name}.tsx`);

  const answer = window.confirm("Do you want to create a handler?");

  const contents = route(capitalizeFirst(name), answer);
  await Deno.mkdir(join(resolvedDirectory, "routes"), {
    recursive: true,
  });
  await write(filePath, contents);
}

async function createKvGlue(resolvedDirectory: string) {
  const name = await Input.prompt({
    message: "What's the name of the file?",
    default: "posts",
  });

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

async function createRest(
  resolvedDirectory: string,
  nameOpt: string | null = null,
  fieldsOpt: kv.Field[] | null,
) {
  let name = nameOpt;
  if (!nameOpt) {
    name = await Input.prompt({
      message: "What's the name of the collection?",
      default: "post",
    });
  }
  if (name === null) {
    return;
  }

  const indexPath = join(
    resolvedDirectory,
    "routes",
    "api",
    name,
    "index.ts",
  );
  const singlePath = join(
    resolvedDirectory,
    "routes",
    "api",
    name,
    "[id].ts",
  );
  const adminPath = join(
    resolvedDirectory,
    "routes",
    "api",
    name,
    "admin.tsx",
  );
  const adminIslandPath = join(resolvedDirectory, "islands", "AdminPanel.tsx");

  const kvPath = join(resolvedDirectory, "utils", `${name}.ts`);
  const kvName = capitalizeFirst(name);

  let fields = fieldsOpt;
  if (!fieldsOpt) {
    fields = [
      { name: "title", type: "string", nullable: false },
      { name: "body", type: "string", nullable: false },
    ];
  }
  if (fields === null) {
    return;
  }

  const example = generateExampleFromFields(fields);

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
  await write(kvPath, contents);
  await Deno.mkdir(join(resolvedDirectory, `islands`), {
    recursive: true,
  });

  await Deno.mkdir(join(resolvedDirectory, `routes/api/${name}`), {
    recursive: true,
  });
  await write(
    indexPath,
    api.index(capitalizeFirst(name), fields),
  );
  await write(
    singlePath,
    api.single(capitalizeFirst(name), fields),
  );
  await write(adminPath, api.admin(name, JSON.stringify(example)));
  await write(adminIslandPath, generateAdminPanel());
  console.log(`You can access the admin panel at`);
  console.log(`http://localhost:8000/api/${name}/admin`);
}

async function addGitHubAuth(resolvedDirectory: string) {
  console.log(
    "\x1b[31mWARNING: This will overwrite your project files.\x1b[0m",
  );
  console.log("Please make sure you don't have any uncommitted changes.");

  if (!window.confirm("Are you sure you want to continue?")) {
    return;
  }

  const base =
    "https://raw.githubusercontent.com/hashrock/fresh-auth-pants/main/";

  await Deno.mkdir(join(resolvedDirectory, `routes/auth`), {
    recursive: true,
  });
  await Deno.mkdir(join(resolvedDirectory, `utils`), {
    recursive: true,
  });
  await Deno.mkdir(join(resolvedDirectory, `components`), {
    recursive: true,
  });

  const files = [
    "routes/_middleware.tsx",
    "routes/auth/oauth2callback.ts",
    "routes/auth/signin.ts",
    "routes/auth/signout.ts",
    "routes/index.tsx",
    "components/Page.tsx",
    "utils/github.ts",
    "utils/kv_oauth.ts",
    "utils/users.ts",
    ".env.example",
  ];

  for (const file of files) {
    const filePath = join(resolvedDirectory, file);
    const contents = await fetch(base + file).then((r) => r.text());
    await write(filePath, contents);
  }

  const importMap = await Deno.readTextFile(
    join(resolvedDirectory, "import_map.json"),
  );
  const importMapJson = JSON.parse(importMap);
  importMapJson.imports = {
    ...importMapJson.imports,
    "@/": "./",
    "kv_oauth": "https://deno.land/x/deno_kv_oauth@v0.1.8-beta/mod.ts",
  };
  await Deno.writeTextFile(
    join(resolvedDirectory, "import_map.json"),
    JSON.stringify(importMapJson, null, 2),
  );

  const denoConfig = await Deno.readTextFile(
    join(resolvedDirectory, "deno.json"),
  );
  const expected = "deno run -A --watch=static/,routes/ dev.ts";
  const overwrite = "deno run -A --unstable --watch=static/,routes/ dev.ts";
  const denoConfigJson = JSON.parse(denoConfig);
  if (denoConfigJson.tasks.start === expected) {
    denoConfigJson.tasks.start = overwrite;
    await Deno.writeTextFile(
      join(resolvedDirectory, "deno.json"),
      JSON.stringify(denoConfigJson, null, 2),
    );
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
  if (await confirmWrite(filePath)) {
    await Deno.writeTextFile(filePath, contents);
    console.log(`Created ${filePath}`);
  }
}
