# BazaarBandhu - Complete Marketplace Platform

A comprehensive B2B marketplace platform connecting street food vendors with suppliers, featuring real-time tracking, AI chatbot, and integrated payment solutions.

## 🚀 Features

### Core Features
- **Supplier Registration & Management**: Complete supplier onboarding with OTP verification
- **Vendor Dashboard**: Order management, analytics, and supplier discovery
- **Service Dashboard**: Supplier-specific dashboard for product and order management
- **Real-time Order Tracking**: Google Maps integration for live delivery tracking
- **AI Chatbot**: Hugging Face-powered chatbot for customer support
- **Payment Integration**: Razorpay payment gateway
- **SMS Notifications**: Twilio integration for OTP and notifications
- **Rating & Reviews**: Comprehensive rating system
- **Advanced Analytics**: Business insights and performance metrics

### Technical Features
- **MongoDB Database**: Scalable NoSQL database with proper schemas
- **JWT Authentication**: Secure token-based authentication
- **Real-time Updates**: Socket.io for live notifications
- **Responsive UI**: Modern, mobile-friendly interface
- **Multi-language Support**: Internationalization ready
- **API Documentation**: Comprehensive REST API

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **React Query** for state management
- **Google Maps API** for tracking
- **Socket.io Client** for real-time features

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Twilio** for SMS services
- **Razorpay** for payments
- **Hugging Face** for AI chatbot
- **Socket.io** for real-time communication
- **Multer** for file uploads
- **Nodemailer** for email services

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB 5+
- npm or yarn
- Google Maps API Key
- Twilio Account
- Razorpay Account
- Hugging Face API Key

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/bazaarbandhu.git
cd bazaarbandhu
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Environment Setup

Create `.env` files in both root and server directories:

#### Root `.env`
```env
# Database
MONGODB_URI=mongodb://localhost:27017/bazaarbandhu

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Google Maps
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Twilio
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Hugging Face
HUGGINGFACE_API_KEY=your-huggingface-api-key

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password

# Server
PORT=5000
NODE_ENV=development
```

#### Server `.env`
```env
# Database
MONGODB_URI=mongodb://localhost:27017/bazaarbandhu

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Twilio
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Hugging Face
HUGGINGFACE_API_KEY=your-huggingface-api-key

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password

# Server
PORT=5000
NODE_ENV=development
```

### 4. Database Setup

#### Start MongoDB
```bash
# Start MongoDB service
sudo systemctl start mongod

# Or if using MongoDB Community
mongod
```

#### Seed Database
```bash
cd server
npm run seed
```

### 5. Start Development Servers

#### Option 1: Using Scripts
```bash
# Start both client and server
npm run dev

# Or start individually
npm run dev:client
npm run dev:server
```

#### Option 2: Manual Start
```bash
# Terminal 1 - Start server
cd server
npm run dev

# Terminal 2 - Start client
cd client
npm run dev
```

## 🗄️ Database Schema

### Users Collection
- Base user schema with discriminator pattern
- Supports vendors and suppliers
- Location-based indexing
- Rating and trust score tracking

### Suppliers Collection
- Extended user schema for suppliers
- Product inventory management
- Service area configuration
- Performance metrics tracking

### Vendors Collection
- Extended user schema for vendors
- Purchase analytics
- Preferred suppliers tracking
- Credit management

### Orders Collection
- Complete order lifecycle tracking
- Real-time status updates
- Payment integration
- Rating and review system

## 🔐 Authentication

### Registration Flow
1. **Phone Verification**: OTP sent via Twilio SMS
2. **Email Verification**: OTP sent via email
3. **Business Details**: Complete profile setup
4. **Document Verification**: GST, FSSAI, PAN verification
5. **Account Activation**: Manual review and approval

