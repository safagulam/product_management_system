import { useEffect, useState } from "react";

const EMPTY_FORM = { name: "", code: "", price: "", category: "" };

function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Product name is required.";
  } else if (form.name.trim().length > 150) {
    errors.name = "Keep it under 150 characters.";
  }

  if (!form.code.trim()) {
    errors.code = "Product code is required.";
  } else if (!/^[A-Za-z0-9_-]+$/.test(form.code.trim())) {
    errors.code = "Use letters, numbers, dashes or underscores only.";
  } else if (form.code.trim().length > 50) {
    errors.code = "Keep it under 50 characters.";
  }

  if (form.price === "" || form.price === null) {
    errors.price = "Price is required.";
  } else if (Number.isNaN(Number(form.price))) {
    errors.price = "Enter a valid number.";
  } else if (Number(form.price) < 0) {
    errors.price = "Price can't be negative.";
  }

  if (!form.category.trim()) {
    errors.category = "Category is required.";
  } else if (form.category.trim().length > 100) {
    errors.category = "Keep it under 100 characters.";
  }

  return errors;
}

export default function ProductForm({
  editingProduct,
  onSubmit,
  onCancel,
  submitting,
  serverErrors,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState({});
  const [clientErrors, setClientErrors] = useState({});

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        code: editingProduct.code,
        price: String(editingProduct.price),
        category: editingProduct.category,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setTouched({});
    setClientErrors({});
  }, [editingProduct]);

  const errors = { ...clientErrors, ...serverErrors };

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setClientErrors(validate({ ...form }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const foundErrors = validate(form);
    setClientErrors(foundErrors);
    setTouched({ name: true, code: true, price: true, category: true });

    if (Object.keys(foundErrors).length > 0) return;

    onSubmit({
      name: form.name.trim(),
      code: form.code.trim(),
      price: Number(form.price),
      category: form.category.trim(),
    });
  }

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <span className="form-eyebrow">
          {editingProduct ? "Editing entry" : "New entry"}
        </span>
        <h2>{editingProduct ? "Update product" : "Add a product"}</h2>
      </div>

      <div className="field">
        <label htmlFor="name">Product name</label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
          placeholder="e.g. Canvas Field Jacket"
          aria-invalid={Boolean(touched.name && errors.name)}
        />
        {touched.name && errors.name && (
          <span className="field-error">{errors.name}</span>
        )}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="code">Product code</label>
          <input
            id="code"
            type="text"
            value={form.code}
            onChange={(e) => handleChange("code", e.target.value)}
            onBlur={() => handleBlur("code")}
            placeholder="e.g. CFJ-014"
            className="mono-input"
            aria-invalid={Boolean(touched.code && errors.code)}
          />
          {touched.code && errors.code && (
            <span className="field-error">{errors.code}</span>
          )}
        </div>

        <div className="field">
          <div className="field">
  <label htmlFor="price">Price (₹)</label>
  <input
    id="price"
    type="number"
    step="1"
    min="0"
    value={form.price}
    onChange={(e) => handleChange("price", e.target.value)}
    onBlur={() => handleBlur("price")}
    placeholder="₹0"
    className="mono-input price-input"
    aria-invalid={Boolean(touched.price && errors.price)}
  />
</div>
          {touched.price && errors.price && (
            <span className="field-error">{errors.price}</span>
          )}
        </div>
      </div>

      <div className="field">
        <label htmlFor="category">Category</label>
        <input
          id="category"
          type="text"
          list="category-suggestions"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
          onBlur={() => handleBlur("category")}
          placeholder="e.g. Outerwear"
          aria-invalid={Boolean(touched.category && errors.category)}
        />
        <datalist id="category-suggestions">
          <option value="Outerwear" />
          <option value="Footwear" />
          <option value="Accessories" />
          <option value="Electronics" />
          <option value="Home Goods" />
        </datalist>
        {touched.category && errors.category && (
          <span className="field-error">{errors.category}</span>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting
            ? "Saving…"
            : editingProduct
            ? "Save changes"
            : "Add product"}
        </button>
        {editingProduct && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
