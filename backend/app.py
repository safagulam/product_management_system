from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError

from config import Config
from extensions import db
from models import Product

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)  # Allow requests from the React frontend (different origin/port)
db.init_app(app)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def validate_product_payload(data, partial=False):
    """
    Validates incoming product data.
    Returns (cleaned_data, errors_dict)
    """
    errors = {}
    cleaned = {}

    # --- name ---
    if "name" in data or not partial:
        name = (data.get("name") or "").strip()
        if not name:
            errors["name"] = "Product name is required."
        elif len(name) > 150:
            errors["name"] = "Product name must be 150 characters or fewer."
        else:
            cleaned["name"] = name

    # --- code ---
    if "code" in data or not partial:
        code = (data.get("code") or "").strip()
        if not code:
            errors["code"] = "Product code is required."
        elif len(code) > 50:
            errors["code"] = "Product code must be 50 characters or fewer."
        else:
            cleaned["code"] = code

    # --- price ---
    if "price" in data or not partial:
        price_raw = data.get("price")
        if price_raw is None or price_raw == "":
            errors["price"] = "Price is required."
        else:
            try:
                price = float(price_raw)
                if price < 0:
                    errors["price"] = "Price cannot be negative."
                else:
                    cleaned["price"] = round(price, 2)
            except (TypeError, ValueError):
                errors["price"] = "Price must be a valid number."

    # --- category ---
    if "category" in data or not partial:
        category = (data.get("category") or "").strip()
        if not category:
            errors["category"] = "Category is required."
        elif len(category) > 100:
            errors["category"] = "Category must be 100 characters or fewer."
        else:
            cleaned["category"] = category

    return cleaned, errors


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"}), 200


@app.route("/api/products", methods=["GET"])
def get_products():
    """Get all products, newest first."""
    products = Product.query.order_by(Product.created_at.desc()).all()
    return jsonify([p.to_dict() for p in products]), 200


@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found."}), 404
    return jsonify(product.to_dict()), 200


@app.route("/api/products", methods=["POST"])
def create_product():
    data = request.get_json(silent=True) or {}
    cleaned, errors = validate_product_payload(data)

    if errors:
        return jsonify({"errors": errors}), 400

    product = Product(**cleaned)
    db.session.add(product)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"errors": {"code": "Product code must be unique."}}), 409

    return jsonify(product.to_dict()), 201


@app.route("/api/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found."}), 404

    data = request.get_json(silent=True) or {}
    cleaned, errors = validate_product_payload(data, partial=False)

    if errors:
        return jsonify({"errors": errors}), 400

    for key, value in cleaned.items():
        setattr(product, key, value)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"errors": {"code": "Product code must be unique."}}), 409

    return jsonify(product.to_dict()), 200


@app.route("/api/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found."}), 404

    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted successfully."}), 200


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Creates the products table if it doesn't already exist
    app.run(debug=True, port=Config.PORT, host="0.0.0.0")
