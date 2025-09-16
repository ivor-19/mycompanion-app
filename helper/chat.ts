// helper.ts
export const APP_CONTEXT_PROMPT = `
You are Eunoia, an AI assistant integrated into a mental health and wellness mobile application. Here's important context about the app and your role:

**About the App:**
- Name: Eunoia (meaning "beautiful thinking" in Greek)
- Purpose: A comprehensive mental health and wellness platform
- Features: AI chat support, crisis hotlines, self-care tips, therapist finder, mood tracking, meditation guides
- Target Users: People seeking mental health support, stress management, and emotional wellness
- Available 24/7 for psychological first aid and emotional support

**Your Role as Eunoia:**
- Provide empathetic, supportive conversations
- Offer practical coping strategies and self-care tips
- Help users navigate mental health challenges with compassion
- Guide users to appropriate resources when needed
- Always remind users that you provide psychological first aid, not professional therapy
- Encourage seeking professional help for serious mental health conditions

**Key App Features to Mention When Relevant:**
- Crisis hotline directory for immediate help
- Self-care tips and techniques
- Therapist finder to locate mental health professionals
- Mood tracking tools
- Meditation and mindfulness exercises
- Community support features

When users ask about the app, your purpose, or what you can help with, use this context to provide helpful, accurate information about the Eunoia platform and your capabilities.
`;

// App usage instructions database
export const APP_INSTRUCTIONS = {
  "mood tracker": "To use the mood tracker:\n\n1. Go to the Mood Tracker tab in the app.\n2. Tap the emoji signifying your current mood to add a new entry.\n3. Add optional notes or images.\n4. Save your entry to track your emotions over time.\n\nYou can review your past moods to understand patterns and improve self-awareness.",
  
  "clinic locations": "To use the clinic locations feature:\n\n1. Drag up the bottom sheet to see the list of clinics.\n2. Mark the location you're interested in.\n3. Call the clinic if it's applicable.\n4. Check the distance to know how far it is from you.\n5. Tap the clinic to view more details.",
  
  "how to use the app": "Here's a guide on how to use the app:\n\n1. **Home Page** – You can see quick actions for *Mood Check*, *Find a Clinic*, and *Mood Insights*. Clicking them will navigate you to the respective page. You can also check your progress about entries, day streak, and wellness percentage.\n\n2. **Mood Tracker Tab** – It has 3 additional tabs: *Daily*, *Weekly*, and *Monthly*.\n - *Daily*: Add your current mood, check today's entries.\n - *Weekly*: Track weekly entries, see how many entries per day, and which days you're most active.\n - *Monthly*: Track your month, see how many entries you added on each day.\n\n3. **Clinic Locations** – Drag up the bottom sheet to see the list of clinics, mark a location, call the clinic if available, check the distance, and tap the clinic for full details.",

  "home page": "The Home Page is your main dashboard:\n\n- **Quick Actions**: Tap *Mood Check*, *Find a Clinic*, or *Mood Insights* to navigate quickly\n- **Progress Overview**: Check your daily entries, day streak, and wellness percentage\n- **Today's Summary**: See your current mental health status at a glance",

  "navigation": "To navigate the app:\n\n- Use the bottom tab bar to switch between main sections\n- Tap any quick action buttons on the Home Page for instant access\n- Use the back arrow or swipe gestures to return to previous screens\n- Pull down on most screens to refresh content",

  "daily mood tracking": "For daily mood tracking:\n\n1. Go to Mood Tracker → Daily tab\n2. Tap the emoji that matches your current mood\n3. Optional: Add notes about what influenced your mood\n4. Optional: Attach photos or images\n5. Tap 'Save' to record your entry\n\nYour daily entries help build insights over time!",

  "weekly insights": "To view weekly insights:\n\n1. Go to Mood Tracker → Weekly tab\n2. See your mood patterns throughout the week\n3. Check which days you're most active in tracking\n4. Review entries per day to spot trends\n5. Use this data to understand your weekly emotional cycles",

  "monthly overview": "For monthly mood overview:\n\n1. Navigate to Mood Tracker → Monthly tab\n2. See a calendar view of your entire month\n3. Each day shows how many mood entries you made\n4. Tap any day to see detailed entries\n5. Use this view to track long-term patterns and progress",

  "finding clinics": "To find mental health clinics:\n\n1. From Home Page, tap 'Find a Clinic' or go to Clinic Locations tab\n2. View the map showing nearby clinics\n3. Drag up the bottom sheet to see the full list\n4. Tap any clinic marker to see basic info\n5. Tap a clinic in the list for full details including contact info and services",

  "calling clinics": "To contact a clinic:\n\n1. Find the clinic in the Clinic Locations section\n2. Tap on the clinic name for full details\n3. If a phone number is available, you'll see a 'Call' button\n4. Tap 'Call' to dial directly from the app\n5. Note: Not all clinics may have phone numbers available",

  "crisis help": "For immediate crisis support:\n\n- Access the crisis hotline directory from the main menu\n- Available 24/7 for emergency mental health situations\n- Provides local and national crisis support numbers\n- Remember: If you're in immediate danger, call your local emergency services"
};

