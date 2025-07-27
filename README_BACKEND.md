# BazaarBandhu Backend API

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.0.0
- MongoDB (local or cloud)
- npm or yarn

### Environment Setup

1. **Create `.env` file in the server directory:**
```bash
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/bazaarbandhu
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/bazaarbandhu

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Optional: Email Service (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Optional: SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Installation & Running

1. **Install dependencies:**
```bash
cd server
npm install
```

2. **Start the server:**
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

3. **Seed the database (optional):**
```bash
npm run seed
```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user (vendor or supplier)

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91-9876543210",
  "userType": "vendor", // or "supplier"
  "businessName": "John's Food Stall",
  "address": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "userType": "vendor",
    "businessName": "John's Food Stall"
  }
}
```

#### POST `/api/auth/login`
Login with email and password

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "userType": "vendor",
    "businessName": "John's Food Stall"
  }
}
```

### Vendor Endpoints

#### GET `/api/vendors/profile`
Get vendor profile (requires authentication)

**Headers:**
```
Authorization: Bearer jwt_token_here
```

#### PUT `/api/vendors/profile`
Update vendor profile (requires authentication)

#### GET `/api/vendors/analytics`
Get vendor analytics (requires authentication)

### Supplier Endpoints

#### GET `/api/suppliers`
Get all suppliers with filters

**Query Parameters:**
- `category`: Product category filter
- `pincode`: Location filter
- `radius`: Delivery radius filter
- `minRating`: Minimum rating filter
- `limit`: Number of results (default: 20)
- `page`: Page number (default: 1)

#### GET `/api/suppliers/:id`
Get specific supplier details

#### PUT `/api/suppliers/profile`
Update supplier profile (requires authentication)

### Order Endpoints

#### POST `/api/orders`
Create new order (requires authentication)

**Request Body:**
```json
{
  "supplierId": "supplier_id",
  "items": [
    {
      "name": "Onions",
      "quantity": 5,
      "unit": "kg",
      "pricePerUnit": 88
    }
  ],
  "deliveryAddress": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "UPI",
  "specialInstructions": "Fresh vegetables only"
}
```

#### GET `/api/orders`
Get user's orders (requires authentication)

#### GET `/api/orders/:id`
Get specific order details (requires authentication)

### Search Endpoints

#### GET `/api/search/products`
Search products across suppliers

**Query Parameters:**
- `query`: Search term
- `category`: Product category
- `maxPrice`: Maximum price filter
- `minRating`: Minimum rating filter
- `pincode`: Location filter

## 🔧 Database Schema

### User Model (Base)
```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  userType: String (vendor/supplier/admin),
  businessName: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  isActive: Boolean,
  isVerified: Boolean,
  rating: {
    average: Number,
    count: Number
  },
  trustScore: Number,
  lastLogin: Date,
  registrationDate: Date
}
```

### Vendor Model (extends User)
```javascript
{
  businessCategory: String,
  creditLimit: Number,
  currentCredit: Number,
  preferredSuppliers: Array,
  currentInventory: Array,
  recurringOrders: Array,
  purchaseAnalytics: Object,
  savings: Object,
  loyaltyPoints: Number
}
```

### Supplier Model (extends User)
```javascript
{
  productCategories: Array,
  deliveryRadius: Number,
  minOrderAmount: Number,
  paymentMethods: Array,
  workingHours: Object,
  products: Array,
  serviceAreas: Array,
  verificationStatus: Object
}
```

## 🔐 Security Features

- **Password Hashing**: Using bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Express rate limiter to prevent abuse
- **CORS Protection**: Configured for frontend domain
- **Helmet**: Security headers middleware
- **Input Validation**: Request body validation
- **Error Handling**: Comprehensive error handling

## 🚀 Deployment

### Environment Variables for Production
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://yourdomain.com
```

### PM2 Deployment
```bash
# Install PM2
npm install -g pm2

# Start the application
pm2 start app.js --name "bazaarbandhu-api"

# Monitor
pm2 monit

# Logs
pm2 logs bazaarbandhu-api
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 📊 Monitoring

The API includes:
- Request logging with Morgan
- Error tracking
- Performance monitoring
- Health check endpoint (`/health`)

## 🔄 API Versioning

Current version: v1
All endpoints are prefixed with `/api`

## 📞 Support

For API support or questions:
- Check the logs for detailed error messages
- Verify your MongoDB connection
- Ensure all required environment variables are set
- Check the JWT token expiration

## 🚀 Next Steps

1. Set up your MongoDB database
2. Configure environment variables
3. Start the server
4. Test the authentication endpoints
5. Integrate with the frontend

The backend is now ready to handle real authentication and data persistence! 