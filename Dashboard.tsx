import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Shield, 
  Search,
  Bell,
  Clock,
  MapPin,
  Star,
  DollarSign,
  Package,
  Truck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Mic,
  MicOff,
  Send,
  MessageCircle,
  Store,
  BarChart3,
  Calendar,
  Phone,
  Mail,
  Building,
  User,
  Settings,
  LogOut,
  Plus,
  Minus,
  Heart,
  Eye,
  ShoppingBag,
  Navigation,
  RefreshCw,
  Play,
  Pause
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import DeliveryTracking from '@/components/DeliveryTracking';

interface VendorProfile {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  businessType: string;
  registrationDate: string;
  rating: number;
  totalOrders: number;
  totalRevenue: number;
  activeOrders: number;
  trustScore: number;
  businessLicense: string;
  gstNumber: string;
  panNumber: string;
  userType: 'vendor' | 'supplier';
}

interface DashboardStats {
  totalOrders: number;
  moneySaved: number;
  activeSuppliers: number;
  trustScore: number;
  monthlyOrders: number;
  totalSpent: number;
  pendingDeliveries: number;
  completedOrders: number;
}

interface GroupOrder {
  id: string;
  supplierName: string;
  product: string;
  participants: number;
  minParticipants: number;
  endTime: Date;
  savings: number;
  status: 'active' | 'expired' | 'completed';
}

