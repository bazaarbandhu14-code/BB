import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { Truck, MapPin, Clock, CheckCircle, Package } from 'lucide-react';

const DeliveryTracking: React.FC = () => {
  const { t } = useLanguage();

  // Mock tracking data
  const trackingData = {
    orderId: 'ORD-12345',
    status: 'out_for_delivery',
    progress: 75,
    estimatedDelivery: '2:30 PM',
    currentLocation: 'Andheri West, Mumbai',
    trackingSteps: [
      {
        id: 1,
        status: 'completed',
        title: 'Order Confirmed',
        description: 'Order has been confirmed and is being prepared',
        time: '10:30 AM',
        icon: CheckCircle
      },
      {
        id: 2,
        status: 'completed',
        title: 'Preparing Order',
        description: 'Items are being packed and prepared for delivery',
        time: '11:45 AM',
        icon: Package
      },
      {
        id: 3,
        status: 'active',
        title: 'Out for Delivery',
        description: 'Order is out for delivery',
        time: '1:15 PM',
        icon: Truck
      },
      {
        id: 4,
        status: 'pending',
        title: 'Delivered',
        description: 'Order will be delivered to your address',
        time: '2:30 PM',
        icon: CheckCircle
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'active': return 'text-blue-600';
      case 'pending': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100';
      case 'active': return 'bg-blue-100';
      case 'pending': return 'bg-gray-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
          <p className="text-gray-600">{t('welcome')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{t('orders')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold">{trackingData.orderId}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">{t('orderStatus')}</p>
                  <Badge className="mt-1">
                    {trackingData.status === 'out_for_delivery' ? t('outForDelivery') : t('pending')}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                  <p className="font-semibold">{trackingData.estimatedDelivery}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Current Location</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <p className="font-semibold">{trackingData.currentLocation}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <Progress value={trackingData.progress} className="mt-2" />
                  <p className="text-xs text-gray-500 mt-1">{trackingData.progress}% complete</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tracking Timeline */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trackingData.trackingSteps.map((step, index) => {
                    const IconComponent = step.icon;
                    const isLast = index === trackingData.trackingSteps.length - 1;
                    
                    return (
                      <div key={step.id} className="flex items-start gap-4">
                        {/* Timeline Line */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusBgColor(step.status)}`}>
                            <IconComponent className={`h-4 w-4 ${getStatusColor(step.status)}`} />
                          </div>
                          {!isLast && (
                            <div className={`w-0.5 h-12 mt-2 ${
                              step.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>

                        {/* Step Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-semibold ${getStatusColor(step.status)}`}>
                              {step.title}
                            </h3>
                            <span className="text-sm text-gray-500">{step.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <Button variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            Update Delivery Time
          </Button>
          <Button variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            View on Map
          </Button>
          <Button>
            Contact Driver
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracking; 