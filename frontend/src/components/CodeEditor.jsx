// src/components/CodeEditor.jsx

import React from 'react';
import Editor from '@monaco-editor/react';

// It accepts "value" and "onChange"
function CodeEditor({ value, onChange }) {
    // The handler that will be called whenever the code changes.
    const handleEditorChange = (value) => {
        onChange(value);
    };

    return (
        <div className="bg-gray-900 rounded-lg overflow-hidden">
        <Editor
            height="60vh" // Set a height for the editor
            theme="vs-dark" // Use a dark theme
            defaultLanguage="javascript" // Set the default language
            value={value} // The current value of the editor
            onChange={handleEditorChange} // The function to call on change
        />
        </div>
    );
}

export default CodeEditor;