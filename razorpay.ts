interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    address: string;
  };
  theme: {
    color: string;
  };
}

interface PaymentData {
  amount: number;
  currency: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description: string;
  address?: string;
}

class RazorpayService {
  private isLoaded = false;
  private scriptId = 'razorpay-script';

  constructor() {
    this.loadRazorpayScript();
  }

  // Load Razorpay script
  private loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isLoaded) {
        resolve();
        return;
      }

      // Check if script already exists
      const existingScript = document.getElementById(this.scriptId);
      if (existingScript) {
        this.isLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = this.scriptId;
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.isLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Razorpay script'));
      };

      document.head.appendChild(script);
    });
  }

  // Create payment order on backend
  private async createOrder(paymentData: PaymentData): Promise<{ orderId: string; key: string }> {
    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          currency: paymentData.currency,
          customerName: paymentData.customerName,
          customerEmail: paymentData.customerEmail,
          customerPhone: paymentData.customerPhone,
          description: paymentData.description,
          address: paymentData.address
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }

      const data = await response.json();
      return {
        orderId: data.orderId,
        key: data.key
      };
    } catch (error) {
      console.error('Error creating payment order:', error);
      throw error;
    }
  }

  // Initialize payment
  public async initializePayment(paymentData: PaymentData): Promise<void> {
    try {
      await this.loadRazorpayScript();

      // Create order on backend
      const { orderId, key } = await this.createOrder(paymentData);

      const options: RazorpayOptions = {
        key: key,
        amount: paymentData.amount * 100, // Razorpay expects amount in paise
        currency: paymentData.currency,
        name: 'BazaarBandhu',
        description: paymentData.description,
        order_id: orderId,
        handler: (response) => {
          this.handlePaymentSuccess(response, paymentData);
        },
        prefill: {
          name: paymentData.customerName,
          email: paymentData.customerEmail,
          contact: paymentData.customerPhone
        },
        notes: {
          address: paymentData.address || ''
        },
        theme: {
          color: '#10B981' // Green color matching the app theme
        }
      };

      // Initialize Razorpay
      const rzp = new (window as any).Razorpay(options);
      rzp.open();

      // Handle payment failure
      rzp.on('payment.failed', (response: any) => {
        this.handlePaymentFailure(response, paymentData);
      });

    } catch (error) {
      console.error('Error initializing payment:', error);
      throw error;
    }
  }

  // Handle successful payment
  private async handlePaymentSuccess(response: any, paymentData: PaymentData) {
    try {
      // Verify payment on backend
      const verificationResponse = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          orderId: paymentData.orderId
        })
      });

      if (!verificationResponse.ok) {
        throw new Error('Payment verification failed');
      }

      const verificationData = await verificationResponse.json();

      // Show success message
      this.showPaymentSuccess(verificationData);

      // Trigger success callback
      if (this.onPaymentSuccess) {
        this.onPaymentSuccess(verificationData);
      }

    } catch (error) {
      console.error('Payment verification failed:', error);
      this.showPaymentError('Payment verification failed');
    }
  }

  // Handle payment failure
  private handlePaymentFailure(response: any, paymentData: PaymentData) {
    console.error('Payment failed:', response);
    
    // Show error message
    this.showPaymentError('Payment failed. Please try again.');

    // Trigger failure callback
    if (this.onPaymentFailure) {
      this.onPaymentFailure(response);
    }
  }

  // Show payment success message
  private showPaymentSuccess(data: any) {
    // You can customize this based on your UI framework
    alert(`Payment successful! Payment ID: ${data.paymentId}`);
  }

  // Show payment error message
  private showPaymentError(message: string) {
    // You can customize this based on your UI framework
    alert(`Payment Error: ${message}`);
  }

  // Callback functions
  public onPaymentSuccess?: (data: any) => void;
  public onPaymentFailure?: (error: any) => void;

  // Quick payment methods
  public async payForOrder(orderData: {
    orderId: string;
    amount: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: string[];
  }) {
    const paymentData: PaymentData = {
      amount: orderData.amount,
      currency: 'INR',
      orderId: orderData.orderId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      description: `Payment for order #${orderData.orderId} - ${orderData.items.join(', ')}`
    };

    await this.initializePayment(paymentData);
  }

  // Pay for subscription
  public async payForSubscription(subscriptionData: {
    planId: string;
    amount: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    planName: string;
  }) {
    const paymentData: PaymentData = {
      amount: subscriptionData.amount,
      currency: 'INR',
      orderId: `sub-${subscriptionData.planId}-${Date.now()}`,
      customerName: subscriptionData.customerName,
      customerEmail: subscriptionData.customerEmail,
      customerPhone: subscriptionData.customerPhone,
      description: `Subscription payment for ${subscriptionData.planName}`
    };

    await this.initializePayment(paymentData);
  }

  // Pay for credit
  public async payForCredit(creditData: {
    amount: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    creditType: string;
  }) {
    const paymentData: PaymentData = {
      amount: creditData.amount,
      currency: 'INR',
      orderId: `credit-${Date.now()}`,
      customerName: creditData.customerName,
      customerEmail: creditData.customerEmail,
      customerPhone: creditData.customerPhone,
      description: `Credit payment for ${creditData.creditType}`
    };

    await this.initializePayment(paymentData);
  }
}

export const razorpayService = new RazorpayService();
export default razorpayService; 