interface Order {
  id: string;
  supplierName: string;
  items: string[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  scheduledDate: Date;
  progress: number;
  trackingId?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  supplier: string;
  rating: number;
  image: string;
  description: string;
  inStock: boolean;
}

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showAIChat, setShowAIChat] = useState(false);
  const [showBazaar, setShowBazaar] = useState(false);
  const [showDeliveryTracking, setShowDeliveryTracking] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: '1', message: 'Order #1234 has been delivered', time: '2 min ago', read: false },
    { id: '2', message: 'New group order available from Fresh Farm', time: '15 min ago', read: false },
    { id: '3', message: 'Payment received for order #1230', time: '1 hour ago', read: true }
  ]);

  // Get vendor profile from localStorage or use default
  const getVendorProfile = (): VendorProfile => {
    const storedProfile = localStorage.getItem('vendorProfile');
    if (storedProfile) {
      return JSON.parse(storedProfile);
    }
    
    // Default profile based on login
    const userType = localStorage.getItem('userType') || 'vendor';
    const userEmail = localStorage.getItem('userEmail') || 'vendor@example.com';
    const userName = localStorage.getItem('userName') || 'Vendor User';
    
    return {
      id: 'vendor001',
      name: userName,
      businessName: userType === 'supplier' ? 'Fresh Farm Supplies Pvt Ltd' : 'Vendor Business',
      email: userEmail,
      phone: '+91 98765 43210',
      address: '123 Farm Road, Andheri West, Mumbai 400058',
      businessType: userType === 'supplier' ? 'Agricultural Supplies' : 'Vendor Services',
      registrationDate: '2023-01-15',
      rating: 4.8,
      totalOrders: userType === 'supplier' ? 1250 : 850,
      totalRevenue: userType === 'supplier' ? 2500000 : 1800000,
      activeOrders: userType === 'supplier' ? 8 : 5,
      trustScore: 95,
      businessLicense: 'AGRI123456789',
      gstNumber: '27AAACF1234A1Z5',
      panNumber: 'ABCDE1234F',
      userType: userType as 'vendor' | 'supplier'
    };
  };

  const [vendorProfile, setVendorProfile] = useState<VendorProfile>(getVendorProfile());

  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: vendorProfile.totalOrders,
    moneySaved: 75000,
    activeSuppliers: vendorProfile.userType === 'supplier' ? 0 : 12,
    trustScore: vendorProfile.trustScore,
    monthlyOrders: vendorProfile.userType === 'supplier' ? 45 : 25,
    totalSpent: vendorProfile.totalRevenue,
    pendingDeliveries: vendorProfile.userType === 'supplier' ? 0 : 3,
    completedOrders: vendorProfile.totalOrders - (vendorProfile.userType === 'supplier' ? 0 : 3)
  });

  const [groupOrders, setGroupOrders] = useState<GroupOrder[]>([
    {
      id: '1',
      supplierName: 'Fresh Farm Supplies',
      product: 'Organic Vegetables Bundle',
      participants: 3,
      minParticipants: 5,
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      savings: 300,
      status: 'active'
    },
    {
      id: '2',
      supplierName: 'Dairy Delights Co',
      product: 'Milk & Curd Combo',
      participants: 7,
      minParticipants: 5,
      endTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
      savings: 200,
      status: 'active'
    }
  ]);

  const [recentOrders, setRecentOrders] = useState<Order[]>([
    {
      id: '1',
      supplierName: 'Fresh Farm Supplies',
      items: ['Fresh Tomatoes (5kg)', 'Organic Onions (3kg)'],
      total: 340,
      status: 'out_for_delivery',
      scheduledDate: new Date(),
      progress: 75,
      trackingId: 'TRK001'
    },
    {
      id: '2',
      supplierName: 'Dairy Delights Co',
      items: ['Fresh Milk (10L)'],
      total: 630,
      status: 'delivered',
      scheduledDate: new Date(),
      progress: 100,
      trackingId: 'TRK002'
    }
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Fresh Tomatoes',
      category: 'Vegetables',
      price: 40,
      unit: 'kg',
      supplier: 'Fresh Farm Supplies',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400',
      description: 'Fresh red tomatoes from local farms',
      inStock: true
    },
    {
      id: '2',
      name: 'Organic Onions',
      category: 'Vegetables',
      price: 30,
      unit: 'kg',
      supplier: 'Fresh Farm Supplies',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
      description: 'Organic onions, pesticide-free',
      inStock: true
    },
    {
      id: '3',
      name: 'Fresh Milk',
      category: 'Dairy',
      price: 60,
      unit: 'litre',
      supplier: 'Dairy Delights Co',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
      description: 'Fresh cow milk, delivered daily',
      inStock: true
    }
  ]);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    localStorage.removeItem('vendorProfile');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'out_for_delivery': return <Truck className="h-4 w-4 text-blue-500" />;
      case 'preparing': return <Package className="h-4 w-4 text-yellow-500" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, implement actual voice recording
    if (!isRecording) {
      toast.success('Voice recording started');
    } else {
      toast.success('Voice recording stopped');
    }
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setCurrentMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Thank you for your message. I\'m here to help you with your agricultural needs. How can I assist you today?',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openDeliveryTracking = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowDeliveryTracking(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('dashboard')}</h1>
              <p className="text-gray-600">Welcome back, {vendorProfile.name}</p>
              <p className="text-sm text-gray-500">{vendorProfile.businessName} • {vendorProfile.userType}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t('search')}
                className="pl-10 w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="relative">
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
            <LanguageSelector />
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="bazaar" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Bazaar
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              AI Bandhu
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {vendorProfile.userType === 'supplier' ? 'Total Sales' : 'Total Orders'}
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs opacity-90">
                    +{stats.monthlyOrders} this month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {vendorProfile.userType === 'supplier' ? 'Total Revenue' : 'Money Saved'}
                  </CardTitle>
                  <DollarSign className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.moneySaved.toLocaleString()}</div>
                  <p className="text-xs opacity-90">
                    {vendorProfile.userType === 'supplier' ? 'This month' : 'Through group orders'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {vendorProfile.userType === 'supplier' ? 'Active Customers' : 'Active Suppliers'}
                  </CardTitle>
                  <Users className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeSuppliers}</div>
                  <p className="text-xs opacity-90">
                    {vendorProfile.userType === 'supplier' ? 'Regular buyers' : 'Trusted partners'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
                  <Shield className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.trustScore}%</div>
                  <Progress value={stats.trustScore} className="mt-2 bg-white/20" />
                </CardContent>
              </Card>
            </div>

            {/* Group Orders and Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Group Orders - Only show for vendors */}
              {vendorProfile.userType === 'vendor' && (
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        Group Order Opportunities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {groupOrders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold">{order.supplierName}</h3>
                                <p className="text-sm text-gray-600">{order.product}</p>
                              </div>
                              <Badge variant={order.status === 'active' ? 'default' : 'secondary'}>
                                {order.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div className="text-center">
                                <p className="text-sm text-gray-600">Participants</p>
                                <p className="font-semibold">{order.participants}/{order.minParticipants}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-600">Savings</p>
                                <p className="font-semibold text-green-600">₹{order.savings}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="h-4 w-4" />
                                <span>Ends in {formatTimeRemaining(order.endTime)}</span>
                              </div>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Join Order
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Supplier Dashboard - Only show for suppliers */}
              {vendorProfile.userType === 'supplier' && (
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        Recent Orders
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentOrders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold">Order #{order.id}</h3>
                                <p className="text-sm text-gray-600">{order.supplierName}</p>
                              </div>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <p key={index} className="text-sm text-gray-600">• {item}</p>
                              ))}
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <span className="font-semibold">₹{order.total}</span>
                              <Button size="sm" variant="outline">
                                Process Order
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Recent Orders */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-600" />
                      Recent Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-sm">{order.supplierName}</h4>
                              <p className="text-xs text-gray-600">₹{order.total}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                {order.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-1 mb-2">
                            {order.items.map((item, index) => (
                              <p key={index} className="text-xs text-gray-600">• {item}</p>
                            ))}
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{order.progress}%</span>
                            </div>
                            <Progress value={order.progress} className="h-1" />
                          </div>

                          {order.trackingId && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="mt-2 w-full"
                              onClick={() => openDeliveryTracking(order.trackingId!)}
                            >
                              <Truck className="h-3 w-3 mr-1" />
                              Track Delivery
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Info */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {vendorProfile.userType === 'supplier' ? 'Supplier' : 'Vendor'} Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Full Name</label>
                          <p className="text-lg font-semibold">{vendorProfile.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Business Name</label>
                          <p className="text-lg font-semibold">{vendorProfile.businessName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Email</label>
                          <p className="text-lg">{vendorProfile.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Phone</label>
                          <p className="text-lg">{vendorProfile.phone}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Business Type</label>
                          <p className="text-lg">{vendorProfile.businessType}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Registration Date</label>
                          <p className="text-lg">{new Date(vendorProfile.registrationDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Address</label>
                          <p className="text-lg">{vendorProfile.address}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Rating</label>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                              <span className="text-lg font-semibold ml-1">{vendorProfile.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Business Documents */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Business Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Business License</h4>
                        <p className="text-sm text-gray-600">{vendorProfile.businessLicense}</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">GST Number</h4>
                        <p className="text-sm text-gray-600">{vendorProfile.gstNumber}</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">PAN Number</h4>
                        <p className="text-sm text-gray-600">{vendorProfile.panNumber}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Stats Sidebar */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Business Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{vendorProfile.totalOrders}</div>
                        <p className="text-sm text-gray-600">
                          {vendorProfile.userType === 'supplier' ? 'Total Sales' : 'Total Orders'}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">₹{vendorProfile.totalRevenue.toLocaleString()}</div>
                        <p className="text-sm text-gray-600">
                          {vendorProfile.userType === 'supplier' ? 'Total Revenue' : 'Total Spent'}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{vendorProfile.activeOrders}</div>
                        <p className="text-sm text-gray-600">
                          {vendorProfile.userType === 'supplier' ? 'Pending Orders' : 'Active Orders'}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{vendorProfile.trustScore}%</div>
                        <p className="text-sm text-gray-600">Trust Score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Bazaar Tab */}
          <TabsContent value="bazaar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Bazaar - Agricultural Marketplace
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <p className="text-sm text-gray-600">{product.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold">₹{product.price}</span>
                            <Badge variant="outline">{product.unit}</Badge>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm ml-1">{product.rating}</span>
                            </div>
                            <Badge variant="secondary">{product.category}</Badge>
                          </div>

                          <div className="text-sm text-gray-600">
                            <div className="flex items-center gap-1 mb-1">
                              <MapPin className="w-3 h-3" />
                              <span>{product.supplier}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </div>
                            <Button
                              size="sm"
                              disabled={!product.inStock}
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <Card key={order.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">Order #{order.id}</h4>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{order.supplierName}</p>
                            <div className="space-y-1">
                              {order.items.map((item, index) => (
                                <p key={index} className="text-sm text-gray-600">• {item}</p>
                              ))}
                            </div>
                            <p className="font-semibold mt-2">₹{order.total}</p>
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Assistant Tab */}
          <TabsContent value="ai-assistant" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  AI Bandhu - Your Agricultural Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Chat Interface */}
                  <div className="lg:col-span-2">
                    <Card className="h-96">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">AI Bandhu is online</span>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="h-80 overflow-y-auto">
                        <div className="space-y-4">
                          {chatMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.type === 'user'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <div className="p-4 border-t">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleVoiceRecording}
                            className={isRecording ? 'bg-red-100 text-red-600' : ''}
                          >
                            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                          </Button>
                          <Input
                            placeholder="Type your message..."
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1"
                          />
                          <Button size="sm" onClick={sendMessage}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <Button variant="outline" className="w-full justify-start">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Check Mandi Prices
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Store className="h-4 w-4 mr-2" />
                            Find Suppliers
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Group Orders
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Truck className="h-4 w-4 mr-2" />
                            Track Deliveries
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Market Analysis
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delivery Tracking Dialog */}
        <Dialog open={showDeliveryTracking} onOpenChange={setShowDeliveryTracking}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Delivery Tracking</DialogTitle>
            </DialogHeader>
            {selectedOrderId && (
              <DeliveryTracking orderId={selectedOrderId} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;