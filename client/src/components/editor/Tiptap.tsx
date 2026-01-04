import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toggle } from "../ui/toggle"; // Using Toggle instead of Button
import {
  Bold,
  Heading1,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react";
import { useEffect } from "react";

interface TiptapProps {
  value: string;
  onChange: (value: string) => void;
}

const Tiptap = ({ value, onChange }: TiptapProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: { class: "list-decimal pl-4" },
        },
        bulletList: {
          HTMLAttributes: { class: "list-disc pl-4" },
        },
        heading: {
          HTMLAttributes: { class: "text-2xl font-bold" },
          levels: [1],
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync internal editor content with external value prop
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1">
        <Toggle
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          size={"sm"}
        >
          <Heading1 className="w-4 h-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          size={"sm"}
        >
          <Bold className="w-4 h-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          size={"sm"}
        >
          <Italic className="w-4 h-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          size={"sm"}
        >
          <Strikethrough className="w-4 h-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          size={"sm"}
        >
          <ListOrdered className="w-4 h-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          size={"sm"}
        >
          <List className="w-4 h-4" />
        </Toggle>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
