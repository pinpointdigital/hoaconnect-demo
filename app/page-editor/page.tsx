'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { 
  Home as HomeIcon, 
  Users, 
  Building, 
  Calendar, 
  FileText,
  Edit3,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Palette,
  Type,
  Image as ImageIcon,
  Settings,
  X
} from 'lucide-react';
import Link from 'next/link';

interface EditableContent {
  communityName: string;
  welcomeTitle: string;
  heroImage: string;
  communityDescription: string;
  primaryColor: string;
  secondaryColor: string;
  highlights: {
    highlight1: { title: string; description: string };
    highlight2: { title: string; description: string };
    highlight3: { title: string; description: string };
    highlight4: { title: string; description: string };
  };
  events: {
    boardMeeting: { title: string; date: string; image: string };
    fallCleanup: { title: string; date: string; image: string };
    poolMaintenance: { title: string; date: string; image: string };
  };
}

const defaultContent: EditableContent = {
  communityName: 'Rancho Madrina Community',
  welcomeTitle: 'Welcome to Rancho Madrina Community',
  heroImage: '/demo/rancho-madrina-header.jpg',
  communityDescription: 'Rancho Madrina is a gated community located in San Juan Capistrano developed by the William Lyon Company that opened in 2006. The community sits within walking distance of the charm and historic make up of San Juan Capistrano\'s downtown with easy access to the (5) Fwy, (74) Ortega Hwy (74) and the (79) and (241) Toll Roads.',
  primaryColor: 'slate',
  secondaryColor: 'stone',
  highlights: {
    highlight1: { title: '120 Homes', description: 'Ten unique floor plans' },
    highlight2: { title: 'Gated Community', description: 'Secure & private' },
    highlight3: { title: 'Prime Location', description: 'Walk to downtown' },
    highlight4: { title: 'Est. 2006', description: 'William Lyon Company' }
  },
  events: {
    boardMeeting: {
      title: 'Board Meeting',
      date: 'November 20, 2024 • 7:00 PM',
      image: 'https://www.cmhoa.com/wp-content/uploads/2019/08/hoa-board-meetings-types-Planning-and-purpose.jpeg'
    },
    fallCleanup: {
      title: 'HOA Fall Cleanup',
      date: 'November 15, 2024 • 8:00 AM',
      image: 'https://pristinelandscapingandlighting.com/wp-content/uploads/2024/07/HOA-Lawn-Care.jpeg'
    },
    poolMaintenance: {
      title: 'Pool Maintenance',
      date: 'October 15, 2024 • Completed',
      image: 'https://www.familypoolmaintenance.com/wp-content/uploads/2020/08/pool-cleaning-service.jpg'
    }
  }
};

