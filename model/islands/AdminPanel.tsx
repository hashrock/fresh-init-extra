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
            <textarea cols={68} rows={5} ref={textRef}>
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
  const [editing, setEditing] = useState<boolean>(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const templateSrc = {
    title: "title",
    body: "body",
  };
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
    const json = textRef.current!.value;
    await fetch("/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    }).then((res) => res.json());
    await list();
    setEditing(false);
  }

  return (
    <>
      <style>
        {`
          body{
            display: flex;
            font-size: 14px;
            margin: 2em;
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
      {editing ? (
      <form onSubmit={create}>
        <div>
          <textarea cols={80} rows={10} ref={textRef}>
            {template}
          </textarea>
        </div>
        <div>
          <input type="submit" value="Create" />
          <button type="button" onClick={()=>{setEditing(false)}}>Cancel</button>
        </div>
  </form>
) : (
  <button onClick={() => setEditing(true)}>New Post</button>
)}

      <div>
        <table>
          <thead>
            <tr>
              <th width={360}>id</th>
              <th width={500}>json</th>
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
