export default function route(name: string, handler: boolean) {
  return handler ? routeHandler(name) : routeSimple(name);
}

function routeSimple(name: string) {
  return `import { Head } from "$fresh/runtime.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>${name}</title>
      </Head>
      <div>
      </div>
    </>
  );
}`;
}

function routeHandler(name: string) {
  return `import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

interface Data {
  message: string;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    console.log(ctx.params.id)
    return ctx.render({ message: "Hello, world!" });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    console.log(form.get("message"))
    return ctx.render({ message: "Hello, world!" });
  }
};

export default function Home(props: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>${name}</title>
      </Head>
      <div>
      </div>
    </>
  );
}`;
}
