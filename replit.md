# Refugee Survival App

## Overview
A comprehensive Next.js application designed to help refugees survive in conflict zones. The app provides critical survival information, threat identification, and location services.

## Technology Stack
- **Framework**: Next.js 16.0.7 with React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Language**: TypeScript

## Project Structure
```
app/
├── admin/              # Admin dashboard pages
├── api/
│   └── geocode/       # Geocoding API using OpenStreetMap Nominatim
├── checklist/         # Survival checklist feature
├── guides/            # Survival guides
├── identifier/        # Identification tools
├── offline/           # Offline functionality
├── threats/           # Threat identification
├── victim-identification/  # Victim ID tools
├── globals.css        # Global styles
├── layout.tsx         # Root layout
└── page.tsx           # Home page

components/            # Reusable React components
lib/                  # Utility functions and helpers
public/               # Static assets
```

## Key Features
- Multiple specialized pages for refugee survival scenarios
- Geocoding API with fallback database for location services
- Offline functionality for areas with limited connectivity
- Threat identification and victim identification tools
- Admin dashboard for management
- Survival checklists and guides

## Development

### Running the App
The Next.js development server is configured to run on port 5000:
```bash
npm run dev
```
The app will be available at `http://0.0.0.0:5000`

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Configuration

### Next.js Config
The app is configured with:
- TypeScript build error ignoring (for development speed)
- Unoptimized images (for faster development)

### Environment
The development server binds to `0.0.0.0:5000` to work properly with the Replit proxy environment.

## API Routes

### Geocoding API
- **Endpoint**: `/api/geocode`
- **Provider**: OpenStreetMap Nominatim API
- **Fallback**: Database storage for offline capability

## Deployment
Configured for autoscale deployment suitable for stateless Next.js applications.

## Recent Changes
- December 7, 2024: Initial project import and setup
- Configured Next.js for Replit environment
- Set up development workflow on port 5000
- Configured deployment settings

## Notes
- The app is designed to work in challenging environments with limited connectivity
- Offline functionality is a key priority
- All sensitive location data uses fallback databases for privacy and reliability
