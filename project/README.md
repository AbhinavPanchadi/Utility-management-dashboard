# PowerFlow Analytics Dashboard

A modern React dashboard application built with TypeScript, Tailwind CSS, and Recharts.

## Features

- Responsive dashboard layout
- Interactive charts and visualizations
- User management interface
- Power distribution analytics
- Regional data visualization
- Customer segmentation analysis

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Top navigation header
│   ├── Sidebar.tsx     # Side navigation
│   ├── Dashboard.tsx   # Main dashboard layout
│   ├── StatCard.tsx    # Statistics cards
│   └── charts/         # Chart components
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## Backend Integration

This frontend is ready for backend integration. Key areas for API integration:

1. **Authentication**: User login/logout functionality
2. **Dashboard Data**: Real-time statistics and metrics
3. **Charts Data**: Dynamic chart data from APIs
4. **User Management**: CRUD operations for users
5. **Regional Data**: Geographic and regional analytics

## Deployment

The application can be deployed to various platforms:

- Netlify (current deployment)
- Vercel
- AWS S3 + CloudFront
- Any static hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.