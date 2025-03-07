# Authentication Module

This project implements an authentication module using **React (TypeScript) for the frontend** and **Express (TypeScript) with MySQL and JWT for the backend**.

---

## **Tech Stack**

### **Frontend:**
- React (TypeScript)
- Axios
- React Router
- Context API
- Ant Design / Tailwind CSS

### **Backend:**
- Express (TypeScript)
- JWT Authentication
- Bcrypt for password hashing
- MySQL with Sequelize ORM
- Express Validator for request validation
- CORS & Helmet for security

---

## **Project Setup**

### **1. Backend Setup**

#### **Install Dependencies**
```sh
mkdir auth-backend && cd auth-backend
npm init -y
npm install express mysql2 sequelize jsonwebtoken bcryptjs dotenv express-validator cors helmet morgan
npm install --save-dev typescript ts-node @types/express @types/jsonwebtoken @types/bcryptjs @types/cors @types/node
```

#### **Configure Environment Variables**
Create a `.env` file in the root directory:
```env
PORT=5000
DB_HOST=localhost
DB_NAME=auth_db
DB_USER=root
DB_PASSWORD=yourpassword
JWT_SECRET=your_jwt_secret_key
```

#### **Start the Server**
```sh
npx ts-node src/index.ts
```

---

### **2. Frontend Setup**

#### **Install Dependencies**
```sh
mkdir auth-frontend && cd auth-frontend
npx create-react-app . --template typescript
npm install axios react-router-dom @types/react-router-dom
```

#### **Run the Frontend**
```sh
npm start
```

---

## **API Endpoints**

### **Auth Routes**
| Method | Endpoint | Description |
|--------|-------------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate user & return JWT token |

---

## **Features**
- User registration with hashed passwords
- Secure authentication using JWT
- Middleware for protected routes
- Role-based authentication (optional)
- Frontend login and protected dashboard

---

## **Folder Structure**

### **Backend (`auth-backend/`)**
```
/auth-backend
├── src
│   ├── config/
│   │   ├── database.ts
│   ├── models/
│   │   ├── User.ts
│   ├── routes/
│   │   ├── auth.ts
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   ├── index.ts
├── .env
├── package.json
```

### **Frontend (`auth-frontend/`)**
```
/auth-frontend
├── src
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── App.tsx
├── package.json
