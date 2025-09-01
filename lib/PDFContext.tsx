import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PDFDocument } from '@/types/pdf';

interface PDFContextType {
  currentPDF: PDFDocument | null;
  setCurrentPDF: (pdf: PDFDocument | null) => void;
  savedPDFs: PDFDocument[];
  loadSavedPDFs: () => Promise<void>;
  deletePDF: (pdfId: string) => Promise<void>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SAVED_PDFS: 'stored_pdfs', // Match what home screen uses
  CURRENT_PDF: 'current_pdf',
};

export function PDFProvider({ children }: { children: ReactNode }) {
  const [currentPDF, setCurrentPDFState] = useState<PDFDocument | null>(null);
  const [savedPDFs, setSavedPDFs] = useState<PDFDocument[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const setCurrentPDF = async (pdf: PDFDocument | null) => {
    setCurrentPDFState(pdf);
    // Reset to page 1 when switching PDFs
    setCurrentPage(1);
    try {
      if (pdf) {
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_PDF, JSON.stringify(pdf));
        
        // Add to saved PDFs if not already there
        const existing = savedPDFs.find(p => p.id === pdf.id);
        if (!existing) {
          const updatedPDFs = [pdf, ...savedPDFs]; // Add new PDF to beginning for most recent first
          setSavedPDFs(updatedPDFs);
          await AsyncStorage.setItem(STORAGE_KEYS.SAVED_PDFS, JSON.stringify(updatedPDFs));
        }
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_PDF);
      }
    } catch (error) {
      // Silently fail
    }
  };

  const loadSavedPDFs = async () => {
    try {
      const [savedPDFsData, currentPDFData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SAVED_PDFS),
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_PDF),
      ]);

      if (savedPDFsData) {
        const pdfs = JSON.parse(savedPDFsData).map((pdf: Partial<PDFDocument>) => ({
          ...pdf,
          uploadedAt: typeof pdf.uploadedAt === 'string' ? new Date(pdf.uploadedAt) : pdf.uploadedAt
        }));
        // Sort by most recent first
        pdfs.sort((a: PDFDocument, b: PDFDocument) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        setSavedPDFs(pdfs);
      }

      if (currentPDFData) {
        const pdf = JSON.parse(currentPDFData);
        const normalizedPDF = {
          ...pdf,
          uploadedAt: typeof pdf.uploadedAt === 'string' ? new Date(pdf.uploadedAt) : pdf.uploadedAt
        };
        setCurrentPDFState(normalizedPDF);
      }
    } catch (error) {
      // Silently fail
    }
  };

  useEffect(() => {
    loadSavedPDFs();
  }, []);


  const deletePDF = async (pdfId: string) => {
    try {
      // Remove from savedPDFs state
      const updatedPDFs = savedPDFs.filter(p => p.id !== pdfId);
      setSavedPDFs(updatedPDFs);
      
      // Update AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_PDFS, JSON.stringify(updatedPDFs));
      
      // Remove chat history
      const historyKey = `chat_history_${pdfId}`;
      await AsyncStorage.removeItem(historyKey);
      
      // Clear current PDF if it's the one being deleted
      if (currentPDF?.id === pdfId) {
        setCurrentPDF(null);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <PDFContext.Provider
      value={{
        currentPDF,
        setCurrentPDF,
        savedPDFs,
        loadSavedPDFs,
        deletePDF,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </PDFContext.Provider>
  );
}

export function usePDFContext() {
  const context = useContext(PDFContext);
  if (context === undefined) {
    throw new Error('usePDFContext must be used within a PDFProvider');
  }
  return context;
}