# Deployment Guide

## Environment Setup

### Development
```bash
# Copy environment template
cp .env.example .env

# Edit configuration
PORT=3001
CATALOG_SERVICE_URL=http://localhost:3002
NODE_ENV=development
```

### Production

1. **Set Production Environment Variables**
   ```bash
   export PORT=3001
   export CATALOG_SERVICE_URL=https://catalog-service.production.com
   export NODE_ENV=production
   ```

2. **Install Production Dependencies**
   ```bash
   npm install --production
   ```

3. **Start with Process Manager (PM2)**
   ```bash
   npm install -g pm2
   pm2 start server.js --name cart-service
   pm2 save
   pm2 startup
   ```

## Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t cart-service .
docker run -p 3001:3001 -e CATALOG_SERVICE_URL=http://catalog:3002 cart-service
```

## Health Monitoring

Monitor service health:
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "success": true,
  "message": "Cart Service is running",
  "timestamp": "2026-01-11T..."
}
```

## Scaling Considerations

- Use load balancer (nginx) for multiple instances
- Implement Redis for shared cart storage across instances
- Consider database migration for persistence
- Set up logging aggregation
- Monitor performance metrics

## Troubleshooting

**Service won't start:**
- Check if port 3001 is available
- Verify all dependencies are installed
- Check environment variables

**Catalog Service connection fails:**
- Verify CATALOG_SERVICE_URL is correct
- Check network connectivity
- Service will fallback to mock data

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure CORS policies
- [ ] Implement rate limiting
- [ ] Add authentication middleware
- [ ] Sanitize all inputs
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
