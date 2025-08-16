import React from 'react';

interface OutputPanelProps {
  output: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  aiResponse: string;
}

function renderAiResponse(aiResponse: string) {
  // Find all triple-backtick code blocks and inline make them copyable
  const codeBlockRegex = /```(\w*)\n?([\s\S]+?)```/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let idx = 0;

  while ((match = codeBlockRegex.exec(aiResponse)) !== null) {
    const [fullMatch, lang, code] = match;
    const start = match.index;

    // Text before this code block
    if (start > lastIndex) {
      parts.push(
        <div key={idx++} className="mb-2 text-blue-200">
          {aiResponse.substring(lastIndex, start)}
        </div>
      );
    }

    // The code block itself with a copy button
    parts.push(
      <CopyableCodeBlock key={idx++} code={code} language={lang} />
    );

    lastIndex = start + fullMatch.length;
  }

  // Any trailing text
  if (lastIndex < aiResponse.length) {
    parts.push(
      <div key={idx++} className="mb-2 text-blue-200">
        {aiResponse.substring(lastIndex)}
      </div>
    );
  }

  return <>{parts}</>;
}

// Helper: Copyable code block component
function CopyableCodeBlock({ code, language }: { code: string; language?: string }) {
  const handleCopy = () => navigator.clipboard.writeText(code);
  return (
    <div className="relative mb-3">
      <pre
        className="bg-[#23272e] text-blue-100 rounded px-3 py-2 text-xs overflow-x-auto"
        style={{ fontFamily: 'Fira Mono, monospace' }}
      >
        <code>{code}</code>
      </pre>
      <button
        className="absolute top-2 right-2 bg-gray-700 text-blue-300 px-2 py-1 rounded text-xs hover:bg-blue-700"
        onClick={handleCopy}
        type="button"
      >
        Copy
      </button>
    </div>
  );
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  output,
  status,
  aiResponse
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'loading':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="h-full p-4 bg-gray-900 font-mono text-sm overflow-auto">
      {status !== 'idle' && (
        <div className="mb-2">
          <span className={`font-semibold ${getStatusColor()}`}>
            {status === 'loading'
              ? 'Running...'
              : status === 'success'
              ? 'Success'
              : 'Error'}
          </span>
        </div>
      )}
      {output && (
        <pre className="whitespace-pre-wrap break-words mb-6">{output}</pre>
      )}
      {aiResponse && (
        <div className="mt-4 border-t border-gray-700 pt-4">
          <h3 className="text-blue-400 font-semibold mb-2">AI Suggestion:</h3>
          <div>{renderAiResponse(aiResponse)}</div>
        </div>
      )}
      {!output && status === 'idle' && (
        <div className="text-gray-500 italic">
          Click "Run" to compile and execute your code.
        </div>
      )}
    </div>
  );
};