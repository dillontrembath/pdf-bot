import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { THEME_COLORS, BORDER_RADIUS } from '@/constants/theme';
import { COMMON_STYLES } from '@/constants/styles';

import { Message } from '@/types/message';

interface MessageBubbleProps {
  message: Message;
  onCitationPress?: (pageNumber: number) => void;
}

export function MessageBubble({ message, onCitationPress }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const citations = message.citations || [];

  const renderMessageContent = () => {
    // For user messages, use simple text
    if (isUser) {
      return (
        <Text style={{ color: THEME_COLORS.white }}>
          {message.content}
        </Text>
      );
    }

    if (citations.length === 0) {
      return (
        <Markdown
          style={{
            body: { color: THEME_COLORS.gray900 },
            paragraph: { marginTop: 0, marginBottom: 8 },
            strong: { fontWeight: 'bold' },
            em: { fontStyle: 'italic' },
            list_item: { marginBottom: 4 },
          }}
        >
          {message.content}
        </Markdown>
      );
    }

    let contentWithoutCitations = message.content;
    citations.forEach(citation => {
      contentWithoutCitations = contentWithoutCitations.replace(citation.text, '').replace(/\s+/g, ' ').trim();
    });

    return (
      <View>
        <Markdown
          style={{
            body: { color: THEME_COLORS.gray900 },
            paragraph: { marginTop: 0, marginBottom: 8 },
            strong: { fontWeight: 'bold' },
            em: { fontStyle: 'italic' },
            list_item: { marginBottom: 4 },
          }}
        >
          {contentWithoutCitations}
        </Markdown>
      </View>
    );
  };

  return (
    <View style={{ flexDirection: 'row', marginBottom: 16, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      {!isUser && (
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
      )}
      
      <View 
        style={{
          maxWidth: '75%',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: BORDER_RADIUS.lg,
          borderBottomLeftRadius: isUser ? BORDER_RADIUS.lg : 4,
          borderBottomRightRadius: isUser ? 4 : BORDER_RADIUS.lg,
          backgroundColor: isUser ? THEME_COLORS.primary : THEME_COLORS.white,
          borderWidth: isUser ? 0 : 1,
          borderColor: isUser ? 'transparent' : THEME_COLORS.gray200
        }}
      >
        {renderMessageContent()}
        
        {citations.length > 0 && (
          <View 
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: 8,
              paddingTop: 8,
              borderTopWidth: 1,
              borderTopColor: THEME_COLORS.gray200
            }}
          >
            {citations.map((citation, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onCitationPress?.(citation.pageNumber)}
                activeOpacity={0.7}
                style={{
                  backgroundColor: THEME_COLORS.primaryBg,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: BORDER_RADIUS.sm,
                  marginRight: 4,
                  marginBottom: 4,
                  minWidth: 60,
                  alignItems: 'center'
                }}
              >
                <Text style={{ fontSize: 12, color: THEME_COLORS.primary, fontWeight: '600' }}>
                  Page {citation.pageNumber}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}