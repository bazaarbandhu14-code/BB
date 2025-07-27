import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Building2, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff,
  LogIn,
  UserPlus,
  Shield,
  CheckCircle,
  ArrowRight,
  Handshake,
  Globe,
  Zap,
  Users,
  TrendingUp,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import apiService from "@/lib/api";

export default function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const [userType, setUserType] = useState<'vendor' | 'supplier'>('vendor');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    businessName: "",
    phone: ""
  });
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (activeTab === 'signup') {
        // Validate signup form
        if (!formData.fullName || !formData.businessName || !formData.phone || !formData.email || !formData.password || !formData.confirmPassword) {
          setError('Please fill in all required fields');
          return;
        }
        
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }

        // Call signup API
        const response = await apiService.signup({
          ...formData,
          userType
        });

        // Check if response is valid
        if (!response || !response.token || !response.user) {
          throw new Error('Invalid response from server');
        }

        // Store auth data
        apiService.setAuthData(response.token, response.user);
        
        // Store user information in localStorage for dashboard
        localStorage.setItem('userType', response.user.userType || 'vendor');
        localStorage.setItem('userEmail', response.user.email);
        localStorage.setItem('userName', response.user.fullName || response.user.name);
        localStorage.setItem('token', response.token);
        
        // Create vendor profile for dashboard
        const vendorProfile = {
          id: response.user.id || 'vendor001',
          name: response.user.fullName || response.user.name || 'Vendor User',
          businessName: response.user.businessName || (response.user.userType === 'supplier' ? 'Fresh Farm Supplies Pvt Ltd' : 'Vendor Business'),
          email: response.user.email,
          phone: response.user.phone || '+91 98765 43210',
          address: response.user.address || '123 Farm Road, Andheri West, Mumbai 400058',
          businessType: response.user.userType === 'supplier' ? 'Agricultural Supplies' : 'Vendor Services',
          registrationDate: response.user.createdAt || '2023-01-15',
          rating: response.user.rating || 4.8,
          totalOrders: response.user.userType === 'supplier' ? 1250 : 850,
          totalRevenue: response.user.userType === 'supplier' ? 2500000 : 1800000,
          activeOrders: response.user.userType === 'supplier' ? 8 : 5,
          trustScore: response.user.trustScore || 95,
          businessLicense: response.user.businessLicense || 'AGRI123456789',
          gstNumber: response.user.gstNumber || '27AAACF1234A1Z5',
          panNumber: response.user.panNumber || 'ABCDE1234F',
          userType: response.user.userType || 'vendor'
        };
        
        localStorage.setItem('vendorProfile', JSON.stringify(vendorProfile));
        
        console.log('✅ Registration successful:', response.user);
        
        // Redirect based on user type
        if (userType === 'vendor') {
          navigate('/dashboard');
        } else {
          navigate('/suppliers');
        }
      } else {
        // Validate login form
        if (!formData.email || !formData.password) {
          setError('Please enter your email and password');
          return;
        }

        // Call login API
        const response = await apiService.login({
          email: formData.email,
          password: formData.password
        });

        // Store auth data
        apiService.setAuthData(response.token, response.user);
        
        // Store user information in localStorage for dashboard
        localStorage.setItem('userType', response.user.userType || 'vendor');
        localStorage.setItem('userEmail', response.user.email);
        localStorage.setItem('userName', response.user.fullName || response.user.name);
        localStorage.setItem('token', response.token);
        
        // Create vendor profile for dashboard
        const vendorProfile = {
          id: response.user.id || 'vendor001',
          name: response.user.fullName || response.user.name || 'Vendor User',
          businessName: response.user.businessName || (response.user.userType === 'supplier' ? 'Fresh Farm Supplies Pvt Ltd' : 'Vendor Business'),
          email: response.user.email,
          phone: response.user.phone || '+91 98765 43210',
          address: response.user.address || '123 Farm Road, Andheri West, Mumbai 400058',
          businessType: response.user.userType === 'supplier' ? 'Agricultural Supplies' : 'Vendor Services',
          registrationDate: response.user.createdAt || '2023-01-15',
          rating: response.user.rating || 4.8,
          totalOrders: response.user.userType === 'supplier' ? 1250 : 850,
          totalRevenue: response.user.userType === 'supplier' ? 2500000 : 1800000,
          activeOrders: response.user.userType === 'supplier' ? 8 : 5,
          trustScore: response.user.trustScore || 95,
          businessLicense: response.user.businessLicense || 'AGRI123456789',
          gstNumber: response.user.gstNumber || '27AAACF1234A1Z5',
          panNumber: response.user.panNumber || 'ABCDE1234F',
          userType: response.user.userType || 'vendor'
        };
        
        localStorage.setItem('vendorProfile', JSON.stringify(vendorProfile));
        
        // Redirect based on user type
        if (response.user.userType === 'vendor') {
          navigate('/dashboard');
        } else {
          navigate('/suppliers');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Welcome & Features */}
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-2xl">
                <Handshake className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  BazaarBandhu
                </h1>
                <p className="text-lg text-gray-600">आपका विश्वसनीय बाज़ार साथी</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to India's Smart Marketplace
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of vendors and suppliers who trust BazaarBandhu for their daily business needs.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/60 backdrop-blur-sm border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Zap className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold">AI-Powered Shopping</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Voice commands and smart recommendations for the best deals
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Group Buying</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Save 15-25% through cooperative purchasing networks
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">Trusted Suppliers</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Verified vendors with quality guarantees and reliable delivery
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="font-semibold">Live Market Rates</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Real-time pricing and market trends for informed decisions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold mb-4 text-center">Platform Statistics</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">10,000+</p>
                <p className="text-sm text-gray-600">Active Vendors</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">₹50Cr+</p>
                <p className="text-sm text-gray-600">Monthly Volume</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">98%</p>
                <p className="text-sm text-gray-600">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Authentication */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {activeTab === 'login' ? 'Welcome Back' : 'Join BazaarBandhu'}
              </CardTitle>
              <p className="text-gray-600">
                {activeTab === 'login' 
                  ? 'Sign in to access your dashboard' 
                  : 'Create your account and start your journey'
                }
              </p>
            </CardHeader>

            <CardContent>
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="pl-10 pr-10"
                          required
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          <LogIn className="h-4 w-4 mr-2" />
                          Sign In
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* User Type Selection */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">I am a:</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant={userType === 'vendor' ? "default" : "outline"}
                          onClick={() => setUserType('vendor')}
                          className="h-12"
                          disabled={isLoading}
                        >
                          <Store className="h-4 w-4 mr-2" />
                          Vendor
                        </Button>
                        <Button
                          type="button"
                          variant={userType === 'supplier' ? "default" : "outline"}
                          onClick={() => setUserType('supplier')}
                          className="h-12"
                          disabled={isLoading}
                        >
                          <Building2 className="h-4 w-4 mr-2" />
                          Supplier
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-name"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className="pl-10"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="signup-business">Business Name</Label>
                      <div className="relative">
                        <Store className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-business"
                          placeholder="Enter your business name"
                          value={formData.businessName}
                          onChange={(e) => handleInputChange('businessName', e.target.value)}
                          className="pl-10"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="signup-phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-phone"
                          placeholder="+91-9876543210"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="pl-10"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="pl-10 pr-10"
                          required
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="pl-10 pr-10"
                          required
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Create Account
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Additional Info */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  By continuing, you agree to our{" "}
                  <Link to="#" className="text-green-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="#" className="text-green-600 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 