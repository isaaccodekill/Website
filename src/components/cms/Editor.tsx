"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Extension } from "@tiptap/core";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";
import { common, createLowlight } from "lowlight";
import { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  SlashCommandMenu,
  type SlashCommandItem,
} from "./SlashCommandMenu";

const lowlight = createLowlight(common);

// --- Slash Command Items ---
function getSlashCommandItems(
  fileInputRef: React.RefObject<HTMLInputElement | null>
): SlashCommandItem[] {
  return [
    {
      title: "Heading 2",
      description: "Large section heading",
      icon: "H2",
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run();
      },
    },
    {
      title: "Heading 3",
      description: "Small section heading",
      icon: "H3",
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 3 })
          .run();
      },
    },
    {
      title: "Bullet List",
      description: "Unordered list of items",
      icon: "\u2022",
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleBulletList()
          .run();
      },
    },
    {
      title: "Numbered List",
      description: "Ordered list of items",
      icon: "1.",
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleOrderedList()
          .run();
      },
    },
    {
      title: "Blockquote",
      description: "Highlight a quote",
      icon: "\u201C",
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleBlockquote()
          .run();
      },
    },
    {
      title: "Code Block",
      description: "Syntax-highlighted code",
      icon: "{ }",
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleCodeBlock()
          .run();
      },
    },
    {
      title: "Image",
      description: "Upload an image file",
      icon: "\uD83D\uDDBC",
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run();
        fileInputRef.current?.click();
      },
    },
    {
      title: "Horizontal Rule",
      description: "Visual section divider",
      icon: "\u2014",
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setHorizontalRule()
          .run();
      },
    },
  ];
}

// --- Slash Command Extension ---
function createSlashCommandExtension(
  fileInputRef: React.RefObject<HTMLInputElement | null>
) {
  const allItems = getSlashCommandItems(fileInputRef);

  return Extension.create({
    name: "slashCommand",

    addOptions() {
      return {
        suggestion: {
          char: "/",
          startOfLine: false,
          items: ({ query }: { query: string }) => {
            return allItems.filter((item) =>
              item.title.toLowerCase().includes(query.toLowerCase())
            );
          },
          render: () => {
            let popup: HTMLElement | null = null;
            let root: ReturnType<typeof createRoot> | null = null;
            let componentRef: any = null;

            return {
              onStart: (props: any) => {
                popup = document.createElement("div");
                popup.classList.add("slash-command-popup");
                document.body.appendChild(popup);

                root = createRoot(popup);
                root.render(
                  <SlashCommandMenu
                    ref={(ref) => {
                      componentRef = ref;
                    }}
                    items={props.items}
                    command={(item) => {
                      item.command({
                        editor: props.editor,
                        range: props.range,
                      });
                    }}
                  />
                );

                const { view } = props.editor;
                const coords = view.coordsAtPos(props.range.from);
                popup.style.position = "fixed";
                popup.style.left = `${coords.left}px`;
                popup.style.top = `${coords.bottom + 8}px`;
                popup.style.zIndex = "50";
              },

              onUpdate: (props: any) => {
                if (!popup || !root) return;

                root.render(
                  <SlashCommandMenu
                    ref={(ref) => {
                      componentRef = ref;
                    }}
                    items={props.items}
                    command={(item) => {
                      item.command({
                        editor: props.editor,
                        range: props.range,
                      });
                    }}
                  />
                );

                const { view } = props.editor;
                const coords = view.coordsAtPos(props.range.from);
                popup.style.left = `${coords.left}px`;
                popup.style.top = `${coords.bottom + 8}px`;
              },

              onKeyDown: (props: any) => {
                if (props.event.key === "Escape") {
                  popup?.remove();
                  root?.unmount();
                  popup = null;
                  root = null;
                  return true;
                }
                return componentRef?.onKeyDown(props) ?? false;
              },

              onExit: () => {
                popup?.remove();
                root?.unmount();
                popup = null;
                root = null;
                componentRef = null;
              },
            };
          },
        } satisfies Partial<SuggestionOptions>,
      };
    },

    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          ...this.options.suggestion,
        }),
      ];
    },
  });
}

