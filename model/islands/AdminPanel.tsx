import { useEffect, useState, useRef } from "preact/hooks";
import { Post } from "../utils/post.ts";

function AdminPanelRow(
  { post, onUpdate }: { post: Post; onUpdate: () => void },
) {
  const [editing, setEditing] = useState<boolean>(false);
  const textRef = useRef<HTMLTextAreaElement>(null);


  async function remove() {
    await fetch(`/api/post/${post.id}`, {
      method: "DELETE",
    }).then((res) => res.json());
    onUpdate();
  }

  function edit() {
    setEditing(true);
  }
  function cancel() {
    setEditing(false);
  }

  async function endEdit() {
    await fetch(`/api/post/${post.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: textRef.current!.value,
    }).then((res) => res.json());
    setEditing(false);
    onUpdate();
  }

  return (
    <tr>
      <td>{post.id}</td>
      <td>
        {!editing && (
          <div
            class="editable"
            onClick={edit}
          >
            {JSON.stringify(post, null, 2)}
          </div>
        )}
        {editing && (
          <form onSubmit={endEdit}>
            <textarea cols={54} rows={5} ref={textRef}>
              {JSON.stringify(post, null, 2)}
            </textarea>
            <div>
              <input type="submit" value="Update" />
              <button type="button" onClick={cancel}>Cancel</button>
            </div>
          </form>
        )}
      </td>
      <td>
        <button onClick={remove}>Delete</button>
      </td>
    </tr>
  );
}

export default function AdminPanel() {
  const [posts, setPosts] = useState<Post[]>([]);
  const templateSrc = { title: "", body: "" };
  const [template, setTemplate] = useState<string>(
    JSON.stringify(templateSrc, null, 2),
  );

  useEffect(() => {
    (async () => {
      const post = await fetch("/api/post").then((res) => res.json());
      setPosts(post);
    })();
  }, []);

  async function list() {
    const post = await fetch("/api/post").then((res) => res.json());
    setPosts(post);
  }

  function clear() {
    setTemplate(JSON.stringify(templateSrc, null, 2));
  }

  async function create(e: Event) {
    e.preventDefault();
    const json = (e.target as HTMLFormElement).querySelector("textarea")!
      .value;
    await fetch("/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    }).then((res) => res.json());
    await list();
    clear();
  }

  return (
    <>
      <style>
        {`
          body{
            display: flex;
          }
          table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
            padding: 0.5em;
          }
          .editable {
            max-height: 4em; overflow-y: hidden;
          }
          .editable:hover{
            background-color: #eee;
            cursor: pointer;
          }
          table{
            margin-top: 2em;
          }
          `}
      </style>
      <form onSubmit={create}>
        <div>
          <textarea cols={80} rows={10}>
            {template}
          </textarea>
        </div>
        <div>
          <input type="submit" />
        </div>
      </form>

      <div>
        <table>
          <thead>
            <tr>
              <th width={300}>id</th>
              <th width={400}>json</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => <AdminPanelRow post={post} key={post.id} onUpdate={list} />)}
          </tbody>
        </table>
      </div>
    </>
  );
}
