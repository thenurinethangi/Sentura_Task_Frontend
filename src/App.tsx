import React, { useEffect, useState } from 'react';
import './App.css';

interface Country {
  flag: string;
  name: string;
  capital: string;
  region: string;
  population: number;
}

const CountriesTable: React.FC<{ countries: Country[]; onRowClick: (country: Country) => void }> = ({ countries, onRowClick }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr>
        <th>Flag</th>
        <th>Name</th>
        <th>Capital</th>
        <th>Region</th>
        <th>Population</th>
      </tr>
    </thead>
    <tbody>
      {countries.map((country) => (
        <tr key={country.name} style={{ cursor: 'pointer' }} onClick={() => onRowClick(country)}>
          <td><img src={country.flag} alt={country.name + ' flag'} style={{ width: 32, height: 20 }} /></td>
          <td>{country.name}</td>
          <td>{country.capital}</td>
          <td>{country.region}</td>
          <td>{country.population.toLocaleString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
);


const App: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      setError('');
      let url = 'http://localhost:8080/api/countries';
      if (search.trim()) {
        url = `http://localhost:8080/api/countries/search?name=${encodeURIComponent(search)}`;
      }
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch countries');
        const data = await res.json();
        setCountries(data);
      } catch (e) {
        setCountries([]);
        setError('Error loading countries');
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, [search]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Countries</h1>
      <input
        type="text"
        placeholder="Search countries..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 16, padding: 8, width: 300 }}
      />
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && (
        <CountriesTable countries={countries} onRowClick={setSelectedCountry} />
      )}
      {selectedCountry && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedCountry(null)}
        >
          <div
            style={{
              background: '#fff',
              padding: 32,
              borderRadius: 8,
              minWidth: 320,
              boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              style={{ position: 'absolute', top: 8, right: 8 }}
              onClick={() => setSelectedCountry(null)}
            >
              Close
            </button>
            <h2>{selectedCountry.name}</h2>
            <img src={selectedCountry.flag} alt={selectedCountry.name + ' flag'} style={{ width: 64, height: 40 }} />
            <p><strong>Capital:</strong> {selectedCountry.capital}</p>
            <p><strong>Region:</strong> {selectedCountry.region}</p>
            <p><strong>Population:</strong> {selectedCountry.population.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
