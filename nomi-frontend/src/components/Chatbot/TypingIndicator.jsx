export default function TypingIndicator() {
  return (
    <div className="p-3 mb-3 rounded shadow-sm d-inline-block">
      <span className="text-muted fw-bold mb-2">
        AI is thinking&nbsp;
      </span>
      <span className="typing-indicator">
        <span />
        <span />
        <span />
      </span>
    </div>
  );
}