### Login Flow
1. **Email/Password**: Standard authentication
2. **JWT Token**: Secure token generation
3. **Role-based Access**: Vendor/Supplier specific routes
4. **Session Management**: Token refresh mechanism

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/forgot-password` - Password reset
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Suppliers
- `GET /api/suppliers` - List suppliers
- `GET /api/suppliers/:id` - Get supplier details
- `PUT /api/suppliers/profile` - Update supplier profile
- `POST /api/suppliers/products` - Manage products

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status
- `POST /api/orders/:id/rating` - Add rating

### AI Chat
- `POST /api/ai-chat/chat` - Chat with AI
- `GET /api/ai-chat/history/:sessionId` - Get chat history
- `DELETE /api/ai-chat/history/:sessionId` - Clear chat history

### Payments
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Payment history

## 🗺️ Google Maps Integration

### Features
- **Real-time Tracking**: Live delivery tracking
- **Route Optimization**: Best delivery routes
- **Geofencing**: Delivery area restrictions
- **Location Services**: Address autocomplete

### Setup
1. Get Google Maps API Key
2. Enable required APIs:
   - Maps JavaScript API
   - Geocoding API
   - Directions API
   - Places API
3. Configure billing
4. Add API key to environment variables

## 🤖 AI Chatbot (Hugging Face)

### Features
- **Intent Classification**: Automatic query understanding
- **Context Awareness**: Conversation memory
- **Multi-language Support**: Hindi, English, Marathi
- **Predefined Responses**: Common queries handling

### Setup
1. Create Hugging Face account
2. Get API key
3. Configure model preferences
4. Add API key to environment variables

## 📞 Twilio SMS Integration

### Features
- **OTP Delivery**: Secure verification codes
- **Order Notifications**: Status updates
- **Delivery Alerts**: Real-time updates
- **Multi-language SMS**: Hindi/English support

### Setup
1. Create Twilio account
2. Get Account SID and Auth Token
3. Purchase phone number
4. Configure webhook URLs
5. Add credentials to environment variables

## 💳 Razorpay Payment Integration

### Features
- **Multiple Payment Methods**: UPI, Cards, Net Banking
- **Secure Transactions**: PCI DSS compliant
- **Refund Management**: Automatic refund processing
- **Payment Analytics**: Transaction insights

### Setup
1. Create Razorpay account
2. Get API keys
3. Configure webhook URLs
4. Add credentials to environment variables

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e
```

### Test Coverage
```bash
npm run test:coverage
```

## 🚀 Deployment

### Production Build
```bash
# Build client
npm run build:client

# Build server
npm run build:server

# Start production server
npm start
```

### Environment Variables
Ensure all production environment variables are set:
- Database connection string
- API keys
- JWT secret
- Payment credentials

### Database Migration
```bash
# Run migrations
npm run migrate

# Seed production data
npm run seed:prod
```

## 📊 Monitoring & Analytics

### Application Monitoring
- **Error Tracking**: Sentry integration
- **Performance Monitoring**: New Relic
- **Log Management**: Winston logging
- **Health Checks**: API endpoints

### Business Analytics
- **Order Analytics**: Revenue tracking
- **User Analytics**: Engagement metrics
- **Supplier Performance**: Delivery metrics
- **Vendor Insights**: Purchase patterns

## 🔒 Security Features

- **JWT Authentication**: Secure token management
- **Password Hashing**: bcrypt encryption
- **Input Validation**: Zod schema validation
- **Rate Limiting**: API protection
- **CORS Configuration**: Cross-origin security
- **Helmet Security**: HTTP headers protection

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/your-username/bazaarbandhu/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/bazaarbandhu/issues)
- **Email**: support@bazaarbandhu.com
- **Phone**: +91-1800-123-4567

## 🙏 Acknowledgments

- **Google Maps API** for location services
- **Twilio** for SMS services
- **Razorpay** for payment processing
- **Hugging Face** for AI models
- **MongoDB** for database
- **React Team** for frontend framework

---

**Made with ❤️ by the BazaarBandhu Team**
