"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Image,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Počnite da pišete sadržaj...",
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Format functions
  const insertFormat = (startMark: string, endMark: string = startMark) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const selectedText = value.substring(selectionStart, selectionEnd);
    
    const newValue =
      value.substring(0, selectionStart) +
      startMark +
      selectedText +
      endMark +
      value.substring(selectionEnd);
    
    onChange(newValue);
    
    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        selectionStart + startMark.length,
        selectionEnd + startMark.length
      );
    }, 0);
  };

  const insertHeading = (level: number) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const selectedText = value.substring(selectionStart, selectionEnd);
    
    // Get the start of the line where the selection begins
    let startOfLine = selectionStart;
    while (startOfLine > 0 && value[startOfLine - 1] !== '\n') {
      startOfLine--;
    }
    
    // Get existing content before the selection
    const beforeSelection = value.substring(0, startOfLine);
    
    // Create the heading mark with the specified level
    const headingMark = '#'.repeat(level) + ' ';
    
    // Combine all parts to create the new value
    const newValue =
      beforeSelection +
      headingMark +
      selectedText +
      value.substring(selectionEnd);
    
    onChange(newValue);
    
    // Set cursor position after the heading
    setTimeout(() => {
      textarea.focus();
      const newCursorPosition = startOfLine + headingMark.length + selectedText.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  const insertList = (ordered: boolean = false) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const selectedText = value.substring(selectionStart, selectionEnd);
    
    let newText = '';
    if (selectedText) {
      // Split the selected text by newlines
      const lines = selectedText.split('\n');
      // Format each line as a list item
      newText = lines
        .map((line, i) => (ordered ? `${i + 1}. ` : '- ') + line)
        .join('\n');
    } else {
      // If no text is selected, just add a single list item
      newText = ordered ? '1. ' : '- ';
    }
    
    const newValue =
      value.substring(0, selectionStart) +
      newText +
      value.substring(selectionEnd);
    
    onChange(newValue);
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = selectionStart + newText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const insertImage = () => {
    const url = prompt('Unesite URL slike:');
    if (!url) return;
    
    const alt = prompt('Unesite alternativni tekst za sliku:', 'Slika');
    const alignment = prompt('Unesite poravnanje slike (left, center, right):', 'center');
    
    let imgMarkdown = `![${alt}](${url})`;
    
    // Add HTML for alignment if specified
    if (alignment && ['left', 'center', 'right'].includes(alignment)) {
      imgMarkdown = `<div style="text-align: ${alignment};">\n${imgMarkdown}\n</div>`;
    }
    
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    
    const newValue =
      value.substring(0, cursorPos) +
      imgMarkdown +
      value.substring(cursorPos);
    
    onChange(newValue);
    
    // Set cursor position after the image markdown
    setTimeout(() => {
      textarea.focus();
      const newPosition = cursorPos + imgMarkdown.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const insertLink = () => {
    const url = prompt('Unesite URL linka:');
    if (!url) return;
    
    const text = prompt('Unesite tekst za link:', 'Link');
    
    const linkMarkdown = `[${text}](${url})`;
    
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    
    const newValue =
      value.substring(0, cursorPos) +
      linkMarkdown +
      value.substring(cursorPos);
    
    onChange(newValue);
    
    // Set cursor position after the link markdown
    setTimeout(() => {
      textarea.focus();
      const newPosition = cursorPos + linkMarkdown.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  return (
    <div className="border rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => insertFormat("**")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => insertFormat("*")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="h-6 border-r mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => insertHeading(1)}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => insertHeading(2)}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => insertHeading(3)}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <div className="h-6 border-r mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => insertList(false)}
          title="Bulleted List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => insertList(true)}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => insertFormat("> ")}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => insertFormat("```\n", "\n```")}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>
        <div className="h-6 border-r mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={insertLink}
          title="Insert Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={insertImage}
          title="Insert Image"
        >
          <Image className="h-4 w-4" />
        </Button>
        <div className="h-6 border-r mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => insertFormat("<div style=\"text-align: left;\">\n", "\n</div>")}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => insertFormat("<div style=\"text-align: center;\">\n", "\n</div>")}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => insertFormat("<div style=\"text-align: right;\">\n", "\n</div>")}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor/Preview Tabs */}
      <Tabs value={tab} onValueChange={(value) => setTab(value as "write" | "preview")}>
        <div className="border-b px-4">
          <TabsList className="bg-transparent border-b-0">
            <TabsTrigger value="write">Piši</TabsTrigger>
            <TabsTrigger value="preview">Pregled</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="write" className="p-0 m-0">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[250px] rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-y"
          />
        </TabsContent>

        <TabsContent value="preview" className="p-4 m-0 min-h-[250px] prose prose-emerald max-w-none">
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <p className="text-gray-400 italic">Nema sadržaja za pregled</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 