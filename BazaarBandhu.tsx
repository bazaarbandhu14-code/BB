import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  ShoppingCart, 
  Star, 
  MapPin, 
  Truck, 
  Clock, 
  Phone,
  Mail,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Package,
  CheckCircle,
  AlertCircle,
  Navigation,
  RefreshCw,
  Play,
  Pause,
  Eye,
  Heart,
  Share2,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DeliveryTracking from '@/components/DeliveryTracking';

interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  pricePerUnit: number;
  quality: string;
  description: string;
  supplier: {
    id: string;
    name: string;
    businessName: string;
    rating: number;
    deliveryRadius: number;
    minOrderAmount: number;
  };
  currentStock: number;
  images: string[];
  isFavorite?: boolean;
  deliveryTime?: string;
  liveTracking?: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
  supplierId: string;
}

interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: string;
  status: string;
  placedAt: string;
  trackingId?: string;
  estimatedDelivery?: string;
  driverInfo?: {
    name: string;
    phone: string;
    vehicleNumber: string;
  };
}

export default function BazaarBandhu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showDeliveryTracking, setShowDeliveryTracking] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [activeTab, setActiveTab] = useState('products');

  // Mock data for demonstration
  useEffect(() => {
    setTimeout(() => {
      setProducts([
        {
          id: '1',
          name: 'Fresh Tomatoes',
          category: 'Vegetables',
          unit: 'kg',
          pricePerUnit: 40,
          quality: 'A+',
          description: 'Fresh red tomatoes from local farms',
          supplier: {
            id: 'supplier1',
            name: 'Fresh Farm Supplies',
            businessName: 'Fresh Farm Supplies Pvt Ltd',
            rating: 4.5,
            deliveryRadius: 15,
            minOrderAmount: 500
          },
          currentStock: 150,
          images: ['https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400'],
          deliveryTime: 'Same day delivery',
          liveTracking: true
        },
        {
          id: '2',
          name: 'Organic Onions',
          category: 'Vegetables',
          unit: 'kg',
          pricePerUnit: 30,
          quality: 'A',
          description: 'Organic onions, pesticide-free',
          supplier: {
            id: 'supplier1',
            name: 'Fresh Farm Supplies',
            businessName: 'Fresh Farm Supplies Pvt Ltd',
            rating: 4.5,
            deliveryRadius: 15,
            minOrderAmount: 500
          },
          currentStock: 200,
          images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400'],
          deliveryTime: 'Next day delivery',
          liveTracking: true
        },
        {
          id: '3',
          name: 'Fresh Milk',
          category: 'Dairy',
          unit: 'litre',
          pricePerUnit: 60,
          quality: 'A+',
          description: 'Fresh cow milk, delivered daily',
          supplier: {
            id: 'supplier2',
            name: 'Dairy Delights',
            businessName: 'Dairy Delights Co',
            rating: 4.8,
            deliveryRadius: 10,
            minOrderAmount: 300
          },
          currentStock: 50,
          images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400'],
          deliveryTime: 'Same day delivery',
          liveTracking: true
        },
        {
          id: '4',
          name: 'Basmati Rice',
          category: 'Grains',
          unit: 'kg',
          pricePerUnit: 80,
          quality: 'A+',
          description: 'Premium quality basmati rice',
          supplier: {
            id: 'supplier3',
            name: 'Grain Masters',
            businessName: 'Grain Masters Ltd',
            rating: 4.3,
            deliveryRadius: 20,
            minOrderAmount: 1000
          },
          currentStock: 100,
          images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
          deliveryTime: '2-3 days delivery',
          liveTracking: false
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSupplier = selectedSupplier === 'all' || product.supplier.id === selectedSupplier;
    
    return matchesSearch && matchesCategory && matchesSupplier;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'price':
        aValue = a.pricePerUnit;
        bValue = b.pricePerUnit;
        break;
      case 'rating':
        aValue = a.supplier.rating;
        bValue = b.supplier.rating;
        break;
      default:
        aValue = a.name;
        bValue = b.name;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1, supplierId: product.supplier.id }]);
    }
    
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
    toast.success('Item removed from cart!');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity }
        : item
    ));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.pricePerUnit * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const toggleFavorite = (productId: string) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, isFavorite: !product.isFavorite }
        : product
    ));
  };

  const openDeliveryTracking = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowDeliveryTracking(true);
  };

  const handleCheckout = async () => {
    if (!deliveryAddress) {
      toast.error('Please enter delivery address');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const totalAmount = getCartTotal();
    
    try {
      // Initialize Razorpay payment
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY',
        amount: totalAmount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'BazaarBandhu',
        description: 'Order Payment',
        handler: function (response: any) {
          // Payment successful
          const order = {
            id: Date.now().toString(),
            items: cart,
            totalAmount,
            deliveryAddress,
            paymentMethod,
            status: 'confirmed',
            placedAt: new Date().toISOString(),
            trackingId: `TRK${Date.now()}`,
            estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            driverInfo: {
              name: 'Rajesh Kumar',
              phone: '+91 98765 43211',
              vehicleNumber: 'MH-01-AB-1234'
            }
          };
          
          setOrders([...orders, order]);
          setCart([]);
          setShowCheckout(false);
          toast.success('Order placed successfully! You can track your delivery.');
        },
        prefill: {
          name: 'Vendor Name',
          email: 'vendor@example.com',
          contact: '+91 98765 43210'
        },
        theme: {
          color: '#10b981'
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  };

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const suppliers = ['all', ...Array.from(new Set(products.map(p => p.supplier.id)))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">BazaarBandhu</h1>
            <p className="text-gray-600">Discover quality products from trusted suppliers</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowCart(true)}
              className="relative"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {getCartItemCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                  {getCartItemCount()}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="tracking">Delivery Tracking</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier === 'all' ? 'All Suppliers' : supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {sortedProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                          onClick={() => toggleFavorite(product.id)}
                        >
                          <Heart className={`h-4 w-4 ${product.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                        </Button>
                        {product.liveTracking && (
                          <Badge className="bg-green-500 text-white text-xs">
                            Live Track
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">₹{product.pricePerUnit}</span>
                        <Badge variant="outline">{product.unit}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm ml-1">{product.supplier.rating}</span>
                        </div>
                        <Badge variant="secondary">{product.quality}</Badge>
                      </div>

                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-1 mb-1">
                          <MapPin className="w-3 h-3" />
                          <span>{product.supplier.businessName}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          <Truck className="w-3 h-3" />
                          <span>Min order: ₹{product.supplier.minOrderAmount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{product.deliveryTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Stock: {product.currentStock} {product.unit}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product)}
                          disabled={product.currentStock === 0}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No orders yet</p>
                    <Button 
                      className="mt-4"
                      onClick={() => setActiveTab('products')}
                    >
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">Order #{order.id}</h4>
                                <Badge className={order.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                  {order.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {new Date(order.placedAt).toLocaleDateString()}
                              </p>
                              <div className="space-y-1">
                                {order.items.map((item, index) => (
                                  <p key={index} className="text-sm text-gray-600">• {item.product.name} x {item.quantity}</p>
                                ))}
                              </div>
                              <p className="font-semibold mt-2">₹{order.totalAmount}</p>
                              <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              {order.trackingId && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => openDeliveryTracking(order.trackingId!)}
                                >
                                  <Truck className="h-3 w-3 mr-1" />
                                  Track
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery Tracking Tab */}
          <TabsContent value="tracking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Delivery Tracking</CardTitle>
                <CardDescription>
                  Track your orders in real-time with live updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.filter(order => order.trackingId).length === 0 ? (
                  <div className="text-center py-8">
                    <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No active deliveries to track</p>
                    <Button 
                      className="mt-4"
                      onClick={() => setActiveTab('products')}
                    >
                      Place an Order
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.filter(order => order.trackingId).map((order) => (
                      <Card key={order.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-2">Order #{order.id}</h4>
                              <p className="text-sm text-gray-600 mb-2">
                                Estimated delivery: {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleString() : 'TBD'}
                              </p>
                              {order.driverInfo && (
                                <div className="text-sm text-gray-600 mb-2">
                                  <p>Driver: {order.driverInfo.name}</p>
                                  <p>Vehicle: {order.driverInfo.vehicleNumber}</p>
                                </div>
                              )}
                            </div>
                            <Button 
                              onClick={() => openDeliveryTracking(order.trackingId!)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Navigation className="h-4 w-4 mr-2" />
                              Live Track
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Cart Dialog */}
        <Dialog open={showCart} onOpenChange={setShowCart}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Shopping Cart</DialogTitle>
              <DialogDescription>
                Review your items before checkout
              </DialogDescription>
            </DialogHeader>
            
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.product.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-gray-600">{item.product.supplier.businessName}</p>
                          </div>
                        </TableCell>
                        <TableCell>₹{item.product.pricePerUnit}/{item.product.unit}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>₹{item.product.pricePerUnit * item.quantity}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>₹{getCartTotal()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCart(false)}
                    className="flex-1"
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Checkout Dialog */}
        <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Checkout</DialogTitle>
              <DialogDescription>
                Complete your order with live tracking
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="address">Delivery Address</Label>
                <Textarea
                  id="address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your complete delivery address"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="payment">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="razorpay">Razorpay (Recommended)</SelectItem>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between">
                      <span>{item.product.name} x {item.quantity}</span>
                      <span>₹{item.product.pricePerUnit * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>₹{getCartTotal()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-800">Live Tracking Included</span>
                </div>
                <p className="text-sm text-green-700">
                  Your order will include real-time delivery tracking with live updates.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCheckout(false)}
                  className="flex-1"
                >
                  Back to Cart
                </Button>
                <Button
                  onClick={handleCheckout}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!deliveryAddress}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay ₹{getCartTotal()}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delivery Tracking Dialog */}
        <Dialog open={showDeliveryTracking} onOpenChange={setShowDeliveryTracking}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Live Delivery Tracking</DialogTitle>
            </DialogHeader>
            {selectedOrderId && (
              <DeliveryTracking orderId={selectedOrderId} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