// --- Upload helper ---
async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data.url;
}

// --- Editor Component ---
interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave?: () => void;
}

export function Editor({ content, onChange, onSave }: EditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing, or type / for commands...",
        emptyEditorClass: "is-editor-empty",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-accent underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-md border border-border max-w-full",
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-accent-light px-1 rounded",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "bg-code-bg rounded-md p-4 font-mono text-sm overflow-x-auto",
        },
      }),
      createSlashCommandExtension(fileInputRef),
    ],
    content: content ? JSON.parse(content) : undefined,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[70vh] px-4 py-8 editor-sans",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved || !event.dataTransfer?.files.length) return false;

        const file = event.dataTransfer.files[0];
        if (!file?.type.startsWith("image/")) return false;

        event.preventDefault();

        const pos = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });

        setIsUploading(true);
        uploadImage(file)
          .then((url) => {
            const { schema } = view.state;
            const node = schema.nodes.image.create({ src: url });
            const tr = view.state.tr.insert(pos?.pos ?? view.state.doc.content.size, node);
            view.dispatch(tr);
          })
          .catch((err) => {
            console.error("Image upload failed:", err);
          })
          .finally(() => {
            setIsUploading(false);
          });

        return true;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (const item of items) {
          if (item.type.startsWith("image/")) {
            event.preventDefault();
            const file = item.getAsFile();
            if (!file) return false;

            setIsUploading(true);
            uploadImage(file)
              .then((url) => {
                const { schema } = view.state;
                const node = schema.nodes.image.create({ src: url });
                const tr = view.state.tr.replaceSelectionWith(node);
                view.dispatch(tr);
              })
              .catch((err) => {
                console.error("Image paste upload failed:", err);
              })
              .finally(() => {
                setIsUploading(false);
              });

            return true;
          }
        }

        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const json = JSON.stringify(editor.getJSON());
      onChange(json);
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        onSave?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onSave]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      setIsUploading(true);
      try {
        const url = await uploadImage(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        console.error(
          "Image upload failed:",
          err instanceof Error ? err.message : "Unknown error"
        );
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [editor]
  );

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!isMounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="font-mono text-sm text-text-tertiary">
          Loading editor...
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload indicator */}
      {isUploading && (
        <div className="fixed bottom-6 right-6 z-50 bg-bg border border-border rounded-lg px-4 py-2 shadow-lg font-mono text-xs text-text-secondary">
          Uploading image...
        </div>
      )}

      {/* Bubble Menu — appears on text selection */}
      {editor && (
        <BubbleMenu
          editor={editor}
          shouldShow={({ editor: bubbleEditor, state }: { editor: any; state: any }) => {
            const { from, to } = state.selection;
            if (from === to) return false;
            if (bubbleEditor.isActive("codeBlock") || bubbleEditor.isActive("image"))
              return false;
            return true;
          }}
        >
          <div className="bubble-menu">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`bubble-menu-btn ${editor.isActive("bold") ? "is-active" : ""}`}
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`bubble-menu-btn ${editor.isActive("italic") ? "is-active" : ""}`}
            >
              <em>I</em>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`bubble-menu-btn ${editor.isActive("strike") ? "is-active" : ""}`}
            >
              <s>S</s>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`bubble-menu-btn ${editor.isActive("code") ? "is-active" : ""}`}
            >
              {"</>"}
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`bubble-menu-btn ${editor.isActive("highlight") ? "is-active" : ""}`}
            >
              Highlight
            </button>
            <div className="bubble-menu-divider" />
            <button
              type="button"
              onClick={setLink}
              className={`bubble-menu-btn ${editor.isActive("link") ? "is-active" : ""}`}
            >
              Link
            </button>
          </div>
        </BubbleMenu>
      )}

      {/* Editor content */}
      <EditorContent editor={editor} />
    </div>
  );
}
