"use client";
import { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

function ToolBtn({ title, onClick, isActive, children }) {
    return (
        <button
            type="button"
            title={title}
            className={`cb-tool-btn${isActive ? " cb-tool-btn--active" : ""}`}
            onMouseDown={(e) => { e.preventDefault(); onClick(); }}
        >
            {children}
        </button>
    );
}

function Toolbar({ editor }) {
    if (!editor) return null;

    const setLink = useCallback(() => {
        const prev = editor.getAttributes("link").href;
        const url = window.prompt("Enter URL:", prev || "https://");
        if (url === null) return;
        if (url === "") {
            editor.chain().focus().extendMarkToLink().unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkToLink().setLink({ href: url, target: "_blank" }).run();
    }, [editor]);

    return (
        <div className="cb-toolbar">
            <ToolBtn title="Bold (Ctrl+B)" isActive={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
                <span className="cb-tool-label">B</span>
            </ToolBtn>

            <ToolBtn title="Italic (Ctrl+I)" isActive={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
                <span className="cb-tool-label-i">I</span>
            </ToolBtn>

            <ToolBtn title="Underline (Ctrl+U)" isActive={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 4v6a6 6 0 0012 0V4" /><line x1="4" y1="20" x2="20" y2="20" />
                </svg>
            </ToolBtn>

            <div className="cb-tool-sep" />

            <ToolBtn title="Heading" isActive={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12h16M4 6h7M4 18h7M17 6v12" />
                </svg>
            </ToolBtn>

            <ToolBtn title="Quote" isActive={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                </svg>
            </ToolBtn>

            <ToolBtn title="Bullet list" isActive={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" />
                    <circle cx="4" cy="6" r="1" fill="currentColor" />
                    <circle cx="4" cy="12" r="1" fill="currentColor" />
                    <circle cx="4" cy="18" r="1" fill="currentColor" />
                </svg>
            </ToolBtn>

            <ToolBtn title="Numbered list" isActive={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
                    <path d="M4 6h1v4M4 6H3M3 10h2M3 14h1.5a.5.5 0 010 1H3.5a.5.5 0 010 1H5M4 18v2h2" strokeWidth="1.5" />
                </svg>
            </ToolBtn>

            <div className="cb-tool-sep" />

            <ToolBtn title="Code block" isActive={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                </svg>
            </ToolBtn>

            <ToolBtn title="Insert link" isActive={editor.isActive("link")} onClick={setLink}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                </svg>
            </ToolBtn>

            <div className="cb-tool-sep" />

            <ToolBtn title="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
                </svg>
            </ToolBtn>

            <ToolBtn title="Redo (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 7v6h-6" /><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13" />
                </svg>
            </ToolBtn>

            <ToolBtn title="Clear formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                    <path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" />
                </svg>
            </ToolBtn>
        </div>
    );
}

export function useBlogEditor({ onWordCountChange }) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { rel: "noopener noreferrer" },
            }),
            Placeholder.configure({
                placeholder: "Start writing your story… use the toolbar above to format your text.",
            }),
        ],
        editorProps: {
            attributes: {
                class: "cb-body-input",
                spellcheck: "true",
            },
            transformPastedHTML(html) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                doc.querySelectorAll("*").forEach((el) => {
                    el.removeAttribute("style");
                    el.removeAttribute("class");
                    el.removeAttribute("id");
                    if (el.tagName === "SPAN" && el.attributes.length === 0) {
                        el.replaceWith(...el.childNodes);
                    }
                });
                return doc.body.innerHTML;
            },
        },
        onUpdate({ editor }) {
            const text = editor.getText();
            const words = text.trim() ? text.trim().split(/\s+/).length : 0;
            onWordCountChange?.(words);
        },
    });

    const getHTML = useCallback(() => editor?.getHTML() ?? "", [editor]);
    const getText = useCallback(() => editor?.getText() ?? "", [editor]);

    return { editor, getHTML, getText };
}

export default function BlogEditor({ editor }) {
    return (
        <>
            <Toolbar editor={editor} />
            <div className="cb-editor-wrap">
                <EditorContent editor={editor} />
            </div>
        </>
    );
}