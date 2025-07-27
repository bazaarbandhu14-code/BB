# Gemini API and Voice-to-Text Setup Guide

## 🚀 Features Implemented

### 1. **Gemini AI Integration**
- ✅ Integrated Gemini API for intelligent chat responses
- ✅ Real-time AI conversations with agricultural context
- ✅ Smart responses for mandi prices, suppliers, and farming advice

### 2. **Voice-to-Text Functionality**
- ✅ Hugging Face Whisper model integration
- ✅ Real-time voice recording and transcription
- ✅ Voice commands for hands-free operation
- ✅ Multi-language support (Hindi, English)

### 3. **Enhanced Dashboard**
- ✅ Removed vendor photos from header
- ✅ Dynamic vendor details based on login
- ✅ Logout functionality
- ✅ Supplier-specific dashboard sections
- ✅ User type detection (vendor/supplier)

## 🔧 Setup Instructions

### 1. **Environment Variables**

Create a `.env` file in the `client` directory:

```bash
# Hugging Face API Token for Voice-to-Text
REACT_APP_HUGGING_FACE_TOKEN=hf_your_token_here

# Google Maps API Key
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Razorpay API Keys
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_key_id
REACT_APP_RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

### 2. **Get Hugging Face Token**

1. Go to [Hugging Face](https://huggingface.co/)
2. Create an account or sign in
3. Go to Settings → Access Tokens
4. Create a new token with read permissions
5. Copy the token and add it to your `.env` file

### 3. **Gemini API Key**

The Gemini API key is already integrated:
```
AIzaSyBa5-PR5qFI7ssAVYI3VKWRRaGu6uSvLtQ
```

## 🎯 How It Works

### **Voice-to-Text Flow:**
1. User clicks microphone button
2. Browser requests microphone permission
3. Audio is recorded for 5 seconds
4. Audio blob is sent to Hugging Face Whisper API
5. Transcribed text is sent to Gemini API
6. AI response is displayed in chat

### **Dashboard Features:**
1. **Vendor Login**: Shows vendor-specific dashboard
2. **Supplier Login**: Shows supplier-specific dashboard
3. **Dynamic Content**: Stats and sections change based on user type
4. **Logout**: Clears all stored data and redirects to login

### **AI Assistant Features:**
1. **Text Chat**: Direct text input with Gemini AI responses
2. **Voice Chat**: Voice recording with real-time transcription
3. **Quick Actions**: Pre-defined actions for common queries
4. **Multi-language**: Support for Hindi and English

## 🔍 API Endpoints Used

### **Gemini API:**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

### **Hugging Face Whisper:**
```
POST https://api-inference.huggingface.co/models/openai/whisper-large-v3
```

## 📱 User Experience

### **For Vendors:**
- View total orders and money saved
- Join group orders for better prices
- Track deliveries in real-time
- Access AI assistant for queries

### **For Suppliers:**
- View total sales and revenue
- Process incoming orders
- Manage inventory
- Access AI assistant for market insights

## 🛠️ Technical Implementation

### **Voice Recording:**
```javascript
const startVoiceRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream);
  // ... recording logic
};
```

### **Voice-to-Text:**
```javascript
const convertVoiceToText = async (audioBlob: Blob) => {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.wav');
  // ... API call to Hugging Face
};
```

### **Gemini Integration:**
```javascript
const callGeminiAPI = async (prompt: string) => {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  // ... process response
};
```

## 🎨 UI/UX Improvements

### **Dashboard:**
- ✅ Removed vendor photos
- ✅ Added logout button
- ✅ Dynamic user information display
- ✅ Supplier-specific sections

### **AI Assistant:**
- ✅ Voice recording indicators
- ✅ Real-time transcription display
- ✅ Loading states for API calls
- ✅ Error handling and user feedback

## 🔐 Security Features

- ✅ Environment variables for API keys
- ✅ Secure token storage
- ✅ User session management
- ✅ Proper logout functionality

## 🚀 Next Steps

1. **Add your Hugging Face token** to the `.env` file
2. **Test voice recording** in a secure context (HTTPS)
3. **Customize AI prompts** for better agricultural responses
4. **Add more voice commands** for specific actions

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Verify API keys are correct
3. Ensure microphone permissions are granted
4. Check network connectivity for API calls

---

**Note**: Voice recording requires HTTPS in production environments for security reasons. 