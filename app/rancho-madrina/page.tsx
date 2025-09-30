'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { 
  Home as HomeIcon, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  Users, 
  Building, 
  DollarSign,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  School,
  Zap,
  Car
} from 'lucide-react';
import Link from 'next/link';

export default function RanchoMadrinaPublicSite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showAgenda, setShowAgenda] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['home', 'about', 'gallery']));

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home' },
    { 
      id: 'about', 
      label: 'About',
      submenu: [
        { id: 'about', label: 'Community' },
        { id: 'management', label: 'Management' },
        { id: 'meetings', label: 'Meetings' },
        { id: 'financial', label: 'Financial' },
        { id: 'documents', label: 'Documents' }
      ]
    },
    { id: 'gallery', label: 'Gallery' },
    { id: 'schools', label: 'Schools' },
    { id: 'utilities', label: 'Services' }
  ];

  const [showAboutSubmenu, setShowAboutSubmenu] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="font-bold text-xl text-gray-900">Rancho Madrina</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <div key={item.id} className="relative group">
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-teal-600 ${
                          activeSection === item.id ? 'text-teal-600' : 'text-gray-700'
                        }`}
                      >
                        {item.label}
                        <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                      </button>
                      
                      {/* Submenu */}
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-2">
                          {item.submenu.map((subItem) => (
                            <button
                              key={subItem.id}
                              onClick={() => scrollToSection(subItem.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                            >
                              {subItem.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                        activeSection === item.id ? 'text-teal-600' : 'text-gray-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id 
                      ? 'bg-amber-50 text-amber-600' 
                      : 'text-gray-700 hover:bg-amber-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-20 bg-gradient-to-br from-blue-50 via-teal-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 pt-8">
            <div className="handwritten-welcome mb-2">
              Welcome to
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 animate-fade-in">
              Rancho Madrina Community Association
            </h1>
          </div>

          {/* Hero Image */}
          <div className="mb-12 animate-slide-up">
            <div className="max-w-4xl mx-auto">
              <img
                src="/demo/rancho-madrina-header.jpg"
                alt="Rancho Madrina Community Entrance"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-96 bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 rounded-2xl shadow-2xl flex items-center justify-center">
                        <div class="text-center">
                          <div class="text-6xl mb-4">🏘️</div>
                          <h2 class="text-2xl font-bold text-gray-800">Rancho Madrina</h2>
                          <p class="text-gray-600">Gated Community Entrance</p>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          </div>

          {/* Main CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-fade-in-up">
            <button
              onClick={() => scrollToSection('about')}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-teal-100"
            >
              <HomeIcon className="text-teal-600 mb-4 mx-auto" size={32} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Information</h3>
              <p className="text-gray-600 text-sm">Learn about our community amenities and lifestyle</p>
            </button>

            <Link href="/dashboard/new-residents/registration">
              <button className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full">
                <Users className="text-white mb-4 mx-auto" size={32} />
                <h3 className="text-lg font-semibold mb-2">Community Registration</h3>
                <p className="text-amber-100 text-sm">New residents start here</p>
              </button>
            </Link>

            <Link href="/dashboard?role=captain">
              <button className="bg-gradient-to-br from-slate-600 to-blue-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full">
                <Building className="text-white mb-4 mx-auto" size={32} />
                <h3 className="text-lg font-semibold mb-2">Owner Login</h3>
                <p className="text-blue-100 text-sm">Access your resident portal</p>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about" 
        className={`py-20 bg-white transition-all duration-1000 ${
          visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">About Our Community</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Community Description */}
            <div className="prose prose-lg text-gray-700 leading-relaxed">
              <p className="text-lg mb-6">
                Rancho Madrina is a gated community located in San Juan Capistrano developed by the William Lyon Company that opened in 2006. The community sits within walking distance of the charm and historic make up of San Juan Capistrano's downtown with easy access to the (5) Fwy, (74) Ortega Hwy (74) and the (79) and (241) Toll Roads.
              </p>
              <p className="text-lg">
                The community consists of 120 homes featuring ten (10) floor plans and is surrounded by a number of elite private and public institutions making it a most desirable place to call home.
              </p>
              
              {/* Community Features */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-gray-900 mb-1">120 Homes</h4>
                  <p className="text-sm text-gray-600">Ten unique floor plans</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-gray-900 mb-1">Gated Community</h4>
                  <p className="text-sm text-gray-600">Secure & private</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-gray-900 mb-1">Prime Location</h4>
                  <p className="text-sm text-gray-600">Walk to downtown</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-gray-900 mb-1">Est. 2006</h4>
                  <p className="text-sm text-gray-600">William Lyon Company</p>
                </div>
              </div>
            </div>
            
            {/* Community Photos */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="/demo/rancho-madrina-photos/rancho-madrina-photo-1.jpg"
                  alt="Rancho Madrina Community View"
                  className="w-full h-40 object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                  }}
                />
                <img
                  src="/demo/rancho-madrina-photos/rancho-madrina-hoa-photo-2.jpg"
                  alt="Rancho Madrina Homes"
                  className="w-full h-40 object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <img
                src="/demo/rancho-madrina-photos/rancho-madrina-hoa-photo-3.jpg"
                alt="Rancho Madrina Community Features"
                className="w-full h-48 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Community Gallery Section */}
      <section 
        className={`py-20 bg-stone-50 transition-all duration-1000 ${
          visibleSections.has('gallery') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        id="gallery"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Community Gallery</h2>
            <p className="text-gray-600">Discover the beauty and charm of Rancho Madrina</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { src: '/demo/rancho-madrina-photos/rancho-madrina-photo-4.jpg', alt: 'Community Streets', title: 'Tree-Lined Streets' },
              { src: '/demo/rancho-madrina-photos/rancho-madrina-photo-5.jpg', alt: 'Community Homes', title: 'Beautiful Homes' },
              { src: '/demo/rancho-madrina-photos/rancho-madrina-photo-6.jpg', alt: 'Community Amenities', title: 'Community Features' },
              { src: '/demo/rancho-madrina-photos/rancho-madrina-photo-7.jpg', alt: 'Landscape', title: 'Mature Landscaping' },
              { src: '/demo/rancho-madrina-photos/rancho-madrina-photo-8.png', alt: 'Neighborhood', title: 'Quiet Neighborhoods' }
            ].map((photo, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-64 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                          <div class="text-center">
                            <div class="text-3xl mb-2">🏘️</div>
                            <p class="text-gray-600 font-medium">${photo.title}</p>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">{photo.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Management Section */}
      <section 
        id="management" 
        className={`py-20 bg-gray-50 relative overflow-hidden transition-all duration-1000 ${
          visibleSections.has('management') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.88)), url('/demo/rancho-madrina-photos/rancho-madrina-photo-6.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Management</h2>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Seabreeze Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Office Address</h4>
                  <div className="space-y-2 text-gray-700">
                    <p>26840 Aliso Viejo Parkway, Suite 100</p>
                    <p>Aliso Viejo, CA 92636</p>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Phone size={16} className="text-amber-600" />
                      <a href="tel:8002327517" className="text-amber-600 hover:text-amber-800 transition-colors">
                        800.232.7517
                      </a>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <ExternalLink size={16} className="text-amber-600" />
                      <a href="https://seabreezemgnt.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-800 transition-colors">
                        seabreezemgnt.com
                      </a>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Property Manager</h4>
                  <div className="text-center">
                    <p className="text-xl font-semibold text-gray-900">Mike Canning</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Mail size={16} className="text-amber-600" />
                      <a href="mailto:mike.canning@seabreezemgnt.com" className="text-amber-600 hover:text-amber-800 transition-colors">
                        mike.canning@seabreezemgnt.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meetings Section */}
      <section 
        id="meetings" 
        className={`py-20 bg-white relative overflow-hidden transition-all duration-1000 ${
          visibleSections.has('meetings') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.80), rgba(255, 255, 255, 0.90)), url('/demo/rancho-madrina-photos/rancho-madrina-photo-7.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Board Meetings</h2>
          </div>
          
              <div className="bg-amber-50 rounded-2xl p-8 border border-amber-200">
            <div className="text-center">
              <Calendar className="text-amber-600 mb-4 mx-auto" size={48} />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Meeting Schedule</h3>
              <p className="text-gray-700 mb-6">Third Wednesday of every other month</p>
              
              <div className="bg-white rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Meeting Location</h4>
                <div className="text-gray-700 space-y-1">
                  <p>Seabreeze Management</p>
                  <p>26840 Aliso Viejo Parkway, Ste. 100</p>
                  <p>Aliso Viejo, CA 92656</p>
                  <p className="text-sm text-amber-600 mt-2">Or by Zoom</p>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm font-medium text-green-800 mb-2">Next Meeting</p>
                <p className="text-lg font-bold text-gray-900 mb-3">November 20, 2024 at 7:00 PM</p>
                <Button
                  onClick={() => setShowAgenda(true)}
                  className="flex items-center gap-2"
                >
                  <FileText size={16} />
                  View Agenda
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Information */}
      <section 
        id="financial" 
        className={`py-20 bg-gray-50 transition-all duration-1000 ${
          visibleSections.has('financial') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Financial Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <DollarSign className="text-green-600 mb-4 mx-auto" size={32} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Dues 2025</h3>
              <p className="text-3xl font-bold text-green-600">$321.00</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <Calendar className="text-blue-600 mb-4 mx-auto" size={32} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Accounting</h3>
              <p className="text-gray-700">Calendar Year</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <FileText className="text-purple-600 mb-4 mx-auto" size={32} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports</h3>
              <p className="text-gray-700">Audit & Reserve Study distributed annually</p>
            </div>
          </div>
        </div>
      </section>

      {/* Schools Section */}
      <section 
        id="schools" 
        className={`py-20 bg-white transition-all duration-1000 ${
          visibleSections.has('schools') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Local Schools</h2>
            <p className="text-gray-600">Excellent educational opportunities in the area</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                name: 'San Juan Hills High School', 
                type: 'Public High School', 
                grades: '9-12',
                website: 'sanjuanhills.capousd.org',
                icon: `https://www.google.com/s2/favicons?domain=sanjuanhills.capousd.org&sz=32`
              },
              { 
                name: 'Marco Forster Middle School', 
                type: 'Public Middle School', 
                grades: '6-8',
                website: 'marcoforster.capousd.org',
                icon: `https://www.google.com/s2/favicons?domain=marcoforster.capousd.org&sz=32`
              },
              { 
                name: 'San Juan Elementary School', 
                type: 'Public Elementary', 
                grades: 'K-5',
                website: 'sanjuan.capousd.org',
                icon: `https://www.google.com/s2/favicons?domain=sanjuan.capousd.org&sz=32`
              },
              { 
                name: 'JSerra Catholic High School', 
                type: 'Private High School', 
                grades: '9-12',
                website: 'www.jserra.org',
                icon: `https://www.google.com/s2/favicons?domain=www.jserra.org&sz=32`
              },
              { 
                name: 'St Margaret\'s Episcopal School', 
                type: 'Private School', 
                grades: 'K-12',
                website: 'www.smes.org',
                icon: `https://www.google.com/s2/favicons?domain=www.smes.org&sz=32`
              },
              { 
                name: 'Capistrano Valley Christian School', 
                type: 'Private School', 
                grades: 'K-12',
                website: 'www.cvcs.org',
                icon: `https://www.google.com/s2/favicons?domain=www.cvcs.org&sz=32`
              }
            ].map((school, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100">
                <div className="w-8 h-8 mb-4 flex items-center justify-center">
                  <img
                    src={school.icon}
                    alt={`${school.name} icon`}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center"><span class="text-amber-600 text-xs font-bold">📚</span></div>';
                      }
                    }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{school.name}</h3>
                <p className="text-amber-600 text-sm mb-1">{school.type}</p>
                <p className="text-gray-600 text-sm">Grades {school.grades}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section 
        id="utilities" 
        className={`py-20 bg-stone-50 transition-all duration-1000 ${
          visibleSections.has('utilities') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Local Services</h2>
            <p className="text-gray-600">Essential services and utilities for residents</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                name: 'City of San Juan Capistrano', 
                type: 'Municipal Services', 
                website: 'sanjuancapistrano.org',
                icon: `https://www.google.com/s2/favicons?domain=sanjuancapistrano.org&sz=32`
              },
              { 
                name: 'Cox Communications', 
                type: 'Internet & Cable', 
                website: 'www.cox.com',
                icon: `https://www.google.com/s2/favicons?domain=www.cox.com&sz=32`
              },
              { 
                name: 'SoCal Gas', 
                type: 'Natural Gas', 
                website: 'www.socalgas.com',
                icon: `https://www.google.com/s2/favicons?domain=www.socalgas.com&sz=32`
              },
              { 
                name: 'SDG&E', 
                type: 'Electricity', 
                website: 'www.sdge.com',
                icon: `https://www.google.com/s2/favicons?domain=www.sdge.com&sz=32`
              }
            ].map((service, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-all duration-300 border border-stone-200">
                <div className="w-8 h-8 mb-4 mx-auto flex items-center justify-center">
                  <img
                    src={service.icon}
                    alt={`${service.name} icon`}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const icons = ['🏛️', '📡', '🔥', '⚡'];
                        parent.innerHTML = `<div class="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center"><span class="text-stone-600 text-lg">${icons[index]}</span></div>`;
                      }
                    }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-stone-600 text-sm">{service.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section 
        id="documents" 
        className={`py-20 bg-white transition-all duration-1000 ${
          visibleSections.has('documents') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Community Documents</h2>
            <p className="text-gray-600">Important documents and guidelines for residents</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'CC&Rs', description: 'Covenants, Conditions & Restrictions' },
              { title: 'Design Guidelines', description: 'Architectural and landscaping standards' },
              { title: 'Parking Rules', description: 'Community parking regulations' }
            ].map((doc, index) => (
              <div key={index} className="bg-amber-50 rounded-xl p-6 hover:bg-amber-100 transition-colors cursor-pointer border border-amber-200">
                <FileText className="text-amber-600 mb-4" size={24} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{doc.description}</p>
                <div className="flex items-center text-amber-600 text-sm font-medium">
                  <span>View Document</span>
                  <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img
                src="/hoa-connect-logo-icon-white.png"
                alt="HOA Connect"
                className="h-6 w-auto"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const span = document.createElement('span');
                    span.className = 'text-white font-bold';
                    span.textContent = 'HOA Connect';
                    parent.appendChild(span);
                  }
                }}
              />
              <span className="text-gray-300">Powered by HOA Connect</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 Rancho Madrina Community Association. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Meeting Agenda Modal */}
      {showAgenda && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold text-gray-900">Board Meeting Agenda</h3>
              <button onClick={() => setShowAgenda(false)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="font-semibold text-blue-900">November 20, 2024 at 7:00 PM</p>
                <p className="text-blue-700 text-sm">Seabreeze Management Office</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Agenda Items:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Call to Order</li>
                  <li>• Approval of Previous Meeting Minutes</li>
                  <li>• Financial Report</li>
                  <li>• Landscape Committee Update</li>
                  <li>• ARC Requests Review</li>
                  <li>• 2025 Budget Discussion</li>
                  <li>• New Business</li>
                  <li>• Homeowner Forum</li>
                  <li>• Adjournment</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowAgenda(false)}>
                Close
              </Button>
              <Button>
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      <link 
        href="https://fonts.googleapis.com/css2?family=Pacifico&family=Kalam:wght@400;700&family=Caveat:wght@400;500;600;700&display=swap" 
        rel="stylesheet" 
      />
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 1.2s ease-out 0.3s both;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.6s both;
        }

        /* Enhanced parallax effect */
        section[style*="background-attachment: fixed"] {
          background-attachment: fixed !important;
          will-change: transform;
        }

        /* Smooth scrolling for better parallax */
        html {
          scroll-behavior: smooth;
        }

        /* Optimize parallax performance */
        section[style*="backgroundAttachment"] {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }

        /* Welcome text styling */
        .handwritten-welcome {
          font-family: inherit;
          font-size: 1.5rem;
          color: #64748b;
          font-weight: 400;
          opacity: 0.8;
        }

        @media (min-width: 768px) {
          .handwritten-welcome {
            font-size: 1.875rem;
          }
        }
      `}</style>
    </div>
  );
}
