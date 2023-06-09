🍹 juicer - A scaffolding tool for Fresh projects

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

# TODO

- [x] island
- [x] routes + Custom Handler
- [x] KV glue code
- [x] REST API
- [ ] routes with Markdown rendering
- [ ] form style CRUD
- [ ] Auth snippet
