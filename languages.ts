export type Language = 'en' | 'hi' | 'mr' | 'gu';

export interface Translations {
  // Dashboard
  dashboard: string;
  welcome: string;
  overview: string;
  
  // Stats
  totalOrders: string;
  moneySaved: string;
  activeSuppliers: string;
  trustScore: string;
  totalRevenue: string;
  monthlyRevenue: string;
  averageOrderValue: string;
  customerSatisfaction: string;
  onTimeDelivery: string;
  totalCustomers: string;
  activeProducts: string;
  
  // Orders
  orders: string;
  orderManagement: string;
  recentOrders: string;
  orderStatus: string;
  pending: string;
  confirmed: string;
  preparing: string;
  outForDelivery: string;
  delivered: string;
  cancelled: string;
  
  // Products
  products: string;
  productManagement: string;
  inventory: string;
  addProduct: string;
  editProduct: string;
  stockLevel: string;
  price: string;
  quality: string;
  sales: string;
  
  // Analytics
  analytics: string;
  revenueTrends: string;
  orderVolume: string;
  performanceMetrics: string;
  
  // Notifications
  notifications: string;
  recentNotifications: string;
  unread: string;
  view: string;
  
  // Actions
  search: string;
  filter: string;
  save: string;
  update: string;
  delete: string;
  cancel: string;
  confirm: string;
  accept: string;
  reject: string;
  
  // Group Orders
  groupOrders: string;
  groupOrderOpportunities: string;
  participants: string;
  savings: string;
  endsIn: string;
  joinOrder: string;
  
  // Common
  loading: string;
  error: string;
  success: string;
  noData: string;
  viewAll: string;
  more: string;
  less: string;
  
  // Time
  minutes: string;
  hours: string;
  days: string;
  ago: string;
  
  // Status
  online: string;
  offline: string;
  active: string;
  inactive: string;
  
  // Priority
  high: string;
  medium: string;
  low: string;
  
  // Quality
  excellent: string;
  good: string;
  average: string;
  poor: string;
  
  // Additional keys used in ServiceDashboard
  per: string;
  customers: string;
  in: string;
  stock: string;
  month: string;
  will: string;
  be: string;
  displayed: string;
  here: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    dashboard: 'Dashboard',
    welcome: 'Welcome back! Here\'s your business overview',
    overview: 'Overview',
    
    totalOrders: 'Total Orders',
    moneySaved: 'Money Saved',
    activeSuppliers: 'Active Suppliers',
    trustScore: 'Trust Score',
    totalRevenue: 'Total Revenue',
    monthlyRevenue: 'Monthly Revenue',
    averageOrderValue: 'Average Order Value',
    customerSatisfaction: 'Customer Satisfaction',
    onTimeDelivery: 'On-Time Delivery',
    totalCustomers: 'Total Customers',
    activeProducts: 'Active Products',
    
    orders: 'Orders',
    orderManagement: 'Order Management',
    recentOrders: 'Recent Orders',
    orderStatus: 'Order Status',
    pending: 'Pending',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    outForDelivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    
    products: 'Products',
    productManagement: 'Product Management',
    inventory: 'Inventory',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    stockLevel: 'Stock Level',
    price: 'Price',
    quality: 'Quality',
    sales: 'Sales',
    
    analytics: 'Analytics',
    revenueTrends: 'Revenue Trends',
    orderVolume: 'Order Volume',
    performanceMetrics: 'Performance Metrics',
    
    notifications: 'Notifications',
    recentNotifications: 'Recent Notifications',
    unread: 'Unread',
    view: 'View',
    
    search: 'Search',
    filter: 'Filter',
    save: 'Save',
    update: 'Update',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    accept: 'Accept',
    reject: 'Reject',
    
    groupOrders: 'Group Orders',
    groupOrderOpportunities: 'Group Order Opportunities',
    participants: 'Participants',
    savings: 'Savings',
    endsIn: 'Ends in',
    joinOrder: 'Join Order',
    
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    noData: 'No data available',
    viewAll: 'View All',
    more: 'More',
    less: 'Less',
    
