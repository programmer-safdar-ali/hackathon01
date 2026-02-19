import React from 'react';
import ChatbotWidget from '@site/src/components/ChatbotWidget';

export default function Root({children}: {children: React.ReactNode}): JSX.Element {
  return (
    <>
      {children}
      <ChatbotWidget />
    </>
  );
}
