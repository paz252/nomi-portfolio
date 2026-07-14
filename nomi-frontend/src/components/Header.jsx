export default function Header({ guestName }) {
  return (
    <nav className="navbar sticky-top navbar-expand-lg py-3 ps-5 text-white fw-bold d-flex justify-content-between align-items-center" style={{ backgroundColor: '#1e1e1e', height: '8vh' }}>
      <div className="navbar-brand mb-0 text-white">NOMI</div>
      {guestName && (
        <div className="d-flex align-items-center gap-2 pe-5">
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#4ade80',
              boxShadow: '0 0 8px rgba(74, 222, 128, 0.8)',
              display: 'inline-block',
            }}
          />
          <span className="small">Hi, {guestName}</span>
        </div>
      )}
    </nav>
  );
}