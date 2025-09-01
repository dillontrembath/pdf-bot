import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AppCard } from '@/components/AppCard';
import { AppText } from '@/components/AppText';
import { useRouter } from 'expo-router';
import { usePDFContext } from '@/lib/PDFContext';
import { THEME_COLORS, LAYOUT, BORDER_RADIUS } from '@/constants/theme';
import { COMMON_STYLES } from '@/constants/styles';

import { PDFDocument } from '@/types/pdf';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const router = useRouter();
  const { setCurrentPDF, savedPDFs, loadSavedPDFs } = usePDFContext();

  useEffect(() => {
    loadSavedPDFs();
  }, []);

  const uploadPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      setLoading(true);
      setUploadStatus('Processing PDF...');

      const file = result.assets[0];
      
      if (!file.name || !file.uri) {
        throw new Error('Invalid file selected');
      }

      // Copy PDF to permanent storage in app's documents directory
      const fileName = `pdf_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const permanentUri = `${FileSystem.documentDirectory}pdfs/${fileName}`;
      
      setUploadStatus('Saving PDF...');
      
      // Ensure pdfs directory exists
      const pdfsDir = `${FileSystem.documentDirectory}pdfs/`;
      const dirInfo = await FileSystem.getInfoAsync(pdfsDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(pdfsDir, { intermediates: true });
      }
      
      await FileSystem.copyAsync({
        from: file.uri,
        to: permanentUri,
      });

      const formData = new FormData();
      // React Native FormData expects blob-like object
      const pdfBlob = {
        uri: file.uri, // Use original URI for upload
        type: 'application/pdf',
        name: file.name,
      } as const;
      
      formData.append('pdf', pdfBlob as any); // RN FormData typing limitation

      const API_URL = process.env.API_URL || 'http://localhost:3000';
      const uploadResponse = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || 'Upload failed');
      }

      if (!uploadData.success) {
        throw new Error(uploadData.error || 'Upload was not successful');
      }

      const textContentKey = `pdf_text_${uploadData.pdfId}`;
      if (uploadData.textContent) {
        await AsyncStorage.setItem(textContentKey, uploadData.textContent);
      }

      const pdfData: PDFDocument = {
        id: uploadData.pdfId,
        name: uploadData.name,
        uri: permanentUri, // Use permanent URI for storage
        totalPages: uploadData.totalPages,
        uploadedAt: new Date(),
      };

      setCurrentPDF(pdfData);
      
      setLoading(false);
      setUploadStatus('');
      router.push('/chat');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      let userFriendlyMessage = 'Failed to upload PDF. Please try again.';
      
      if (errorMessage.includes('network') || errorMessage.includes('connection')) {
        userFriendlyMessage = 'Check your internet connection and try again.';
      } else if (errorMessage.includes('size') || errorMessage.includes('large')) {
        userFriendlyMessage = 'PDF file is too large. Please try a smaller file.';
      } else if (errorMessage.includes('format') || errorMessage.includes('invalid')) {
        userFriendlyMessage = 'Invalid PDF file. Please select a valid PDF document.';
      }
      
      Alert.alert('Upload Failed', userFriendlyMessage);
      setUploadStatus('');
      setLoading(false);
    }
  };

  const selectPDF = async (pdf: PDFDocument) => {
    setCurrentPDF(pdf);
    router.push('/chat');
  };

  const formatDate = (date: Date | string) => 
    new Date(date).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

  const renderPDFItem = ({ item }: { item: PDFDocument }) => (
    <AppCard onPress={() => selectPDF(item)}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View 
          style={{
            ...COMMON_STYLES.iconContainer(48),
            borderRadius: BORDER_RADIUS.md,
            marginRight: 16
          }}
        >
          <Ionicons name="document-text" size={24} color={THEME_COLORS.primary} />
        </View>
        
        <View style={{ flex: 1 }}>
          <AppText variant="subtitle" numberOfLines={1} style={{ marginBottom: 4 }}>
            {item.name}
          </AppText>
          <AppText variant="caption">
            {item.totalPages} pages • {formatDate(item.uploadedAt)}
          </AppText>
        </View>
        
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={THEME_COLORS.gray500}
          style={{ marginLeft: 16 }} 
        />
      </View>
    </AppCard>
  );

  if (loading) {
    return <LoadingSpinner message={uploadStatus || "Processing PDF..."} />;
  }

  return (
    <SafeAreaView style={LAYOUT.screen}>
      <View style={LAYOUT.container}>
        {/* Hero Header Section */}
        <View style={{ alignItems: 'center', paddingTop: 20, paddingBottom: 24 }}>
          <View 
            style={{
              width: 80,
              height: 80,
              borderRadius: BORDER_RADIUS.lg,
              backgroundColor: THEME_COLORS.primaryBg,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              ...COMMON_STYLES.shadow,
              shadowColor: THEME_COLORS.primary,
            }}
          >
            <Image 
              source={require('../assets/PDFBot.png')} 
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
          </View>
          
          <AppText 
            variant="title" 
            style={{ 
              textAlign: 'center', 
              marginBottom: 8,
              fontSize: 28,
              fontWeight: 'bold'
            }}
          >
            PDFBot
          </AppText>
          
          <AppText 
            variant="body" 
            style={{ 
              textAlign: 'center',
              color: THEME_COLORS.gray500,
              fontSize: 16,
              paddingHorizontal: 20
            }}
          >
            Your AI-powered PDF companion
          </AppText>
        </View>

        {/* Upload Button */}
        <View style={{ paddingBottom: 24 }}>
          <TouchableOpacity
            onPress={uploadPDF}
            disabled={loading}
            style={{
              backgroundColor: THEME_COLORS.primary,
              paddingVertical: 14,
              paddingHorizontal: 20,
              borderRadius: BORDER_RADIUS.lg,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              ...COMMON_STYLES.shadow,
              shadowColor: THEME_COLORS.primary,
              opacity: loading ? 0.6 : 1
            }}
            activeOpacity={0.8}
          >
            <Ionicons 
              name="cloud-upload" 
              size={20} 
              color={THEME_COLORS.white}
              style={{ marginRight: 10 }} 
            />
            <AppText 
              variant="buttonPrimary" 
              style={{ 
                color: THEME_COLORS.white,
                fontSize: 16,
                fontWeight: '600'
              }}
            >
              {loading ? 'Processing...' : 'Upload PDF Document'}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Upload Status */}
        {uploadStatus && (
          <View 
            style={{
              backgroundColor: THEME_COLORS.primaryLight,
              borderWidth: 1,
              borderColor: THEME_COLORS.primary,
              borderRadius: BORDER_RADIUS.md,
              padding: 16,
              marginBottom: 24,
              alignItems: 'center',
              marginHorizontal: 8
            }}
          >
            <AppText variant="body" style={{ color: THEME_COLORS.primary, textAlign: 'center' }}>
              {uploadStatus}
            </AppText>
          </View>
        )}

        {/* PDF Library Section */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 }}>
            <View
              style={{
                ...COMMON_STYLES.iconContainer(32),
                borderRadius: BORDER_RADIUS.sm,
                marginRight: 12
              }}
            >
              <Ionicons
                name="library"
                size={18}
                color={THEME_COLORS.primary}
              />
            </View>
            <AppText variant="subtitle" style={{ fontSize: 20, fontWeight: '700', flex: 1 }}>
              Your PDF Library
            </AppText>
            <View
              style={{
                backgroundColor: THEME_COLORS.gray200,
                borderRadius: 20,
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AppText variant="caption" style={{ color: THEME_COLORS.gray500, fontSize: 14, fontWeight: '600' }}>
                {savedPDFs.length}
              </AppText>
            </View>
          </View>
          
          {savedPDFs.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 32 }}>
              <View 
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: BORDER_RADIUS.lg,
                  backgroundColor: THEME_COLORS.gray100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  borderWidth: 2,
                  borderColor: THEME_COLORS.gray200,
                  borderStyle: 'dashed'
                }}
              >
                <Ionicons name="documents" size={40} color={THEME_COLORS.gray300} />
              </View>
              
              <AppText variant="subtitle" style={{ textAlign: 'center', marginBottom: 6, fontSize: 16 }}>
                No documents yet
              </AppText>
              
              <AppText variant="caption" style={{ textAlign: 'center', paddingHorizontal: 32, lineHeight: 18 }}>
                Upload your first PDF document to start learning with AI-powered assistance
              </AppText>
            </View>
          ) : (
            <FlatList
              data={savedPDFs}
              renderItem={renderPDFItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              style={{ flex: 1 }}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}