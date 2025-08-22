'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Chargement dynamique de Monaco Editor pour éviter les problèmes de SSR
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-gray-900 rounded-lg p-4 text-gray-500">
        Chargement de l'éditeur...
      </div>
    )
  }
);

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language?: string;
  height?: string | number;
}

export default function CodeEditor({ 
  code, 
  onChange, 
  language = 'typescript',
  height = '500px' 
}: CodeEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-full w-full bg-gray-900 rounded-lg p-4 text-gray-500">
        Chargement de l'éditeur...
      </div>
    );
  }

  const handleChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-700">
      <MonacoEditor
        height={height.toString()}
        defaultLanguage={language}
        theme="vs-dark"
        value={code}
        onChange={handleChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: { top: 10 },
        }}
      />
    </div>
  );
}
