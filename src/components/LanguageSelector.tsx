import React from 'react';
interface LanguageSelectorProps {
  language: 'go' | 'rust' | 'cpp';
  onLanguageChange: (language: 'go' | 'rust' | 'cpp') => void;
}
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onLanguageChange
}) => {
  return <div className="flex space-x-1">
      <LanguageTab language="go" current={language} onClick={() => onLanguageChange('go')} />
      <LanguageTab language="rust" current={language} onClick={() => onLanguageChange('rust')} />
      <LanguageTab language="cpp" current={language} onClick={() => onLanguageChange('cpp')} />
    </div>;
};
interface LanguageTabProps {
  language: 'go' | 'rust' | 'cpp';
  current: 'go' | 'rust' | 'cpp';
  onClick: () => void;
}
const LanguageTab: React.FC<LanguageTabProps> = ({
  language,
  current,
  onClick
}) => {
  const isActive = language === current;
  return <button onClick={onClick} className={`px-4 py-1.5 rounded-t-md text-sm font-medium transition-colors
        ${isActive ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}>
      {language.toUpperCase()}
    </button>;
};