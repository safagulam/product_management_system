const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export default function ProductList({
  products,
  loading,
  onEdit,
  onDelete,
  deletingId,
}) {
  if (loading) {
    return (
      <div className="empty-state">
        <p>Loading the stockroom…</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-title">No products yet</p>
        <p>Add your first product using the form to see it listed here.</p>
      </div>
    );
  }

  return (
    <div className="product-table-wrap">
      <table className="product-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Code</th>
            <th>Category</th>
            <th className="align-right">Price</th>
            <th className="align-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td data-label="Product" className="cell-name">
                {product.name}
              </td>
              <td data-label="Code">
                <span className="code-tag">{product.code}</span>
              </td>
              <td data-label="Category">
                <span className="category-pill">{product.category}</span>
              </td>
              <td data-label="Price" className="align-right cell-price">
                {currency.format(product.price)}
              </td>
              <td data-label="Actions" className="align-right">
                <div className="row-actions">
                  <button
                    type="button"
                    className="btn btn-small btn-ghost"
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-small btn-danger"
                    onClick={() => onDelete(product)}
                    disabled={deletingId === product.id}
                  >
                    {deletingId === product.id ? "Removing…" : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
