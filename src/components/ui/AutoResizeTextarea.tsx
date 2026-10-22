"use client";

import React, { useRef, useEffect } from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onValueChange: (val: string) => void;
  className?: string;
}

export function AutoResizeTextarea({
  value,
  onValueChange,
  className = "",
  rows = 1,
  ...props
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 24)}px`;
  };

  useEffect(() => {
    resize();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        onValueChange(e.target.value);
        resize();
      }}
      rows={rows}
      className={`w-full overflow-hidden resize-none bg-transparent outline-none transition-all ${className}`}
      {...props}
    />
  );
}
