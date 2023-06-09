import { Head } from "$fresh/runtime.ts";
import AdminPanel from "../islands/AdminPanel.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <div>
        <AdminPanel />
      </div>
    </>
  );
}
