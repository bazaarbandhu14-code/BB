import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { Phone, Mail, MapPin, Building2, Truck, Clock, Shield, CreditCard } from 'lucide-react';

const registrationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  businessType: z.string().min(1, 'Please select business type'),
  gstNumber: z.string().optional(),
  fssaiLicense: z.string().optional(),
  panNumber: z.string().optional(),
  deliveryRadius: z.number().min(1).max(100),
  minOrderAmount: z.number().min(0),
  workingHoursFrom: z.string(),
  workingHoursTo: z.string(),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(6, 'Pincode must be at least 6 digits'),
  productCategories: z.array(z.string()).min(1, 'Select at least one category'),
  paymentMethods: z.array(z.string()).min(1, 'Select at least one payment method'),
  workingDays: z.array(z.string()).min(1, 'Select at least one working day'),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationForm = z.infer<typeof registrationSchema>;

const productCategories = [
  'Vegetables', 'Fruits', 'Dairy', 'Meat', 'Grains', 'Spices', 
  'Beverages', 'Snacks', 'Bakery', 'Organic', 'Frozen Foods'
];

const paymentMethods = [
  'Cash', 'UPI', 'Card', 'Net Banking', 'Digital Wallet'
];

const workingDays = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const businessTypes = [
  'Wholesaler', 'Retailer', 'Manufacturer', 'Distributor', 'Producer', 'Other'
];

