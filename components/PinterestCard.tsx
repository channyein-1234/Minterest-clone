'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

export interface PinData {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
}

interface PinterestCardProps {
  pin: PinData;
  onClick: (pin: PinData) => void;
}

export function PinterestCard({ pin, onClick }: PinterestCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
      onClick={() => onClick(pin)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="h-48 w-full transition-transform duration-300"
        style={{
          backgroundColor: pin.color,
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        <div className="h-full w-full flex items-center justify-center p-6">
          <h3 className="text-white text-xl font-bold text-center drop-shadow-lg">
            {pin.title}
          </h3>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {pin.description}
        </p>
        <div className="mt-2">
          <span className="text-xs font-medium px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
            {pin.category}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