export default function PageEditor() {
  const [content, setContent] = useState<EditableContent>(defaultContent);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'highlights' | 'events'>('content');
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved content from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('page-editor-content');
    if (saved) {
      const savedContent = JSON.parse(saved);
      // Ensure highlights exist in saved content
      if (!savedContent.highlights) {
        savedContent.highlights = defaultContent.highlights;
      }
      setContent(savedContent);
    }
  }, []);

  // Save content to localStorage
  const saveContent = () => {
    localStorage.setItem('page-editor-content', JSON.stringify(content));
    alert('Changes saved successfully!');
  };

  // Reset to default content
  const resetContent = () => {
    setContent(defaultContent);
    localStorage.removeItem('page-editor-content');
    alert('Content reset to default!');
  };

  const updateContent = (path: string, value: string) => {
    setContent(prev => {
      const newContent = { ...prev };
      const keys = path.split('.');
      let current: any = newContent;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return newContent;
    });
  };

  const colorOptions = [
    { name: 'Coastal Slate', primary: 'slate', secondary: 'stone' },
    { name: 'Ocean Blue', primary: 'blue', secondary: 'cyan' },
    { name: 'Warm Amber', primary: 'amber', secondary: 'orange' },
    { name: 'Forest Green', primary: 'emerald', secondary: 'teal' },
    { name: 'Sunset Rose', primary: 'rose', secondary: 'pink' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Editor Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">HOA Website Editor</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              Demo Mode
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link href="/">
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <X size={16} />
                <span>Cancel</span>
              </button>
            </Link>
            
            
            <button
              onClick={saveContent}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
            
            <button
              onClick={resetContent}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Editor Panel */}
        <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            {/* Editor Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
              {[
                { id: 'content', label: 'Content', icon: <Type size={16} /> },
                { id: 'design', label: 'Design', icon: <Palette size={16} /> },
                { id: 'highlights', label: 'Highlights', icon: <Settings size={16} /> },
                { id: 'events', label: 'Events', icon: <Calendar size={16} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Community Name
                  </label>
                  <input
                    type="text"
                    value={content.communityName}
                    onChange={(e) => updateContent('communityName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Welcome Title
                  </label>
                  <input
                    type="text"
                    value={content.welcomeTitle}
                    onChange={(e) => updateContent('welcomeTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Image
                    <span className="text-xs text-gray-500 ml-2">(Recommended: 1200x400px)</span>
                  </label>
                  <div className="space-y-3">
                    <input
                      type="url"
                      value={content.heroImage}
                      onChange={(e) => updateContent('heroImage', e.target.value)}
                      placeholder="Enter image URL..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="text-center">
                      <span className="text-xs text-gray-500">or</span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            updateContent('heroImage', result);
                            setImagePreview(result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center space-x-2"
                    >
                      <ImageIcon size={16} />
                      <span>Upload Image</span>
                    </button>
                    {imagePreview && (
                      <div className="mt-2">
                        <img src={imagePreview} alt="Preview" className="w-full h-20 object-cover rounded border" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Community Description
                  </label>
                  <textarea
                    value={content.communityDescription}
                    onChange={(e) => updateContent('communityDescription', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Highlights Tab */}
            {activeTab === 'highlights' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Community Highlights</h3>
                  <p className="text-sm text-gray-600 mb-6">Edit the four feature cards that showcase your community's key attributes.</p>
                </div>
                
                {Object.entries(content.highlights || {}).map(([key, highlight]) => (
                  <div key={key} className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Highlight {key.slice(-1)}
                    </h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={highlight.title}
                          onChange={(e) => updateContent(`highlights.${key}.title`, e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={highlight.description}
                          onChange={(e) => updateContent(`highlights.${key}.description`, e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Design Tab */}
            {activeTab === 'design' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Color Scheme
                  </label>
                  <div className="space-y-3">
                    {colorOptions.map((option) => (
                      <button
                        key={option.name}
                        onClick={() => {
                          updateContent('primaryColor', option.primary);
                          updateContent('secondaryColor', option.secondary);
                        }}
                        className={`w-full p-3 rounded-lg border-2 transition-all ${
                          content.primaryColor === option.primary
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{option.name}</span>
                          <div className="flex space-x-2">
                            <div className={`w-4 h-4 rounded-full bg-${option.primary}-500`}></div>
                            <div className={`w-4 h-4 rounded-full bg-${option.secondary}-500`}></div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                {Object.entries(content.events).map(([key, event]) => (
                  <div key={key} className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Event Title
                        </label>
                        <input
                          type="text"
                          value={event.title}
                          onChange={(e) => updateContent(`events.${key}.title`, e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Date & Time
                        </label>
                        <input
                          type="text"
                          value={event.date}
                          onChange={(e) => updateContent(`events.${key}.date`, e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={event.image}
                          onChange={(e) => updateContent(`events.${key}.image`, e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Preview */}
        {showPreview && (
          <div className="flex-1 overflow-y-auto bg-gray-100">
            <div className="p-6">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Preview Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Live Preview</h2>
                    <div className="flex items-center space-x-2 text-blue-200">
                      <Eye size={16} />
                      <span className="text-sm">Real-time updates</span>
                    </div>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="relative">
                  {/* Navigation Preview */}
                  <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xl text-gray-900">{content.communityName}</span>
                      <div className="flex items-center space-x-6">
                        <span className="text-sm text-gray-700">Home</span>
                        <span className="text-sm text-gray-700">About</span>
                        <span className="text-sm text-gray-700">Gallery</span>
                        <div className="flex space-x-2">
                          <button 
                            className="px-3 py-1 text-white text-xs rounded"
                            style={{
                              background: content.primaryColor === 'slate' ? 'linear-gradient(to right, #475569, #334155)' :
                                         content.primaryColor === 'blue' ? 'linear-gradient(to right, #3b82f6, #1d4ed8)' :
                                         content.primaryColor === 'amber' ? 'linear-gradient(to right, #f59e0b, #d97706)' :
                                         content.primaryColor === 'emerald' ? 'linear-gradient(to right, #10b981, #047857)' :
                                         content.primaryColor === 'rose' ? 'linear-gradient(to right, #f43f5e, #e11d48)' :
                                         'linear-gradient(to right, #475569, #334155)'
                            }}
                          >
                            Registration
                          </button>
                          <button 
                            className="px-3 py-1 text-white text-xs rounded"
                            style={{
                              background: content.secondaryColor === 'stone' ? 'linear-gradient(to right, #57534e, #44403c)' :
                                         content.secondaryColor === 'cyan' ? 'linear-gradient(to right, #06b6d4, #0891b2)' :
                                         content.secondaryColor === 'orange' ? 'linear-gradient(to right, #ea580c, #c2410c)' :
                                         content.secondaryColor === 'teal' ? 'linear-gradient(to right, #14b8a6, #0d9488)' :
                                         content.secondaryColor === 'pink' ? 'linear-gradient(to right, #ec4899, #db2777)' :
                                         'linear-gradient(to right, #57534e, #44403c)'
                            }}
                          >
                            Login
                          </button>
                        </div>
                      </div>
                    </div>
                  </nav>

                  {/* Hero Section Preview */}
                  <section className={`py-12 bg-gradient-to-br from-${content.primaryColor}-50 via-teal-50 to-neutral-100`}>
                    <div className="max-w-6xl mx-auto px-6">
                      <div className="text-center mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                          {content.welcomeTitle}
                        </h1>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                        {/* Hero Image */}
                        <div className="lg:col-span-2">
                          <img
                            src={content.heroImage}
                            alt="Community Entrance"
                            className="w-full h-48 object-cover rounded-xl shadow-lg"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwTDE2MCA4MEwyMDAgNjBMMjQwIDgwTDIwMCAxMDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xNjAgODBMMTYwIDEyMEwyNDAgMTIwTDI0MCA4MEwxNjAgODBaIiBmaWxsPSIjNkI3Mjg0Ii8+CjxwYXRoIGQ9Ik0xODAgMTIwTDE4MCA5MEwyMjAgOTBMMjIwIDEyMEwxODAgMTIwWiIgZmlsbD0iIzM3NDE1MSIvPgo8L3N2Zz4K';
                            }}
                          />
                        </div>

                        {/* CTAs Preview */}
                        <div className="space-y-3">
                          <div className="bg-white p-3 rounded-lg shadow border border-gray-200 text-center">
                            <HomeIcon 
                              className="mb-2 mx-auto" 
                              size={24}
                              style={{
                                color: content.primaryColor === 'slate' ? '#475569' :
                                       content.primaryColor === 'blue' ? '#3b82f6' :
                                       content.primaryColor === 'amber' ? '#f59e0b' :
                                       content.primaryColor === 'emerald' ? '#10b981' :
                                       content.primaryColor === 'rose' ? '#f43f5e' :
                                       '#475569'
                              }}
                            />
                            <h3 className="text-sm font-semibold text-gray-900">Community Info</h3>
                          </div>
                          <div 
                            className="text-white p-3 rounded-lg text-center"
                            style={{
                              background: content.secondaryColor === 'stone' ? 'linear-gradient(to bottom right, #57534e, #44403c)' :
                                         content.secondaryColor === 'cyan' ? 'linear-gradient(to bottom right, #06b6d4, #0891b2)' :
                                         content.secondaryColor === 'orange' ? 'linear-gradient(to bottom right, #ea580c, #c2410c)' :
                                         content.secondaryColor === 'teal' ? 'linear-gradient(to bottom right, #14b8a6, #0d9488)' :
                                         content.secondaryColor === 'pink' ? 'linear-gradient(to bottom right, #ec4899, #db2777)' :
                                         'linear-gradient(to bottom right, #57534e, #44403c)'
                            }}
                          >
                            <Users className="text-white mb-2 mx-auto" size={24} />
                            <h3 className="text-sm font-semibold">Registration</h3>
                          </div>
                          <div 
                            className="text-white p-3 rounded-lg text-center"
                            style={{
                              background: content.primaryColor === 'slate' ? 'linear-gradient(to bottom right, #64748b, #475569)' :
                                         content.primaryColor === 'blue' ? 'linear-gradient(to bottom right, #3b82f6, #1d4ed8)' :
                                         content.primaryColor === 'amber' ? 'linear-gradient(to bottom right, #f59e0b, #d97706)' :
                                         content.primaryColor === 'emerald' ? 'linear-gradient(to bottom right, #10b981, #047857)' :
                                         content.primaryColor === 'rose' ? 'linear-gradient(to bottom right, #f43f5e, #e11d48)' :
                                         'linear-gradient(to bottom right, #64748b, #475569)'
                            }}
                          >
                            <Building className="text-white mb-2 mx-auto" size={24} />
                            <h3 className="text-sm font-semibold">Owner Login</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Community Updates Preview */}
                  <section className="py-8 px-6">
                    <div className="max-w-6xl mx-auto">
                      <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Community Updates</h2>
                        <p className="text-gray-600 text-sm">Stay informed about important community events</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(content.events).map(([key, event]) => (
                          <div key={key} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                            <div className="h-24 relative">
                              <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjUwIiByPSIyMCIgZmlsbD0iIzlCOUJBMCIvPgo8L3N2Zz4K';
                                }}
                              />
                            </div>
                            <div className="p-3">
                              <h3 className="font-semibold text-gray-900 text-sm mb-1">{event.title}</h3>
                              <p className="text-xs text-gray-600">{event.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* About Section Preview */}
                  <section className="py-8 px-6 bg-gray-50">
                    <div className="max-w-6xl mx-auto">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 mb-4">About Our Community</h2>
                          <p className="text-sm text-gray-700 leading-relaxed mb-6">
                            {content.communityDescription}
                          </p>
                          
                          {/* Community Highlights Preview */}
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(content.highlights || {}).map(([key, highlight]) => (
                              <div key={key} className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                                <h4 className="font-semibold text-gray-900 text-sm mb-1">{highlight.title}</h4>
                                <p className="text-xs text-gray-600">{highlight.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white rounded-lg shadow-sm h-24"></div>
                          <div className="bg-white rounded-lg shadow-sm h-24"></div>
                          <div className="col-span-2 bg-white rounded-lg shadow-sm h-32"></div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Preview Message */}
        {!showPreview && (
          <div className="flex-1 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <EyeOff className="text-gray-400 mb-4 mx-auto" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Hidden</h3>
              <p className="text-gray-600 mb-4">Click "Show Preview" to see your changes</p>
              <button
                onClick={() => setShowPreview(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Show Preview
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
              ← Back to Landing Page
            </Link>
            <span className="text-gray-400 text-sm">HOA Website Editor Demo</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500">Changes auto-save to browser storage</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Live Preview Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
