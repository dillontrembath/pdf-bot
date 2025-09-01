import React, { useRef, useEffect } from 'react';
import { View, TextInput, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MessageBubble } from './MessageBubble';
import { AppText } from './AppText';
import { THEME_COLORS, BORDER_RADIUS } from '@/constants/theme';
import { COMMON_STYLES } from '@/constants/styles';

interface ChatInterfaceProps {
  pdfId?: string;
  onCitationPress?: (pageNumber: number) => void;
  chatHook: ReturnType<typeof import('../hooks/useChat').usePDFChat>;
}

export function ChatInterface({ pdfId, onCitationPress, chatHook }: ChatInterfaceProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = chatHook;

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, [messages]);

  useEffect(() => {
    // Immediately scroll to bottom when component mounts (for existing messages)
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 50);
    }
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      handleSubmit();
    }
  };

  const handleCitationPress = (pageNumber: number) => {
    onCitationPress?.(pageNumber);
  };

  return (
    <View style={{ flex: 1, backgroundColor: THEME_COLORS.gray50 }}>
      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
            <View style={{ alignItems: 'center' }}>
              <View 
                style={{
                  ...COMMON_STYLES.iconContainer(80, THEME_COLORS.primaryLight),
                  marginBottom: 16
                }}
              >
                <Image 
                source={require('../assets/PDFBot.png')} 
                style={{ width: 56, height: 56 }}
                resizeMode="contain"
              />
              </View>
              <AppText variant="title" style={{ textAlign: 'center', marginBottom: 8, fontSize: 20 }}>
                {pdfId ? 'Start Learning!' : 'Upload a PDF First'}
              </AppText>
              <AppText variant="body" style={{ textAlign: 'center', paddingHorizontal: 16, color: THEME_COLORS.gray500 }}>
                {pdfId 
                  ? 'Ask me anything about your PDF document'
                  : 'Upload a PDF document to start chatting with AI about its contents'
                }
              </AppText>
            </View>
          </View>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onCitationPress={handleCitationPress}
            />
          ))
        )}
        
        {isLoading && <LoadingDots />}
      </ScrollView>

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View 
          style={{
            backgroundColor: THEME_COLORS.white,
            borderTopWidth: 1,
            borderTopColor: THEME_COLORS.gray200,
            paddingHorizontal: 16,
            paddingVertical: 12,
            paddingBottom: 12
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View 
              style={{
                flex: 1,
                ...COMMON_STYLES.inputContainer,
                marginRight: 12
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  color: THEME_COLORS.gray900,
                  fontSize: 16,
                  lineHeight: 20,
                  fontFamily: 'Inter_400Regular',
                  textAlignVertical: 'center'
                }}
                placeholder={pdfId ? "Ask about your PDF..." : "Upload a PDF first"}
                placeholderTextColor={THEME_COLORS.gray500}
                selectionColor={THEME_COLORS.primary}
                cursorColor={THEME_COLORS.primary}
                value={input}
                onChangeText={handleInputChange}
                onSubmitEditing={handleSend}
                returnKeyType="send"
                enablesReturnKeyAutomatically={true}
                multiline={false}
                maxLength={500}
                editable={!!pdfId && !isLoading}
              />
            </View>
            
            <TouchableOpacity
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: input.trim() && pdfId && !isLoading ? THEME_COLORS.primary : THEME_COLORS.gray100,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: input.trim() && pdfId && !isLoading ? THEME_COLORS.primary : THEME_COLORS.gray200
              }}
              onPress={handleSend}
              disabled={!input.trim() || !pdfId || isLoading}
              activeOpacity={0.8}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={input.trim() && pdfId && !isLoading ? THEME_COLORS.white : THEME_COLORS.gray500}
                style={{ marginLeft: 2 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// Animated loading dots component
function LoadingDots() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animateDot = (dotValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dotValue, {
            toValue: 1,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.timing(dotValue, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: false,
          }),
        ])
      );
    };

    const animation = Animated.parallel([
      animateDot(dot1, 0),
      animateDot(dot2, 200),
      animateDot(dot3, 400),
    ]);

    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 16 }}>
      <View 
        style={{
          ...COMMON_STYLES.iconContainer(32, THEME_COLORS.primaryBg),
          marginRight: 8,
          marginTop: 4
        }}
      >
        <Image 
          source={require('../assets/PDFBot.png')} 
          style={{ width: 20, height: 20 }}
          resizeMode="contain"
        />
      </View>
      <View 
        style={{
          backgroundColor: THEME_COLORS.white,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: BORDER_RADIUS.lg,
          borderBottomLeftRadius: 4
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Animated.View style={{ 
            width: 8, 
            height: 8, 
            backgroundColor: THEME_COLORS.primary,
            borderRadius: 4, 
            marginRight: 4,
            opacity: dot1
          }} />
          <Animated.View style={{ 
            width: 8, 
            height: 8, 
            backgroundColor: THEME_COLORS.primary,
            borderRadius: 4, 
            marginRight: 4,
            opacity: dot2
          }} />
          <Animated.View style={{ 
            width: 8, 
            height: 8, 
            backgroundColor: THEME_COLORS.primary,
            borderRadius: 4,
            opacity: dot3
          }} />
        </View>
      </View>
    </View>
  );
}