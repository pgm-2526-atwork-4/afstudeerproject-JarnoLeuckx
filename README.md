# afstudeerproject-JarnoLeuckx


## 1. Project Summary

Social Drive is a web platform for accessible and supportive transport services. The system supports three roles:

- customer: request rides, view quotes, and sign quotes digitally
- driver: manage availability and accept/reject/complete rides
- admin: manage planning, prepare/send quotes, and follow up in Filament

## 2. Problem Statement

The organization needs one central digital platform to:

- process ride requests in a structured way
- match drivers and availability efficiently
- provide fast and transparent price quotes to customers
- digitize administrative steps (including digital signature)

## 3. Project Goals

- digitize operational planning
- improve communication between customer, driver, and admin
- reduce manual work and human error
- provide a transparent quote process with PDF generation and digital signing

## 4. Core Functionalities

### Authentication and Roles

- registration/login with API token authentication
- role-based access: customer, driver, admin
- profile management and notification preferences

### Customer Portal

- submit ride requests
- view own rides and statuses
- check available drivers for a selected time slot
- view personal quotes
- digitally sign quotes

### Driver Portal

- create/delete availability slots
- view personal ride list and schedule
- accept, reject, and complete assigned rides

### Admin Portal (Filament)

- centralized follow-up of contact and quote requests
- prepare quote draft, preview PDF, and send quote
- status management and filtering
- monitor signed quotes


## 5. Architecture

- frontend: React + TypeScript + Vite
- backend: Laravel 12 (REST API)
- admin panel: Filament v3
- API auth: Laravel Sanctum
- PDF generation: Dompdf (server-side) and jsPDF (client-side download)
- database: MariaDB
- local environment: DDEV

## 6. Technology Stack

| Domain    | Technology                               |
| --------- | ---------------------------------------- |
| Frontend  | React 19, TypeScript, Vite, React Router |
| Backend   | Laravel 12, PHP 8.2                      |
| Admin     | Filament 3                               |
| Auth      | Laravel Sanctum                          |
| PDF       | barryvdh/laravel-dompdf, jsPDF           |
| Signature | react-signature-canvas                   |
| Styling   | Tailwind CSS                             |
| Local Dev | DDEV                                     |

## 7. Key Modules and Files

### Backend

- API routes: [backend/routes/api.php](backend/routes/api.php)
- Web routes: [backend/routes/web.php](backend/routes/web.php)
- Ride model: [backend/app/Models/Ride.php](backend/app/Models/Ride.php)
- Contact/Quote model: [backend/app/Models/ContactRequest.php](backend/app/Models/ContactRequest.php)
- Filament quote resource: [backend/app/Filament/Resources/ContactRequestResource.php](backend/app/Filament/Resources/ContactRequestResource.php)

### Frontend

- App entry point: [frontend/src/main.tsx](frontend/src/main.tsx)
- Customer account page: [frontend/src/pages/CustomerAccount.tsx](frontend/src/pages/CustomerAccount.tsx)
- Quote API client: [frontend/src/lib/quote.api.ts](frontend/src/lib/quote.api.ts)
- Quote PDF generation: [frontend/src/lib/quote.ts](frontend/src/lib/quote.ts)



## 9. Security and Access Control

- API secured with Sanctum tokens
- role-based middleware for customer and driver endpoints
- admin features protected by Filament authentication
- quote signing allowed only for the quote owner

## 10. Setup and Run (DDEV)

### Backend (inside DDEV)

1. Start environment

- ddev start

2. Install PHP dependencies

- ddev composer install

3. Prepare environment and run migrations

- ddev exec php artisan key:generate
- ddev exec php artisan migrate

4. Run backend services when needed

- ddev exec php artisan queue:listen --tries=1 --timeout=0

### Frontend

1. Install dependencies

- cd frontend
- npm install

2. Start development server

- npm run dev

3. Production build

- npm run build

### Testing

- backend tests: ddev exec php artisan test

## 11. Result and Added Value

- end-to-end digital flow from request to signed quote
- stronger operational follow-up through admin dashboard
- clearer communication with customers
- scalable foundation for future expansion (reporting, extra services, analytics)

