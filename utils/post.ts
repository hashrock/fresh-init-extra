const kv = await Deno.openKv();

export interface Post {
  id: string;
  title: string;
  body: string
  createdAt: Date;
  updatedAt: Date;
}

export async function listPost() {
  const iter = await kv.list<Post>({ prefix: ["post"] });
  const post: Post[] = [];
  for await (const item of iter) {
    post.push(item.value);
  }
  return post;
}

export async function addPost(title: string, body: string) {
  const id = crypto.randomUUID();
  const post: Post = {
    id,
    title,
    body,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await kv.set(["post", id], post);
  return id;
}

export async function getPost(id: string) {
  const res = await kv.get<Post>(["post", id]);
  return res.value;
}

export async function updatePost(id: string, title: string, body: string) {
  const post = await getPost(id);
  if (!post) throw new Error("post not found");
  post.title = title;
  post.body = body;
  post.updatedAt = new Date();
  await kv.set(["post", id], post);
}

export async function deletePost(id: string) {
  await kv.delete(["post", id]);
}