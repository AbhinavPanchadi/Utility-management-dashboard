# Deployment Guide

## Current Deployment

The application is currently deployed on Netlify at:
https://astonishing-churros-2f0bde.netlify.app

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=PowerFlow Analytics
```

For production, update the API URL to your backend server.

## Deployment Options

### 1. Netlify (Current)
- Automatic deployments from Git
- Built-in CI/CD
- Custom domains supported
- Environment variables in dashboard

### 2. Vercel
```bash
npm install -g vercel
vercel --prod
```

### 3. AWS S3 + CloudFront
1. Build the project: `npm run build`
2. Upload `dist/` folder to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain (optional)

### 4. Docker Deployment
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t powerflow-dashboard .
docker run -p 80:80 powerflow-dashboard
```

## Backend Integration

When deploying with a backend:

1. Update `VITE_API_BASE_URL` in environment variables
2. Configure CORS on your backend server
3. Set up authentication token handling
4. Configure any necessary proxy settings

## Performance Optimization

1. **Code Splitting**: Already configured with Vite
2. **Asset Optimization**: Images and assets are optimized
3. **Bundle Analysis**: Run `npm run build` to see bundle size
4. **Caching**: Configure proper cache headers

## Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **HTTPS**: Always use HTTPS in production
3. **CSP Headers**: Configure Content Security Policy
4. **API Security**: Implement proper authentication

## Monitoring

Consider adding:
- Error tracking (Sentry)
- Analytics (Google Analytics)
- Performance monitoring
- Uptime monitoring

## Troubleshooting

### Build Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist`
- Check Node.js version compatibility

### Runtime Issues
- Check browser console for errors
- Verify API endpoints are accessible
- Check network requests in browser dev tools

### Deployment Issues
- Verify build command in deployment settings
- Check environment variables are set correctly
- Ensure publish directory is set to `dist`