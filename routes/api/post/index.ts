import { Handlers } from "$fresh/server.ts";
import { addPost, listPost } from "../../../utils/post.ts";

export const handler: Handlers = {
  async GET(req, ctx): Promise<Response> {
    const list = await listPost();
    return new Response(JSON.stringify(list));
  },
  async POST(req, ctx): Promise<Response> {
    const { title, body } = await req.json();
    const id = await addPost(title, body);
    return new Response(JSON.stringify({ id }));
  },
};
