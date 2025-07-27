# MongoDB Data Save Guide - BazaarBandhu

## 🚀 Overview

This guide demonstrates how to save data to MongoDB using Node.js and Express in the BazaarBandhu project.

## 📁 Files Created

1. **`server/routes/data.js`** - Complete CRUD operations for data
2. **`server/scripts/saveData.js`** - Bulk data saving script
3. **`test-data-save.js`** - Simple test script
4. **Updated `server/app.js`** - Added data routes

## 🔧 Setup

### 1. Install Dependencies
```bash
cd server
npm install axios
```

### 2. Start the Server
```bash
cd server
npm start
```

### 3. Test Data Saving
```bash
node test-data-save.js
```

## 📊 API Endpoints

### Suppliers
- `POST /api/data/supplier` - Save single supplier
- `POST /api/data/suppliers/bulk` - Save multiple suppliers
- `GET /api/data/suppliers` - Get all suppliers
- `GET /api/data/supplier/:id` - Get supplier by ID
- `PUT /api/data/supplier/:id` - Update supplier
- `DELETE /api/data/supplier/:id` - Delete supplier

### Vendors
- `POST /api/data/vendor` - Save single vendor
- `POST /api/data/vendors/bulk` - Save multiple vendors
- `GET /api/data/vendors` - Get all vendors
- `GET /api/data/vendor/:id` - Get vendor by ID
- `PUT /api/data/vendor/:id` - Update vendor
- `DELETE /api/data/vendor/:id` - Delete vendor

### Orders
- `POST /api/data/order` - Save single order
- `GET /api/data/orders` - Get all orders
- `GET /api/data/order/:id` - Get order by ID
- `PUT /api/data/order/:id/status` - Update order status
- `DELETE /api/data/order/:id` - Delete order

### Products
- `POST /api/data/supplier/:supplierId/products` - Add product to supplier

## 💾 Data Saving Examples

### 1. Save Single Supplier
```javascript
const axios = require('axios');

const supplierData = {
  fullName: 'Fresh Farm Supplies',
  email: 'freshfarm@example.com',
  phone: '+91 98765 43210',
  userType: 'supplier',
  businessName: 'Fresh Farm Supplies',
  businessType: 'Wholesaler',
  address: {
    street: '123 Farm Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    country: 'India'
  },
  productCategories: ['Vegetables', 'Fruits'],
  deliveryRadius: 15,
  minOrderAmount: 500,
  paymentMethods: ['Cash', 'UPI', 'Card'],
  workingHours: { from: '06:00', to: '20:00' },
  gstNumber: '27AABFP1234Z1Z5',
  fssaiLicense: 'FSSAI123456789',
  products: [
    {
      name: 'Fresh Tomatoes',
      category: 'Vegetables',
      unit: 'kg',
      pricePerUnit: 40,
      currentStock: 150,
      minStock: 20,
      maxStock: 500,
      quality: 'A+',
      description: 'Fresh red tomatoes from local farms',
      images: ['https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400'],
      isActive: true
    }
  ],
  verificationStatus: { documents: true, address: true, bank: true, quality: true },
  serviceAreas: [{ pincode: '400001', deliveryCharge: 50, minimumOrderForFreeDelivery: 1000 }],
  rating: { average: 4.5, count: 45 },
  trustScore: 85,
  isActive: true,
  isVerified: true,
  emailVerified: true,
  phoneVerified: true
};

const response = await axios.post('http://localhost:5000/api/data/supplier', supplierData);
console.log('Supplier saved:', response.data.supplier.id);
```

