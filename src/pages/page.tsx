import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Markdown from 'react-markdown';

// Syntax in .md files:
//   {{input:fieldName:placeholder text}}
//   {{select:fieldName:option1,option2,option3}}
//   {{break}}


const Page: React.FC = () => {
  const [searchParams] = useSearchParams();
  const content = searchParams.get('content');
  const [markdown, setMarkdown] = useState('');
  const [error, setError] = useState('');
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!content) {
      setError('No content parameter provided.');
      return;
    }

    fetch(`/${content}.md`)
      .then((res) => {
        if (!res.ok) throw new Error('File not found');
        return res.text();
      })
      .then(setMarkdown)
      .catch(() => setError(`Could not load "${content}.md"`));
  }, [content]);

  const handleChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  if (error) {
    return (
      <div className="p-4 w-[375px] h-[667px] bg-[#EEE] rounded-[30px] border-2 border-[#222] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden relative">
        <p className="pt-12 text-red-700">{error}</p>
      </div>
    );
  }

  // Split markdown into segments: plain text, form controls, and breaks
  const segments: React.ReactNode[] = [];
  const combined = /\{\{(input|select|break)(?::([^:}]+))?(?::([^}]*))?\}\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = combined.exec(markdown)) !== null) {
    // Add preceding markdown text
    if (match.index > lastIndex) {
      const text = markdown.slice(lastIndex, match.index);
      segments.push(<Markdown key={`md-${lastIndex}`}>{text}</Markdown>);
    }

    const [, type, field, meta] = match;

    if (type === 'break') {
      segments.push(<br key={`br-${match.index}`} />);
    } else if (type === 'input') {
      segments.push(
        <input
          key={`input-${field}`}
          type="text"
          placeholder={meta}
          value={formValues[field] ?? ''}
          onChange={(e) => handleChange(field, e.target.value)}
        />
      );
    } else if (type === 'select') {
      const options = (meta ?? '').split(',').map((o) => o.trim());
      segments.push(
        <select
          key={`select-${field}`}
          value={formValues[field] ?? ''}
          onChange={(e) => handleChange(field, e.target.value)}
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining markdown text
  if (lastIndex < markdown.length) {
    segments.push(<Markdown key={`md-${lastIndex}`}>{markdown.slice(lastIndex)}</Markdown>);
  }

  return (
    <div className="p-4 w-[375px] h-[667px] bg-[#EEE] rounded-[30px] border-2 border-[#222] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-y-auto relative">
      {segments}
    </div>
  );
};

export default Page;
