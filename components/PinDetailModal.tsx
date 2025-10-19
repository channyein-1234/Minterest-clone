'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PinData } from './PinterestCard';
import { Loader2 } from 'lucide-react';

interface PinDetailModalProps {
  pin: PinData | null;
  isOpen: boolean;
  onClose: () => void;
  relatedPins: PinData[];
  isGeneratingRelated: boolean;
  onRelatedPinClick: (pin: PinData) => void;
}

export function PinDetailModal({
  pin,
  isOpen,
  onClose,
  relatedPins,
  isGeneratingRelated,
  onRelatedPinClick,
}: PinDetailModalProps) {
  if (!pin) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Idea Details</DialogTitle>
          <DialogDescription>
            <span className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
              {pin.category}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Color Banner with Idea */}
          <div
            className="min-h-32 w-full rounded-lg flex items-center justify-center p-6"
            style={{ backgroundColor: pin.color }}
          >
            <p className="text-white text-xl font-medium text-center drop-shadow-lg leading-relaxed">
              {pin.idea}
            </p>
          </div>

          {/* Related Ideas Section */}
          <div>
            <h4 className="font-semibold mb-3 text-lg">More Ideas Like This</h4>
            
            {isGeneratingRelated && relatedPins.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                <span className="ml-2 text-muted-foreground">Generating related ideas...</span>
              </div>
            )}
            
            {relatedPins.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {relatedPins.map((relatedPin) => (
                  <div
                    key={relatedPin.id}
                    className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-lg overflow-hidden border"
                    onClick={() => onRelatedPinClick(relatedPin)}
                  >
                    <div
                      className="h-24 w-full flex items-center justify-center p-3"
                      style={{ backgroundColor: relatedPin.color }}
                    >
                      <p className="text-white text-xs font-medium text-center drop-shadow-lg line-clamp-3">
                        {relatedPin.idea}
                      </p>
                    </div>
                    <div className="p-3">
                      <div>
                        <span className="text-xs font-medium px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
                          {relatedPin.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {isGeneratingRelated && relatedPins.length > 0 && (
              <div className="text-center mt-3 text-sm text-muted-foreground">
                <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
                Loading more...
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
