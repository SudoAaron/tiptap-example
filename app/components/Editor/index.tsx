"use client";
import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./components/Toolbar";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
// import ImageResize from "tiptap-extension-resize-image";
import { ImageResize } from "@/app/extensions/ImageResize";
import "./styles.css";

interface Props {}

export default function Editor({}: Props) {
  const [content, setContent] = useState<string>(() => {
    // Get content from local storage, defaulting to "Your results.." if not found
    return localStorage.getItem("editorContent") || "";
  });

  useEffect(() => {
    // Save content to local storage whenever it changes
    localStorage.setItem("editorContent", content);
    // Save timestamp of when the data was saved
    localStorage.setItem("editorContentTimestamp", Date.now().toString());
  }, [content]);

  useEffect(() => {
    // Check if data has expired and reset content if necessary
    const savedTimestamp = parseInt(
      localStorage.getItem("editorContentTimestamp") || "0",
      10
    );
    const expirationTime = 60 * 1000; // 1 minute in milliseconds
    if (Date.now() - savedTimestamp > expirationTime) {
      localStorage.removeItem("editorContent");
      localStorage.removeItem("editorContentTimestamp");
      setContent("Your results..");
    }
  }, []);

  const handleContentChange = (reason: any) => {
    setContent(reason);
  };
  const handleChange = (newContent: string) => {
    handleContentChange(newContent);
  };

  function handleImageDeletes(transaction: any) {
    const getImageSrcs = (fragment: any) => {
      let srcs = new Set();
      fragment.forEach((node: any) => {
        if (node.type.name === "image") {
          srcs.add(node.attrs.src);
        }
      });
      return srcs;
    };

    let currentSrcs = getImageSrcs(transaction.doc.content);
    let previousSrcs = getImageSrcs(transaction.before.content) as any;

    if (currentSrcs.size === 0 && previousSrcs.size === 0) {
      return;
    }

    // Determine which images were deleted
    let deletedImageSrcs = [...previousSrcs].filter(
      (src) => !currentSrcs.has(src)
    );

    if (deletedImageSrcs.length > 0) {
      //Handle deleting file on cloud here
      console.log("Handle deleting the images:", deletedImageSrcs);
      fetch("/api/images", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: deletedImageSrcs,
        }),
      })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  const editor = useEditor({
    onTransaction({ transaction }) {
      handleImageDeletes(transaction);
    },
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "pl-3 list-disc",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "pl-4 list-decimal",
          },
        },
        heading: {
          HTMLAttributes: {
            class: "text-3xl",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "w-full",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),
      Underline,
      ImageResize,
    ],
    editorProps: {
      attributes: {
        class:
          "px-7 h-96 pb-4 border-b border-r border-l border-gray-700 text-gray-700 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none overflow-y-scroll",
      },
    },
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
    content: content,
  });

  return (
    <div>
      <div className="w-full px-4 min-h-24">
        <Toolbar editor={editor} content={content} />
        <EditorContent style={{ whiteSpace: "pre-line" }} editor={editor} />
      </div>
      <div>
        <div className="text-xl text-center">HTML Output:</div>
        <p className="text-red-500 p-2 text-lg">{editor?.getHTML()}</p>
      </div>
      <div>
        <div className="text-xl text-center">JSON Output:</div>
        <p className="text-red-500 p-2 text-lg">
          {JSON.stringify(editor?.getJSON())}
        </p>
      </div>
    </div>
  );
}
