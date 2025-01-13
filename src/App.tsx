import React, { useState, useEffect } from 'react';
import { Search, GraduationCap, Download } from 'lucide-react';

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

  const downloadCSV = () => {
    const headers = ['ID', 'First Name', 'Last Name', 'From Date', 'To Date', 'Created At'];
    const csvData = certificates.map(cert => [
      cert.id,
      cert.firstName,
      cert.lastName,
      formatDate(cert.fromDate),
      formatDate(cert.tomDate),
      formatDate(cert.createdAt)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'student_certificates.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          
          {/* Search and Download Bar */}
          <div className="max-w-4xl mx-auto flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by student name..."
                className="w-full pl-12 pr-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={downloadCSV}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center gap-2 transition-colors duration-200"
            >
              <Download className="w-5 h-5" />
              Download CSV
            </button>
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
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">First Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Last Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">From Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">To Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCertificates.map(cert => (
                    <tr key={cert.id} className="hover:bg-blue-50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm text-gray-900">{cert.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{cert.firstName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{cert.lastName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatDate(cert.fromDate)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatDate(cert.tomDate)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatDate(cert.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredCertificates.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No certificates found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;