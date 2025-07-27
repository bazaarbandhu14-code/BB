import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";
import { 
  ShoppingCart, 
  Volume2, 
  Bot, 
  RefreshCw,
  Mic,
  MicOff,
  Send,
  MessageCircle,
  Phone,
  MapPin,
  TrendingUp,
  Package,
  Truck,
  Star,
  DollarSign,
  Users,
  Settings,
  Play,
  Pause,
  Download,
  Upload,
  FileText,
  Camera,
  Video,
  Headphones,
  Speaker,
  Loader2,
  Radio,
  VolumeX,
  Volume1,
  Waveform,
  BarChart3
} from "lucide-react";
import { callGeminiAPI, convertVoiceToText } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
  audioUrl?: string;
  isRealTime?: boolean;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

const AIAssistant = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState('chat');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isRealTimeVoice, setIsRealTimeVoice] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [realTimeInterval, setRealTimeInterval] = useState<NodeJS.Timeout | null>(null);
  const [voiceActivity, setVoiceActivity] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'ai',
      content: 'Namaste! I am BazaarBandhu AI, your agricultural assistant. I can help you with mandi prices, supplier information, group orders, and much more. How can I assist you today? You can also use real-time voice mode for hands-free interaction.',
      timestamp: new Date()
    };
    setChatMessages([welcomeMessage]);

    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        console.log('Speech recognition started');
      };
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          handleRealTimeVoiceInput(finalTranscript);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
      
      setSpeechRecognition(recognition);
    }
  }, []);

  const quickActions: QuickAction[] = [
    {
      id: 'mandi-prices',
      title: 'Check Mandi Prices',
      description: 'Get real-time prices from local mandis',
      icon: <TrendingUp className="h-5 w-5" />,
      action: () => handleQuickAction('Check current mandi prices for vegetables and fruits')
    },
    {
      id: 'find-suppliers',
      title: 'Find Suppliers',
      description: 'Discover trusted suppliers in your area',
      icon: <Users className="h-5 w-5" />,
      action: () => handleQuickAction('Find reliable suppliers for organic vegetables')
    },
    {
      id: 'group-orders',
      title: 'Group Orders',
      description: 'Join or create group orders for better prices',
      icon: <ShoppingCart className="h-5 w-5" />,
      action: () => handleQuickAction('Show me available group orders for vegetables')
    },
    {
      id: 'track-delivery',
      title: 'Track Delivery',
      description: 'Track your order deliveries in real-time',
      icon: <Truck className="h-5 w-5" />,
      action: () => handleQuickAction('Track my recent order deliveries')
    },
    {
      id: 'market-analysis',
      title: 'Market Analysis',
      description: 'Get insights on market trends and prices',
      icon: <BarChart3 className="h-5 w-5" />,
      action: () => handleQuickAction('Provide market analysis for agricultural products')
    },
    {
      id: 'weather-info',
      title: 'Weather Info',
      description: 'Get weather forecasts for farming',
      icon: <RefreshCw className="h-5 w-5" />,
      action: () => handleQuickAction('What\'s the weather forecast for farming this week?')
    }
  ];

  const handleQuickAction = async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsGeminiLoading(true);

    try {
      const aiResponse = await callGeminiAPI(message);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGeminiLoading(false);
    }
  };

  const startRealTimeVoice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      
      // Set up audio analysis for voice activity detection
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const detectVoiceActivity = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        
        setVoiceLevel(average);
        setVoiceActivity(average > 30);
        
        if (realTimeInterval) {
          clearTimeout(realTimeInterval);
        }
        
        const timeout = setTimeout(() => {
          if (voiceActivity && average > 30) {
            // Voice detected, start recording
            startVoiceRecording();
          }
        }, 1000);
        
        setRealTimeInterval(timeout);
      };
      
      const interval = setInterval(detectVoiceActivity, 100);
      
      // Start speech recognition
      if (speechRecognition) {
        speechRecognition.start();
      }
      
      setIsRealTimeVoice(true);
      setIsListening(true);
      
      return () => {
        clearInterval(interval);
        if (realTimeInterval) {
          clearTimeout(realTimeInterval);
        }
      };
      
    } catch (error) {
      console.error('Error starting real-time voice:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopRealTimeVoice = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (speechRecognition) {
      speechRecognition.stop();
    }
    
    if (realTimeInterval) {
      clearTimeout(realTimeInterval);
    }
    
    setIsRealTimeVoice(false);
    setIsListening(false);
    setVoiceLevel(0);
    setVoiceActivity(false);
  };

  const handleRealTimeVoiceInput = async (transcript: string) => {
    if (!transcript.trim()) return;
    
    const voiceMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: `Voice: ${transcript}`,
      timestamp: new Date(),
      isVoice: true,
      isRealTime: true
    };
    
    setChatMessages(prev => [...prev, voiceMessage]);
    await sendMessageWithGemini(transcript);
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      
      const chunks: Blob[] = [];
      setAudioChunks(chunks);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        await processVoiceInput(audioBlob);
      };
      
      recorder.start();
      setIsRecording(true);
      setIsListening(true);
      
      // Simulate voice level changes
      const interval = setInterval(() => {
        setVoiceLevel(Math.random() * 100);
      }, 100);
      
      setTimeout(() => {
        clearInterval(interval);
        stopVoiceRecording();
      }, 5000); // Record for 5 seconds
      
    } catch (error) {
      console.error('Error starting voice recording:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    setIsRecording(false);
    setIsListening(false);
    setVoiceLevel(0);
  };

  const processVoiceInput = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      const transcribedText = await convertVoiceToText(audioBlob);
      
      if (transcribedText) {
        const voiceMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'user',
          content: `Voice: ${transcribedText}`,
          timestamp: new Date(),
          isVoice: true
        };
        
        setChatMessages(prev => [...prev, voiceMessage]);
        await sendMessageWithGemini(transcribedText);
      } else {
        toast.error('Could not transcribe voice. Please try again.');
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
      toast.error('Error processing voice input.');
    } finally {
      setIsProcessing(false);
    }
  };

  const sendMessageWithGemini = async (message: string) => {
    setIsGeminiLoading(true);
    
    try {
      const aiResponse = await callGeminiAPI(message);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
      
      // Optional: Text-to-speech for AI response
      if (isRealTimeVoice && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiResponse);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        setIsSpeaking(true);
        speechSynthesis.speak(utterance);
        utterance.onend = () => setIsSpeaking(false);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGeminiLoading(false);
    }
  };

  const handleVoiceRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const handleRealTimeVoiceToggle = () => {
    if (isRealTimeVoice) {
      stopRealTimeVoice();
    } else {
      startRealTimeVoice();
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage('');
    
    await sendMessageWithGemini(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            BazaarBandhu AI Assistant
          </h1>
          <p className="text-xl text-gray-600">
            Your intelligent agricultural companion with real-time voice access
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              AI Chat
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice Assistant
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Features
            </TabsTrigger>
          </TabsList>

          {/* AI Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Chat Interface */}
              <div className="lg:col-span-3">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">AI Bandhu is online</span>
                        <Badge variant="outline">Powered by Gemini</Badge>
                        {isRealTimeVoice && (
                          <Badge className="bg-blue-500 text-white">
                            <Radio className="h-3 w-3 mr-1" />
                            Real-time Voice
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 overflow-y-auto space-y-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {message.isVoice && (
                            <div className="flex items-center gap-2 mb-2">
                              <Mic className="h-3 w-3" />
                              <span className="text-xs opacity-70">
                                {message.isRealTime ? 'Real-time Voice' : 'Voice Message'}
                              </span>
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {isGeminiLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleVoiceRecording}
                        className={isRecording ? 'bg-red-100 text-red-600' : ''}
                        disabled={isGeminiLoading || isRealTimeVoice}
                      >
                        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRealTimeVoiceToggle}
                        className={isRealTimeVoice ? 'bg-blue-100 text-blue-600' : ''}
                        disabled={isGeminiLoading || isRecording}
                      >
                        {isRealTimeVoice ? <VolumeX className="h-4 w-4" /> : <Radio className="h-4 w-4" />}
                        {isRealTimeVoice ? 'Stop Real-time' : 'Real-time Voice'}
                      </Button>
                      
                      <Input
                        placeholder="Ask me about mandi prices, suppliers, group orders..."
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                        disabled={isGeminiLoading || isRealTimeVoice}
                      />
                      <Button 
                        size="sm" 
                        onClick={sendMessage} 
                        disabled={!currentMessage.trim() || isGeminiLoading || isRealTimeVoice}
                      >
                        {isGeminiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quick Actions Sidebar */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {quickActions.map((action) => (
                        <Button
                          key={action.id}
                          variant="outline"
                          className="w-full justify-start h-auto p-3"
                          onClick={action.action}
                          disabled={isGeminiLoading || isRealTimeVoice}
                        >
                          <div className="flex items-center gap-3">
                            {action.icon}
                            <div className="text-left">
                              <div className="font-medium text-sm">{action.title}</div>
                              <div className="text-xs text-gray-500">{action.description}</div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Voice Assistant Tab */}
          <TabsContent value="voice" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Voice Interface */}
              <Card className="h-96">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    Real-time Voice Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-full">
                  <div className="text-center space-y-6">
                    <div className="relative">
                      <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                        isListening ? 'bg-blue-500 animate-pulse' : 'bg-green-500'
                      }`}>
                        {isRealTimeVoice ? (
                          <Radio className="h-12 w-12 text-white" />
                        ) : (
                          <Mic className="h-12 w-12 text-white" />
                        )}
                      </div>
                      {isListening && (
                        <div className="absolute inset-0 rounded-full border-4 border-blue-300 animate-ping"></div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">
                        {isRealTimeVoice ? 'Real-time Voice Active' : 'Ready for Voice'}
                      </h3>
                      <p className="text-gray-600">
                        {isRealTimeVoice 
                          ? 'Speak naturally - I\'m listening continuously' 
                          : 'Click to start real-time voice interaction'
                        }
                      </p>
                    </div>

                    {isListening && (
                      <div className="w-full max-w-xs">
                        <Progress value={voiceLevel} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">
                          {voiceActivity ? 'Voice Detected' : 'Listening...'}
                        </p>
                      </div>
                    )}

                    {isProcessing && (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Processing voice...</span>
                      </div>
                    )}

                    {isSpeaking && (
                      <div className="flex items-center gap-2">
                        <Speaker className="h-4 w-4 animate-pulse" />
                        <span className="text-sm">AI is speaking...</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="lg"
                        onClick={handleRealTimeVoiceToggle}
                        className={isRealTimeVoice ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
                        disabled={isProcessing}
                      >
                        {isRealTimeVoice ? (
                          <>
                            <VolumeX className="h-5 w-5 mr-2" />
                            Stop Real-time
                          </>
                        ) : (
                          <>
                            <Radio className="h-5 w-5 mr-2" />
                            Start Real-time
                          </>
                        )}
                      </Button>
                      
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={handleVoiceRecording}
                        className={isRecording ? 'bg-red-100 text-red-600' : ''}
                        disabled={isRealTimeVoice || isProcessing}
                      >
                        {isRecording ? (
                          <>
                            <Pause className="h-5 w-5 mr-2" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Play className="h-5 w-5 mr-2" />
                            Manual Record
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Voice Features */}
              <Card className="h-96">
                <CardHeader>
                  <CardTitle>Real-time Voice Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <Radio className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <h4 className="font-semibold">Real-time Voice</h4>
                        <p className="text-sm text-gray-600">Continuous listening</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Waveform className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <h4 className="font-semibold">Voice Activity</h4>
                        <p className="text-sm text-gray-600">Auto-detection</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Speaker className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <h4 className="font-semibold">Text-to-Speech</h4>
                        <p className="text-sm text-gray-600">AI responses</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Volume1 className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                        <h4 className="font-semibold">Noise Reduction</h4>
                        <p className="text-sm text-gray-600">Clear audio</p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Real-time Voice Mode</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Continuous voice recognition</li>
                        <li>• Automatic speech detection</li>
                        <li>• Instant AI responses</li>
                        <li>• Hands-free operation</li>
                        <li>• Natural conversation flow</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="clay-element p-6 text-center hover:shadow-lg transition-shadow">
                <ShoppingCart className="mx-auto text-orange-500 mb-4 h-12 w-12" />
                <h3 className="text-lg font-semibold mb-2">Order Raw Materials</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Order agricultural supplies and raw materials with ease
                </p>
                <Button className="w-full">Start Ordering</Button>
              </Card>
              
              <Card className="clay-element p-6 text-center hover:shadow-lg transition-shadow">
                <Radio className="mx-auto text-orange-500 mb-4 h-12 w-12" />
                <h3 className="text-lg font-semibold mb-2">Real-time Voice</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Continuous voice recognition for hands-free operation
                </p>
                <Button className="w-full">Try Real-time Voice</Button>
              </Card>
              
              <Card className="clay-element p-6 text-center hover:shadow-lg transition-shadow">
                <Bot className="mx-auto text-orange-500 mb-4 h-12 w-12" />
                <h3 className="text-lg font-semibold mb-2">Local Mandi Rates</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Real-time mandi prices and market updates
                </p>
                <Button className="w-full">Check Prices</Button>
              </Card>
              
              <Card className="clay-element p-6 text-center hover:shadow-lg transition-shadow">
                <RefreshCw className="mx-auto text-orange-500 mb-4 h-12 w-12" />
                <h3 className="text-lg font-semibold mb-2">Group Orders</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Join group orders for better prices and savings
                </p>
                <Button className="w-full">Join Groups</Button>
              </Card>
              
              <Card className="clay-element p-6 text-center hover:shadow-lg transition-shadow">
                <Truck className="mx-auto text-orange-500 mb-4 h-12 w-12" />
                <h3 className="text-lg font-semibold mb-2">Delivery Tracking</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Track your orders in real-time with live updates
                </p>
                <Button className="w-full">Track Orders</Button>
              </Card>
              
              <Card className="clay-element p-6 text-center hover:shadow-lg transition-shadow">
                <BarChart3 className="mx-auto text-orange-500 mb-4 h-12 w-12" />
                <h3 className="text-lg font-semibold mb-2">Market Analysis</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get insights on market trends and price predictions
                </p>
                <Button className="w-full">View Analysis</Button>
              </Card>
            </div>

            <div className="mt-8 text-center space-y-4">
              <Button
                className="clay-button text-lg px-6 py-3"
                onClick={() => navigate("/Chat")}
              >
                Launch OpenAI Chat Assistant
              </Button>
              
              <div>
                <Button
                  className="clay-button text-lg px-6 py-3 bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate("/deepseek-chat")}
                >
                  Try DeepSeek-R1 Local Model
                </Button>
                <p className="text-sm text-gray-500 mt-2">Powered by local DeepSeek-R1 model</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIAssistant;
