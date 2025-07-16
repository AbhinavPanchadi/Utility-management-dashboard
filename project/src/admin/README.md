# Admin Management Dashboard

A modern, responsive admin management dashboard built with React, TypeScript, and Tailwind CSS.

## Features

- **Admin Management**: Full CRUD operations for admin users
- **Role-based Access**: Support for Admin, Sub-Admin, and Analyst roles
- **Real-time Search**: Search admins by name or email
- **Role Filtering**: Filter admins by their roles
- **Status Management**: Toggle admin status (Active/Inactive)
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean design with gradient cards and smooth animations
- **Loading States**: Elegant loading and empty state designs

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool and dev server

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   └── AdminManagement.tsx    # Main admin management component
├── App.tsx                    # Root component
├── main.tsx                   # Application entry point
├── index.css                  # Global styles with Tailwind
└── vite-env.d.ts             # Vite type definitions
```

## Features Overview

### Dashboard Metrics
- Total Admins count
- Active Admins count
- Sub-Admins count
- Analysts count

### Admin Table
- Name with avatar initials
- Role with color-coded badges
- Email address
- Status toggle (Active/Inactive)
- Last login timestamp
- Edit and Delete actions

### Add/Edit Modal
- Name input field
- Email input field
- Password field with show/hide toggle
- Role dropdown selection
- Form validation

### Search & Filter
- Real-time search by name or email
- Filter by role (All, Admin, Sub-Admin, Analyst)

## Customization

### Colors
The dashboard uses a gradient color scheme that can be customized in the `MetricCard` component:
- Emerald: Total Admins
- Blue: Active Admins
- Purple: Sub-Admins
- Pink: Analysts

### Mock Data
The application uses mock data for demonstration. Replace the `mockAdmins` array in `AdminManagement.tsx` with your API calls.

### Styling
All styles are built with Tailwind CSS. You can customize the design by modifying the Tailwind classes in the components.

## Browser Support

This application supports all modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.