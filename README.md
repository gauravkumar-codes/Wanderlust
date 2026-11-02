# 🌍 Wanderlust

> A full-stack vacation-rental and travel-listing platform where users can discover destinations, host their own listings, review stays, and explore locations on an interactive map.

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-9.x-880000)
![EJS](https://img.shields.io/badge/EJS-Templates-B4CA65)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-GL_JS-000000?logo=mapbox&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Images-3448C5?logo=cloudinary&logoColor=white)

---

## 📑 Table of Contents

- [Live Demo](#-live-demo)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#️-architecture)
- [Project Structure](#-project-structure)
- [Data Models](#-data-models)
- [API Routes](#-api-routes)
- [Getting Started](#️-getting-started)
- [Environment Variables](#-environment-variables)
- [Seeding the Database](#-seeding-the-database)
- [Authentication and Authorization](#-authentication-and-authorization)
- [Validation and Error Handling](#-validation-and-error-handling)
- [Deployment](#-deployment)
- [Security Notes](#-security-notes)
- [Future Improvements](#-future-improvements)
- [Key Learnings](#-key-learnings)
- [Author](#-author)

---

## 🔗 Live Demo

| | Link |
|---|---|
| 🚀 **Live Website** | https://wanderlust-project-rgiu.onrender.com |
| 💻 **GitHub Repository** | https://github.com/gauravkumar-codes/wanderlust |

> ⏳ The app is hosted on a free Render instance, so the first request after a period of inactivity may take a few seconds while the server wakes up.

---

## 📸 Screenshots

### 🏠 Explore Destinations
Browse destinations with pricing, location details, category filters, and search.

<p align="center">
  <img src="./screenshots/home.png" width="90%" alt="Wanderlust Home Page">
</p>

### ✨ User Signup
Create an account to unlock hosting and reviewing features.

<p align="center">
  <img src="./screenshots/sign-up.png" width="90%" alt="Wanderlust Signup Page">
</p>

### 🔐 User Login
Registered users can securely log in and are redirected back to the page they originally requested.

<p align="center">
  <img src="./screenshots/log-in.png" width="90%" alt="Wanderlust Login Page">
</p>

### 🏡 Listing Details
View the full description, price per night, category, location, host, and reviews.

<p align="center">
  <img src="./screenshots/listing-details.png" width="90%" alt="Listing Details">
</p>

### ⭐ Reviews and Location Map
Rate listings, leave reviews, and view the destination on an interactive Mapbox map.

<p align="center">
  <img src="./screenshots/reviews.png" width="90%" alt="Reviews and Map">
</p>

### ➕ Create a New Listing
Logged-in users can add new destinations with an image upload.

<p align="center">
  <img src="./screenshots/add-new-listing.png" width="90%" alt="Add new listing">
</p>

### ✏️ Edit a Listing
Owners can update the details or replace the image of their listings.

<p align="center">
  <img src="./screenshots/edit-listing.png" width="90%" alt="Edit listing">
</p>

---

## 🚀 Features

### 🏠 Listings
- Browse all travel and accommodation listings, **paginated** (12 per page)
- View detailed information about each destination
- Create, edit, and delete listings (owner only for edit/delete)
- Upload listing images, stored on **Cloudinary**
- Image uploads are limited to **PNG / JPG / JPEG / WEBP, max 5 MB**; replaced or deleted listings also remove their image from Cloudinary
- Deleting a listing automatically removes all of its reviews

### 🔎 Search and Categories
- Search by **title, location, country, or category** (case-insensitive, special characters are escaped)
- Filter by **11 categories**: Trending, Rooms, Cities, Mountains, Castles, Pools, Camping, Deserts, Arctic, Beaches, Boats

### 👤 Authentication
- Sign up, log in, and log out using **Passport.js** (Local Strategy)
- Passwords are salted and hashed by `passport-local-mongoose`
- Sessions stored in MongoDB via `connect-mongo` and kept for 7 days
- Post-login redirect to the page the user was trying to visit
- Login and signup are **rate limited** (10 attempts per IP per 15 minutes)

### ⭐ Reviews and Ratings
- Add a comment with a **1–5 star** rating
- View reviews along with the author's name
- Delete your own reviews

### 🗺️ Maps and Location
- Location text is **geocoded to coordinates** with the Mapbox Geocoding API when a listing is created or updated; unknown locations show a friendly error instead of crashing
- Each listing page shows an interactive **Mapbox GL JS** map with a marker and popup

### 🔐 Authorization
- Only logged-in users can create listings and reviews
- Only the **listing owner** can edit or delete a listing
- Only the **review author** can delete a review

### 💬 User Experience
- Flash messages for success and error feedback
- Client-side form validation using Bootstrap's validation styles
- Custom error page for 404s and server errors
- Server-side rendered, Bootstrap-based responsive layout

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | HTML, CSS, JavaScript, EJS, EJS-Mate, Bootstrap 5, Font Awesome |
| **Backend** | Node.js, Express.js 5 |
| **Database** | MongoDB Atlas, Mongoose |
| **Authentication** | Passport.js, passport-local, passport-local-mongoose |
| **Sessions** | express-session, connect-mongo, connect-flash |
| **File Uploads** | Multer, multer-storage-cloudinary, Cloudinary |
| **Maps** | Mapbox GL JS, Mapbox Geocoding SDK |
| **Validation** | Joi |
| **Utilities** | method-override, dotenv |

---

## 🏗️ Architecture

Wanderlust follows the **MVC (Model–View–Controller)** pattern with server-side rendering.

```text
Browser
   │
   ▼
Express App (app.js)
   │
   ├── Session / Passport / Flash middleware
   │
   ├── Routes ──► Middleware (auth, ownership, validation) ──► Controllers
   │                                                              │
   │                                                              ▼
   │                                                  Mongoose Models ──► MongoDB Atlas
   │                                                              │
   │                                          Mapbox (geocoding) / Cloudinary (images)
   ▼
EJS Views (rendered HTML) ──► Browser
```

### Application Workflow

```text
Visitor
  │
  ├─► Browse / Search / Filter listings
  │
  ├─► Open a listing ─► see details, reviews, and map
  │
  └─► Sign up / Log in
         │
         ├─► Create a listing (image upload + geocoding)
         ├─► Edit / Delete own listings
         └─► Add / Delete own reviews
```

---

## 📂 Project Structure

```text
Wanderlust/
│
├── controllers/
│   ├── listings.js        # Listing CRUD, search and category filtering
│   ├── reviews.js         # Create / delete reviews
│   └── users.js           # Signup, login, logout
│
├── models/
│   ├── listings.js        # Listing schema (+ cascade delete of reviews)
│   ├── reviews.js         # Review schema
│   └── users.js           # User schema (passport-local-mongoose)
│
├── routes/
│   ├── listings.js        # /listings routes
│   ├── reviews.js         # /listings/:id/reviews routes
│   └── user.js            # /signup, /login, /logout
│
├── views/
│   ├── includes/          # navbar, footer, flash messages
│   ├── layouts/           # boilerplate layout
│   ├── listings/          # index, show, new, edit
│   ├── users/             # login, signup
│   └── error.ejs
│
├── public/
│   ├── css/               # style.css, rating.css
│   └── js/                # script.js (form validation), map.js (Mapbox)
│
├── utils/
│   ├── wrapAsync.js       # Async error wrapper
│   └── ExpressError.js    # Custom error class
│
├── init/
│   ├── data.js            # Sample listings
│   └── index.js           # Database seeding script
│
├── screenshots/
├── app.js                 # App entry point
├── middleware.js          # Auth, ownership and validation middleware
├── schema.js              # Joi validation schemas
├── cloudConfig.js         # Cloudinary + Multer storage config
├── package.json
└── README.md
```

---

## 🗃️ Data Models

### Listing
| Field | Type | Notes |
|---|---|---|
| `title` | String | Required |
| `description` | String | |
| `image` | `{ filename, url }` | Cloudinary image, with a default fallback |
| `price` | Number | Price per night |
| `location` | String | Geocoded on create/update |
| `country` | String | |
| `geometry` | GeoJSON `Point` | `[longitude, latitude]` from Mapbox |
| `category` | String (enum) | One of the 11 categories |
| `reviews` | `[ObjectId → Review]` | |
| `owner` | `ObjectId → User` | |

### Review
| Field | Type | Notes |
|---|---|---|
| `comment` | String | |
| `rating` | Number | 1 to 5 |
| `createdAt` | Date | |
| `author` | `ObjectId → User` | |

### User
| Field | Type | Notes |
|---|---|---|
| `email` | String | Required |
| `username` / `hash` / `salt` | — | Added by `passport-local-mongoose` |

---

## 🔌 API Routes

### Listings
| Method | Route | Description | Access |
|---|---|---|---|
| GET | `/listings` | All listings (supports `?category=`, `?search=` and `?page=`) | Public |
| GET | `/listings/new` | New listing form | Logged in |
| POST | `/listings` | Create a listing | Logged in |
| GET | `/listings/:id` | Listing details, reviews and map | Public |
| GET | `/listings/:id/edit` | Edit form | Owner |
| PUT | `/listings/:id` | Update a listing | Owner |
| DELETE | `/listings/:id` | Delete a listing | Owner |

### Reviews
| Method | Route | Description | Access |
|---|---|---|---|
| POST | `/listings/:id/reviews` | Add a review | Logged in |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete a review | Review author |

### Users
| Method | Route | Description |
|---|---|---|
| GET / POST | `/signup` | Signup form / register |
| GET / POST | `/login` | Login form / authenticate |
| GET | `/logout` | Log out |

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v22 or later
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or local MongoDB)
- A [Cloudinary](https://cloudinary.com/) account
- A [Mapbox](https://www.mapbox.com/) account and access token

### 1️⃣ Clone the repository
```bash
git clone https://github.com/gauravkumar-codes/wanderlust-vacation-rental-website.git
cd wanderlust-vacation-rental-website
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure environment variables
Create a `.env` file in the project root (see [Environment Variables](#-environment-variables)).

### 4️⃣ Start the server
```bash
npm start
```
Or with auto-reload (Node 22+):
```bash
npm run dev
```

### 5️⃣ Open the app
```text
http://localhost:8080
```
(or the port set in the `PORT` environment variable)

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
ATLASDB_URL=your_mongodb_connection_string

# Session
SESSION_SECRET=your_long_random_secret

# Optional: server port (defaults to 8080) and environment
PORT=8080
NODE_ENV=development

# Mapbox
MAP_TOKEN=your_mapbox_access_token

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

| Variable | Purpose |
|---|---|
| `ATLASDB_URL` | MongoDB connection string (also used by the session store) |
| `SESSION_SECRET` | Secret used to sign session cookies |
| `PORT` | *(optional)* Port to listen on, defaults to `8080` |
| `NODE_ENV` | Set to `production` in deployment (enables secure cookies and proxy trust) |
| `MAP_TOKEN` | Mapbox token for geocoding and map rendering |
| `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET` | Cloudinary credentials for image uploads |

> The app checks the six required variables at startup and exits with a clear message if any are missing.

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`. Do not share it in zip files or screenshots.

---

## 🌱 Seeding the Database

A seed script with sample listings is provided in `init/`.

```bash
node init/index.js
```

> **Note:** The script connects to a **local** MongoDB (`mongodb://localhost:27017/wanderlust`), **deletes all existing listings**, and assigns every sample listing to a hard-coded owner ID. Create a user first, then update the `owner` ID in `init/index.js` to match, and point `MONGO_URL` at your own database if needed. Sample entries in `init/data.js` also need `geometry` and `category` values to satisfy the schema.

---

## 🔐 Authentication and Authorization

Authentication is handled by **Passport.js** with the local strategy and `passport-local-mongoose`.

| Middleware | Purpose |
|---|---|
| `isLoggedIn` | Blocks unauthenticated users and remembers the requested URL |
| `saveRedirectUrl` | Restores the original URL after login |
| `isOwner` | Allows only the listing owner to edit or delete |
| `isReviewAuthor` | Allows only the review author to delete a review |
| `validateListing` | Validates listing data using Joi |
| `validateReview` | Validates review data using Joi |

---

## ✅ Validation and Error Handling

- **Joi schemas** (`schema.js`) validate listing and review input on the server.
- **Bootstrap validation** (`public/js/script.js`) validates forms on the client.
- **`wrapAsync`** forwards async errors to the central error handler.
- **`ExpressError`** carries a status code and message.
- A catch-all route returns a **404 Page Not Found**, and all errors render `error.ejs`.

---

## ☁️ Deployment

The project is deployed on **Render**.

1. Push the repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com/) and connect the repo.
3. Set the build command to `npm install` and the start command to `npm start`.
4. Add all [environment variables](#-environment-variables) in the Render dashboard, plus `NODE_ENV=production`.
5. In MongoDB Atlas, allow Render's IP addresses under **Network Access**.

---

## 🛡️ Security Notes

Built-in protections:

- Session cookies are `httpOnly`, `sameSite=lax`, and `secure` in production; unauthenticated visitors don't get a stored session
- Login and signup are rate limited per IP
- Search input is regex-escaped and query parameters are type-checked
- Listing updates only accept whitelisted fields (no mass assignment)
- Uploads are limited by type and size; invalid submissions don't leave orphaned images on Cloudinary
- Basic security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`) and `x-powered-by` is disabled
- Unexpected errors are logged on the server and shown to users as a generic message

Recommended next steps before heavy production use: add `helmet` with a CSP that allows Mapbox and the CDNs, CSRF protection, and a shared rate-limit store if you run more than one instance.

---

## 🎯 Future Improvements

- 🔍 Combined search, category, price and rating filters with sorting
- 📅 Online booking with availability calendar
- 💳 Payment integration
- ❤️ Wishlist / favorite listings
- 👤 User profile pages and "My Listings"
- 🖼️ Multiple images per listing
- ⭐ Average rating on listing cards
- 📍 Map view of all listings with clustering
- ✉️ Email verification and password reset
- 💬 Host–guest messaging
- 📊 Admin dashboard and moderation
- 🧪 Automated tests (Jest + Supertest)
- 📱 Further mobile responsiveness improvements

---

## 📚 Key Learnings

- Building a complete full-stack application with Node.js, Express and MongoDB
- MVC architecture and RESTful routing
- CRUD operations and Mongoose relationships (one-to-many, population, cascade delete)
- Authentication, authorization and session management with Passport.js
- Server-side rendering with EJS and layouts
- File uploads with Multer and Cloudinary
- Geocoding and interactive maps with Mapbox
- Server-side validation with Joi and centralized error handling

---

## 👨‍💻 Author

**Gaurav Kumar**
B.Tech Information Technology Student

- GitHub: [@gauravkumar-codes](https://github.com/gauravkumar-codes)

---

## ⭐ Show Your Support

If you found this project useful or interesting, please consider giving it a ⭐ on GitHub!

---

<p align="center">Built with ❤️ using Node.js, Express.js, MongoDB, and EJS · © 2026 Wanderlust</p>
