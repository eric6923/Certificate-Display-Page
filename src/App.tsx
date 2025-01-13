import React, { useState, useEffect } from 'react';
import { Search, GraduationCap } from 'lucide-react';

interface Certificate {
  id: number;
  firstName: string;
  lastName: string;
  fromDate: string;
  tomDate: string;
  createdAt: string;
}

function App() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://totem-consultancy-alpha.vercel.app/api/certificates')
      .then(response => response.json())
      .then(data => {
        setCertificates(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const filteredCertificates = certificates.filter(cert => 
    `${cert.firstName} ${cert.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="text-white w-12 h-12 mr-4" />
            <h1 className="text-3xl font-bold text-white">Student Certifications</h1>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by student name..."
              className="w-full pl-12 pr-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCertificates.map(cert => (
              <div
                key={cert.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">ID: {cert.id}</span>
                    <span className="text-sm text-gray-500">
                      Created: {formatDate(cert.createdAt)}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {cert.firstName} {cert.lastName}
                  </h2>
                  <div className="text-sm text-gray-600">
                    <p className="mb-1">
                      <span className="font-medium">From:</span> {formatDate(cert.fromDate)}
                    </p>
                    <p>
                      <span className="font-medium">To:</span> {formatDate(cert.tomDate)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && filteredCertificates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No certificates found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;