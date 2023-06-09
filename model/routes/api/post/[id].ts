import { Handlers } from "$fresh/server.ts";
import { deletePost, getPost, updatePost } from "../../../utils/post.ts";

export const handler: Handlers = {
  async GET(req, ctx): Promise<Response> {
    const list = await getPost(ctx.params.id);
    return new Response(JSON.stringify(list));
  },
  async PUT(req, ctx): Promise<Response> {
    const { title, body } = await req.json();
    await updatePost(ctx.params.id, title, body);
    return new Response(JSON.stringify({ id: ctx.params.id }));
  },
  async DELETE(req, ctx): Promise<Response> {
    const id = await deletePost(ctx.params.id);
    return new Response(JSON.stringify({ id }));
  },
};
