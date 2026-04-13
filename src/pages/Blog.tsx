import { CirclePlay, Headphones, Calendar, ArrowRight, Loader2, Video, User, MapPin, Search, X, Clock, Send } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { SEO } from '../components/SEO';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { RSVPModal } from '../components/RSVPModal';

interface Resource {
  id: string | number;
  slug?: string;
  type: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  status?: string;
  audioUrl?: string;
  videoUrl?: string;
  audioEmbedUrl?: string;
  youtubeId?: string;
  duration?: string;
  excerpt?: string;
  speaker?: string;
  date?: string;
  location?: string;
}

export function Blog() {
  const { category } = useParams();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Resource | null>(null);
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const navigate = useNavigate();

  // Map URL category to Firestore category
  const categoryMap: Record<string, string> = {
    'sermons': 'Sermons',
    'leadership-podcasts': 'Teachings & Prayers',
    'events': 'Events'
  };

  const currentCategory = category ? categoryMap[category] : 'Sermons';

  useEffect(() => {
    // Real-time listener for all sermons
    console.log(`Fetching all resources for category: ${currentCategory}`);
    
    const q = query(
      collection(db, 'sermons'),
      where('category', '==', currentCategory),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(`Firestore returned ${snapshot.docs.length} total documents`);
      
      const firestoreSermons = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            category: data.category || 'Sermons',
            type: data.type || 'Sermon',
            icon: data.icon || (data.category === 'Teachings & Prayers' ? 'headphones' : data.category === 'Events' ? 'calendar' : 'play')
          } as Resource;
        });

      console.log(`Filtered to ${firestoreSermons.length} published resources for category: ${currentCategory}`);
      setResources(firestoreSermons);
      setError(null);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching sermons:", error);
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentCategory]);

  const pageInfo = useMemo(() => {
    switch (category) {
      case 'leadership-podcasts':
        return {
          title: 'Audio & Video Teachings & Prayers',
          description: 'Access a divine collection of prophetic prayers, sermon messages, and spiritual teachings designed to empower your walk with God.'
        };
      case 'events':
        return {
          title: 'Ministry Events',
          description: 'Stay updated with upcoming conferences, global summits, and ministry gatherings. Join Pastor Efe Ovenseri for powerful spiritual encounters and leadership.'
        };
      case 'sermons':
      default:
        return {
          title: 'Sermon Archive',
          description: 'Access transformative teachings and divine messages from Pastor Efe Ovenseri. Explore our library of sermons designed to empower your faith and spiritual life.'
        };
    }
  }, [category]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'play': return <CirclePlay className="w-16 h-16 text-accent-gold-secondary group-hover:scale-110 transition-transform duration-300 fill-current" />;
      case 'headphones': return <Headphones className="w-16 h-16 text-accent-gold-secondary group-hover:scale-110 transition-transform duration-300 fill-current" />;
      case 'calendar': return <Calendar className="w-16 h-16 text-accent-gold-secondary group-hover:scale-110 transition-transform duration-300 fill-current" />;
      default: return <CirclePlay className="w-16 h-16 text-accent-gold-secondary group-hover:scale-110 transition-transform duration-300 fill-current" />;
    }
  };

  const getDemoData = (): Resource[] => {
    if (category === 'leadership-podcasts') {
      return [
        {
          id: 'demo-prayer-1',
          slug: 'demo-prayer-1',
          type: 'Prophetic Prayer',
          title: 'Prayer for Open Doors',
          description: 'A powerful prophetic session focused on breaking barriers and entering into new seasons of divine opportunity.',
          excerpt: 'A powerful prophetic session focused on breaking barriers and entering into new seasons of divine opportunity.',
          category: 'Teachings & Prayers',
          icon: 'headphones',
          youtubeId: 'dQw4w9WgXcQ',
          speaker: 'Pastor Efe Ovenseri',
          duration: '15:20'
        },
        {
          id: 'demo-sermon-1',
          slug: 'demo-sermon-1',
          type: 'Sermon Message',
          title: 'Breaking Generational Limitations',
          description: 'Understanding the spiritual mechanics of deliverance and how to walk in total freedom from ancestral patterns.',
          excerpt: 'Understanding the spiritual mechanics of deliverance and how to walk in total freedom from ancestral patterns.',
          category: 'Teachings & Prayers',
          icon: 'play',
          youtubeId: 'dQw4w9WgXcQ',
          speaker: 'Pastor Efe Ovenseri',
          duration: '45:10'
        },
        {
          id: 'demo-teaching-1',
          slug: 'demo-teaching-1',
          type: 'Teaching',
          title: 'The Power of Alignment',
          description: 'A deep dive into the importance of aligning your spirit, soul, and body with the divine purpose of God.',
          excerpt: 'A deep dive into the importance of aligning your spirit, soul, and body with the divine purpose of God.',
          category: 'Teachings & Prayers',
          icon: 'play',
          youtubeId: 'dQw4w9WgXcQ',
          speaker: 'Pastor Efe Ovenseri',
          duration: '38:45'
        },
        {
          id: 'demo-prayer-2',
          slug: 'demo-prayer-2',
          type: 'Morning Prayer',
          title: 'Morning Prayer for Divine Speed',
          description: 'Start your day with this prophetic charge to activate the grace for acceleration and supernatural progress.',
          excerpt: 'Start your day with this prophetic charge to activate the grace for acceleration and supernatural progress.',
          category: 'Teachings & Prayers',
          icon: 'headphones',
          youtubeId: 'dQw4w9WgXcQ',
          speaker: 'Pastor Efe Ovenseri',
          duration: '12:00'
        }
      ];
    } else if (category === 'events') {
      return [
        {
          id: 'demo-event-1',
          slug: 'demo-event-1',
          type: 'Conference',
          title: 'Global Leadership Summit 2026',
          description: 'Join leaders from around the world for a transformative 3-day summit.',
          excerpt: 'Join leaders from around the world for a transformative 3-day summit.',
          category: 'Events',
          icon: 'calendar',
          date: 'August 15-17, 2026',
          location: 'Global Online',
        },
        {
          id: 'demo-event-2',
          slug: 'demo-event-2',
          type: 'Conference',
          title: 'Kingdom Builders Conference',
          description: 'A gathering for entrepreneurs and professionals building the Kingdom in the marketplace.',
          excerpt: 'A gathering for entrepreneurs and professionals building the Kingdom in the marketplace.',
          category: 'Events',
          icon: 'calendar',
          date: 'October 10-12, 2026',
          location: 'Lagos, Nigeria',
        },
        {
          id: 'demo-event-3',
          slug: 'demo-event-3',
          type: 'Gathering',
          title: 'Marketplace Apostolic Gathering',
          description: 'Equipping believers to take apostolic authority in their professional spheres.',
          excerpt: 'Equipping believers to take apostolic authority in their professional spheres.',
          category: 'Events',
          icon: 'calendar',
          date: 'November 5, 2026',
          location: 'Global Online',
        },
        {
          id: 'demo-event-4',
          slug: 'demo-event-4',
          type: 'Retreat',
          title: 'Annual Ministers Retreat',
          description: 'A time of refreshing, impartation, and strategic alignment for ministry leaders.',
          excerpt: 'A time of refreshing, impartation, and strategic alignment for ministry leaders.',
          category: 'Events',
          icon: 'calendar',
          date: 'December 1-3, 2026',
          location: 'Lagos, Nigeria',
        }
      ];
    }
    return [];
  };

  const displayResources = resources.length > 0 ? resources : getDemoData();

  const filteredResources = useMemo(() => {
    if (!searchTerm.trim()) return displayResources;
    
    const term = searchTerm.toLowerCase().trim();
    return displayResources.filter(r => 
      r.title.toLowerCase().includes(term) ||
      r.category.toLowerCase().includes(term) ||
      (r.description && r.description.toLowerCase().includes(term)) ||
      (r.excerpt && r.excerpt.toLowerCase().includes(term)) ||
      (r.type && r.type.toLowerCase().includes(term)) ||
      (r.speaker && r.speaker.toLowerCase().includes(term))
    );
  }, [searchTerm, displayResources]);

  const handleRSVP = (e: React.MouseEvent, resource: Resource) => {
    e.stopPropagation();
    setSelectedEvent(resource);
    setIsRSVPModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-bg-midnight pt-20">
      <SEO title={pageInfo.title} description={pageInfo.description} />
      
      <RSVPModal 
        isOpen={isRSVPModalOpen}
        onClose={() => setIsRSVPModalOpen(false)}
        eventTitle={selectedEvent?.title || ''}
      />
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden border-b border-gold/10 bg-bg-navy-deep">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.05),transparent_50%)]"></div>
        <div className="divine-glow top-0 right-0 opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
              {category === 'leadership-podcasts' ? 'Audio & Video Wisdom' : category === 'events' ? 'Kingdom Gatherings' : 'Spiritual Nourishment'}
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 gold-gradient-text leading-tight">
              {pageInfo.title}
            </h1>
            <p className="text-lg text-gray-400 font-light leading-relaxed mb-10">
              {pageInfo.description}
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500 group-focus-within:text-gold transition-colors" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={category === 'leadership-podcasts' ? "Search prayers, sermons..." : `Search ${pageInfo.title.toLowerCase()}...`}
                className="block w-full pl-12 pr-12 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all shadow-2xl"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-500 hover:text-gold transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20 bg-bg-midnight">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-gold" />
              <p className="text-gray-400 font-light tracking-widest uppercase text-xs">Loading {category || 'resources'}...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-20 glass-card border-red-500/20">
              <p className="text-red-400 text-lg font-bold mb-2">System Error</p>
              <p className="text-gray-400 text-sm font-light max-w-md mx-auto">{error}</p>
            </div>
          ) : filteredResources.length > 0 ? (
            filteredResources.map(resource => (
              <div 
                key={resource.id} 
                onClick={() => navigate(`/resources/sermons/${resource.slug || resource.id}`)}
                className="glass-card group flex flex-col cursor-pointer hover:border-gold/30 transition-all duration-500"
              >
                <div className="h-56 bg-black/40 flex items-center justify-center relative overflow-hidden border-b border-white/5">
                  {(resource as any).featuredImage ? (
                    <img 
                      src={(resource as any).featuredImage} 
                      alt={resource.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="p-12 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                      {getIcon(resource.icon)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight to-transparent opacity-60"></div>
                </div>

                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-gold/10 text-gold border border-gold/20`}>
                      {resource.type}
                    </span>
                    {(resource.youtubeId || resource.audioEmbedUrl || resource.videoUrl || resource.audioUrl) && (
                      <span className="flex items-center text-[9px] font-bold uppercase tracking-widest text-white bg-red-600/20 border border-red-600/30 px-2.5 py-1 rounded-full backdrop-blur-sm">
                        <Video className="w-3 h-3 mr-1.5 text-red-500" />
                        Media Available
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-display font-bold text-white mb-4 group-hover:text-gold transition-colors duration-300">{resource.title}</h3>
                  
                  <div className="flex flex-wrap gap-4 mb-6 text-[11px] text-gray-400 font-medium">
                    {resource.speaker && (
                      <span className="flex items-center">
                        <User className="w-3.5 h-3.5 mr-1.5 text-gold/60" />
                        {resource.speaker}
                      </span>
                    )}
                    {resource.date && (
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-gold/60" />
                        {resource.date}
                      </span>
                    )}
                    {(resource as any).duration && (
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-gold/60" />
                        {(resource as any).duration}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-400 font-light text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                    {resource.excerpt || resource.description}
                  </p>
                  
                  <div className="flex flex-col gap-4 pt-6 border-t border-white/5">
                    {resource.category === 'Events' && (
                      <button
                        onClick={(e) => handleRSVP(e, resource)}
                        className="w-full py-3 bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest rounded-xl flex items-center justify-center space-x-2 hover:bg-gold hover:text-bg-navy-deep transition-all duration-300"
                      >
                        <Send className="w-4 h-4" />
                        <span>RSVP Now</span>
                      </button>
                    )}
                    
                    <div className="flex items-center text-xs font-bold uppercase tracking-widest text-white group-hover:text-gold transition-colors">
                      <span>
                        {resource.type.toLowerCase().includes('prayer') ? 'Listen Now' : 
                         resource.type.toLowerCase().includes('sermon') ? 'Watch / Listen' :
                         resource.icon === 'play' ? 'Watch Now' : 'Listen Now'}
                      </span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-24 glass-card border-dashed border-white/10">
              <p className="text-gray-400 text-lg font-light">
                {searchTerm ? (
                  <>No results found for "<span className="text-gold font-semibold">{searchTerm}</span>"</>
                ) : (
                  `No ${category || 'resources'} found in this category.`
                )}
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-8 gold-outline-btn"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>

  );
}
