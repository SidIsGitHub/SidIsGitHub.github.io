"use client";

export default function CodeUnderworld({ activeZone, rawCode }: { activeZone?: string, rawCode: string }) {
  const codeString = rawCode || "SYSTEM_BOOT...";
  
  // Flatten the string (remove explicit line breaks) and add spacing
  const continuousCode = codeString.replace(/\n/g, '   ');
  
  // 3. Multiply it massively to ensure a full edge-to-edge matrix
  const massiveCode = continuousCode.repeat(100);

  // Single-pass tokenizer to avoid double-processing and corrupting HTML
  const formatCode = (codeStr: string) => {
    // 1. Escape HTML
    const escaped = codeStr.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    // 2. Single-pass tokenizer
    const tokenizer = /(["'`][\s\S]*?["'`])|(\/\/.*)|(\b(?:export|default|function|return|const|let|var|import|from|useMotionValue|useVelocity)\b)|(\b[A-Z][a-zA-Z0-9_]*\b)|(\b\d+\b)/g;
    
    return escaped.replace(tokenizer, (match, str, comment, keyword, reactComp, num) => {
      if (str) return `<span style="color:#00B4D8;">${str}</span>`;
      if (comment) return `<span style="color:#6B7280; font-style:italic;">${comment}</span>`;
      if (keyword) return `<span style="color:#C77DFF; font-weight:bold;">${keyword}</span>`;
      if (reactComp) return `<span style="color:#FF2A00; font-weight:bold;">${reactComp}</span>`;
      if (num) return `<span style="color:#FFB703;">${num}</span>`;
      return match;
    });
  };

  return (
    // Removed p-8 to allow edge-to-edge bleeding
    <div className="fixed inset-0 z-0 w-screen h-screen bg-[#060608] overflow-hidden pointer-events-none">
      <pre 
        // break-all and whitespace-normal force the text to hit the exact right edge before wrapping
        className="w-[105vw] h-[105vh] -translate-x-2 -translate-y-2 font-mono text-[1.05rem] leading-[1.7] tracking-tight text-[#EBEBEB] break-all whitespace-normal text-justify opacity-85"
        dangerouslySetInnerHTML={{ __html: formatCode(massiveCode) }}
      />
    </div>
  );
}
