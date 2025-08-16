import React, { useState } from 'react';
import { Editor } from './components/Editor';
import { OutputPanel } from './components/OutputPanel';
import { LanguageSelector } from './components/LanguageSelector';
import { AskAIButton } from './components/AskAIButton';
import { PlayIcon } from 'lucide-react';

export function App() {
  const [language, setLanguage] = useState<'go' | 'rust' | 'cpp'>('go');
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  const handleCodeChange = (value: string) => {
    setCode(value);
  };

  const handleLanguageChange = (lang: 'go' | 'rust' | 'cpp') => {
    setLanguage(lang);
    setOutput('');
    setStatus('idle');
    setAiResponse('');
    setCode(''); // Optionally also clear code when changing language
  };

  const runCode = async () => {
    setStatus('loading');
    setOutput('Compiling and running...');
    setAiResponse('');
    console.log("Current code before running:", code); // Debug: You should see your code here!
    try {
      const endpoint = `http://localhost:8080/api/code/execute/${language}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: code
      });
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      const data = await response.json();
      setOutput(data.output || '');
      setStatus(data.status === 'success' ? 'success' : 'error');
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setStatus('error');
    }
  };

  const askAI = async () => {
    if (!output || status !== 'error') return;
    setAiLoading(true);
    try {
      const response = await fetch('http://localhost:8080/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,     // send latest code!
          error: output,  // the error message/output
          lang: language
        })
      });
      const data = await response.text();
      setAiResponse(data);
    } catch (error) {
      setAiResponse(
        `Failed to get AI help: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gray-900 text-white">
      <header className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <h1 className="text-xl font-bold">Code Compiler IDE</h1>
        <LanguageSelector language={language} onLanguageChange={handleLanguageChange} />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col w-1/2 border-r border-gray-700">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
            <h2 className="font-medium">Code Editor</h2>
            <button onClick={runCode} className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium" disabled={status === 'loading'}>
              <PlayIcon className="w-4 h-4 mr-1" />
              Run
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor language={language} value={code} onChange={handleCodeChange} />
          </div>
        </div>
        <div className="flex flex-col w-1/2">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
            <h2 className="font-medium">Output</h2>
            {status === 'error' && <AskAIButton onClick={askAI} loading={aiLoading} />}
          </div>
          <div className="flex-1 overflow-auto">
            <OutputPanel output={output} status={status} aiResponse={aiResponse} />
          </div>
        </div>
      </div>
    </div>
  );
}