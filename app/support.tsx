import AlertBox from "@/components/custom/Alert";
import GBackground from "@/components/custom/GBackground";
import TypingIndicator from "@/components/custom/TypingIndicator";
import { buildConversationContext, findRelevantInstruction, isAppRelatedQuery, isGeneralHelpQuery } from "@/helper/chat";
import { FONT } from "@/lib/scale";
import { useChatStore } from "@/stores/chatStore";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale } from "react-native-size-matters";

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

// Enhanced options that include app guidance
const appGuidanceOptions = [
  { id: 5, label: "📱 How to use this app" },
  { id: 6, label: "📊 How to track my mood" },
  { id: 7, label: "🏥 Find clinics near me" },
  { id: 8, label: "🆘 Crisis support options" },
];

export default function Support() {
  const { messages, addMessage, clearMessages, initializeChat } = useChatStore();
  
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [showAppGuidance, setShowAppGuidance] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isAiThinking]);

  const sendMessage = async (textMessage: string) => {
    if (!textMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
    };

    addMessage(userMessage);
    const currentInput = textMessage;
    setInputText("");
    setIsLoading(true);
    setIsAiThinking(true); 

    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      let promptToSend: string;
      
      // Check if it's an app-related query first
      if (isAppRelatedQuery(currentInput)) {
        promptToSend = buildConversationContext(currentInput, messages);
        console.log("App-related query detected, using enhanced context");
      } 
      // Check if it's a general help query
      else if (isGeneralHelpQuery(currentInput)) {
        promptToSend = `
          You are Eunoia, a compassionate AI assistant for a mental health and wellness app. 
          The user is asking for general help. You should:
          1. Offer emotional support and mental health guidance
          2. Mention relevant app features like mood tracking, clinic finder, crisis hotlines
          3. Provide practical coping strategies
          4. Always remind users that you provide psychological first aid, not professional therapy
          
          User message: ${currentInput}
        `;
      }
      // Default mental health support
      else {
        promptToSend = `
          You are Eunoia, a compassionate AI assistant providing mental health support. 
          You offer empathetic listening, practical coping strategies, and emotional support. 
          Always remind users that you provide psychological first aid, not professional therapy.
          
          User message: ${currentInput}
        `;
      }

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptToSend }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
          ]
        }),
      });

      const data = await response.json();
      
      if (data.candidates?.[0]) {
        const aiResponseText = data.candidates[0].content.parts[0].text;
        
        // Check if we have a relevant instruction to add
        const relevantInstruction = findRelevantInstruction(currentInput);
        let finalResponse = aiResponseText;
        
        // If there's a relevant instruction and it's an app query, append it
        if (relevantInstruction && isAppRelatedQuery(currentInput)) {
          finalResponse += `\n\n📱 **Quick Guide:**\n${relevantInstruction}`;
        }
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: finalResponse,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
        };
        addMessage(aiMessage);
      } else {
        addMessage({
          id: (Date.now() + 1).toString(),
          text: "I apologize, but I'm having trouble responding right now. Please try rephrasing your message, or contact our crisis hotline if you need immediate support.",
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      addMessage({
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having technical difficulties. Please try again, or reach out to our crisis hotline if you need immediate support.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
      });
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
            <RemixIcon name="arrow-left-s-line" size={scale(26)}/>
          </TouchableOpacity>
        </View>
        <View className="flex-1 flex-row gap-4 items-center">
          <Image source={require('../assets/images/bot/head-nobg.png')} style={{height: scale(38), width: scale(38)}} contentFit="contain"/>
          <View>
            <Text className="font-funnel_bold" style={{fontSize: FONT.md}}>Eunoia</Text>
            <View className="flex-row gap-2 items-center">
              <View className="bg-green-500 rounded-full h-2 w-2"/>
              <Text className="font-funnel_regular " style={{fontSize: FONT.xs}}>Always here for you</Text>
            </View>
          </View>
        </View>
        {/* Optional: Add clear chat button */}
        <TouchableOpacity onPress={clearMessages} className="ml-2 flex-row items-center gap-2 rounded-xl border-gray-300 border-[1px] p-2">
          <RemixIcon name="edit-2-line" size={scale(14)} color="gray"/>
          <Text className="font-funnel_regular text-gray-600" style={{fontSize: FONT.xxs}}>New chat</Text>
        </TouchableOpacity>
      </View>
      
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1, width: '100%'}} keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} >
        <GBackground>
          <AlertBox
            text="Crisis Support Available 24/7"
            subText="If you're in immediate danger, please contact emergency services"
            mainIcon="shield-cross-fill"
            buttonIcon="arrow-right-s-line"
            onPress={() => router.push('/hotlines')}
          />
          
          <ScrollView style={{flexGrow: 1}} contentContainerStyle={{paddingBottom: 20}} ref={scrollViewRef} showsVerticalScrollIndicator={false} >
            <View className="w-full p-4 gap-4">
              {messages.map((message) => (
                <View key={message.id} className={`w-full flex-row mb-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <View className="w-[10%] justify-end">
                    {!message.isUser &&
                      <Image source={require('../assets/images/bot/head-nobg.png')} style={{width: scale(32), height: scale(32), borderRadius: 50}}/>
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
                  <Text className="font-funnel_medium text-gray-600 mb-3 text-center" style={{fontSize: FONT.xs}}>How can I support you today?</Text>
                  
                  {/* Mental Health Support Options */}
                  <View className="flex-row flex-wrap gap-2 justify-center mb-4">
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

                  {/* Toggle for App Guidance */}
                  <TouchableOpacity onPress={() => setShowAppGuidance(!showAppGuidance)} className="flex-row items-center justify-center gap-2 mb-3" >
                    <RemixIcon name={showAppGuidance ? "arrow-up-s-line" : "arrow-down-s-line"} size={scale(16)} color="#666" />
                    <Text className="font-funnel_medium text-gray-600" style={{fontSize: FONT.xs}}> App Guidance & Features </Text>
                  </TouchableOpacity>

                  {/* App Guidance Options */}
                  {showAppGuidance && (
                    <View className="flex-row flex-wrap gap-2 justify-center">
                      {appGuidanceOptions.map((option, index) => (
                        <TouchableOpacity key={option.id} onPress={() => sendMessage(option.label)} className="px-4 py-2 rounded-full border border-green-200 bg-green-50 "  activeOpacity={0.8} >
                          <Text className="font-funnel_regular text-green-700" style={{fontSize: FONT.xs}}>{option.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              }
            
              {isAiThinking && (
                <View className="flex-col items-start mb-2 gap-4">
                  <View className="flex-row gap-2 items-end">
                    <Image source={require('../assets/images/bot/head-nobg.png')} style={{width: scale(32), height: scale(32), borderRadius: 50}}/>
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
                placeholder="Ask me anything or how to use the app..."
                autoCapitalize="none"
                multiline
                value={inputText}
                onChangeText={setInputText}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => sendMessage(inputText)} disabled={isLoading || !inputText.trim()}>
                <RemixIcon name="send-plane-fill" color="#FF90BC" size={scale(20)} />
              </TouchableOpacity>
            </View>
            
            <View className="flex-row gap-3">
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => router.push('/hotlines')}
              >
                <RemixIcon name="phone-line" color="gray" size={scale(12)}/>
                <Text className="ml-1 font-nt_regular text-gray-600" style={{fontSize: FONT.xxs}}>Crisis Hotline</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center">
                <RemixIcon name="heart-line" color="gray" size={scale(12)}/>
                <Text className="ml-1 font-nt_regular text-gray-600" style={{fontSize: FONT.xxs}}>Self-Care Tips</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center">
                <RemixIcon name="user-heart-line" color="gray" size={scale(12)}/>
                <Text className="ml-1 font-nt_regular text-gray-600" style={{fontSize: FONT.xxs}}>Find Therapist</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-center text-gray-400 font-funnel_regular mt-2 mb-2 px-6 italic" style={{fontSize: FONT.xxs}}>
              This AI chatbot is intended for psychological first aid only. Please seek professional psychological intervention for mental health conditions.
            </Text>
          </View>
        </GBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}