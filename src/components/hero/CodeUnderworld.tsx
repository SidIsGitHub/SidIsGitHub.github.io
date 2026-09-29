"use client";

export default function CodeUnderworld({ activeZone, rawCode }: { activeZone?: string, rawCode: string }) {
  const codeString = rawCode || "SYSTEM_BOOT...";
  
  // Flatten the string (remove explicit line breaks) and add spacing
  const continuousCode = codeString.replace(/\n/g, '   ');
  
  // 3. Multiply it massively to ensure a full edge-to-edge matrix
  const massiveCode = continuousCode.repeat(100);

  // Strict regex pipeline: Escape HTML first, then colorize.
  const formatCode = (codeStr: string) => {
    let html = codeStr.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    html = html
      // Strings (Seraphic Cyan)
      .replace(/(["'`].*?["'`])/g, '<span style="color:#00B4D8;">$1</span>')
      // Keywords (Ethereal Violet)
      .replace(/\b(export|default|function|return|const|let|var|import|from|useMotionValue|useVelocity)\b/g, '<span style="color:#C77DFF; font-weight:bold;">$1</span>')
      // React Components (Warning Red)
      .replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, '<span style="color:#FF2A00; font-weight:bold;">$1</span>')
      // Numbers (Halo Gold)
      .replace(/\b(\d+)\b/g, '<span style="color:#FFB703;">$1</span>')
      // Comments (Dim Gray)
      .replace(/(\/\/.*)/g, '<span style="color:#6B7280; font-style:italic;">$1</span>');
      
    return html;
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
