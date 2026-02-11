interface BlockQuoteProps {
  children: React.ReactNode;
  author?: string;
  source?: string;
}

export function BlockQuote({ children, author, source }: BlockQuoteProps) {
  return (
    <blockquote className="my-8 border-l-[3px] border-accent pl-6 py-1">
      <div className="font-serif text-xl italic leading-relaxed text-text">
        {children}
      </div>
      {(author || source) && (
        <footer className="mt-3 font-mono text-xs text-text-secondary">
          {author && <span>— {author}</span>}
          {author && source && <span>, </span>}
          {source && <cite className="not-italic">{source}</cite>}
        </footer>
      )}
    </blockquote>
  );
}
