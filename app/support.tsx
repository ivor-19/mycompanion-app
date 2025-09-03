import AlertBox from "@/components/custom/Alert";
import GBackground from "@/components/custom/GBackground";
import TypingIndicator from "@/components/custom/TypingIndicator";
import { FONT } from "@/lib/scale";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const options = [
  { id: 1, label: "🌸 I'm feeling anxious" },
  { id: 2, label: "💙 I need someone to talk to" },
  { id: 3, label: "💤 I'm having trouble sleeping" },
  { id: 4, label: "🥺 Help me with stress" },
];

export default function Support() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: 'Hey! I\'m Eunoia, your friendly psychological chatbot 🤗. This is a safe, judgment-free space where you can share what\'s on your mind anytime. I\'m here to listen, support, and help you feel a little lighter. So, how are you feeling today?', 
      isUser: false ,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isAiThinking]);

  const sendMessage = async (textMessage: string) => {
    if (!textMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = textMessage;
    setInputText('');
    setIsLoading(true);
    setIsAiThinking(true); 

    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: currentInput }] }],
        }),
      });

      const data = await response.json();
      
      if (data.candidates?.[0]) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.candidates[0].content.parts[0].text,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
        };
        setMessages(prev => [...prev, aiMessage]);
        
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get response');
    } finally {
      setIsLoading(false);
      setIsAiThinking(false);
    }
  };

  return (
    <SafeAreaView className="min-h-screen bg-white items-center">
      {/* Header */}
      <View className='pt-4 pb-4 px-4 bg-white border-b-2 border-gray-100 flex-row items-center'>
        <View className="">
          <TouchableOpacity activeOpacity={0.6} onPress={() => router.back()}>
            <RemixIcon name="arrow-left-s-line" size={30}/>
          </TouchableOpacity>
        </View>
        <View className="flex-1 flex-row gap-4 items-center">
          <Image source={require('../assets/images/bot/head-nobg.png')} style={{height: 45, width: 45}} contentFit="contain"/>
          <View>
            <Text className="font-funnel_bold" style={{fontSize: FONT.md}}>Eunoia</Text>
            <View className="flex-row gap-2 items-center">
              <View className="bg-green-500 rounded-full h-2 w-2"/>
              <Text className="font-funnel_regular " style={{fontSize: FONT.xs}}>Always here for you</Text>
            </View>
          </View>
        </View>
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{flex: 1, width: '100%'}}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <GBackground>
          <AlertBox
            text="Crisis Support Available 24/7"
            subText="If you're in immediate danger, please contact emergency services"
            mainIcon="shield-cross-fill"
            buttonIcon="arrow-right-s-line"
            onPress={() => router.push('/hotlines')}
          />
          
          <ScrollView 
            style={{flexGrow: 1}} 
            contentContainerStyle={{paddingBottom: 20}}
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
          >
            <View className="w-full p-4 gap-4">
              {messages.map((message, index) => (
                <View key={index} className={`w-full flex-row mb-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <View className="w-[10%] justify-end">
                    {!message.isUser &&
                      <Image source={require('../assets/images/bot/head-nobg.png')} style={{width: 40, height: 40, borderRadius: 50}}/>
                    }
                  </View>
                  <View className="max-w-[70%] flex-col">
                    <View className={`p-4 rounded-3xl  ${ message.isUser ? 'bg-white' : 'bg-[#FF90BC]'}`} >
                      <Text className={`font-nt_regular ${message.isUser ? 'text-black' : 'text-white'}`}>
                        {message.text}
                      </Text>
                    </View>
                    <Text className={`font-nt_regular text-gray-600 px-2  ${message.isUser ? 'text-right' : 'text-left'}`} style={{fontSize: FONT.xxs}}>{message.timestamp}</Text>
                  </View>
                </View>
              ))}


              {messages.length === 1 && 
                <View className="mt-6 mb-4">
                  <Text className="font-funnel_medium text-gray-600  mb-3 text-center" style={{fontSize: FONT.xs}}>How can I support you today?</Text>
                  <View className="flex-row flex-wrap gap-2 justify-center">
                    {options.map((option, index) => (
                      <TouchableOpacity 
                        key={index} 
                        onPress={() => sendMessage(option.label)} 
                        className="px-4 py-2 rounded-full border border-gray-100 bg-white shadow-sm" 
                        style={{elevation: 4, shadowColor: 'gray'}} 
                        activeOpacity={0.8}
                      >
                        <Text className="font-funnel_regular text-gray-700" style={{fontSize: FONT.xs}}>{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              }
            
              {isAiThinking && (
                <View className="flex-col items-start mb-2 gap-4">
                  <View className="flex-row gap-2 items-end">
                    <Image source={require('../assets/images/bot/head-nobg.png')} style={{width: 40, height: 40, borderRadius: 50}}/>
                    <View className="p-4 bg-[#FFE3EF] rounded-3xl min-w-20 max-w-[80%]">
                      <TypingIndicator />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Input bar */}
          <View className="w-full items-center pb-4">
            <View className="py-2 w-[95%] my-4 bg-white flex-row items-center px-6 border-2 border-gray-200" style={{borderRadius: 20, minHeight: 60}}>
              <TextInput
                className="flex-1 font-funnel_regular"
                placeholder="Ask me anything..."
                autoCapitalize="none"
                multiline
                value={inputText}
                onChangeText={setInputText}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => sendMessage(inputText)} disabled={isLoading || !inputText.trim()}>
                <RemixIcon name="send-plane-fill" color="#FF90BC" size={26} />
              </TouchableOpacity>
            </View>
            
            <View className="flex-row gap-3">
              <View className="flex-row items-center">
                <RemixIcon name="phone-line" color="gray" size={16}/>
                <Text className="ml-1 font-nt_regular text-gray-600" style={{fontSize: FONT.xxs}}>Crisis Hotline</Text>
              </View>
              <View className="flex-row items-center">
                <RemixIcon name="heart-line" color="gray" size={16}/>
                <Text className="ml-1 font-nt_regular text-gray-600" style={{fontSize: FONT.xxs}}>Self-Care Tips</Text>
              </View>
              <View className="flex-row items-center">
                <RemixIcon name="user-heart-line" color="gray" size={16}/>
                <Text className="ml-1 font-nt_regular text-gray-600" style={{fontSize: FONT.xxs}}>Find Therapist</Text>
              </View>
            </View>
          </View>
        </GBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}