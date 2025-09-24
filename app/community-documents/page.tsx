'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/Button';
import { 
  BookOpen, 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Bot, 
  Sparkles,
  Search,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  Zap,
  MessageSquare,
  FileCheck,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  filename: string;
  category: 'CC&R' | 'Bylaws' | 'Community Rules' | 'Forms' | 'Management Reports' | 'Policies';
  uploadDate: string;
  size: string;
  version: string;
  aiAnalyzed: boolean;
  aiSummary?: string;
  lastUpdated: string;
}

const DEFAULT_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    name: 'Complete CC&Rs and Bylaws',
    filename: 'Complete CC&Rs and Bylaws OCR.pdf',
    category: 'CC&R',
    uploadDate: '2024-01-15',
    size: '2.4 MB',
    version: '2024.1',
    aiAnalyzed: true,
    aiSummary: 'Comprehensive governing documents including architectural guidelines, property use restrictions, and board governance procedures.',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'doc-2',
    name: 'Homeowner Information Form',
    filename: 'Homeowner Info Form.pdf',
    category: 'Forms',
    uploadDate: '2024-02-01',
    size: '156 KB',
    version: '1.0',
    aiAnalyzed: true,
    aiSummary: 'Required form for new residents containing contact information, emergency contacts, and property details.',
    lastUpdated: '2024-02-01'
  },
  {
    id: 'doc-3',
    name: 'Parking Rules - Proposed Updates',
    filename: 'Parking Rules - Proposed Updates 07.02.2024 - Redline to 03.31.2020 Adopted Parking Rules.pdf',
    category: 'Community Rules',
    uploadDate: '2024-07-02',
    size: '892 KB',
    version: '2024.2',
    aiAnalyzed: true,
    aiSummary: 'Updated parking regulations with redlined changes from 2020 rules, including guest parking and enforcement procedures.',
    lastUpdated: '2024-07-02'
  },
  {
    id: 'doc-4',
    name: 'Annual Management Disclosure Statement',
    filename: 'Seabreeze Management Company - Annual Management Disclosure Statement 2025.pdf',
    category: 'Management Reports',
    uploadDate: '2025-01-01',
    size: '1.2 MB',
    version: '2025.1',
    aiAnalyzed: true,
    aiSummary: 'Annual disclosure statement from Seabreeze Management Company detailing services, fees, and management responsibilities.',
    lastUpdated: '2025-01-01'
  }
];

