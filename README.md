🍹 juicer - A scaffolding tool for Fresh projects

<img width="821" alt="image" src="https://github.com/hashrock/juicer/assets/3132889/bbe8032b-5542-498d-8856-997b5a0b7dd3">

# Install

```bash
$ deno install -Arf https://deno.land/x/juicer/juicer.ts
```

# Usage

```bash
$ juicer
```

# Create REST API from a magic spell

```
$ juicer rest <CollectionName> <FieldName>:<Type> <FieldName>:<Type> ...
```

for example:

```
$ juicer rest memo text:string tags:string\[\]
```

make sure to escape brackets if you use Zsh.

When you start fresh dev server, you can access admin UI:

http://localhost:8000/api/memo/admin

<img width="1019" alt="image" src="https://github.com/hashrock/juicer/assets/3132889/d5f03bb6-a3aa-4504-a035-4f068ee8beae">

# TODO

- [x] island
- [x] routes + Custom Handler
- [x] KV glue code
- [x] REST API
- [ ] routes with Markdown rendering
- [ ] form style CRUD
- [x] Auth snippet
