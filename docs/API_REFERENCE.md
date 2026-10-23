# API Reference & Endpoints

Typst Studio exposes a set of REST endpoints for document compilation, asset management, and project lifecycle persistence.

---

## 1. Document Compilation & PDF Export

### `POST /api/export`
Compiles a complete `TypstDocument` AST into a native vector PDF using the Typst CLI.

#### Request Headers
```http
Content-Type: application/json
```

#### Request Payload
```json
{
  "document": {
    "id": "doc-uuid-1234",
    "title": "Quarterly Technical Review",
    "page": {
      "paper": "a4",
      "orientation": "portrait",
      "margins": { "top": 2.5, "bottom": 2.5, "left": 2.5, "right": 2.5 }
    },
    "theme": {
      "palette": "blue",
      "fontFamily": "Liberation Sans"
    },
    "blocks": [
      {
        "id": "block-1",
        "type": "heading",
        "content": "Quarterly Technical Review",
        "metadata": { "level": 1 }
      }
    ]
  }
}
```

#### Response Headers
```http
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="Quarterly_Technical_Review.pdf"
```

#### Example Usage (cURL)
```bash
curl -X POST http://localhost:3000/api/export \
  -H "Content-Type: application/json" \
  -d @document.json \
  --output report.pdf
```

---

## 2. Media & Asset Uploads

### `POST /api/upload`
Uploads local images and media assets for inclusion in documents. Assets are saved into `/public/uploads/` and resolved during native compilation.

#### Request Headers
```http
Content-Type: multipart/form-data
```

#### Form Fields
- `file`: Binary image file (`image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`).
- Maximum file size: **10 MB**.

#### Response Payload (`201 Created`)
```json
{
  "success": true,
  "url": "/uploads/1740000000-diagram.png",
  "filename": "diagram.png",
  "size": 142850
}
```

---

## 3. Project Management

### `GET /api/projects`
Retrieves a list of all saved document projects with metadata and timestamps.

#### Response Payload (`200 OK`)
```json
[
  {
    "id": "cm0a1b2c3d4e",
    "title": "System Architecture v2",
    "description": "Core microservices and event flow",
    "createdAt": "2026-10-22T21:00:00.000Z",
    "updatedAt": "2026-10-23T01:00:00.000Z"
  }
]
```

---

### `POST /api/projects`
Creates and stores a new document project in SQLite via Prisma.

#### Request Payload
```json
{
  "title": "New System Brief",
  "description": "Draft specification",
  "document": { ... }
}
```

#### Response Payload (`201 Created`)
```json
{
  "id": "cm0a9z8y7x6w",
  "title": "New System Brief",
  "createdAt": "2026-10-23T01:15:00.000Z"
}
```

---

### `GET /api/projects/[id]`
Fetches the full document AST and state for a specific project ID.

---

### `PUT /api/projects/[id]`
Updates an existing project's metadata or document block tree.

---

### `DELETE /api/projects/[id]`
Permanently deletes a saved project.
