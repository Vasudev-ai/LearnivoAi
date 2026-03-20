"use client";

import { useEffect, useCallback } from "react";

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description?: string;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
}

export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey : true;
        const metaMatch = shortcut.meta ? event.metaKey : true;
        const shiftMatch = shortcut.shift ? event.shiftKey : !shortcut.shift;
        const altMatch = shortcut.alt ? event.altKey : !shortcut.alt;

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
          if (isInputField && shortcut.key !== "Escape") {
            continue;
          }

          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

export const DEFAULT_SHORTCUTS = {
  OPEN_ASSISTANT: {
    key: "k",
    ctrl: true,
    description: "Open AI Assistant",
  } as const,
  SAVE: {
    key: "s",
    ctrl: true,
    description: "Save current work",
  } as const,
  CLOSE_MODAL: {
    key: "Escape",
    description: "Close modal/dialog",
  } as const,
  FOCUS_SEARCH: {
    key: "/",
    description: "Focus search input",
  } as const,
};
