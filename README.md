# SecureSign

A document signing platform built with the MERN stack (MongoDB, Express, React, Node.js). Upload PDFs, place digital signatures, invite guests via secure links, finalize signed documents, and track every action in an audit trail.

## Features

- **Digital signatures** — Draw, type, date-stamp, or location-stamp signatures with drag-and-drop placement on PDFs
- **Server-side PDF processing** — Embeds signatures into PDFs using `pdf-lib`
- **Guest signing** — Share secure links for signers, witnesses, approvers, and viewers
- **Audit trail** — Logs uploads, views, signatures, invitations, and finalization with timestamps and IP addresses
- **Real-time updates** — Live document status via Socket.io
- **Authentication** — JWT access tokens with refresh-token rotation
- **Responsive UI** — Works on desktop and mobile, with light/dark mode

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite 7, React Router 7, Tailwind CSS 4 |
| Backend | Express 5, Mongoose, Socket.io |
| Storage | Cloudinary (PDF uploads) |
| Email | SendGrid (invitations & password reset) |
| PDF | `react-pdf` (viewer), `pdf-lib` (embedding) |
| Signatures | `react-signature-canvas`, `@dnd-kit` |

## Prerequisites

- Node.js 18+
- MongoDB (Atlas or local)
- [Cloudinary](https://cloudinary.com/) account (required for PDF storage)
- [SendGrid](https://sendgrid.com/) account (optional — emails are simulated in the console without it)

## Setup

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd My-DocuSign-Web-App
```

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

### 2. Environment configuration

**Server** — create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Public links for invitations and password reset
FRONTEND_URL=http://localhost:5173

# Cloudinary (required for PDF upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SendGrid (optional — logs to console if omitted)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email
```

**Client** — optionally create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

> If `VITE_API_URL` is not set, the client defaults to `http://localhost:5001/api`. Set it to match your server `PORT`.

### 3. Run the application

Start the backend (from `server/`):

```bash
npm run dev
```

Start the frontend (from `client/`):

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. **Create an account** — Register and you are signed in automatically.
2. **Upload a document** — Click **New Document** on the dashboard and upload a PDF.
3. **Place signatures** — Open the document, drag a signature onto the PDF or enable **Place signature** mode and click to position.
4. **Invite guests** — Use **Invite Guest** to send signing links by email.
5. **Finalize** — Click **Finish** to embed signatures and lock the document.
6. **Download** — Download the signed PDF from the document view.
7. **Audit trail** — Review all activity in the sidebar on the document page.

### Guest signing flow

Guests open the invitation link (`/sign/:token`), confirm their identity, place signatures, and finalize. A success screen lets them download the signed copy.

## Project structure

```
My-DocuSign-Web-App/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── components/      # Modals, layout, shared UI
│       ├── context/         # Auth, theme, socket providers
│       ├── pages/           # Route-level screens
│       └── services/        # Axios API client
└── server/                  # Express API
    ├── controllers/         # Business logic
    ├── models/              # Mongoose schemas
    ├── routes/              # API routes
    └── utils/               # Email, Cloudinary helpers
```

## API overview

| Route prefix | Purpose |
|-------------|---------|
| `/api/auth` | Register, login, refresh, forgot/reset password |
| `/api/docs` | Upload, list, get, invite, reject, download, delete |
| `/api/signatures` | Create, update, delete, finalize signatures |
| `/api/audit` | Audit logs per document |

## Production notes

- Set `FRONTEND_URL` to your deployed client URL so invitation and reset links are correct.
- Cloudinary credentials are required — local `server/uploads` is not used for production uploads.
- Without SendGrid keys, invitation and password-reset emails are printed to the server console instead of being sent.
