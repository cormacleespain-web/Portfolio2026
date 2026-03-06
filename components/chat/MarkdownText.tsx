"use client";

import { type ReactNode } from "react";

function parseInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      nodes.push(
        <strong key={key} className="font-semibold">
          <em>{match[2]}</em>
        </strong>,
      );
    } else if (match[3]) {
      nodes.push(
        <strong key={key} className="font-semibold text-text">
          {match[3]}
        </strong>,
      );
    } else if (match[4]) {
      nodes.push(<em key={key}>{match[4]}</em>);
    } else if (match[5]) {
      nodes.push(
        <code
          key={key}
          className="rounded bg-background px-1 py-0.5 text-xs font-mono text-accent"
        >
          {match[5]}
        </code>,
      );
    }

    lastIndex = match.index + match[0].length;
    key++;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length ? nodes : [text];
}

export function MarkdownText({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("### ")) {
      elements.push(
        <p key={key++} className="mt-2 mb-1 text-xs font-semibold uppercase tracking-wide text-accent">
          {parseInline(line.slice(4))}
        </p>,
      );
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <p key={key++} className="mt-2 mb-1 text-sm font-semibold text-text">
          {parseInline(line.slice(3))}
        </p>,
      );
      i++;
      continue;
    }

    if (/^[-*]\s/.test(line)) {
      const listItems: ReactNode[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        listItems.push(
          <li key={key++} className="ml-3 list-disc">
            {parseInline(lines[i].replace(/^[-*]\s/, ""))}
          </li>,
        );
        i++;
      }
      elements.push(
        <ul key={key++} className="my-1 space-y-0.5 pl-1">
          {listItems}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const listItems: ReactNode[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(
          <li key={key++} className="ml-3 list-decimal">
            {parseInline(lines[i].replace(/^\d+\.\s/, ""))}
          </li>,
        );
        i++;
      }
      elements.push(
        <ol key={key++} className="my-1 space-y-0.5 pl-1">
          {listItems}
        </ol>,
      );
      continue;
    }

    if (line.trim() === "") {
      elements.push(<div key={key++} className="h-2" />);
      i++;
      continue;
    }

    elements.push(
      <p key={key++} className="my-0.5">
        {parseInline(line)}
      </p>,
    );
    i++;
  }

  return <div className="space-y-0">{elements}</div>;
}
