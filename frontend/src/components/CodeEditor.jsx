// src/components/CodeEditor.jsx

import React from 'react';
import CodeMirror from '@uiw/react-codemirror';

// Import the language extensions we need
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';

// Import a theme. There are many available.
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

// A map to easily select the language extension
const languageMap = {
  javascript: [javascript({ jsx: true })],
  python: [python()],
  cpp: [cpp()],
};

function CodeEditor({ value, onChange, language }) {
  // The onChange handler for CodeMirror provides the value directly
  const handleChange = (newValue) => {
    onChange(newValue);
  };

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <CodeMirror
        value={value}
        height="400px"
        theme={vscodeDark}
        // Select the correct language extension from our map
        extensions={languageMap[language]}
        onChange={handleChange}
        basicSetup={{
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
        }}
      />
    </div>
  );
}

export default CodeEditor;