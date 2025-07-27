# 🔍 Debugging 500 Error Guide

## Step-by-Step Debugging

### 1. Check Server Status
```bash
# Check if server is running
curl http://localhost:5000/health

# Check if port 5000 is in use
netstat -ano | findstr :5000
```

### 2. Test MongoDB Connection
```bash
cd server
node debug-connection.js
```

### 3. Check Server Logs
Look for these common errors:
- **MongoDB connection failed**
- **Missing dependencies**
- **Model validation errors**
- **Route handler errors**

### 4. Test Basic Server (Without Database)
```bash
cd server
node test-server.js
```

### 5. Check Dependencies
```bash
cd server
npm install
npm list --depth=0
```

## Common 500 Error Causes

### 1. MongoDB Connection Issues
- **Wrong connection string**
- **Network connectivity**
- **Authentication failed**
- **Database doesn't exist**

### 2. Missing Dependencies
- **bcryptjs not installed**
- **mongoose not installed**
- **express not installed**

### 3. Model Validation Errors
- **Invalid enum values**
- **Missing required fields**
- **Schema validation failed**

### 4. Route Handler Errors
- **Undefined variables**
- **Async/await issues**
- **Error handling problems**

## Quick Fixes

### Fix 1: Restart Server
```bash
# Kill existing process
taskkill /F /IM node.exe

# Start server
cd server
npm run dev
```

### Fix 2: Clear Node Modules
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

### Fix 3: Test Without Database
Use the test server to isolate the issue:
```bash
cd server
node test-server.js
```

### Fix 4: Check Environment Variables
Make sure these are set:
- `MONGODB_URI`
- `JWT_SECRET`
- `PORT`

## Testing Steps

1. **Test basic connectivity:**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Test registration endpoint:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
   -H "Content-Type: application/json" \
   -d '{"fullName":"Test","email":"test@test.com","password":"123456","userType":"vendor","businessName":"Test Business"}'
   ```

3. **Check browser console** for detailed error messages

## Next Steps

1. Run the debug script
2. Check server logs
3. Test with curl commands
4. Identify specific error message
5. Apply targeted fix

The 500 error will be resolved once we identify the specific cause! 