# Stockroom — Simple Product Management System

A full-stack CRUD app for managing products.

- **Frontend:** React (Vite)
- **Backend:** Python (Flask + SQLAlchemy)
- **Database:** MySQL

Each product has: **Product Name**, **Product Code** (unique), **Price**, **Category**.

```
product-management-system/
├── backend/
│   ├── app.py            # Flask app + REST routes
│   ├── models.py         # Product SQLAlchemy model
│   ├── config.py         # Env-based config
│   ├── extensions.py     # db instance
│   ├── schema.sql        # MySQL DB/table creation
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ProductForm.jsx
    │   │   ├── ProductList.jsx
    │   │   ├── ConfirmDialog.jsx
    │   │   └── Toast.jsx
    │   ├── App.jsx
    │   ├── api.js
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 1. Database setup (MySQL)

Make sure MySQL is installed and running, then create the database:

```bash
mysql -u root -p < backend/schema.sql
```

This creates a `product_management` database and a `products` table (the Flask app will also auto-create the table on first run if it doesn't exist).

## 2. Backend setup (Python / Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env          # then edit .env with your MySQL credentials

python app.py
```

The API will run at `http://localhost:5000`.

### API Endpoints

| Method | Endpoint                  | Description          |
|--------|----------------------------|-----------------------|
| GET    | `/api/products`            | Get all products      |
| GET    | `/api/products/<id>`       | Get a single product  |
| POST   | `/api/products`            | Create a product      |
| PUT    | `/api/products/<id>`       | Update a product      |
| DELETE | `/api/products/<id>`       | Delete a product      |
| GET    | `/api/health`               | Health check          |

**Request body** (POST / PUT), JSON:
```json
{
  "name": "Canvas Field Jacket",
  "code": "CFJ-014",
  "price": 129.99,
  "category": "Outerwear"
}
```

Validation is enforced server-side (required fields, non-negative price, unique code) and errors return HTTP 400 with an `errors` object, e.g.:
```json
{ "errors": { "price": "Price cannot be negative." } }
```

## 3. Frontend setup (React)

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will run at `http://localhost:5173` and proxies `/api` requests to the Flask backend on port 5000 (see `vite.config.js`), so no CORS configuration is needed in development beyond what's already set up.

## Features

- **List** all products in a responsive ledger-style table (collapses to cards on mobile).
- **Add** a product via a validated form (name, code, price, category).
- **Edit** a product inline — the form switches to "edit mode" and pre-fills values.
- **Delete** a product with a confirmation dialog to prevent accidental removal.
- **Validation**: required fields, numeric/non-negative price, code format, max lengths — enforced on both the client (instant feedback) and server (source of truth).
- Toast notifications for success/error feedback, graceful loading and empty/error states.

## Notes

- CORS is enabled on the Flask app (`flask-cors`) so the frontend can also be pointed at the API directly (e.g. `VITE` dev server on a different port) if you change the proxy setup.
- Product `code` is enforced unique at the database level; attempting to create/update to a duplicate code returns HTTP 409.
