// Integration checks against a LOCAL disposable database and local Auth.js secret only.
import assert from "node:assert/strict";
import fs from "node:fs";
import { encode } from "next-auth/jwt";
const base = "http://localhost:3000";
const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .trim()
    .split("\n")
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1)];
    }),
);
assert.match(
  env.DATABASE_URL,
  /127\.0\.0\.1:55439\/journal$/,
  "Use only the disposable local test database",
);
const cookieName = "authjs.session-token";
const token = await encode({
  secret: env.AUTH_SECRET,
  salt: cookieName,
  token: { sub: "35108225", owner: true, name: "Local test owner" },
  maxAge: 3600,
});
const other = await encode({
  secret: env.AUTH_SECRET,
  salt: cookieName,
  token: { sub: "someone-else", owner: false },
  maxAge: 3600,
});
async function req(
  path,
  { owner = true, method = "GET", body, origin = base } = {},
) {
  return fetch(base + path, {
    method,
    redirect: "manual",
    headers: {
      ...(owner
        ? { cookie: `${cookieName}=${owner === "other" ? other : token}` }
        : {}),
      origin,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}
for (const path of [
  "/api/posts",
  "/api/posts/test",
  "/api/media",
  "/api/media/test",
]) {
  assert.equal((await req(path, { owner: false })).status, 401);
  assert.equal((await req(path, { owner: "other" })).status, 401);
}
assert.equal(
  (
    await req("/api/posts", {
      method: "POST",
      body: {},
      origin: "https://unrelated.example",
    })
  ).status,
  403,
);
for (const path of ["/cms", "/cms/posts", "/cms/posts/test"])
  assert.equal((await req(path, { owner: false })).status, 307);
const created = await req("/api/posts", {
  method: "POST",
  body: { title: "LOCAL TEST PRIVATE PAGE", status: "published" },
});
assert.equal(created.status, 201);
const post = await created.json();
assert.equal(post.status, "draft");
const privateHtml = await (
  await req("/blog/" + post.slug, { owner: false })
).text();
assert.ok(!privateHtml.includes("LOCAL TEST PRIVATE PAGE"));
const data = {
  title: "Local sample: a page to begin with",
  slug: "local-sample-page",
  excerpt: "A sample page for checking typography and the reading experience.",
  topics: ["sample"],
  tiptap_json: JSON.stringify({
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "This is a local sample, created only to check how a page feels to read. It is not a published entry from Isaac’s notebook.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Room to think" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "A comfortable line length, enough space between paragraphs, and a little less noise around the words. Curly braces {like these} stay ordinary text.",
          },
        ],
      },
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "A thought can be unfinished and still deserve a page.",
              },
            ],
          },
        ],
      },
    ],
  }),
};
assert.equal(
  (
    await req("/api/posts/" + post.id, {
      method: "PUT",
      body: { ...data, status: "published" },
    })
  ).status,
  200,
);
assert.equal(
  (await (await req("/api/posts/" + post.id)).json()).status,
  "draft",
);
assert.equal(
  (
    await req("/api/posts/" + post.id + "/publish", {
      method: "POST",
      body: data,
    })
  ).status,
  400,
);
assert.equal(
  (
    await req("/api/posts/" + post.id + "/publish", {
      method: "POST",
      body: { ...data, confirmPublish: true },
    })
  ).status,
  200,
);
assert.equal(
  (
    await req("/api/posts/" + post.id, {
      method: "PUT",
      body: { title: "accidental update" },
    })
  ).status,
  409,
);
const publicHtml = await (
  await req("/blog/local-sample-page", { owner: false })
).text();
assert.ok(publicHtml.includes("Room to think"));
assert.ok(publicHtml.includes("Curly braces"));
assert.equal(
  (
    await req("/api/posts/" + post.id + "/publish", {
      owner: false,
      method: "POST",
      body: { ...data, confirmPublish: true },
    })
  ).status,
  401,
);
const draft = await (
  await req("/api/posts", { method: "POST", body: {} })
).json();
fs.writeFileSync(
  "../local-preview.json",
  JSON.stringify({ cookieName, token, draftId: draft.id }),
);
console.log(
  "PASS: owner access, anonymous/non-owner rejection, CSRF, private-by-default, private read exclusion, save cannot publish, explicit publication, published autosave rejection, rich text rendering.",
);
