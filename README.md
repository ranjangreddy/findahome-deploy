# 🏠 Find A Home – Temporary Property Listing Platform

Find A Home is a modern full-stack web application that enables users to list and discover short-term rental properties. Built for students, interns, and working professionals in need of temporary housing solutions.

## 🚀 Live URLs

- **Frontend**: [https://findahome-six.vercel.app/]
- **Backend API**: [https://final-project-part-2-algorithm-unlocked.onrender.com]
- **Database**: [postgresql://tempnest_db_user:O20DeMIvMjISqqn3T0Tm2pW5KR0qdyRG@dpg-d02divbe5dus73bm1ma0-a.oregon-postgres.render.com/tempnest_db - DB]

- The **frontend** is hosted on **Vercel**, enabling fast static site delivery through a global CDN.  
- The **backend** is deployed on **Render**, providing robust API support, server-side business logic, and secure cookie-based authentication.

## ✨ Features

- 🔐 **Authentication**: JWT + cookie-based secure login and signup
- 🏠 **Post a Property**: Multi-step form to list entire homes or individual units
- 🌍 **Google Maps Autocomplete**: Helps users tag accurate property addresses with geolocation
- 💰 **Price & Availability**: Daily or monthly pricing model, with calendar-based availability
- 🖼️ **Image Uploads**: Supports client-side image uploads with preview and backend storage
- 📍 **Map Embeds**: Preview listing location using Google Maps
- 📦 **Preview Listing**: Sellers can review their data before publishing
- 📤 **API-first Architecture**: React frontend consumes a REST API powered by Express & Prisma
- 🧪 **Unit Tests**: Critical frontend components are covered using React Testing Library

---

## 🛠️ Tech Stack

### Frontend (Client)
- React + TypeScript
- React Router DOM
- Tailwind CSS / CSS Modules
- React Hot Toast & React Toastify
- Google Maps Places API
- React Testing Library & Jest

### Backend (API)
- Node.js with Express.js
- Prisma ORM + SQLite (local dev)
- Multer (for image upload)
- CORS, cookie-parser, and security middlewares
- Render.com for hosting backend APIs

---

## 🧪 Running Tests

To run the frontend test suite:

```bash
cd client
npx jest