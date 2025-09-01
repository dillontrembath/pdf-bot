import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PDFViewer } from '@/components/PDFViewer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AppButton } from '@/components/AppButton';
import { AppText } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePDFContext } from '@/lib/PDFContext';
import { THEME_COLORS, LAYOUT } from '@/constants/theme';

export default function ViewerScreen() {
  const [loading] = useState(false);
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const page = searchParams.page as string | undefined;
  const { currentPDF, currentPage, setCurrentPage } = usePDFContext();
  
  // Use URL param if provided (from citation), otherwise use context page
  const effectiveInitialPage = page ? parseInt(page, 10) : currentPage;

  if (loading) {
    return <LoadingSpinner message="Loading PDF viewer..." />;
  }

  if (!currentPDF) {
    return (
      <SafeAreaView style={LAYOUT.screen}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View style={{ alignItems: 'center' }}>
            <View 
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: THEME_COLORS.gray100,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16
              }}
            >
              <Ionicons name="document-outline" size={40} color={THEME_COLORS.gray300} />
            </View>
            <AppText variant="title" style={{ marginBottom: 8, textAlign: 'center' }}>
              No PDF Loaded
            </AppText>
            <AppText variant="caption" style={{ textAlign: 'center', marginBottom: 24 }}>
              Upload a PDF document first to view it here
            </AppText>
            <AppButton
              title="Upload PDF"
              onPress={() => router.push('/')}
              variant="primary"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={LAYOUT.screen}>
      <View style={LAYOUT.header}>
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
          <View 
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: THEME_COLORS.primaryBg,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12
            }}
          >
            <Ionicons name="document" size={16} color={THEME_COLORS.primary} />
          </View>
          <AppText variant="subtitle">
            PDF Viewer
          </AppText>
        </View>
        <AppText variant="caption" style={{ marginTop: 8 }} numberOfLines={1}>
          {currentPDF.name} • {currentPDF.totalPages} pages
        </AppText>
      </View>

      <PDFViewer
        uri={currentPDF.uri}
        initialPage={effectiveInitialPage}
        onPageChanged={(pageNum) => setCurrentPage(pageNum)}
      />
    </SafeAreaView>
  );
}