    minutes: 'min',
    hours: 'h',
    days: 'd',
    ago: 'ago',
    
    online: 'Online',
    offline: 'Offline',
    active: 'Active',
    inactive: 'Inactive',
    
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    
    excellent: 'Excellent',
    good: 'Good',
    average: 'Average',
    poor: 'Poor',
    
    per: 'per',
    customers: 'customers',
    in: 'in',
    stock: 'stock',
    month: 'month',
    will: 'will',
    be: 'be',
    displayed: 'displayed',
    here: 'here'
  },
  
  hi: {
    dashboard: 'डैशबोर्ड',
    welcome: 'वापस आने के लिए धन्यवाद! यहाँ आपका व्यवसाय अवलोकन है',
    overview: 'अवलोकन',
    
    totalOrders: 'कुल ऑर्डर',
    moneySaved: 'बचाया गया धन',
    activeSuppliers: 'सक्रिय आपूर्तिकर्ता',
    trustScore: 'विश्वास स्कोर',
    totalRevenue: 'कुल राजस्व',
    monthlyRevenue: 'मासिक राजस्व',
    averageOrderValue: 'औसत ऑर्डर मूल्य',
    customerSatisfaction: 'ग्राहक संतुष्टि',
    onTimeDelivery: 'समय पर डिलीवरी',
    totalCustomers: 'कुल ग्राहक',
    activeProducts: 'सक्रिय उत्पाद',
    
    orders: 'ऑर्डर',
    orderManagement: 'ऑर्डर प्रबंधन',
    recentOrders: 'हाल के ऑर्डर',
    orderStatus: 'ऑर्डर स्थिति',
    pending: 'लंबित',
    confirmed: 'पुष्टि की गई',
    preparing: 'तैयारी में',
    outForDelivery: 'डिलीवरी के लिए बाहर',
    delivered: 'पहुंचाया गया',
    cancelled: 'रद्द किया गया',
    
    products: 'उत्पाद',
    productManagement: 'उत्पाद प्रबंधन',
    inventory: 'इन्वेंटरी',
    addProduct: 'उत्पाद जोड़ें',
    editProduct: 'उत्पाद संपादित करें',
    stockLevel: 'स्टॉक स्तर',
    price: 'मूल्य',
    quality: 'गुणवत्ता',
    sales: 'बिक्री',
    
    analytics: 'विश्लेषण',
    revenueTrends: 'राजस्व प्रवृत्तियां',
    orderVolume: 'ऑर्डर मात्रा',
    performanceMetrics: 'प्रदर्शन मैट्रिक्स',
    
    notifications: 'सूचनाएं',
    recentNotifications: 'हाल की सूचनाएं',
    unread: 'अपठित',
    view: 'देखें',
    
    search: 'खोजें',
    filter: 'फ़िल्टर',
    save: 'सहेजें',
    update: 'अपडेट करें',
    delete: 'हटाएं',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    accept: 'स्वीकार करें',
    reject: 'अस्वीकार करें',
    
    groupOrders: 'समूह ऑर्डर',
    groupOrderOpportunities: 'समूह ऑर्डर अवसर',
    participants: 'प्रतिभागी',
    savings: 'बचत',
    endsIn: 'समाप्त होता है',
    joinOrder: 'ऑर्डर में शामिल हों',
    
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    noData: 'कोई डेटा उपलब्ध नहीं',
    viewAll: 'सभी देखें',
    more: 'अधिक',
    less: 'कम',
    
    minutes: 'मिनट',
    hours: 'घंटे',
    days: 'दिन',
    ago: 'पहले',
    
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    
    high: 'उच्च',
    medium: 'मध्यम',
    low: 'कम',
    
    excellent: 'उत्कृष्ट',
    good: 'अच्छा',
    average: 'औसत',
    poor: 'खराब',
    
    per: 'प्रति',
    customers: 'ग्राहक',
    in: 'में',
    stock: 'स्टॉक',
    month: 'माह',
    will: 'होगा',
    be: 'होगा',
    displayed: 'प्रदर्शित',
    here: 'यहाँ'
  },
  
  mr: {
    dashboard: 'डॅशबोर्ड',
    welcome: 'परत आल्याबद्दल धन्यवाद! हे तुमचे व्यवसायाचे आढावे आहे',
    overview: 'आढावा',
    
    totalOrders: 'एकूण ऑर्डर',
    moneySaved: 'वाचवलेले पैसे',
    activeSuppliers: 'सक्रिय पुरवठादार',
    trustScore: 'विश्वास स्कोअर',
    totalRevenue: 'एकूण महसूल',
    monthlyRevenue: 'मासिक महसूल',
    averageOrderValue: 'सरासरी ऑर्डर मूल्य',
    customerSatisfaction: 'ग्राहक संतुष्टी',
    onTimeDelivery: 'वेळेवर वितरण',
    totalCustomers: 'एकूण ग्राहक',
    activeProducts: 'सक्रिय उत्पादने',
    
    orders: 'ऑर्डर',
    orderManagement: 'ऑर्डर व्यवस्थापन',
    recentOrders: 'अलीकडील ऑर्डर',
    orderStatus: 'ऑर्डर स्थिती',
    pending: 'प्रलंबित',
    confirmed: 'पुष्टी केले',
    preparing: 'तयारीत',
    outForDelivery: 'वितरणासाठी बाहेर',
    delivered: 'पोहोचवले',
    cancelled: 'रद्द केले',
    
    products: 'उत्पादने',
    productManagement: 'उत्पादन व्यवस्थापन',
    inventory: 'इन्व्हेंटरी',
    addProduct: 'उत्पादन जोडा',
    editProduct: 'उत्पादन संपादित करा',
    stockLevel: 'स्टॉक पातळी',
    price: 'किंमत',
    quality: 'गુણવत્તા',
    sales: 'विक्री',
    
    analytics: 'विश્લेषण',
    revenueTrends: 'महसूल प्रवृत्ती',
    orderVolume: 'ऑर्डर खंड',
    performanceMetrics: 'कार्यक्षमता मेट्रिक्स',
    
    notifications: 'सूचना',
    recentNotifications: 'अलीकडील सूचना',
    unread: 'वाचले नाही',
    view: 'पहा',
    
    search: 'शोधा',
    filter: 'फिल्टर',
    save: 'जतन करा',
    update: 'अपडेट करा',
    delete: 'हटवा',
    cancel: 'रद्द करा',
    confirm: 'पुष्टी करा',
    accept: 'स्वीकारा',
    reject: 'नाकारा',
    
    groupOrders: 'गट ऑर्डर',
    groupOrderOpportunities: 'गट ऑर्डर संधी',
    participants: 'सहभागી',
    savings: 'बचत',
    endsIn: 'समाप્ત होतो',
    joinOrder: 'ऑर्डरमध्ये सामील व्हा',
    
    loading: 'लोड होत आहे...',
    error: 'त्रुटी',
    success: 'यश',
    noData: 'कोणताही डेटा उपलब्ध नाही',
    viewAll: 'सर्व पहा',
    more: 'अधिक',
    less: 'कमी',
    
    minutes: 'मिनिटे',
    hours: 'तास',
    days: 'दिवस',
    ago: 'आधी',
    
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    
    high: 'उच्च',
    medium: 'मध्यम',
    low: 'कमी',
    
    excellent: 'उत्कृष्ट',
    good: 'चांगले',
    average: 'सरासरी',
    poor: 'खराब',
    
    per: 'प्रति',
    customers: 'ग्राहक',
    in: 'में',
    stock: 'स्टॉक',
    month: 'माह',
    will: 'होगा',
    be: 'होगा',
    displayed: 'प्रदर्शित',
    here: 'यहाँ'
  },
  
  gu: {
    dashboard: 'ડેશબોર્ડ',
    welcome: 'પાછા આવવા માટે આભાર! અહીં તમારો વ્યવસાય અવલોકન છે',
    overview: 'અવલોકન',
    
    totalOrders: 'કુલ ઓર્ડર',
    moneySaved: 'બચાવેલા પૈસા',
    activeSuppliers: 'સક્રિય સપ્લાયર',
    trustScore: 'વિશ્વાસ સ્કોર',
    totalRevenue: 'કુલ આવક',
    monthlyRevenue: 'માસિક આવક',
    averageOrderValue: 'સરેરાશ ઓર્ડર મૂલ્ય',
    customerSatisfaction: 'ગ્રાહક સંતુષ્ટિ',
    onTimeDelivery: 'સમય પર ડિલિવરી',
    totalCustomers: 'કુલ ગ્રાહકો',
    activeProducts: 'સક્રિય ઉત્પાદનો',
    
    orders: 'ઓર્ડર',
    orderManagement: 'ઓર્ડર મેનેજમેન્ટ',
    recentOrders: 'તાજેતરના ઓર્ડર',
    orderStatus: 'ઓર્ડર સ્થિતિ',
    pending: 'બાકી',
    confirmed: 'પુષ્ટિ કરેલું',
    preparing: 'તૈયારીમાં',
    outForDelivery: 'ડિલિવરી માટે બહાર',
    delivered: 'પહોંચાડ્યું',
    cancelled: 'રદ કરેલું',
    
    products: 'ઉત્પાદનો',
    productManagement: 'ઉત્પાદન મેનેજમેન્ટ',
    inventory: 'ઇન્વેન્ટરી',
    addProduct: 'ઉત્પાદન ઉમેરો',
    editProduct: 'ઉત્પાદન સંપાદિત કરો',
    stockLevel: 'સ્ટોક સ્તર',
    price: 'કિંમત',
    quality: 'ગુણવત્તા',
    sales: 'વેચાણ',
    
    analytics: 'વિશ્લેષણ',
    revenueTrends: 'આવક વલણો',
    orderVolume: 'ઓર્ડર વોલ્યુમ',
    performanceMetrics: 'પ્રદર્શન મેટ્રિક્સ',
    
    notifications: 'સૂચનો',
    recentNotifications: 'તાજેતરના સૂચનો',
    unread: 'વાંચેલું નથી',
    view: 'જુઓ',
    
    search: 'શોધો',
    filter: 'ફિલ્ટર',
    save: 'સાચવો',
    update: 'અપડેટ કરો',
    delete: 'કાઢી નાખો',
    cancel: 'રદ કરો',
    confirm: 'પુષ્ટિ કરો',
    accept: 'સ્વીકારો',
    reject: 'નકારો',
    
    groupOrders: 'ગ્રુપ ઓર્ડર',
    groupOrderOpportunities: 'ગ્રુપ ઓર્ડર તકો',
    participants: 'સહભાગીઓ',
    savings: 'બચત',
    endsIn: 'સમાપ્ત થાય છે',
    joinOrder: 'ઓર્ડરમાં જોડાઓ',
    
    loading: 'લોડ થઈ રહ્યું છે...',
    error: 'ભૂલ',
    success: 'સફળતા',
    noData: 'કોઈ ડેટા ઉપલબ્ધ નથી',
    viewAll: 'બધું જુઓ',
    more: 'વધુ',
    less: 'ઓછું',
    
    minutes: 'મિનિટ',
    hours: 'કલાક',
    days: 'દિવસ',
    ago: 'પહેલા',
    
    online: 'ઓનલાઇન',
    offline: 'ઓફલાઇન',
    active: 'સક્રિય',
    inactive: 'નિષ્ક્રિય',
    
    high: 'ઉચ્ચ',
    medium: 'મધ્યમ',
    low: 'નીચું',
    
    excellent: 'ઉત્તમ',
    good: 'સારું',
    average: 'સરેરાશ',
    poor: 'ખરાબ',
    
    per: 'પ્રતિ',
    customers: 'ગ્રાહક',
    in: 'માં',
    stock: 'સ્ટૉક',
    month: 'માહ',
    will: 'હશે',
    be: 'હશે',
    displayed: 'પ્રદર્શિત',
    here: 'યહીં'
  }
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  mr: 'मराठी',
  gu: 'ગુજરાતી'
};

export const languageFlags: Record<Language, string> = {
  en: '🇺🇸',
  hi: '🇮🇳',
  mr: '🇮🇳',
  gu: '🇮🇳'
};
