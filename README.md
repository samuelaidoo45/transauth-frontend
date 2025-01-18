
# **TransactShield Authentication**

TransactShield Authentication is a secure authentication system designed to streamline user registration, login, and profile management. Built with modern technologies, it ensures a seamless and user-friendly experience.

---

## **Table of Contents**
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Authentication Flow](#authentication-flow)
- [Setup Instructions](#setup-instructions)
- [Hosted Links](#hosted-links)


---

## **Features**
- User Registration with secure password hashing.
- Login functionality with JWT token-based authentication.
- Protected profile route accessible only by authenticated users.
- Responsive UI designed with Tailwind CSS.

---

## **Tech Stack**
- **Frontend**: React, Next.js, Tailwind CSS
- **Authentication**: JSON Web Tokens (JWT)
- **Hosting**: Vercel 

---

## **Authentication Flow**

1. **Registration**:
   - The user submits a username, email, and password.
   - Passwords are securely hashed before storage in the database.
   - A new user record is created.

2. **Login**:
   - The user provides email and password.
   - The backend verifies the credentials and generates a JWT token upon success.
   - The token is stored in a cookie for secure communication.

3. **Protected Profile Route**:
   - The user must be authenticated to access the profile page.
   - The frontend sends the JWT token to the backend for verification.
   - Upon verification, the user's profile data is returned.

---

## **Setup Instructions**


1. **Clone the Repository**:
   ```bash
   git clone https://github.com/samuelaidoo45/transactshield-frontend.git
   cd transactshield-frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   - The frontend will be running at `http://localhost:3000`.

4. **Environment Variables**:
   - Ensure the backend URL is configured in `utils/api.js` :
     ```javascript
     const api = axios.create({
       baseURL: "http://127.0.0.1:8000",
     });
     export default api;
     ```

---

## **Hosted Link**

- **Frontend**: [https://your-frontend-link.com](https://your-frontend-link.com)

---

