# XTermux Toolbox

## Overview
XTermux Toolbox is a React + TypeScript web application built with Vite. It provides a toolbox interface for Termux users with features including AI chat, tools library, user guides, GitHub scripts, and architecture tools.

## Project Structure
- `/components/` - Reusable React components (Card, Header, Toast, etc.)
- `/views/` - Page components (Home, AIChat, Packages, Guides, etc.)
- `/contexts/` - React context providers (AuthContext)
- `App.tsx` - Main application component with routing
- `vite.config.ts` - Vite configuration
- `firebase.ts` - Firebase configuration

## Development

### Running the App
```bash
npm run dev
```
The development server runs on port 5000.

### Building for Production
```bash
npm run build
```
Output is generated in the `dist` directory.

## Configuration
- Vite configured for port 5000 with all hosts allowed for Replit compatibility
- TypeScript with React JSX support
- Uses Tailwind CSS via CDN

## Recent Changes
- 2025-12-31: Configured for Replit environment (port 5000, allowed hosts)
