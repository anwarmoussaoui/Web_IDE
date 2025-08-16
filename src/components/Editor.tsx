import React, { useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';

interface EditorProps {
  language: 'go' | 'rust' | 'cpp';
  value: string;
  onChange: (value: string | undefined) => void;
}

const languageMap = {
  go: 'go',
  rust: 'rust',
  cpp: 'cpp'
};

const defaultCode = {
  go: `package main
import "fmt"
func main() {
  fmt.Println("Hello, Go!")
}`,
  rust: `fn main() {
  println!("Hello, Rust!");
}`,
  cpp: `#include <stdio.h>
int main() {
  printf("Hello, C++!\\n");
  return 0;
}`
};

export const Editor: React.FC<EditorProps> = ({
  language,
  value,
  onChange
}) => {
  useEffect(() => {
    // If value is empty, initialize to defaultCode for the selected language and notify parent
    if (!value) {
      onChange(defaultCode[language]);
    }
    // Only run when language changes, or on first mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <MonacoEditor
      height="100%"
      language={languageMap[language]}
      value={value || defaultCode[language]}
      onChange={onChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        tabSize: 2,
        automaticLayout: true
      }}
    />
  );
};