### 2. Save Single Vendor
```javascript
const vendorData = {
  fullName: 'Street Food Corner',
  email: 'streetfood@example.com',
  phone: '+91 98765 43213',
  userType: 'vendor',
  businessName: 'Street Food Corner',
  businessType: 'street_food',
  address: {
    street: '321 Food Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    country: 'India'
  },
  businessCategory: 'street_food',
  preferredSuppliers: [],
  purchaseAnalytics: {
    totalPurchases: 25000,
    monthlyAverage: 5000,
    topCategories: ['Vegetables', 'Dairy'],
    savings: 5000
  },
  savings: 5000,
  totalOrders: 25,
  totalSpent: 25000,
  rating: { average: 4.2, count: 15 },
  trustScore: 75,
  isActive: true,
  isVerified: true,
  emailVerified: true,
  phoneVerified: true
};

const response = await axios.post('http://localhost:5000/api/data/vendor', vendorData);
console.log('Vendor saved:', response.data.vendor.id);
```

### 3. Save Order
```javascript
const orderData = {
  vendor: 'vendor_id_here',
  supplier: 'supplier_id_here',
  items: [
    {
      name: 'Fresh Tomatoes',
      quantity: 5,
      pricePerUnit: 40,
      totalPrice: 200,
      unit: 'kg'
    },
    {
      name: 'Organic Onions',
      quantity: 3,
      pricePerUnit: 30,
      totalPrice: 90,
      unit: 'kg'
    }
  ],
  subtotal: 290,
  deliveryCharge: 50,
  totalAmount: 340,
  status: 'pending',
  delivery: {
    address: {
      street: '321 Food Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    scheduledDate: new Date('2024-01-16T08:00:00Z'),
    timeSlot: '08:00-10:00',
    deliveryCharge: 50
  },
  payment: {
    method: 'razorpay',
    amount: 340,
    finalAmount: 340,
    status: 'pending'
  },
  specialInstructions: 'Please deliver early morning',
  placedAt: new Date(),
  updatedAt: new Date()
};

const response = await axios.post('http://localhost:5000/api/data/order', orderData);
console.log('Order saved:', response.data.order.id);
```

### 4. Bulk Save Suppliers
```javascript
const suppliersData = [
  // ... array of supplier objects
];

const response = await axios.post('http://localhost:5000/api/data/suppliers/bulk', {
  suppliers: suppliersData
});

console.log('Bulk save completed:', response.data);
```

### 5. Add Product to Supplier
```javascript
const productData = {
  name: 'Fresh Potatoes',
  category: 'Vegetables',
  unit: 'kg',
  pricePerUnit: 25,
  currentStock: 300,
  minStock: 50,
  maxStock: 800,
  quality: 'A+',
  description: 'Fresh potatoes from local farms',
  images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400'],
  isActive: true
};

const response = await axios.post(`http://localhost:5000/api/data/supplier/${supplierId}/products`, productData);
console.log('Product saved:', response.data.product);
```

## 🔍 Data Retrieval Examples

### 1. Get All Suppliers
```javascript
const response = await axios.get('http://localhost:5000/api/data/suppliers');
console.log('Suppliers:', response.data.suppliers);
```

### 2. Get Supplier by ID
```javascript
const response = await axios.get(`http://localhost:5000/api/data/supplier/${supplierId}`);
console.log('Supplier:', response.data);
```

### 3. Get All Orders
```javascript
const response = await axios.get('http://localhost:5000/api/data/orders');
console.log('Orders:', response.data.orders);
```

## 🔄 Data Update Examples

### 1. Update Supplier
```javascript
const updates = {
  businessName: 'Updated Business Name',
  deliveryRadius: 20,
  minOrderAmount: 600
};

const response = await axios.put(`http://localhost:5000/api/data/supplier/${supplierId}`, updates);
console.log('Supplier updated:', response.data);
```

### 2. Update Order Status
```javascript
const response = await axios.put(`http://localhost:5000/api/data/order/${orderId}/status`, {
  status: 'confirmed'
});
console.log('Order status updated:', response.data);
```

## 🗑️ Data Deletion Examples

### 1. Delete Supplier
```javascript
const response = await axios.delete(`http://localhost:5000/api/data/supplier/${supplierId}`);
console.log('Supplier deleted:', response.data);
```

### 2. Delete Order
```javascript
const response = await axios.delete(`http://localhost:5000/api/data/order/${orderId}`);
console.log('Order deleted:', response.data);
```

## 🧪 Testing

### Run Test Script
```bash
node test-data-save.js
```

### Expected Output
```
🧪 Testing data save operations...

