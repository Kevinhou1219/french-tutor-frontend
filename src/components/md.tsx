/** Converts **bold** markdown to <strong> and renders safely. */
export function Md({ text, className }: { text: string; className?: string }) {
  const html = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
