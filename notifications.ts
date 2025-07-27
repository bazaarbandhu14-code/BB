import apiService from './api';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'delivery' | 'order' | 'payment';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: string;
  actionHandler?: () => void;
  data?: any;
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private pollingInterval: NodeJS.Timeout | null = null;
  private isPolling = false;

  constructor() {
    this.startPolling();
  }

  // Start polling for new notifications
  private startPolling() {
    if (this.isPolling) return;
    
    this.isPolling = true;
    this.pollingInterval = setInterval(async () => {
      try {
        await this.fetchNotifications();
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    }, 10000); // Poll every 10 seconds
  }

  // Stop polling
  public stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isPolling = false;
  }

  // Fetch notifications from backend
  private async fetchNotifications() {
    try {
      // This would be replaced with actual API call
      // const response = await apiService.getNotifications();
      // this.updateNotifications(response.notifications);
      
      // For now, simulate real-time notifications
      this.simulateRealTimeNotifications();
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }

  // Simulate real-time notifications for demo
  private simulateRealTimeNotifications() {
    const now = new Date();
    const randomEvents = [
      {
        type: 'delivery' as const,
        title: 'Order Delivered',
        message: 'Your order #12345 has been delivered successfully!',
        probability: 0.1
      },
      {
        type: 'order' as const,
        title: 'Order Status Update',
        message: 'Order #12346 is out for delivery',
        probability: 0.15
      },
      {
        type: 'payment' as const,
        title: 'Payment Successful',
        message: 'Payment of ₹500 has been processed successfully',
        probability: 0.08
      },
      {
        type: 'warning' as const,
        title: 'Low Stock Alert',
        message: 'Some items in your cart are running low on stock',
        probability: 0.05
      }
    ];

    randomEvents.forEach(event => {
      if (Math.random() < event.probability) {
        this.addNotification({
          id: `notification-${Date.now()}-${Math.random()}`,
          type: event.type,
          title: event.title,
          message: event.message,
          timestamp: now,
          read: false
        });
      }
    });
  }

  // Add a new notification
  public addNotification(notification: Notification) {
    // Check if notification already exists
    const exists = this.notifications.find(n => n.id === notification.id);
    if (exists) return;

    this.notifications.unshift(notification);
    this.notifyListeners();
    
    // Show browser notification if supported
    this.showBrowserNotification(notification);
  }

  // Show browser notification
  private showBrowserNotification(notification: Notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  }

  // Request notification permission
  public async requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }

  // Mark notification as read
  public markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
      
      // Update on backend
      this.updateNotificationOnBackend(id, { read: true });
    }
  }

  // Mark all notifications as read
  public markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
    
    // Update on backend
    this.updateAllNotificationsOnBackend();
  }

  // Delete notification
  public deleteNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
    
    // Delete on backend
    this.deleteNotificationOnBackend(id);
  }

  // Get all notifications
  public getNotifications(): Notification[] {
    return this.notifications;
  }

  // Get unread notifications
  public getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.read);
  }

  // Get unread count
  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Subscribe to notification updates
  public subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // Update notifications
  private updateNotifications(notifications: Notification[]) {
    this.notifications = notifications;
    this.notifyListeners();
  }

  // Backend API calls (to be implemented)
  private async updateNotificationOnBackend(id: string, updates: Partial<Notification>) {
    try {
      // await apiService.updateNotification(id, updates);
      console.log('Notification updated on backend:', id, updates);
    } catch (error) {
      console.error('Failed to update notification on backend:', error);
    }
  }

  private async updateAllNotificationsOnBackend() {
    try {
      // await apiService.markAllNotificationsAsRead();
      console.log('All notifications marked as read on backend');
    } catch (error) {
      console.error('Failed to update notifications on backend:', error);
    }
  }

  private async deleteNotificationOnBackend(id: string) {
    try {
      // await apiService.deleteNotification(id);
      console.log('Notification deleted on backend:', id);
    } catch (error) {
      console.error('Failed to delete notification on backend:', error);
    }
  }

  // Create specific notification types
  public createOrderNotification(orderId: string, status: string, message: string) {
    this.addNotification({
      id: `order-${orderId}-${Date.now()}`,
      type: 'order',
      title: `Order #${orderId} ${status}`,
      message,
      timestamp: new Date(),
      read: false,
      data: { orderId, status }
    });
  }

  public createPaymentNotification(amount: number, status: string) {
    this.addNotification({
      id: `payment-${Date.now()}`,
      type: 'payment',
      title: `Payment ${status}`,
      message: `Payment of ₹${amount} has been ${status.toLowerCase()}`,
      timestamp: new Date(),
      read: false,
      data: { amount, status }
    });
  }

  public createDeliveryNotification(orderId: string, status: string, estimatedTime?: string) {
    this.addNotification({
      id: `delivery-${orderId}-${Date.now()}`,
      type: 'delivery',
      title: `Delivery Update - Order #${orderId}`,
      message: `Your order is ${status.toLowerCase()}${estimatedTime ? ` (ETA: ${estimatedTime})` : ''}`,
      timestamp: new Date(),
      read: false,
      data: { orderId, status, estimatedTime }
    });
  }

  public createWarningNotification(title: string, message: string) {
    this.addNotification({
      id: `warning-${Date.now()}`,
      type: 'warning',
      title,
      message,
      timestamp: new Date(),
      read: false
    });
  }

  public createSuccessNotification(title: string, message: string) {
    this.addNotification({
      id: `success-${Date.now()}`,
      type: 'success',
      title,
      message,
      timestamp: new Date(),
      read: false
    });
  }
}

export const notificationService = new NotificationService();
export default notificationService; 