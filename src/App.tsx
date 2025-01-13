import { useState, useEffect } from "react";
import {
  Search,
  GraduationCap,
  Download,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Certificate {
  id: number;
  firstName: string;
  lastName: string;
  fromDate: string;
  tomDate: string;
  createdAt: string;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const App = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  useEffect(() => {
    fetch("https://totem-consultancy-alpha.vercel.app/api/certificates")
      .then((response) => response.json())
      .then((data) => {
        setCertificates(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const filteredCertificates = certificates.filter((cert) =>
    `${cert.firstName} ${cert.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const downloadCSV = () => {
    const headers = [
      "ID",
      "First Name",
      "Last Name",
      "From Date",
      "To Date",
      "Created At",
    ];
    const csvData = certificates.map((cert) => [
      cert.id,
      cert.firstName,
      cert.lastName,
      formatDate(cert.fromDate),
      formatDate(cert.tomDate),
      formatDate(cert.createdAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "student_certificates.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDownloadMenu(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text("Student Certificates", 14, 15);

    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

    // Create table
    const tableColumns = [
      "ID",
      "First Name",
      "Last Name",
      "From Date",
      "To Date",
      "Created At",
    ];

    const tableData = certificates.map((cert) => [
      cert.id,
      cert.firstName,
      cert.lastName,
      formatDate(cert.fromDate),
      formatDate(cert.tomDate),
      formatDate(cert.createdAt),
    ]);

    autoTable(doc, {
      head: [tableColumns],
      body: tableData,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 133, 244] },
    });

    doc.save("student_certificates.pdf");
    setShowDownloadMenu(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-6 sm:py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="text-white w-8 h-8 sm:w-12 sm:h-12 mr-3 sm:mr-4" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Student Certifications</h1>
          </div>
          
          {/* Search and Download Bar */}
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by student name..."
                className="w-full pl-12 pr-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 border border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Download button with dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="w-full sm:w-auto bg-white text-blue-600 px-6 py-3 rounded-lg shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2 transition-colors duration-200"
              >
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
              
              {showDownloadMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button
                      onClick={downloadPDF}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Download as PDF
                    </button>
                    <button
                      onClick={downloadCSV}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      Download as CSV
                    </button>
                  </div>
                </div>
              )}
            </div>
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
            {/* Desktop view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
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

            {/* Mobile view */}
            <div className="md:hidden space-y-4 p-4">
              {filteredCertificates.map(cert => (
                <div 
                  key={cert.id} 
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="border-b border-gray-100 bg-gray-50 px-4 py-2 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">#{cert.id}</span>
                      <span className="h-4 w-px bg-gray-300"/>
                      <span className="text-xs text-gray-500">Created: {formatDate(cert.createdAt)}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {cert.firstName} {cert.lastName}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-md p-3">
                        <span className="block text-xs text-gray-500 mb-1">From Date</span>
                        <span className="block text-sm font-medium text-gray-900">
                          {formatDate(cert.fromDate)}
                        </span>
                      </div>

                      <div className="bg-gray-50 rounded-md p-3">
                        <span className="block text-xs text-gray-500 mb-1">To Date</span>
                        <span className="block text-sm font-medium text-gray-900">
                          {formatDate(cert.tomDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredCertificates.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No certificates found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default App;
