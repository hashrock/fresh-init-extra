export interface Field {
  name: string;
  type: string;
  nullable: boolean;
}

export function typeCode(typeName: string, fields: Field[]) {
  const fieldsCode = fields
    .map((i) => `  ${i.name}${i.nullable ? "?" : ""}: ${i.type}`)
    .join(";\n");

  return `
export interface ${typeName} {
  id: string;
${fieldsCode}
  createdAt: Date;
  updatedAt: Date;
}`;
}

export function listCode(typeName: string) {
  const lower = typeName.toLowerCase();

  return `
export async function list${typeName}() {
  const iter = await kv.list<${typeName}>({ prefix: ["${lower}"] });
  const ${lower}: ${typeName}[] = [];
  for await (const item of iter) {
    ${lower}.push(item.value);
  }
  return ${lower};
}`;
}

export function updateCode(typeName: string, fields: Field[]) {
  const lower = typeName.toLowerCase();
  const argsCode = fields
    .map((i) => `${i.name}${i.nullable ? "?" : ""}: ${i.type}`)
    .join(", ");
  const assignCode = fields
    .map((i) => `  ${lower}.${i.name} = ${i.name};`)
    .join("\n");
  return `
export async function update${typeName}(id: string, ${argsCode}) {
  const ${lower} = await get${typeName}(id);
  if (!${lower}) throw new Error("${lower} not found");
${assignCode}
  ${lower}.updatedAt = new Date();
  await kv.set(["${lower}", id], ${lower});
}`;
}

export function deleteCode(typeName: string) {
  const lower = typeName.toLowerCase();

  return `
export async function delete${typeName}(id: string) {
  await kv.delete(["${lower}", id]);
}`;
}

export function getCode(typeName: string) {
  const lower = typeName.toLowerCase();
  return `
export async function get${typeName}(id: string) {
  const res = await kv.get<${typeName}>(["${lower}", id]);
  return res.value;
}`;
}

export function addCode(typeName: string, fields: Field[]) {
  const lower = typeName.toLowerCase();
  const argsCode = fields
    .map((i) => `${i.name}${i.nullable ? "?" : ""}: ${i.type}`)
    .join(", ");
  const fieldCode = fields.map((i) => `    ${i.name}`).join(",\n");

  return `
export async function add${typeName}(${argsCode}) {
  const id = crypto.randomUUID();
  const ${lower}: ${typeName} = {
    id,
${fieldCode},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await kv.set(["${lower}", id], ${lower});
  return id;
}`;
}
