import React from 'react';

interface CurationRendererProps {
  text: string;
}

export default function CurationRenderer({ text }: CurationRendererProps) {
  if (!text) return null;
  
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];
  
  const flushTable = (key: number) => {
    if (tableRows.length > 0 || tableHeaders.length > 0) {
      elements.push(
        <div key={`table-${key}`} className="overflow-x-auto my-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
          <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
            {tableHeaders.length > 0 && (
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-850 font-black text-slate-800 dark:text-cyan-400">
                <tr>
                  {tableHeaders.map((h, i) => (
                    <th key={i} className="px-3 py-2.5 tracking-wider">{h.trim()}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {tableRows.map((row, ri) => (
                <tr key={ri} className="border-b dark:border-slate-850 border-slate-100 hover:bg-slate-50/40 dark:hover:bg-slate-900/10">
                  {row.map((cell, ci) => {
                    const formatted = formatInline(cell);
                    return (
                      <td key={ci} className="px-3 py-3 font-medium leading-relaxed align-top" dangerouslySetInnerHTML={{ __html: formatted }}></td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeaders = [];
      tableRows = [];
    }
    inTable = false;
  };
  
  const formatInline = (str: string) => {
    let fmt = str.trim();
    fmt = fmt.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-850 dark:text-white">$1</strong>');
    fmt = fmt.replace(/\*(.*?)\*/g, '<em class="italic text-slate-500">$1</em>');
    fmt = fmt.replace(/<br\s*\/?>/gi, '<br />');
    return fmt;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const parts = trimmed.split('|').map(p => p.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
      const isSeparator = parts.every(part => /^:?-+:?$/.test(part));
      
      if (isSeparator) {
        inTable = true;
      } else {
        if (!inTable) {
          tableHeaders = parts;
          inTable = true;
        } else {
          tableRows.push(parts);
        }
      }
      return;
    } else {
      if (inTable) {
        flushTable(index);
      }
    }
    
    if (trimmed.startsWith('###')) {
      elements.push(
        <h5 key={index} className="text-sm font-black text-slate-900 dark:text-white mt-6 mb-2 flex items-center gap-2 border-l-4 border-amber-900 dark:border-cyan-400 pl-2">
          {trimmed.replace(/^###\s*/, '')}
        </h5>
      );
    } else if (trimmed.startsWith('🧭') || trimmed.startsWith('🗺️') || trimmed.startsWith('💊') || trimmed.startsWith('💡')) {
      elements.push(
        <div key={index} className="p-3.5 bg-amber-50/50 dark:bg-slate-900/50 border border-amber-100/30 dark:border-slate-800 text-xs font-semibold rounded-2xl text-[#6B5A40] dark:text-cyan-300 my-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
      );
    } else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      elements.push(
        <ul key={index} className="list-disc pl-5 my-1.5 text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <li dangerouslySetInnerHTML={{ __html: formatInline(trimmed.replace(/^[-*]\s*/, '')) }} />
        </ul>
      );
    } else if (trimmed) {
      elements.push(
        <p key={index} className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 my-2" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      );
    }
  });
  
  if (inTable) {
    flushTable(lines.length);
  }
  
  return <div className="space-y-1">{elements}</div>;
}
