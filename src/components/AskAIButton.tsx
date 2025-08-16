import React from 'react';
import { BrainIcon, LoaderIcon } from 'lucide-react';
interface AskAIButtonProps {
  onClick: () => void;
  loading: boolean;
}
export const AskAIButton: React.FC<AskAIButtonProps> = ({
  onClick,
  loading
}) => {
  return <button onClick={onClick} disabled={loading} className="flex items-center px-3 py-1 bg-purple-700 hover:bg-purple-800 rounded text-sm font-medium transition-colors">
      {loading ? <LoaderIcon className="w-4 h-4 mr-1 animate-spin" /> : <BrainIcon className="w-4 h-4 mr-1" />}
      {loading ? 'Asking AI...' : 'Fix using AI'}
    </button>;
};