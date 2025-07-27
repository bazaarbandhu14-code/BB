const axios = require('axios');

// Test data saving to MongoDB
async function testDataSave() {
  const API_BASE_URL = 'http://localhost:5000/api/data';
  
  console.log('🧪 Testing data save operations...\n');
  
  try {
    // Test 1: Save a single supplier
    console.log('1️⃣ Testing single supplier save...');
    const supplierData = {
      fullName: 'Test Supplier',
      email: 'testsupplier@example.com',
      phone: '+91 98765 43210',
      userType: 'supplier',
      businessName: 'Test Supplier Co',
      businessType: 'Wholesaler',
      address: {
        street: '123 Test Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      productCategories: ['Vegetables'],
      deliveryRadius: 10,
      minOrderAmount: 500,
      paymentMethods: ['Cash', 'UPI'],
      workingHours: { from: '06:00', to: '18:00' },
      gstNumber: '27AABFP1234Z1Z5',
      fssaiLicense: 'FSSAI123456789',
      products: [
        {
          name: 'Test Tomatoes',
          category: 'Vegetables',
          unit: 'kg',
          pricePerUnit: 40,
          currentStock: 100,
          minStock: 20,
          maxStock: 500,
          quality: 'A+',
          description: 'Test tomatoes',
          images: ['https://example.com/image.jpg'],
          isActive: true
        }
      ],
      verificationStatus: { documents: true, address: true, bank: true, quality: true },
      serviceAreas: [{ pincode: '400001', deliveryCharge: 50, minimumOrderForFreeDelivery: 1000 }],
      rating: { average: 4.5, count: 10 },
      trustScore: 80,
      isActive: true,
      isVerified: true,
      emailVerified: true,
      phoneVerified: true
    };
    
    const supplierResponse = await axios.post(`${API_BASE_URL}/supplier`, supplierData);
    console.log('✅ Supplier saved:', supplierResponse.data.supplier.id);
    
    // Test 2: Save a single vendor
    console.log('\n2️⃣ Testing single vendor save...');
    const vendorData = {
      fullName: 'Test Vendor',
      email: 'testvendor@example.com',
      phone: '+91 98765 43211',
      userType: 'vendor',
      businessName: 'Test Vendor Co',
      businessType: 'street_food',
      address: {
        street: '456 Test Avenue',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400002',
        country: 'India'
      },
      businessCategory: 'street_food',
      preferredSuppliers: [],
      purchaseAnalytics: {
        totalPurchases: 10000,
        monthlyAverage: 2000,
        topCategories: ['Vegetables'],
        savings: 2000
      },
      savings: 2000,
      totalOrders: 10,
      totalSpent: 10000,
      rating: { average: 4.0, count: 5 },
      trustScore: 70,
      isActive: true,
      isVerified: true,
      emailVerified: true,
      phoneVerified: true
    };
    
    const vendorResponse = await axios.post(`${API_BASE_URL}/vendor`, vendorData);
    console.log('✅ Vendor saved:', vendorResponse.data.vendor.id);
    
    // Test 3: Save an order
    console.log('\n3️⃣ Testing order save...');
    const orderData = {
      items: [
        {
          name: 'Test Tomatoes',
          quantity: 2,
          pricePerUnit: 40,
          totalPrice: 80,
          unit: 'kg'
        }
      ],
      subtotal: 80,
      deliveryCharge: 50,
      totalAmount: 130,
      status: 'pending',
      delivery: {
        address: {
          street: '456 Test Avenue',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400002',
          country: 'India'
        },
        scheduledDate: new Date('2024-01-20T08:00:00Z'),
        timeSlot: '08:00-10:00',
        deliveryCharge: 50
      },
      payment: {
        method: 'razorpay',
        amount: 130,
        finalAmount: 130,
        status: 'pending'
      },
      specialInstructions: 'Test order',
      placedAt: new Date(),
      updatedAt: new Date()
    };
    
    const orderResponse = await axios.post(`${API_BASE_URL}/order`, {
      ...orderData,
      vendor: vendorResponse.data.vendor.id,
      supplier: supplierResponse.data.supplier.id
    });
    console.log('✅ Order saved:', orderResponse.data.order.id);
    
    // Test 4: Retrieve all data
    console.log('\n4️⃣ Testing data retrieval...');
    const [suppliersResponse, vendorsResponse, ordersResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/suppliers`),
      axios.get(`${API_BASE_URL}/vendors`),
      axios.get(`${API_BASE_URL}/orders`)
    ]);
    
    console.log('✅ Data retrieved:');
    console.log(`- Suppliers: ${suppliersResponse.data.count}`);
    console.log(`- Vendors: ${vendorsResponse.data.count}`);
    console.log(`- Orders: ${ordersResponse.data.count}`);
    
    // Test 5: Update order status
    console.log('\n5️⃣ Testing order status update...');
    const updateResponse = await axios.put(`${API_BASE_URL}/order/${orderResponse.data.order.id}/status`, {
      status: 'confirmed'
    });
    console.log('✅ Order status updated:', updateResponse.data.order.status);
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log(`- Supplier ID: ${supplierResponse.data.supplier.id}`);
    console.log(`- Vendor ID: ${vendorResponse.data.vendor.id}`);
    console.log(`- Order ID: ${orderResponse.data.order.id}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testDataSave(); 