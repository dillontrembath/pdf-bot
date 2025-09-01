import React from 'react';
import { View, Alert, ActionSheetIOS, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatInterface } from '@/components/ChatInterface';
import { AppButton } from '@/components/AppButton';
import { AppText } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usePDFContext } from '@/lib/PDFContext';
import { usePDFChat } from '@/hooks/useChat';
import { THEME_COLORS, LAYOUT } from '@/constants/theme';

export default function ChatScreen() {
  const router = useRouter();
  const { currentPDF, deletePDF } = usePDFContext();
  const chatHook = usePDFChat({ pdfId: currentPDF?.id });

  const handleCitationPress = (pageNumber: number) => {
    router.push(`/viewer?page=${pageNumber}`);
  };

  return (
    <SafeAreaView style={[LAYOUT.screen, { backgroundColor: THEME_COLORS.white }]}>
      {/* Navigation Header */}
      <View 
        style={{
          backgroundColor: THEME_COLORS.white,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: THEME_COLORS.gray200,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 2
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                padding: 8,
                marginRight: 12,
              }}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="chevron-back" 
                size={24} 
                color={THEME_COLORS.primary}
              />
            </TouchableOpacity>
            <View>
              <AppText variant="subtitle" style={{ fontSize: 18, fontWeight: '600' }}>
                PDFBot Chat
              </AppText>
              {currentPDF && (
                <AppText variant="caption" style={{ color: THEME_COLORS.gray500 }} numberOfLines={1}>
                  {currentPDF.name}
                </AppText>
              )}
            </View>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {currentPDF && (
              <>
                <AppButton
                  title="PDF"
                  onPress={() => router.push('/viewer')}
                  variant="primary"
                  size="sm"
                  icon="document"
                  style={{ paddingHorizontal: 12, marginRight: 8 }}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      ActionSheetIOS.showActionSheetWithOptions(
                        {
                          options: ['Cancel', 'Delete PDF'],
                          destructiveButtonIndex: 1,
                          cancelButtonIndex: 0,
                        },
                        (buttonIndex) => {
                          if (buttonIndex === 1) {
                            Alert.alert(
                              'Delete PDF',
                              `Delete "${currentPDF.name}" and all chat history?`,
                              [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                  text: 'Delete',
                                  style: 'destructive',
                                  onPress: async () => {
                                    try {
                                      await deletePDF(currentPDF.id);
                                      router.back();
                                    } catch (error) {
                                      Alert.alert('Error', 'Failed to delete PDF');
                                    }
                                  }
                                }
                              ]
                            );
                          }
                        }
                      );
                    }
                  }}
                  style={{
                    padding: 8,
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name="ellipsis-horizontal" 
                    size={24} 
                    color={THEME_COLORS.primary}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Chat Content */}
      {currentPDF ? (
        <View style={{ flex: 1 }}>
          <ChatInterface 
            pdfId={currentPDF?.id} 
            onCitationPress={handleCitationPress}
            chatHook={chatHook}
          />
        </View>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <View 
            style={{
              alignItems: 'center',
              backgroundColor: THEME_COLORS.white,
              borderRadius: 20,
              padding: 32,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 6,
              marginHorizontal: 8
            }}
          >
            <View 
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: THEME_COLORS.primaryBg,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20
              }}
            >
              <Ionicons name="chatbubbles" size={40} color={THEME_COLORS.primary} />
            </View>
            
            <AppText variant="title" style={{ textAlign: 'center', marginBottom: 8, fontSize: 22 }}>
              Ready to Learn?
            </AppText>
            
            <AppText variant="body" style={{ textAlign: 'center', marginBottom: 24, lineHeight: 22 }}>
              Select a PDF from your library to start an interactive learning session with AI
            </AppText>
            
            <AppButton
              title="Choose Document"
              onPress={() => router.push('/')}
              variant="primary"
              icon="library"
              style={{
                paddingHorizontal: 24,
                paddingVertical: 14,
                borderRadius: 14
              }}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}