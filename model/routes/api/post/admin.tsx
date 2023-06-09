import { Head } from "$fresh/runtime.ts";
import AdminPanel from "../../../islands/AdminPanel.tsx";

export default function Home() {
  const example = {
    title: "Hello, world!",
    body: "This is an example post.",
  }

  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <div>
        <AdminPanel collection="post" example={JSON.stringify(example, null, 2)} />
      </div>
    </>
  );
}
