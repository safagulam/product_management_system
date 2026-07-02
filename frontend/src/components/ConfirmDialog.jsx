export default function ConfirmDialog({ product, onConfirm, onCancel, busy }) {
  if (!product) return null;

  return (
    <div className="dialog-backdrop" role="dialog" aria-modal="true">
      <div className="dialog">
        <h3>Delete “{product.name}”?</h3>
        <p>
          This removes product code{" "}
          <span className="code-tag">{product.code}</span> permanently. This
          can't be undone.
        </p>
        <div className="dialog-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={busy}
          >
            Keep it
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Deleting…" : "Delete product"}
          </button>
        </div>
      </div>
    </div>
  );
}
