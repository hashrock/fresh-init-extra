const kv = await Deno.openKv();

export interface User {
  id: string;
  title: string;
  body: string
  createdAt: Date;
  updatedAt: Date;
}

export async function listUser() {
  const iter = await kv.list<User>({ prefix: ["user"] });
  const user: User[] = [];
  for await (const item of iter) {
    user.push(item.value);
  }
  return user;
}

export async function addUser(title: string, body: string) {
  const id = crypto.randomUUID();
  const user: User = {
    id,
    title,
    body,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await kv.set(["user", id], user);
  return id;
}

export async function getUser(id: string) {
  const res = await kv.get<User>(["user", id]);
  return res.value;
}

export async function updateUser(id: string, title: string, body: string) {
  const user = await getUser(id);
  if (!user) throw new Error("user not found");
  user.title = title;
  user.body = body;
  user.updatedAt = new Date();
  await kv.set(["user", id], user);
}

export async function deleteUser(id: string) {
  await kv.delete(["user", id]);
}