# 🧾 Invoice Generator

A full-stack invoice management web application that lets businesses create, manage, and send professional invoices with PDF export and email delivery — all from a clean, modern dashboard.

🔗 **Live Demo:** [https://invoice-generator-five-coral.vercel.app](https://invoice-generator-five-coral.vercel.app)

---

## ✨ Features

- **Authentication** — Email/password signup & login with JWT, plus **Google OAuth 2.0**
- **Forget Password** — OTP-based password reset via email (Nodemailer + Mailgen)
- **Client Management** — Add, edit, and delete clients with GST number, company details, and contact info
- **Invoice Creation** — Generate invoices with line items, quantity, unit price, tax %, and discount
- **Auto Invoice Numbering** — Sequential invoice numbers in the format `INV-YYYY-###`
- **Invoice Status Tracking** — Track invoices as `Draft`, `Pending`, `Paid`, or `Overdue`
- **PDF Export** — Download invoices as professionally formatted PDFs (powered by PDFKit)
- **Email Delivery** — Send invoices directly to clients via email
- **Dashboard Overview** — Summary stats with charts using Recharts
- **Dark / Light Mode** — Theme toggle with persistent context
- **Responsive UI** — Built with Tailwind CSS and Lucide icons

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 19 | UI framework |
| Vite | Build tool |
| React Router DOM v7 | Client-side routing |
| Tailwind CSS v4 | Styling |
| Axios | HTTP client |
| Recharts | Dashboard charts |
| React Toastify | Notifications |
| Lucide React | Icons |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express 5 | Server framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| Passport.js | Google OAuth 2.0 |
| Nodemailer + Mailgen | Email sending |
| PDFKit | PDF generation |
| cookie-parser | Cookie handling |
| dotenv | Environment config |

### Deployment
| Service | Role |
|---------|------|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |

---

## 📁 Project Structure

```
Invoice_Generator/
├── client/                        # React frontend (Vite)
│   ├── components/
│   │   ├── ThemeContext.jsx        # Dark/light mode context
│   │   └── ThemeToggle.jsx        # Theme toggle button
│   ├── routes/
│   │   └── AppRoutes.jsx          # All app routes
│   └── src/
│       ├── pages/
│       │   ├── landingPage.jsx    # Marketing landing page
│       │   ├── login.jsx          # Login page
│       │   ├── Register.jsx       # Signup page
│       │   ├── ForgetPassword.jsx # OTP password reset
│       │   └── dashboard/
│       │       ├── index.jsx              # Dashboard layout
│       │       ├── DashboardOverview.jsx  # Stats & charts
│       │       ├── clients.jsx            # Client list
│       │       ├── AddClient.jsx          # Add new client
│       │       ├── EditClient.jsx         # Edit client
│       │       ├── Invoices.jsx           # Invoice list
│       │       ├── NewInvoice.jsx         # Create invoice
│       │       ├── EditInvoiceStatus.jsx  # Update status
│       │       └── settings.jsx           # User settings
│       └── util/
│           └── axiosInstance.jsx  # Axios base config
│
└── server/                        # Express backend
    ├── Routes/
    │   ├── userRoute.js           # Auth routes (/api/v8)
    │   ├── clientRoutes.js        # Client routes (/api/v10)
    │   ├── invoiceRoute.js        # Invoice routes (/api/v12)
    │   └── DashboardRoutes.js     # Dashboard routes (/api/v13)
    ├── controller/
    │   ├── userController.js
    │   ├── clientController.js
    │   ├── invoiceController.js
    │   ├── forgetPasswordController.js
    │   └── DashboardController.js
    ├── models/
    │   ├── InvoicesModels.js
    │   └── clientModels.js
    ├── config/
    │   ├── db.js                  # MongoDB connection
    │   ├── googleConfig.js        # Passport Google OAuth
    │   ├── emailConfig.js         # Email templates
    │   └── transporter.js        # Nodemailer transporter
    ├── middleware/
    │   └── authMiddleware         # JWT verification
    └── index.js                   # App entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- A Google Cloud project with OAuth 2.0 credentials
- A Gmail account with an App Password (for email)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/invoice-generator.git
cd invoice-generator
```

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email (Gmail)
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
```

Start the backend:

```bash
npm run dev       # development (nodemon)
npm start         # production
```

### 3. Set Up the Frontend

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000
```

> The base URL is configured in `src/util/axiosInstance.jsx`. Update it if needed.

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v8/register` | Register a new user |
| POST | `/api/v8/login` | Login with email & password |
| GET | `/api/v8/auth/google` | Initiate Google OAuth |
| POST | `/api/v8/forget-password` | Send OTP to email |
| POST | `/api/v8/reset-password` | Reset password with OTP |
| GET | `/api/v10/clients` | Get all clients |
| POST | `/api/v10/clients` | Add a new client |
| PUT | `/api/v10/clients/:id` | Update a client |
| DELETE | `/api/v10/clients/:id` | Delete a client |
| GET | `/api/v12/invoices` | Get all invoices |
| POST | `/api/v12/invoices` | Create a new invoice |
| PATCH | `/api/v12/invoices/:id/status` | Update invoice status |
| GET | `/api/v12/invoices/:id/pdf` | Download invoice as PDF |
| GET | `/api/v13/dashboard` | Get dashboard stats |

---

## 📸 Screenshots

> *(Add screenshots of your landing page, dashboard, invoice creation form, and PDF preview here)*

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

---

## 👨‍💻 Author

Built with ❤️ — feel free to connect and share feedback!
