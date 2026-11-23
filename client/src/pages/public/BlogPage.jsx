import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  Search, 
  Tag, 
  Share2, 
  Bookmark,
  Sparkles,
  ShieldCheck,
  Activity
} from 'lucide-react';

const blogArticles = [
  {
    id: 1,
    title: 'How Verified Medical Crowdfunding is Saving Lives in 2026',
    category: 'Healthcare Transparency',
    date: 'October 12, 2026',
    readTime: '5 min read',
    author: 'Dr. Priya Sharma, MD',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    summary: 'Direct hospital record audits and hospital wire settlements prevent fraud and build unbreakable trust between empathetic donors and families facing emergency surgeries.',
    content: 'When a critical illness strikes, families are thrust into unprecedented medical emergencies. Medical crowdfunding bridges this gap by directly linking verified hospital admissions to humanitarian aid.'
  },
  {
    id: 2,
    title: '5 Steps to Create an Urgent Pediatric Heart Surgery Campaign',
    category: 'Campaign Guides',
    date: 'September 28, 2026',
    readTime: '6 min read',
    author: 'Rajesh Varma (Medical Social Worker)',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    summary: 'A step-by-step checklist on preparing surgical estimates, diagnostic scans, physician recommendations, and creating an emotional, authentic story that connects with donors.',
    content: 'Document clarity is the single most important factor in rapid campaign approval. Learn how attaching official hospital diagnostic stamps accelerates donor engagement.'
  },
  {
    id: 3,
    title: 'Small Help, Big Hope: The Science Behind Micro-Donations',
    category: 'Donor Stories',
    date: 'September 15, 2026',
    readTime: '4 min read',
    author: 'Anita Desmond',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80',
    summary: 'How collective kindness through modest ₹500 or ₹1,000 contributions aggregates into life-saving bone marrow transplants and emergency neonatal intensive care.',
    content: 'No donation is too small. Thousands of micro-contributions create massive collective waves of hope, funding expensive surgical suites and ICU recoveries in record time.'
  },
  {
    id: 4,
    title: 'NGO Collaboration: Ensuring Every Rupee Goes Straight to Patient Beds',
    category: 'Ecosystem & Trust',
    date: 'August 30, 2026',
    readTime: '7 min read',
    author: 'Suresh Patil (Director, Hope Relief Trust)',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    summary: 'Understanding how certified healthcare NGOs audit patient income verification, match crowdfunding grants, and oversee medicine disbursements with zero administrative leakage.',
    content: 'Humanitarian partnerships are the backbone of transparent medical support. By working alongside accredited hospitals, NGOs guarantee accountability at every clinical stage.'
  }
];

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Healthcare Transparency', 'Campaign Guides', 'Donor Stories', 'Ecosystem & Trust'];

  const filteredArticles = blogArticles.filter(article => {
    const matchesCat = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="blog-page-wrapper bg-light min-vh-100">
      
      {/* Header Banner */}
      <section className="bg-white border-bottom py-5">
        <div className="container py-3">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-8">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary bg-opacity-10 text-primary small fw-bold mb-3">
                <Sparkles size={16} />
                <span>MediFund Knowledge & Stories</span>
              </div>
              <h1 className="display-5 fw-bold text-mfms-navy mb-2">
                Stories of Hope, Healing & Healthcare Innovation
              </h1>
              <p className="lead text-muted mb-0" style={{ maxWidth: '640px' }}>
                Inspiring survival stories, transparent hospital insights, and essential guides to organizing successful medical fundraisers.
              </p>
            </div>

            <div className="col-12 col-lg-4 text-lg-end">
              <Link to="/patient/create-campaign" className="btn btn-mfms-primary fw-bold px-4 py-3 rounded-3 shadow-xs">
                Start a Fundraiser
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container py-5">
        <div className="row g-4">
          
          {/* Left Column: Articles */}
          <div className="col-12 col-lg-8">
            
            {/* Filter Tabs */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold ${
                    selectedCategory === cat ? 'btn-primary' : 'btn-white border text-secondary'
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Articles List */}
            {filteredArticles.length === 0 ? (
              <div className="text-center py-5 bg-white rounded-4 border p-5">
                <Search size={36} className="text-muted opacity-50 mb-2" />
                <h5 className="fw-bold text-mfms-navy">No articles match your criteria</h5>
                <p className="text-muted small">Try searching with different terms or selecting another category.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {filteredArticles.map(article => (
                  <article key={article.id} className="card border-0 rounded-4 shadow-xs overflow-hidden transition-all hover-shadow">
                    <div className="row g-0">
                      <div className="col-12 col-md-5">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-100 h-100 object-fit-cover"
                          style={{ minHeight: '220px' }}
                        />
                      </div>
                      <div className="col-12 col-md-7 p-4 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="badge bg-primary-subtle text-primary small px-2 py-1 rounded-pill">
                              {article.category}
                            </span>
                            <span className="text-muted small d-inline-flex align-items-center gap-1">
                              <Clock size={13} /> {article.readTime}
                            </span>
                          </div>

                          <h4 className="fw-bold text-mfms-navy mb-2 line-clamp-2">
                            {article.title}
                          </h4>

                          <p className="text-muted small mb-3 line-clamp-3">
                            {article.summary}
                          </p>
                        </div>

                        <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                          <div className="small text-muted d-flex align-items-center gap-2">
                            <User size={14} className="text-primary" />
                            <span>{article.author}</span>
                          </div>
                          <span className="text-primary fw-bold small d-inline-flex align-items-center gap-1">
                            Read Story <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="col-12 col-lg-4">
            
            {/* Search Box */}
            <div className="card border-0 rounded-4 shadow-xs p-4 mb-4 bg-white">
              <h6 className="fw-bold text-mfms-navy mb-3">Search Articles</h6>
              <div className="position-relative">
                <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input
                  type="text"
                  className="form-control ps-5 rounded-pill"
                  placeholder="Keywords, surgeries, guide..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Inspiration Quote Widget */}
            <div className="card border-0 rounded-4 shadow-xs p-4 mb-4 text-white position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1769E0 0%, #123B66 100%)' }}>
              <div className="d-flex align-items-center gap-2 mb-2 text-warning">
                <Heart size={20} fill="#f59e0b" />
                <span className="small fw-bold text-uppercase tracking-wider">Daily Inspiration</span>
              </div>
              <p className="fs-5 fw-bold mb-3" style={{ fontStyle: 'italic' }}>
                “Your kindness today can become someone’s second chance tomorrow.”
              </p>
              <div className="d-flex align-items-center gap-2 small text-light opacity-80">
                <Activity size={16} />
                <span>MediFund Care Community</span>
              </div>
            </div>

            {/* Emergency CTA */}
            <div className="card border-0 rounded-4 shadow-xs p-4 bg-white text-center">
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-3 d-inline-flex mx-auto mb-3">
                <ShieldCheck size={28} />
              </div>
              <h5 className="fw-bold text-mfms-navy mb-2">Need Help for Medical Bills?</h5>
              <p className="text-muted small mb-3">
                Create a campaign in under 3 minutes. Upload hospital reports & start receiving donor funds.
              </p>
              <Link to="/patient/create-campaign" className="btn btn-mfms-primary w-100 fw-bold rounded-pill">
                Start a Campaign
              </Link>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default BlogPage;
