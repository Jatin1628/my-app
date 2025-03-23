"use client";
import React, { useState } from 'react';

interface SearchResultItem {
  title: string;
  link: string;
  snippet: string;
}

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { method: 'GET' });
      const data = await response.json();
  
      if (data.error) {
        setError(data.error);
        setResults([]);
      } else if (data.answer) {
        // If you prefer to display a single answer
        setResults([data.answer]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('An error occurred while searching.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <h2>Google Custom Search</h2>
      <input
        type="text"
        placeholder="Enter your search query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '300px', marginRight: '8px' }}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {results.map((item, index) => (
          <li key={index} style={{ margin: '10px 0' }}>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <strong>{item.title}</strong>
            </a>
            <p>{item.snippet}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchComponent;
