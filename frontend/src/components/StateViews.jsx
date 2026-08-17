export function LoadingState({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-3 py-16 justify-center text-papermuted font-mono text-sm">
      <span className="inline-block h-2 w-2 rounded-full bg-amber animate-pulse" />
      <span className="inline-block h-2 w-2 rounded-full bg-amber animate-pulse [animation-delay:150ms]" />
      <span className="inline-block h-2 w-2 rounded-full bg-amber animate-pulse [animation-delay:300ms]" />
      <span>{label}&hellip;</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="border border-coral/40 bg-coral/10 rounded-lg p-6 text-center">
      <p className="font-display text-lg text-paper mb-1">Something broke the connection</p>
      <p className="text-sm text-papermuted mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-md bg-coral/20 hover:bg-coral/30 border border-coral/40 text-sm font-mono transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, hint }) {
  return (
    <div className="border border-white/10 rounded-lg p-10 text-center">
      <p className="font-display text-lg text-paper mb-1">{title}</p>
      {hint && <p className="text-sm text-papermuted">{hint}</p>}
    </div>
  );
}
