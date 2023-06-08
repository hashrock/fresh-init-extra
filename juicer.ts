import { join, resolve } from "https://deno.land/std@0.182.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.182.0/flags/mod.ts";
import island from "./templates/islands/counter.ts";
import route from "./templates/routes/route.ts";

function capitalizeFirst(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const flags = parse(Deno.args, {
  boolean: ["force", "twind", "vscode"],
  default: { "force": null, "twind": null, "vscode": null },
});

const help = `juicer - A scaffolding tool for Fresh projects

USAGE:
    juicer island <NAME>
    juicer route <NAME>
`;

if (flags._.length !== 2) {
  console.log(help);
  Deno.exit(1);
}
const resolvedDirectory = resolve(".");
const type = flags._[0].toString();
const name = flags._[1].toString();

if (type === "island" || type === "i") {
  const filePath = join(resolvedDirectory, "islands", `${name}.tsx`);
  const contents = island(capitalizeFirst(name));
  await Deno.mkdir(join(resolvedDirectory, "islands"), {
    recursive: true,
  });
  await Deno.writeTextFile(filePath, contents);
  console.log(`Created ${filePath}`);
}

if (type === "route" || type === "r") {
  const filePath = join(resolvedDirectory, "routes", `${name}.tsx`);

  const answer = window.confirm("Do you want to create a handler?");

  const contents = route(capitalizeFirst(name), answer);
  await Deno.mkdir(join(resolvedDirectory, "routes"), {
    recursive: true,
  });
  await Deno.writeTextFile(filePath, contents);
  console.log(`Created ${filePath}`);
}
