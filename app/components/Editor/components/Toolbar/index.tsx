"use client";

import React, { useCallback, useState } from "react";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Underline,
  Quote,
  Undo,
  Redo,
  Code,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  ImagePlusIcon,
} from "lucide-react";

type Props = {
  editor: Editor | null;
  content: string;
};

const Toolbar = ({ editor, content }: Props) => {
  if (!editor) {
    return null;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      // Upload file to bucket
      fetch("/api/images", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          // Add to editor
          console.log(data);
          editor.chain().focus().setImage({ src: data.url }).run();
        });
    }
  };

  return (
    <div
      className="px-4 py-3 rounded-tl-md rounded-tr-md flex justify-between items-start
    gap-5 w-full flex-wrap border border-gray-700"
    >
      <div className="flex justify-start items-center gap-5 w-full lg:w-10/12 flex-wrap ">
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={
            editor.isActive("bold")
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-700"
          }
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={
            editor.isActive("italic")
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-700"
          }
        >
          <Italic className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
          className={
            editor.isActive("underline")
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-700"
          }
        >
          <Underline className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
          className={
            editor.isActive("strike")
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-700"
          }
        >
          <Strikethrough className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-700"
          }
        >
          <Heading2 className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={
            editor.isActive("bulletList")
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-700"
          }
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={
            editor.isActive("orderedList")
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-700"
          }
        >
          <ListOrdered className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBlockquote().run();
          }}
          className={
            editor.isActive("blockquote")
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-700"
          }
        >
          <Quote className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleCodeBlock().run();
          }}
          className={
            editor.isActive("code")
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-700"
          }
        >
          <Code className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setImageAlign("left").run();
            editor.chain().focus().setTextAlign("left").run();
          }}
          className={
            editor.isActive({ textAlign: "left" })
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-700"
          }
        >
          <AlignLeftIcon className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setImageAlign("center").run();
            editor.chain().focus().setTextAlign("center").run();
          }}
          className={
            editor.isActive({ textAlign: "center" })
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-700"
          }
        >
          <AlignCenterIcon className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setImageAlign("right").run();
            editor.chain().focus().setTextAlign("right").run();
          }}
          className={
            editor.isActive({ textAlign: "right" })
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-700"
          }
        >
          <AlignRightIcon className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            const { state } = editor;
            const { from } = state.selection;
            const node = state.doc.nodeAt(from);
            if (node?.type?.name !== "image") {
              editor.chain().focus().setTextAlign("justify").run();
            }
          }}
          className={
            editor.isActive({ textAlign: "justify" })
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-700"
          }
        >
          <AlignJustifyIcon className="w-5 h-5" />
        </button>
        <label htmlFor="file">
          <ImagePlusIcon className="w-5 h-5" />
        </label>
        <input
          id="file"
          type="file"
          accept="image/*"
          onChange={(e) => {
            handleFileChange(e);
          }}
          style={{ display: "none" }}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
          className={
            editor.isActive("undo")
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-700 hover:bg-gray-700 hover:text-white p-1 hover:rounded-lg"
          }
        >
          <Undo className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
          className={
            editor.isActive("redo")
              ? "bg-gray-700 text-white p-2 rounded-lg"
              : "text-gray-700 hover:bg-gray-700 hover:text-white p-1 hover:rounded-lg"
          }
        >
          <Redo className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
