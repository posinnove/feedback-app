# Email Setup & Authentication System

This guide explains how to set up the email system for development and provides an overview of the authentication architecture.

## 📧 Email Setup (Ethereal)

For development, we use **Ethereal Email**, a fake SMTP service that doesn't send real emails but allows you to preview them.

### Steps:
1. Go to [Ethereal.email](https://ethereal.email/) and click **"Create Ethereal Account"**.
2. You will be provided with:
   - **Host**: `smtp.ethereal.email`
   - **User**: (e.g., `nickolas.reichel31@ethereal.email`)
   - **Pass**: (your generated password)
3. Open your `backend/.env` file and update the following variables:
   ```env
   EMAIL_USER=your_ethereal_user
   EMAIL_PASS=your_ethereal_password
   ```
4. When the app sends an email (e.g., for verification or password reset), you can view it by logging into Ethereal and checking the **"Messages"** tab.

---

## 🔐 Authentication System Overview

The project uses a secure, production-grade authentication flow.

### 1. Unified Authentication
- Both **Users** and **Companies** log in through the same endpoint (`/api/auth/login`).
- The backend identifies the account type and returns a JWT payload that includes a `type` field.

### 2. Token Management
- **Access Token**: A short-lived JWT returned in the JSON response. Used for authorizing API requests via the `Authorization: Bearer <token>` header.
- **Refresh Token**: A long-lived token stored in a **Secure, HttpOnly Cookie**.
  - **Security**: HttpOnly cookies cannot be accessed by JavaScript, protecting against XSS attacks.
  - **Persistence**: Allows users to stay logged in across sessions safely.

### 3. Protection Measures
- **Rate Limiting**: Auth routes are protected by `express-rate-limit` to prevent brute-force attacks.
- **Validation**: All inputs are strictly validated using **Zod** schemas on both the frontend and backend.
- **Error Handling**: Consistent error responses are guaranteed by a centralized backend error middleware.
