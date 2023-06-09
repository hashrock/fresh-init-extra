import { resolve } from "https://deno.land/std@0.182.0/path/mod.ts";
import generate from "./lib/generate.ts";
import {
  Checkbox,
  Confirm,
  Input,
  Number,
  prompt,
  Select,
} from "https://deno.land/x/cliffy@v0.25.7/prompt/mod.ts";

const title = `\x1b[33m juicer\x1b[0m - A scaffolding tool for Fresh projects `;

console.log(title);
console.log("\n");

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
await generate(type, name, resolvedDirectory);
