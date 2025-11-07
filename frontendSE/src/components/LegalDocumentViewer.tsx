import React from 'react';
import { motion } from 'motion/react';
import { X, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { LegalDocument } from './utils/legalDocuments';
import { useLanguage } from './utils/languageContext';

interface LegalDocumentViewerProps {
  document: LegalDocument | null;
  open: boolean;
  onClose: () => void;
}

export default function LegalDocumentViewer({ document, open, onClose }: LegalDocumentViewerProps) {
  const { language } = useLanguage();

  if (!document) return null;

  const title = language === 'fr' ? document.titleFr : document.title;
  const content = language === 'fr' ? document.contentFr : document.content;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-2 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">{title}</DialogTitle>
                <p className="text-sm text-gray-500">
                  {language === 'fr' ? 'Dernière mise à jour' : 'Last updated'}: {document.lastUpdated}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)] px-6 py-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="prose prose-sm max-w-none"
          >
            <div
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: content
                  .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
                  .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-5 mb-3">$1</h2>')
                  .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mt-4 mb-2">$1</h3>')
                  .replace(/^\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                  .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
                  .replace(/^---$/gim, '<hr class="my-6 border-gray-200" />')
                  .replace(/\n\n/g, '</p><p class="mb-3">')
                  .replace(/^(.+)$/gim, '<p class="mb-3">$1</p>')
              }}
            />
          </motion.div>
        </ScrollArea>

        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <Button onClick={onClose}>
            {language === 'fr' ? 'Fermer' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
