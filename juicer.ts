import generate from "./lib/generate.ts";

const title = `\x1b[33m juicer\x1b[0m - A scaffolding tool for Fresh projects `;

console.log(title);
console.log("\n");

await generate();
