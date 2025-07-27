# 🚀 BazaarBandhu Quick Start Guide

Get the platform running in 5 minutes for testing and development!

## ⚡ Quick Setup (No API Keys Required)

### 1. Install Dependencies
```bash
# Run the setup script
./setup.bat

# Or manually install
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

### 2. Start MongoDB
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

### 3. Seed Database
```bash
cd server
npm run seed
```

### 4. Start Development Servers
```bash
# Terminal 1 - Start server
cd server
npm run dev

# Terminal 2 - Start client
cd client
npm run dev
```

### 5. Access the Platform
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **API Docs**: http://localhost:5000/api

## 🔐 Test Credentials

### Supplier Account
- **Email**: rajesh@freshfarms.com
- **Password**: password123
- **Features**: Product management, order processing, analytics

### Vendor Account
- **Email**: suresh@streetfood.com
- **Password**: password123
- **Features**: Order placement, supplier discovery, payment

## 🎯 Test Features

### 1. Supplier Registration
- Visit: http://localhost:5173/supplier-registration
- Complete the 3-step registration process
- OTP verification (simulated)
- Business details and service configuration

### 2. Service Dashboard
- Login as supplier
- Access: http://localhost:5173/service-dashboard
- Manage products, view orders, analytics
- Real-time notifications

### 3. Bazaar Marketplace
- Login as vendor
- Access: http://localhost:5173/bazaar
- Browse products from suppliers
- Add to cart and checkout
- Payment simulation with Razorpay

### 4. Order Tracking
- Place an order in the bazaar
- Track delivery with Google Maps integration
- Real-time status updates
- Driver communication

### 5. AI Chatbot
- Access: http://localhost:5173/assistant
- Chat with Hugging Face AI
- Voice commands (simulated)
- Multi-language support

## 🔧 Development Mode Features

### Mock Data Available
- **3 Suppliers** with products and ratings
- **2 Vendors** with purchase history
- **Sample Orders** with tracking data
- **Analytics** with realistic metrics

### Simulated Services
- **SMS OTP**: Simulated Twilio responses
- **Payment Processing**: Mock Razorpay integration
- **Email Notifications**: Console logging
- **Google Maps**: Static map with sample coordinates

## 📱 Key Features to Test

### Supplier Features
- ✅ Multi-step registration with OTP
- ✅ Product catalog management
- ✅ Order processing and status updates
- ✅ Analytics dashboard
- ✅ Real-time notifications

### Vendor Features
- ✅ Supplier discovery and browsing
- ✅ Shopping cart functionality
- ✅ Payment processing
- ✅ Order tracking
- ✅ Rating and reviews

### Platform Features
- ✅ Responsive design
- ✅ Real-time updates
- ✅ Role-based access control
- ✅ Search and filtering
- ✅ Analytics and reporting

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongo --eval "db.runCommand('ping')"

# Start MongoDB if not running
mongod
```

#### Port Already in Use
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

#### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables
Create `.env` files with minimal configuration:

#### Root `.env`
```env
MONGODB_URI=mongodb://localhost:27017/bazaarbandhu
JWT_SECRET=dev_secret_key
REACT_APP_GOOGLE_MAPS_API_KEY=your-key-here
```

#### Server `.env`
```env
MONGODB_URI=mongodb://localhost:27017/bazaarbandhu
JWT_SECRET=dev_secret_key
```

## 🚀 Production Deployment

### Required API Keys
1. **Google Maps API Key**
   - Enable: Maps JavaScript API, Geocoding API
   - Set billing account

2. **Twilio Account**
   - Get Account SID and Auth Token
   - Purchase phone number

3. **Razorpay Account**
   - Get Key ID and Secret
   - Configure webhooks

4. **Hugging Face API Key**
   - Create account and get API key

5. **Email Service**
   - Gmail or other SMTP service
   - App password for authentication

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secure-jwt-secret
# Add all API keys...
```

## 📊 Database Schema

### Collections
- **users**: Base user data with discriminator
- **suppliers**: Extended supplier information
- **vendors**: Extended vendor information
- **orders**: Complete order lifecycle
- **products**: Supplier product catalog
- **ratings**: User reviews and ratings

### Sample Data
- 3 suppliers with 8+ products
- 2 vendors with purchase history
- 2 sample orders with tracking
- Realistic analytics and metrics

## 🎯 Next Steps

1. **Test All Features**: Go through each user flow
2. **Customize Data**: Modify seed data for your use case
3. **Add API Keys**: Integrate real services
4. **Deploy**: Set up production environment
5. **Scale**: Add more features and optimizations

## 📞 Support

- **Documentation**: Check README.md for detailed setup
- **Issues**: Report bugs on GitHub
- **Questions**: Contact the development team

---

**🎉 You're ready to explore BazaarBandhu! Start with supplier registration or vendor login to see the platform in action.** 