# Consent Management System

A comprehensive consent management platform that parses legal consent text, generates enforceable policies, and provides secure data access across web and mobile applications.

## Overview

This system allows users to submit consent agreements in natural language, which are then parsed, converted into machine-readable policies, and enforced during data access requests. The platform includes:

- **Backend API**: Handles consent parsing, policy generation, and access enforcement
- **Web Frontend**: React-based interface for consent submission and management
- **Mobile App**: Expo React Native application for on-the-go consent management

## Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** for data storage
- **NLP Processing** for consent text parsing
- **Policy Engine** for access control

### Frontend
- **React 19** with Create React App
- **Testing**: Jest, React Testing Library

### Mobile
- **Expo** with React Native
- **TypeScript** for type safety
- **Expo Router** for navigation

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager
- For mobile: Expo CLI and Android/iOS development environment

## Installation & Setup

### Database Setup

1. Install PostgreSQL and create a database named `consent_db`
2. Run the following SQL to create tables:

```sql
CREATE TABLE consents (
  id SERIAL PRIMARY KEY,
  original_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parsed_consents (
  id SERIAL PRIMARY KEY,
  consent_id INTEGER REFERENCES consents(id),
  data_type VARCHAR(255),
  purpose VARCHAR(255),
  expires_at TIMESTAMP
);

CREATE TABLE policies (
  id SERIAL PRIMARY KEY,
  parsed_consent_id INTEGER REFERENCES parsed_consents(id),
  effect VARCHAR(50),
  expires_at TIMESTAMP
);
```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your database configuration:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/consent_db
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000` (different port if backend is running)

### Mobile Setup

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npm start
   ```

4. Use Expo Go app on your device or run on simulator:
   - For Android: `npm run android`
   - For iOS: `npm run ios`
   - For Web: `npm run web`

## Usage

### Submitting Consent

Send a POST request to `/consent` with consent text:

```bash
curl -X POST http://localhost:3000/consent \
  -H "Content-Type: application/json" \
  -d '{"text": "I consent to the collection and processing of my personal data for marketing purposes until December 31, 2024."}'
```

Response includes parsed data, generated policy, and readable consent text.

### Accessing Protected Data

Access protected endpoints with proper consent:

```bash
curl http://localhost:3000/data/personal
```

The consent enforcer middleware will check if access is allowed based on stored policies.

## API Endpoints

### POST /consent
Submit consent text for parsing and policy generation.

**Request Body:**
```json
{
  "text": "Consent text in natural language"
}
```

**Response:**
```json
{
  "message": "Consent stored successfully",
  "parsed": {
    "data_type": "personal",
    "purpose": "marketing",
    "expires_at": "2024-12-31T23:59:59.000Z"
  },
  "policy": {
    "effect": "allow",
    "expires_at": "2024-12-31T23:59:59.000Z"
  },
  "readableConsent": "Human-readable policy text"
}
```

### GET /data/:type
Access protected data of specified type (requires valid consent).

**Response:**
```json
{
  "message": "Access granted for personal"
}
```

## Project Structure

```
consent-system/
├── backend/           # Node.js Express API
│   ├── db.js         # Database configuration
│   ├── index.js      # Main server file
│   ├── parser/       # Consent text parsing
│   ├── policy/       # Policy generation
│   ├── middleware/   # Access control middleware
│   ├── translator/   # Rule to text conversion
│   └── routes/       # API routes
├── frontend/         # React web application
│   ├── src/
│   │   ├── App.js
│   │   ├── ConsentForm.js
│   │   └── TestAccess.js
│   └── public/
└── mobile/           # Expo React Native app
    ├── app/          # App screens
    ├── components/   # Reusable components
    └── assets/       # Images and icons
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
