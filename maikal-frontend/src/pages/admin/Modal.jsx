export default function Modal({ title, onClose, children, onSave, saving, closeOnBackdrop = false }) {
  const handleOverlayClick = (e) => {
    // Only close if explicitly allowed; by default disabled so user doesn't lose form changes on accidental clicks/drags
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    // Prevent accidental close when pressing Enter in input fields
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
      e.preventDefault();
      if (onSave && !saving) onSave();
    }
  };

  return (
    <div
      className="modal-overlay open"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
    >
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-save"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : '💾 Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
