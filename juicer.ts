import generate from "./lib/generate.ts";

const title = `\x1b[33mjuicer\x1b[0m - A scaffolding tool for Fresh projects`;

console.log("");
console.log(title);
console.log("");

try {
  Deno.statSync("fresh.gen.ts");
} catch (_) {
  console.log(
    "\x1b[31mWARNING: Please run this command from the root of your fresh project\x1b[0m",
  );
  console.log("");
}

await generate();