export default function SupplierRegistration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange'
  });

  const watchedCategories = watch('productCategories') || [];
  const watchedPaymentMethods = watch('paymentMethods') || [];
  const watchedWorkingDays = watch('workingDays') || [];

  const handleCategoryToggle = (category: string) => {
    const current = watchedCategories;
    if (current.includes(category)) {
      setValue('productCategories', current.filter(c => c !== category));
    } else {
      setValue('productCategories', [...current, category]);
    }
  };

  const handlePaymentMethodToggle = (method: string) => {
    const current = watchedPaymentMethods;
    if (current.includes(method)) {
      setValue('paymentMethods', current.filter(m => m !== method));
    } else {
      setValue('paymentMethods', [...current, method]);
    }
  };

  const handleWorkingDayToggle = (day: string) => {
    const current = watchedWorkingDays;
    if (current.includes(day)) {
      setValue('workingDays', current.filter(d => d !== day));
    } else {
      setValue('workingDays', [...current, day]);
    }
  };

  const sendOTP = async () => {
    const phone = watch('phone');
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });

      if (response.ok) {
        setOtpSent(true);
        toast.success('OTP sent successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    const phone = watch('phone');
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });

      if (response.ok) {
        setOtpVerified(true);
        toast.success('Phone number verified!');
        setStep(2);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Invalid OTP');
      }
    } catch (error) {
      toast.error('Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: RegistrationForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          userType: 'supplier',
          workingHoursFrom: data.workingHoursFrom,
          workingHoursTo: data.workingHoursTo
        })
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        toast.success('Registration successful! Welcome to BazaarBandhu!');
        navigate('/service-dashboard');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Join BazaarBandhu as a Supplier
            </h1>
            <p className="text-gray-600">
              Connect with vendors and grow your business
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= stepNumber ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step > stepNumber ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-6 h-6" />
                {step === 1 && 'Phone Verification'}
                {step === 2 && 'Business Information'}
                {step === 3 && 'Service Details'}
              </CardTitle>
              <CardDescription>
                {step === 1 && 'Verify your phone number to get started'}
                {step === 2 && 'Tell us about your business'}
                {step === 3 && 'Configure your service settings'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Phone Verification */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex gap-2">
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            {...register('phone')}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={sendOTP}
                            disabled={isLoading}
                            className="whitespace-nowrap"
                          >
                            {isLoading ? 'Sending...' : 'Send OTP'}
                          </Button>
                        </div>
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    {otpSent && (
                      <div>
                        <Label htmlFor="otp">Enter OTP</Label>
                        <div className="flex gap-2">
                          <Input
                            id="otp"
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              const otp = (document.getElementById('otp') as HTMLInputElement).value;
                              verifyOTP(otp);
                            }}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Business Information */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          {...register('fullName')}
                        />
                        {errors.fullName && (
                          <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          {...register('email')}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Create a password"
                          {...register('password')}
                        />
                        {errors.password && (
                          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          {...register('confirmPassword')}
                        />
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          placeholder="Enter your business name"
                          {...register('businessName')}
                        />
                        {errors.businessName && (
                          <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="businessType">Business Type</Label>
                        <Select onValueChange={(value) => setValue('businessType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                          <SelectContent>
                            {businessTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.businessType && (
                          <p className="text-red-500 text-sm mt-1">{errors.businessType.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="gstNumber">GST Number (Optional)</Label>
                        <Input
                          id="gstNumber"
                          placeholder="Enter GST number"
                          {...register('gstNumber')}
                        />
                      </div>

                      <div>
                        <Label htmlFor="fssaiLicense">FSSAI License (Optional)</Label>
                        <Input
                          id="fssaiLicense"
                          placeholder="Enter FSSAI license"
                          {...register('fssaiLicense')}
                        />
                      </div>

                      <div>
                        <Label htmlFor="panNumber">PAN Number (Optional)</Label>
                        <Input
                          id="panNumber"
                          placeholder="Enter PAN number"
                          {...register('panNumber')}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Address</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Street Address"
                          {...register('street')}
                        />
                        <Input
                          placeholder="City"
                          {...register('city')}
                        />
                        <Input
                          placeholder="State"
                          {...register('state')}
                        />
                        <Input
                          placeholder="Pincode"
                          {...register('pincode')}
                        />
                      </div>
                      {(errors.street || errors.city || errors.state || errors.pincode) && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.street?.message || errors.city?.message || errors.state?.message || errors.pincode?.message}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                      >
                        Previous
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setStep(3)}
                        disabled={!isValid}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Service Details */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="deliveryRadius">Delivery Radius (km)</Label>
                        <Input
                          id="deliveryRadius"
                          type="number"
                          placeholder="10"
                          {...register('deliveryRadius', { valueAsNumber: true })}
                        />
                        {errors.deliveryRadius && (
                          <p className="text-red-500 text-sm mt-1">{errors.deliveryRadius.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="minOrderAmount">Minimum Order Amount (₹)</Label>
                        <Input
                          id="minOrderAmount"
                          type="number"
                          placeholder="500"
                          {...register('minOrderAmount', { valueAsNumber: true })}
                        />
                        {errors.minOrderAmount && (
                          <p className="text-red-500 text-sm mt-1">{errors.minOrderAmount.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="workingHoursFrom">Working Hours From</Label>
                        <Input
                          id="workingHoursFrom"
                          type="time"
                          {...register('workingHoursFrom')}
                        />
                        {errors.workingHoursFrom && (
                          <p className="text-red-500 text-sm mt-1">{errors.workingHoursFrom.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="workingHoursTo">Working Hours To</Label>
                        <Input
                          id="workingHoursTo"
                          type="time"
                          {...register('workingHoursTo')}
                        />
                        {errors.workingHoursTo && (
                          <p className="text-red-500 text-sm mt-1">{errors.workingHoursTo.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>Product Categories</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {productCategories.map((category) => (
                          <Badge
                            key={category}
                            variant={watchedCategories.includes(category) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => handleCategoryToggle(category)}
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                      {errors.productCategories && (
                        <p className="text-red-500 text-sm mt-1">{errors.productCategories.message}</p>
                      )}
                    </div>

                    <div>
                      <Label>Payment Methods</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {paymentMethods.map((method) => (
                          <Badge
                            key={method}
                            variant={watchedPaymentMethods.includes(method) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => handlePaymentMethodToggle(method)}
                          >
                            {method}
                          </Badge>
                        ))}
                      </div>
                      {errors.paymentMethods && (
                        <p className="text-red-500 text-sm mt-1">{errors.paymentMethods.message}</p>
                      )}
                    </div>

                    <div>
                      <Label>Working Days</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {workingDays.map((day) => (
                          <Badge
                            key={day}
                            variant={watchedWorkingDays.includes(day) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => handleWorkingDayToggle(day)}
                          >
                            {day}
                          </Badge>
                        ))}
                      </div>
                      {errors.workingDays && (
                        <p className="text-red-500 text-sm mt-1">{errors.workingDays.message}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={watch('termsAccepted')}
                        onCheckedChange={(checked) => setValue('termsAccepted', checked as boolean)}
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the terms and conditions
                      </Label>
                    </div>
                    {errors.termsAccepted && (
                      <p className="text-red-500 text-sm">{errors.termsAccepted.message}</p>
                    )}

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(2)}
                      >
                        Previous
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading || !isValid}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isLoading ? 'Creating Account...' : 'Complete Registration'}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 