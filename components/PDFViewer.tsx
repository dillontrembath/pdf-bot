import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME_COLORS } from '@/constants/theme';
import Pdf from 'react-native-pdf';
import * as FileSystem from 'expo-file-system';

interface PDFViewerProps {
  uri: string;
  initialPage?: number;
  onPageChanged?: (page: number, totalPages?: number) => void;
}

export function PDFViewer({ uri, initialPage = 1, onPageChanged }: PDFViewerProps) {
  const [fileExists, setFileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const checkFile = async () => {
      try {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        setFileExists(fileInfo.exists);
      } catch (error) {
        setFileExists(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkFile();
  }, [uri]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading PDF...</Text>
      </View>
    );
  }

  if (!fileExists) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>
          PDF file not found
        </Text>
        <Text style={{ textAlign: 'center', fontSize: 12, color: 'gray', marginBottom: 20 }}>
          This can happen in iOS Simulator. Try uploading the PDF again.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: THEME_COLORS.primary,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }}
          onPress={() => {
            // Navigate back to home to re-upload
            // You'll need to pass a navigation function as prop
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>
            Go to Home
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const source = { uri, cache: true };

  return (
    <View style={styles.container}>
      <Pdf
        source={source}
        page={currentPage}
        onLoadComplete={(numberOfPages) => {
          setTotalPages(numberOfPages);
        }}
        onPageChanged={(page, totalPages) => {
          setCurrentPage(page);
          onPageChanged?.(page, totalPages);
        }}
        onError={() => {}}
        onPressLink={() => {}}
        style={styles.pdf}
        enablePaging={true}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        enableAnnotationRendering={true}
        spacing={0}
        fitPolicy={0}
      />
      
      {/* Page Controls */}
      {totalPages > 1 && (
        <View style={styles.pageControls}>
          <TouchableOpacity
            style={[styles.pageButton, currentPage <= 1 && styles.disabled]}
            onPress={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <Ionicons name="chevron-back" size={20} color={currentPage <= 1 ? THEME_COLORS.gray300 : THEME_COLORS.white} />
          </TouchableOpacity>
          
          <View style={styles.pageInfo}>
            <Text style={styles.pageText}>
              {currentPage} / {totalPages}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.pageButton, currentPage >= totalPages && styles.disabled]}
            onPress={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <Ionicons name="chevron-forward" size={20} color={currentPage >= totalPages ? THEME_COLORS.gray300 : THEME_COLORS.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pdf: {
    flex: 1,
  },
  pageControls: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.85)',
    marginHorizontal: 60,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: THEME_COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  pageButton: {
    padding: 6,
  },
  disabled: {
    opacity: 0.3,
  },
  pageInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginHorizontal: 12,
  },
  pageText: {
    color: THEME_COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    minWidth: 50,
    fontFamily: 'Inter_600SemiBold',
  },
});