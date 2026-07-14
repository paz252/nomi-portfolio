import { useState } from "react";

export default function WelcomeModal({ isOpen, onSubmit }) {
  const [nameInput, setNameInput] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = nameInput.trim();
    if (!trimmedName) return;
    onSubmit(trimmedName);
  };

  if (!isOpen) return null;

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        zIndex: 2000,
      }}
    >
      <div
        className="card p-4"
        style={{
          width: "min(500px, 90vw)",
          backgroundColor: "#1e1e1e",
          borderColor: "#333",
          color: "#fff",
        }}
      >
        <h2 className="mb-3 text-center">Welcome to Nomi</h2>
        <p className="mb-3 text-center">What should I call you today?</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-3 welcome-modal-input"
            placeholder="Enter your name"
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            autoFocus
            style={{
              backgroundColor: '#2a2a2a',
              color: '#fff',
              borderColor: '#444',
              textAlign: 'center',
            }}
          />
          <style>{`.welcome-modal-input::placeholder { color: #fff !important; opacity: 1; }`}</style>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={!nameInput.trim()}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
