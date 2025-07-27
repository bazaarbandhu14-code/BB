import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign, 
  Search,
  Bell,
  Clock,
  MapPin,
  Star,
  Truck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Plus,
  Filter,
  BarChart3,
  Calendar,
  Settings
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

interface BusinessMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  customerSatisfaction: number;
  onTimeDeliveryRate: number;
  totalCustomers: number;
  activeProducts: number;
}

interface Order {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  status: 'new' | 'processing' | 'preparing' | 'out_for_delivery' | 'delivered';
  scheduledDate: Date;
  priority: 'high' | 'medium' | 'low';
  customerRating?: number;
  customerReview?: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  maxStock: number;
  quality: string;
  isActive: boolean;
  salesThisMonth: number;
}

const ServiceDashboard: React.FC = () => {
  const { t } = useLanguage();
  
  // Add a simple test to see if component is rendering
  console.log('ServiceDashboard component is rendering');
  
  // Simple test version
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Test div to see if component is rendering */}
      <div className="bg-red-500 text-white p-4 mb-4">
        ServiceDashboard is rendering! If you see this, the component is working.
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
            <p className="text-gray-600">{t('welcome')}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="relative">
              <Bell className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('addProduct')}
            </Button>
            <LanguageSelector />
          </div>
        </div>

        {/* Simple Content */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Simple Service Dashboard</h2>
          <p className="text-gray-600 mb-4">This is a simplified version to test if the component is working.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{t('totalRevenue')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹75,000</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{t('totalOrders')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">150</div>
                <p className="text-xs text-muted-foreground">Total orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{t('customerSatisfaction')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.5/5</div>
                <p className="text-xs text-muted-foreground">Average rating</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{t('onTimeDelivery')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.7%</div>
                <p className="text-xs text-muted-foreground">On-time rate</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDashboard; 