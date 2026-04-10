"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  // Pre-process content to handle common LaTeX delimiters if needed
  // Some LLMs output \[ \] or \( \) which might need conversion to $$ or $
  // but remark-math usually handles them. 
  // Let's ensure consistent formatting.
  
  return (
    <div className={cn("prose prose-sm dark:prose-invert max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Customize components if needed
          h1: ({ ...props }) => <h1 className="text-2xl font-bold mb-4" {...props} />,
          h2: ({ ...props }) => <h2 className="text-xl font-bold mb-3" {...props} />,
          h3: ({ ...props }) => <h3 className="text-lg font-bold mb-2" {...props} />,
          p: ({ ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
          ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
          ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4" {...props} />,
          li: ({ ...props }) => <li className="mb-1" {...props} />,
          code: ({ ...props }) => (
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
          ),
          pre: ({ ...props }) => (
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4" {...props} />
          ),
          blockquote: ({ ...props }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic mb-4" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
