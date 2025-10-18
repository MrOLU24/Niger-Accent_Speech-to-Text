import React, { useState } from 'react';
import { Copy, Edit, Save, X, Download, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TranscriptionPanelProps {
  transcriptText: string;
  isEditing: boolean;
  editableText: string;
  isCopied: boolean;
  isProcessing?: boolean;
  onEditStart: () => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onTextChange: (text: string) => void;
  onCopy: () => void;
  onDownload: () => void;
  sentiment?: {
    label: string;
    score: number;
    confidence: string;
  };
}

const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({
  transcriptText,
  isEditing,
  editableText,
  isCopied,
  isProcessing,
  onEditStart,
  onEditSave,
  onEditCancel,
  onTextChange,
  onCopy,
  onDownload,
  sentiment,
}) => {
  const [showFullText, setShowFullText] = useState(false);
  
  const isPlaceholder = transcriptText.includes('Welcome to ToriType');
  
  // Calculate stats
  const wordCount = transcriptText.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = transcriptText.length;
  const estimatedTime = Math.ceil(wordCount / 150); // Average reading speed
  
  // Truncate text for preview
  const shouldTruncate = transcriptText.length > 200 && !showFullText;
  const displayText = shouldTruncate ? transcriptText.substring(0, 200) + '...' : transcriptText;

  const getSentimentColor = (label: string) => {
    switch (label.toLowerCase()) {
      case 'positive':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'negative':
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'neutral':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-800 rounded-2xl border border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-200">Transcription</h2>
        
        {!isPlaceholder && (
          <div className="flex items-center space-x-2">
            {/* Sentiment Badge */}
            {sentiment && (
              <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getSentimentColor(sentiment.label)}`}>
                {sentiment.label} ({Math.round(sentiment.score * 100)}%)
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex space-x-1">
              {!isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onEditStart}
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCopy}
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDownload}
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onEditSave}
                    className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onEditCancel}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {isEditing ? (
          <Textarea
            value={editableText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onTextChange(e.target.value)}
            className="w-full min-h-[200px] bg-gray-700 border-gray-600 text-gray-200 resize-none focus:border-blue-500 focus:ring-blue-500"
            placeholder="Edit your transcription..."
          />
        ) : isProcessing ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-4"></div>
            <p className="text-blue-400 text-lg font-semibold">Processing...</p>
            <p className="text-gray-400 text-sm mt-2">Please wait while we transcribe your audio.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className={`p-4 rounded-xl bg-gray-700/50 border border-gray-600 ${
              isPlaceholder ? 'text-gray-400 italic' : 'text-gray-200'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">
                {displayText}
              </p>
            </div>
            
            {/* Stats Bar */}
            {!isPlaceholder && (
              <div className="flex items-center justify-center gap-6 text-xs text-gray-400 bg-gray-700/30 rounded-lg p-3">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-blue-400">{wordCount}</span>
                  <span>words</span>
                </div>
                <div className="w-px h-4 bg-gray-600"></div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-blue-400">{charCount}</span>
                  <span>characters</span>
                </div>
                <div className="w-px h-4 bg-gray-600"></div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-blue-400">~{estimatedTime}</span>
                  <span>min read</span>
                </div>
              </div>
            )}
            
            {/* Show More/Less Button */}
            {transcriptText.length > 200 && !isPlaceholder && (
              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullText(!showFullText)}
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                >
                  {showFullText ? 'Show Less' : 'Show More'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Copy Success Message */}
        {isCopied && (
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-400/10 border border-green-400/30 text-green-400 text-sm">
              Text copied to clipboard!
            </div>
          </div>
        )}

        {/* Empty State */}
        {isPlaceholder && (
          <div className="text-center py-8">
            <VolumeX className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">
              Your transcribed text will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptionPanel;
