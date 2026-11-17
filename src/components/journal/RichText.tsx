import { Fragment, type ReactNode } from "react";
export interface TextNode {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  content?: TextNode[];
}
export function textOf(node: TextNode): string {
  return node.text ?? (node.content?.map(textOf).join(" ") || "");
}
function safeUrl(value: unknown, image = false) {
  if (typeof value !== "string") return undefined;
  return /^(https?:|mailto:|\/[^/]|#)/i.test(value) ||
    (image && /^data:image\/(png|jpeg|webp|gif);base64,/i.test(value))
    ? value
    : undefined;
}
export function RichText({ document }: { document: unknown }) {
  let doc: TextNode;
  try {
    doc =
      typeof document === "string"
        ? JSON.parse(document)
        : (document as TextNode);
  } catch {
    return null;
  }
  function render(node: TextNode, i: number): ReactNode {
    const children = node.content?.map(render);
    switch (node.type) {
      case "text": {
        let text: ReactNode = node.text;
        for (const mark of node.marks || []) {
          if (mark.type === "bold") text = <strong>{text}</strong>;
          if (mark.type === "italic") text = <em>{text}</em>;
          if (mark.type === "strike") text = <s>{text}</s>;
          if (mark.type === "code") text = <code>{text}</code>;
          if (mark.type === "highlight") text = <mark>{text}</mark>;
          if (mark.type === "link")
            text = (
              <a href={safeUrl(mark.attrs?.href)} rel="noopener noreferrer">
                {text}
              </a>
            );
        }
        return <Fragment key={i}>{text}</Fragment>;
      }
      case "paragraph":
        return <p key={i}>{children?.length ? children : <br />}</p>;
      case "heading":
        return node.attrs?.level === 3 ? (
          <h3 key={i}>{children}</h3>
        ) : (
          <h2 key={i}>{children}</h2>
        );
      case "bulletList":
        return <ul key={i}>{children}</ul>;
      case "orderedList":
        return (
          <ol key={i} start={Number(node.attrs?.start) || 1}>
            {children}
          </ol>
        );
      case "listItem":
        return <li key={i}>{children}</li>;
      case "blockquote":
        return <blockquote key={i}>{children}</blockquote>;
      case "codeBlock":
        return (
          <pre key={i}>
            <code>{textOf(node)}</code>
          </pre>
        );
      case "hardBreak":
        return <br key={i} />;
      case "horizontalRule":
        return <hr key={i} />;
      case "image":
        return (
          <img
            key={i}
            src={safeUrl(node.attrs?.src, true)}
            alt={String(node.attrs?.alt || "")}
            loading="lazy"
          />
        );
      default:
        return <Fragment key={i}>{children}</Fragment>;
    }
  }
  return doc ? <>{render(doc, 0)}</> : null;
}
