import { resolve } from "https://deno.land/std@0.182.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.182.0/flags/mod.ts";
import generate from "./lib/generate.ts";

const flags = parse(Deno.args, {
  boolean: ["force", "twind", "vscode"],
  default: { "force": null, "twind": null, "vscode": null },
});

const help = `juicer - A scaffolding tool for Fresh projects

USAGE:
    juicer island <NAME>
    juicer route <NAME>
    juicer kv <NAME>
`;

if (flags._.length !== 2) {
  console.log(help);
  Deno.exit(1);
}

const resolvedDirectory = resolve(".");
const type = flags._[0].toString();
const name = flags._[1].toString();

await generate(type, name, resolvedDirectory);
