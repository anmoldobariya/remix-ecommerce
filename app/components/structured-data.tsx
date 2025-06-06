import React from 'react';

interface StructuredDataProps {
  data: object;
}

/**
 * Component to safely add JSON-LD structured data to the head
 * Since Remix meta functions don't support script tags, we use this component instead
 */
export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
    />
  );
}
