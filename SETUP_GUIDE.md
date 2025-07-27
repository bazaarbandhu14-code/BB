# 🚀 BazaarBandhu Setup Guide

## Fixing the 500 Error

The 500 error you're seeing means the backend server isn't running properly. Follow these steps:

### Step 1: Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install frontend dependencies (if not done)
cd ..
npm install
```

### Step 2: Start MongoDB

You need MongoDB running. Choose one:

**Option A: Local MongoDB**
```bash
# Install MongoDB if not installed
# Then start it:
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Go to https://mongodb.com/atlas
- Create free cluster
- Get connection string
- Update the connection in server/app.js

### Step 3: Start the Server

```bash
# Start backend server
cd server
npm run dev

# In another terminal, start frontend
cd ..
npm run dev
```

### Step 4: Test the Connection

Visit these URLs to test:
- Backend: http://localhost:5000/health
- Frontend: http://localhost:3000

### Alternative: Quick Test

If you want to test without MongoDB first:

```bash
cd server
node test-server.js
```

This will start a basic server without database dependencies.

### Common Issues & Solutions

1. **Port 5000 already in use**
   ```bash
   # Kill process on port 5000
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

2. **MongoDB not running**
   - Install MongoDB: https://docs.mongodb.com/manual/installation/
   - Or use MongoDB Atlas cloud service

3. **Dependencies not installed**
   ```bash
   cd server
   npm install
   ```

4. **Environment variables missing**
   - The server now has default values
   - Create `.env` file in server directory if needed

### Environment Variables (Optional)

Create `server/.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/bazaarbandhu
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Testing the API

Once server is running, test with curl:
```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/test
```

### Next Steps

1. Start MongoDB
2. Start backend server
3. Start frontend server
4. Try registration again

The 500 error should be resolved once the server is properly running! 