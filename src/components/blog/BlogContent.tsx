'use client';

import React from 'react';

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  // Parse HTML content and render with proper styling
  return (
    <div 
      className="blog-content prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
      style={{
        lineHeight: '1.8',
        fontSize: '1.125rem'
      }}
    />
  );
}