1️⃣ Testing single supplier save...
✅ Supplier saved: 507f1f77bcf86cd799439011

2️⃣ Testing single vendor save...
✅ Vendor saved: 507f1f77bcf86cd799439012

3️⃣ Testing order save...
✅ Order saved: 507f1f77bcf86cd799439013

4️⃣ Testing data retrieval...
✅ Data retrieved:
- Suppliers: 1
- Vendors: 1
- Orders: 1

5️⃣ Testing order status update...
✅ Order status updated: confirmed

🎉 All tests completed successfully!

📊 Test Summary:
- Supplier ID: 507f1f77bcf86cd799439011
- Vendor ID: 507f1f77bcf86cd799439012
- Order ID: 507f1f77bcf86cd799439013
```

## 🔧 Error Handling

The API includes comprehensive error handling:

- **400 Bad Request** - Invalid data or missing required fields
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server-side errors

### Error Response Format
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

## 📊 Database Schema

### Supplier Schema
```javascript
{
  fullName: String,
  email: String,
  password: String,
  phone: String,
  userType: 'supplier',
  businessName: String,
  businessType: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  productCategories: [String],
  deliveryRadius: Number,
  minOrderAmount: Number,
  paymentMethods: [String],
  workingHours: {
    from: String,
    to: String
  },
  products: [{
    name: String,
    category: String,
    unit: String,
    pricePerUnit: Number,
    currentStock: Number,
    minStock: Number,
    maxStock: Number,
    quality: String,
    description: String,
    images: [String],
    isActive: Boolean
  }],
  rating: {
    average: Number,
    count: Number
  },
  trustScore: Number,
  isActive: Boolean,
  isVerified: Boolean
}
```

### Vendor Schema
```javascript
{
  fullName: String,
  email: String,
  password: String,
  phone: String,
  userType: 'vendor',
  businessName: String,
  businessType: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  businessCategory: String,
  preferredSuppliers: [{
    supplierId: ObjectId,
    rating: Number,
    lastOrderDate: Date
  }],
  purchaseAnalytics: {
    totalPurchases: Number,
    monthlyAverage: Number,
    topCategories: [String],
    savings: Number
  },
  savings: Number,
  totalOrders: Number,
  totalSpent: Number,
  rating: {
    average: Number,
    count: Number
  },
  trustScore: Number,
  isActive: Boolean,
  isVerified: Boolean
}
```

### Order Schema
```javascript
{
  vendor: ObjectId,
  supplier: ObjectId,
  items: [{
    name: String,
    quantity: Number,
    pricePerUnit: Number,
    totalPrice: Number,
    unit: String
  }],
  subtotal: Number,
  deliveryCharge: Number,
  totalAmount: Number,
  status: String,
  delivery: {
    address: Object,
    scheduledDate: Date,
    timeSlot: String,
    deliveryCharge: Number
  },
  payment: {
    method: String,
    amount: Number,
    finalAmount: Number,
    status: String
  },
  specialInstructions: String,
  tracking: [{
    status: String,
    location: String,
    description: String,
    timestamp: Date
  }],
  placedAt: Date,
  updatedAt: Date
}
```

## 🎯 Best Practices

1. **Always validate data** before saving
2. **Use proper error handling** for all operations
3. **Hash passwords** before saving user data
4. **Use transactions** for related operations
5. **Index frequently queried fields**
6. **Validate ObjectIds** before database operations
7. **Use proper HTTP status codes**
8. **Log all operations** for debugging

## 🚀 Next Steps

1. **Test the API endpoints** using the provided examples
2. **Integrate with frontend** to save data from forms
3. **Add more validation** as needed
4. **Implement pagination** for large datasets
5. **Add search and filtering** capabilities
6. **Implement caching** for better performance

---

**Happy coding! 🎉** 