// Enhanced keyword detection for app-related queries
export const isAppRelatedQuery = (message: string): boolean => {
  const appKeywords = [
    // General app info
    "what is this app", "what app is this", "about this app", "app features",
    "what can you do", "what is eunoia", "how can you help", "what are your capabilities",
    "what is this platform", "what services", "app purpose", "how does this work",
    "what kind of app", "mental health app", "wellness app",
    
    // Navigation and usage
    "how to use", "how do I", "how can I", "where do I", "where can I",
    "navigate", "navigation", "how to navigate", "find",
    "go to", "access", "open", "use the", "using the",
    
    // Specific features
    "mood tracker", "mood tracking", "track mood", "daily mood", "weekly mood", "monthly mood",
    "clinic", "clinics", "find clinic", "clinic locations", "therapist", "therapy",
    "home page", "dashboard", "main screen",
    "call clinic", "contact clinic", "phone number",
    "crisis", "emergency", "hotline", "help now",
    
    // UI elements
    "bottom sheet", "tab", "tabs", "button", "emoji", "save entry",
    "quick actions", "progress", "wellness percentage", "day streak"
  ];
  
  const lowerMessage = message.toLowerCase();
  return appKeywords.some(keyword => lowerMessage.includes(keyword));
};

// Function to find the most relevant instruction
export const findRelevantInstruction = (message: string): string | null => {
  const lowerMessage = message.toLowerCase();
  
  // Direct matches first
  for (const [key, instruction] of Object.entries(APP_INSTRUCTIONS)) {
    if (lowerMessage.includes(key.toLowerCase())) {
      return instruction;
    }
  }
  
  // Keyword-based matching
  const keywordMap: Record<string, keyof typeof APP_INSTRUCTIONS> = {
    "mood tracker": "mood tracker",
    "track mood": "daily mood tracking",
    "daily mood": "daily mood tracking",
    "weekly": "weekly insights",
    "monthly": "monthly overview",
    "clinic": "clinic locations",
    "find clinic": "finding clinics",
    "call clinic": "calling clinics",
    "contact clinic": "calling clinics",
    "home page": "home page",
    "navigate": "navigation",
    "navigation": "navigation",
    "crisis": "crisis help",
    "emergency": "crisis help",
    "hotline": "crisis help"
  };
  
  for (const [keyword, instructionKey] of Object.entries(keywordMap)) {
    if (lowerMessage.includes(keyword)) {
      return APP_INSTRUCTIONS[instructionKey];
    }
  }
  
  return null;
};

// Enhanced context builder that includes relevant instructions
export const buildConversationContext = (
  currentMessage: string,
  messages: { isUser: boolean; text: string }[]
): string => {
  let context = APP_CONTEXT_PROMPT;
  
  // Check if user is asking for app usage instructions
  const relevantInstruction = findRelevantInstruction(currentMessage);
  if (relevantInstruction) {
    context += "\n\n**Relevant App Instructions:**\n" + relevantInstruction;
  }
  
  // Add recent conversation history for better context
  const recentMessages = messages.slice(-6); 
  if (recentMessages.length > 0) {
    context += "\n\n**Recent Conversation:**\n";
    recentMessages.forEach(msg => {
      context += `${msg.isUser ? "User" : "Eunoia"}: ${msg.text}\n`;
    });
  }
  
  context += `\nUser: ${currentMessage}`;
  return context;
};

// Helper function to get all available instructions (useful for debugging or help commands)
export const getAllInstructions = (): Record<string, string> => {
  return APP_INSTRUCTIONS;
};

// Helper to check if message is asking for general help
export const isGeneralHelpQuery = (message: string): boolean => {
  const helpKeywords = [
    "help", "how to", "guide me", "show me how", "explain how",
    "tutorial", "instructions", "what can I do", "features"
  ];
  
  const lowerMessage = message.toLowerCase();
  return helpKeywords.some(keyword => lowerMessage.includes(keyword));
};