export default function CommunityDocumentsPage() {
  const { hasPermission } = useAuth();
  const [documents, setDocuments] = useState<Document[]>(DEFAULT_DOCUMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAIDemo, setShowAIDemo] = useState(false);
  const [aiAnalysisProgress, setAIAnalysisProgress] = useState(0);
  const [showAIResults, setShowAIResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load documents from localStorage
  useEffect(() => {
    const savedDocs = localStorage.getItem('community-documents');
    if (savedDocs) {
      try {
        setDocuments(JSON.parse(savedDocs));
      } catch (error) {
        console.error('Error loading documents:', error);
      }
    }
  }, []);

  // Save documents to localStorage
  const saveDocuments = (newDocs: Document[]) => {
    setDocuments(newDocs);
    localStorage.setItem('community-documents', JSON.stringify(newDocs));
  };

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.aiSummary?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group documents by category
  const documentsByCategory = filteredDocuments.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  // AI Demo simulation
  const startAIDemo = async () => {
    // Reset states
    setAIAnalysisProgress(0);
    setShowAIResults(false);
    
    // Small delay to ensure modal is rendered
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simulate AI analysis progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setAIAnalysisProgress(i);
    }
    
    // Wait a moment then show results
    await new Promise(resolve => setTimeout(resolve, 500));
    setShowAIResults(true);
  };

  const categories = ['CC&R', 'Bylaws', 'Community Rules', 'Forms', 'Management Reports', 'Policies'];
  const canEdit = hasPermission('canConfigureBranding') || hasPermission('canReviewARCRequests');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpen className="text-blue-600" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-ink-900">Community Documents</h1>
        </div>
        {canEdit && (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowAIDemo(true);
                setAIAnalysisProgress(0);
                setShowAIResults(false);
              }}
              className="flex items-center gap-2 text-primary hover:text-primary-700 transition-colors text-body font-medium"
            >
              <Bot size={16} />
              AI Assistant Demo
            </button>
            <Button
              variant="primary"
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2"
            >
              <Upload size={16} />
              Upload Document
            </Button>
          </div>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1 p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-500" size={20} />
            <input
              type="text"
              placeholder="Search documents by name, category, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-body"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-body min-w-[200px]"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        {(searchTerm || selectedCategory !== 'all') && (
          <p className="text-caption text-ink-600 mt-2">
            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* AI Assistant Demo Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-card border border-blue-200 shadow-elev1 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
            <Bot className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-ink-900">AI Document Analysis</h2>
            <p className="text-body text-ink-600">Intelligent document processing for HOA Connect features</p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full border border-emerald-200 ml-auto">
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-emerald-700">AI Demo</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={16} className="text-blue-600" />
              <h3 className="text-h4 font-semibold text-ink-900">HOA Connect Assistant</h3>
            </div>
            <p className="text-caption text-ink-600">AI assistant answers resident questions using analyzed CC&R and bylaws content</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Bot size={16} className="text-purple-600" />
              <h3 className="text-h4 font-semibold text-ink-900">ChatBot Integration</h3>
            </div>
            <p className="text-caption text-ink-600">Automated responses based on community rules and regulations</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <FileCheck size={16} className="text-green-600" />
              <h3 className="text-h4 font-semibold text-ink-900">ARC Request AI</h3>
            </div>
            <p className="text-caption text-ink-600">Intelligent ARC request review using community guidelines</p>
          </div>
        </div>

        <div className="text-center">
          <Button
            variant="primary"
            onClick={startAIDemo}
            className="flex items-center gap-2"
            disabled={aiAnalysisProgress > 0 && aiAnalysisProgress < 100}
          >
            <Sparkles size={16} />
            {aiAnalysisProgress > 0 && aiAnalysisProgress < 100 ? 'Demo Running...' : 'Start AI Analysis Demo'}
          </Button>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-card border border-ink-900/8 shadow-elev1">
        <div className="p-6">
          <div className="space-y-6">
            {categories.map(category => {
              const categoryDocs = documentsByCategory[category] || [];
              if (categoryDocs.length === 0) return null;

              return (
                <div key={category} className="space-y-3">
                  <h3 className="text-h3 font-semibold text-ink-900 border-b border-ink-900/8 pb-2">
                    {category}
                  </h3>
                  <div className="space-y-3">
                    {categoryDocs.map((doc) => (
                      <div key={doc.id} className="p-4 border border-ink-900/8 rounded-lg hover:border-neutral-300 transition-colors">
                        <div className="flex items-start gap-4">
                          {/* Document Icon */}
                          <div className="w-12 h-12 bg-red-100 rounded-lg border border-red-200 flex items-center justify-center flex-shrink-0">
                            <FileText className="text-red-600" size={20} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-h4 font-semibold text-ink-900">{doc.name}</h4>
                              {doc.aiAnalyzed && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                  <Bot size={12} />
                                  <span className="text-xs font-medium">AI Analyzed</span>
                                </div>
                              )}
                            </div>
                            
                            {doc.aiSummary && (
                              <p className="text-body text-ink-600 mb-2">{doc.aiSummary}</p>
                            )}
                            
                            <div className="flex items-center gap-4 text-caption" style={{ color: '#434343' }}>
                              <span>📅 {doc.version || `Uploaded ${new Date(doc.uploadDate).toLocaleDateString()}`}</span>
                              <span>📁 {doc.size}</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className="flex gap-4">
                              <button
                                onClick={() => window.open(`/community-documents/${doc.filename}`, '_blank')}
                                className="flex items-center gap-1 text-primary hover:text-primary-700 transition-colors text-body font-medium"
                              >
                                <Eye size={14} />
                                View
                              </button>
                              <button
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = `/community-documents/${doc.filename}`;
                                  link.download = doc.filename;
                                  link.click();
                                }}
                                className="flex items-center gap-1 text-primary hover:text-primary-700 transition-colors text-body font-medium"
                              >
                                <Download size={14} />
                                Download
                              </button>
                              {canEdit && (
                                <button
                                  className="flex items-center gap-1 text-primary hover:text-primary-700 transition-colors text-body font-medium"
                                >
                                  <Edit3 size={14} />
                                  Edit
                                </button>
                              )}
                            </div>
                            {canEdit && (
                              <button
                                className="flex items-center gap-1 text-primary hover:text-primary-700 transition-colors text-body font-medium"
                              >
                                <Upload size={14} />
                                Update Version
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto text-neutral-400 mb-4" size={48} />
              <h3 className="text-h3 font-medium text-ink-900 mb-2">No Documents Found</h3>
              <p className="text-body text-ink-600 mb-4">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Upload your first community document to get started'
                }
              </p>
              {canEdit && (
                <Button
                  variant="primary"
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2"
                >
                  <Upload size={16} />
                  Upload Document
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Demo Modal */}
      {showAIDemo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-h3 font-semibold text-ink-900">AI Document Analysis Demo</h3>
              <button
                onClick={() => {
                  setShowAIDemo(false);
                  setAIAnalysisProgress(0);
                  setShowAIResults(false);
                }}
                className="text-neutral-500 hover:text-neutral-700"
              >
                ×
              </button>
            </div>

            {!showAIResults ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="text-blue-600" size={32} />
                  </div>
                  <h4 className="text-h4 font-semibold text-ink-900 mb-2">Analyzing Community Documents</h4>
                  <p className="text-body text-ink-600 mb-6">
                    AI is processing CC&Rs, bylaws, and community rules to enhance HOA Connect features
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-body text-ink-900">Processing Documents...</span>
                    <span className="text-body font-medium text-ink-900">{aiAnalysisProgress}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${aiAnalysisProgress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-caption text-ink-600">
                  <div className={`flex items-center gap-2 ${aiAnalysisProgress >= 20 ? 'text-green-600' : ''}`}>
                    {aiAnalysisProgress >= 20 ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 border-2 border-neutral-300 rounded-full" />}
                    Extracting text from PDF documents
                  </div>
                  <div className={`flex items-center gap-2 ${aiAnalysisProgress >= 40 ? 'text-green-600' : ''}`}>
                    {aiAnalysisProgress >= 40 ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 border-2 border-neutral-300 rounded-full" />}
                    Identifying key rules and regulations
                  </div>
                  <div className={`flex items-center gap-2 ${aiAnalysisProgress >= 60 ? 'text-green-600' : ''}`}>
                    {aiAnalysisProgress >= 60 ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 border-2 border-neutral-300 rounded-full" />}
                    Creating searchable knowledge base
                  </div>
                  <div className={`flex items-center gap-2 ${aiAnalysisProgress >= 80 ? 'text-green-600' : ''}`}>
                    {aiAnalysisProgress >= 80 ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 border-2 border-neutral-300 rounded-full" />}
                    Training AI assistant responses
                  </div>
                  <div className={`flex items-center gap-2 ${aiAnalysisProgress >= 100 ? 'text-green-600' : ''}`}>
                    {aiAnalysisProgress >= 100 ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 border-2 border-neutral-300 rounded-full" />}
                    Integrating with HOA Connect features
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-green-600" size={32} />
                  </div>
                  <h4 className="text-h4 font-semibold text-ink-900 mb-2">AI Analysis Complete!</h4>
                  <p className="text-body text-ink-600 mb-6">
                    Your community documents have been successfully analyzed and integrated
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={16} className="text-blue-600" />
                      <h4 className="text-h4 font-semibold text-blue-900">Dashboard Assistant</h4>
                    </div>
                    <p className="text-caption text-blue-700 mb-3">Now powered by your CC&Rs and bylaws</p>
                    <div className="text-xs text-blue-600 space-y-1">
                      <div>✓ Architectural guidelines</div>
                      <div>✓ Property use restrictions</div>
                      <div>✓ Community amenities rules</div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot size={16} className="text-purple-600" />
                      <h4 className="text-h4 font-semibold text-purple-900">ChatBot Enhanced</h4>
                    </div>
                    <p className="text-caption text-purple-700 mb-3">Intelligent responses using community rules</p>
                    <div className="text-xs text-purple-600 space-y-1">
                      <div>✓ Parking regulations</div>
                      <div>✓ Pet policies</div>
                      <div>✓ Noise ordinances</div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FileCheck size={16} className="text-green-600" />
                      <h4 className="text-h4 font-semibold text-green-900">ARC Request AI</h4>
                    </div>
                    <p className="text-caption text-green-700 mb-3">Smart review using architectural standards</p>
                    <div className="text-xs text-green-600 space-y-1">
                      <div>✓ Design compliance checks</div>
                      <div>✓ Material restrictions</div>
                      <div>✓ Approval recommendations</div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAIDemo(false);
                      setAIAnalysisProgress(0);
                      setShowAIResults(false);
                    }}
                  >
                    Close Demo
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-h3 font-semibold text-ink-900 mb-4">Upload Community Document</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Document Name</label>
                <input
                  type="text"
                  placeholder="e.g., Updated Parking Rules"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">Category</label>
                <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-body font-medium text-ink-700 mb-2">File</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="block w-full text-caption text-ink-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-caption file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="aiAnalysis"
                  className="rounded border-ink-300 text-primary focus:ring-primary"
                  defaultChecked
                />
                <label htmlFor="aiAnalysis" className="text-body text-ink-700">
                  Enable AI analysis for smart features
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex items-center gap-2"
              >
                <Upload size={16} />
                Upload Document
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
