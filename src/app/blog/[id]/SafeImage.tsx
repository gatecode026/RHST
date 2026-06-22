'use client';

import React, { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  hideOnError?: boolean;
}

export default function SafeImage({ 
  src, 
  fallbackSrc = '/images/bestselling_ipad.png', 
  hideOnError = false,
  ...props 
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (hideOnError) {
      setHasError(true);
    } else {
      setImgSrc(fallbackSrc);
    }
  };

  if (hasError) return null;

  return (
    <img 
      src={imgSrc || fallbackSrc} 
      onError={handleError} 
      {...props} 
    />
  );
}
