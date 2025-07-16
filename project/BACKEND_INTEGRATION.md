# Backend Integration Guide

This document outlines how to integrate this frontend with a backend API.

## API Endpoints Needed

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Dashboard Statistics
- `GET /api/dashboard/stats` - Get overview statistics
- `GET /api/dashboard/charts` - Get chart data

### Users Management
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Regional Data
- `GET /api/regions` - Get regional statistics
- `GET /api/regions/:id/users` - Get users by region

### Power Distribution
- `GET /api/power/distribution` - Get power distribution data
- `GET /api/power/tension` - Get tension/voltage data

### Reading Methods
- `GET /api/readings/methods` - Get reading methods statistics
- `GET /api/readings/history` - Get reading history

## Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  region: string;
  segment: string;
  phase: '1-phase' | '3-phase';
  createdAt: string;
  updatedAt: string;
}
```

### Dashboard Stats
```typescript
interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  alertCases: number;
}
```

### Chart Data
```typescript
interface ChartData {
  powerDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  regionalData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  readingMethods: Array<{
    name: string;
    value: number;
  }>;
}
```

## Environment Variables

Create a `.env` file with:

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=PowerFlow Analytics
```

## API Integration Examples

### Fetching Dashboard Data
```typescript
const fetchDashboardStats = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard/stats`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
  }
};
```

### User Authentication
```typescript
const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

## State Management

Consider using:
- **React Context** for simple state management
- **Redux Toolkit** for complex state management
- **React Query/TanStack Query** for server state management

## Security Considerations

1. **Authentication**: Implement JWT tokens or session-based auth
2. **Authorization**: Role-based access control
3. **CORS**: Configure proper CORS settings
4. **Input Validation**: Validate all user inputs
5. **Rate Limiting**: Implement API rate limiting

## Recommended Backend Technologies

- **Node.js** with Express.js
- **Python** with FastAPI or Django
- **Java** with Spring Boot
- **C#** with ASP.NET Core
- **Go** with Gin or Echo

## Database Schema Suggestions

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  region VARCHAR(100),
  segment VARCHAR(100),
  phase VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Regions Table
```sql
CREATE TABLE regions (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE,
  user_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Next Steps

1. Set up your preferred backend framework
2. Create the database schema
3. Implement the API endpoints
4. Add authentication middleware
5. Connect the frontend to your API
6. Test the integration
7. Deploy both frontend and backend

## Support

For questions about frontend integration, refer to the component documentation in the `src/components/` directory.