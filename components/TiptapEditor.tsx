"use client";

import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  List,
  ListOrdered,
  Bold,
  Italic, Heading1,
} from "lucide-react";
type Props = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
};

export default function TiptapEditor({ value, onChange, onBlur, }: Props) {
  const MAX_WORDS = 250;
const lastValidContent = useRef(value || "<p></p>");
  const editor = useEditor({
      extensions: [
        StarterKit,
      ],
      editorProps: {
  handlePaste: (view, event) => {
    const pastedText =
      event.clipboardData?.getData("text/plain") || "";

    const currentText = view.state.doc.textContent;

    const totalWords = (currentText + " " + pastedText)
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    if (totalWords > 250) {
      event.preventDefault();
      return true;
    }

    return false;
  },

  handleTextInput: (view, from, to, text) => {
    const currentWords = view.state.doc.textContent
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (
      currentWords.length >= 250 &&
      text.includes(" ")
    ) {
      return true;
    }

    return false;
  },
},
    content: value,
    immediatelyRender: false, // ✅ Fix SSR issue
  onUpdate: ({ editor }) => {
  const text = editor.getText().trim();
  const words = text ? text.split(/\s+/).filter(Boolean) : [];

  if (words.length > MAX_WORDS) {
    editor.commands.setContent(lastValidContent.current);
    return;
  }

  const html = editor.getHTML();

  lastValidContent.current = html;
  onChange(html);
},
     onBlur: () => {
      onBlur?.();
    },
  });
useEffect(() => {
  if (!editor) return;

  if (value !== editor.getHTML()) {
    lastValidContent.current = value || "<p></p>";
    editor.commands.setContent(value || "");
  }
}, [value, editor]);
const wordCount = editor
  ? editor
      .getText()
      .trim()
      .split(/\s+/)
      .filter(Boolean).length
  : 0;
  if (!editor) return null;

  return (
    <div className="border rounded-lg p-3 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-3 border-b pb-2">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 text-sm rounded-md border transition ${
            editor.isActive("bold")
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <Bold className="w-4 h-4" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 text-sm rounded-md border transition ${
            editor.isActive("italic")
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <Italic className="w-4 h-4" />
        </button>

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 text-sm rounded-md border transition ${
            editor.isActive("bulletList")
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <List className="w-4 h-4" />
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 text-sm rounded-md border transition ${
            editor.isActive("orderedList")
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        {/* Heading */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-3 py-1 text-sm rounded-md border transition ${
            editor.isActive("heading", { level: 1 })
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <Heading1 className="w-4 h-4" />
        </button>

      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
      <div className="flex justify-end mt-2 text-xs text-gray-500">
  {wordCount}/250 words
</div>
    </div>
  );
}
