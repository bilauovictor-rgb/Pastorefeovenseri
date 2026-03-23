import { PlayCircle, Headphones, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { SEO } from '../components/SEO';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

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
  podcastAudioUrl?: string;
  podcastAudioStatus?: string;
  excerpt?: string;
}

export function Blog() {
  const { category } = useParams();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Map URL category to Firestore category
  const categoryMap: Record<string, string> = {
    'sermons': 'Sermons',
    'leadership-podcasts': 'Leadership Podcasts',
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
            icon: data.icon || (data.category === 'Leadership Podcasts' ? 'headphones' : data.category === 'Events' ? 'calendar' : 'play')
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
          title: 'Leadership Podcasts',
          description: 'Equipping leaders with spiritual wisdom and practical excellence for global impact.'
        };
      case 'events':
        return {
          title: 'Ministry Events',
          description: 'Stay updated with upcoming conferences, global summits, and ministry gatherings.'
        };
      case 'sermons':
      default:
        return {
          title: 'Sermon Archive',
          description: 'Access transformative teachings and divine messages from Pastor Efe Ovenseri.'
        };
    }
  }, [category]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'play': return <PlayCircle className="w-16 h-16 text-accent-gold-secondary group-hover:scale-110 transition-transform duration-300 fill-current" />;
      case 'headphones': return <Headphones className="w-16 h-16 text-accent-gold-secondary group-hover:scale-110 transition-transform duration-300 fill-current" />;
      case 'calendar': return <Calendar className="w-16 h-16 text-accent-gold-secondary group-hover:scale-110 transition-transform duration-300 fill-current" />;
      default: return <PlayCircle className="w-16 h-16 text-accent-gold-secondary group-hover:scale-110 transition-transform duration-300 fill-current" />;
    }
  };

  return (
    <div className="page-section active bg-bg-dark-primary min-h-screen">
      <SEO title={pageInfo.title} description={pageInfo.description} />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28 bg-bg-dark-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-dark-primary via-bg-dark-secondary to-bg-dark-tertiary opacity-90"></div>
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-accent-purple-soft/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-gold-secondary text-sm font-semibold tracking-widest uppercase mb-6 backdrop-blur-md shadow-sm">
            {category === 'leadership-podcasts' ? 'Audio Wisdom' : category === 'events' ? 'Kingdom Gatherings' : 'Spiritual Nourishment'}
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-text-on-dark-primary mb-6 leading-tight">{pageInfo.title}</h1>
          <p className="text-xl text-text-on-dark-secondary leading-relaxed font-light max-w-3xl mx-auto">{pageInfo.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-accent-purple-soft/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-text-on-dark-secondary">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-accent-gold-secondary" />
              <p className="text-lg font-medium">Loading {category || 'resources'}...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-20 bg-red-500/10 backdrop-blur-sm rounded-3xl border border-dashed border-red-500/30">
              <p className="text-red-400 text-lg font-bold mb-2">Failed to load resources</p>
              <p className="text-text-on-dark-secondary text-sm font-light max-w-md mx-auto">{error}</p>
              <p className="text-text-on-dark-muted text-xs mt-4">This usually requires a Firestore composite index to be created.</p>
            </div>
          ) : resources.length > 0 ? (
            resources.map(resource => (
              <div 
                key={resource.id} 
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/resources/sermons/${resource.slug || resource.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/resources/sermons/${resource.slug || resource.id}`);
                  }
                }}
                className="bg-bg-dark-secondary/80 backdrop-blur-md border border-border-dark-soft overflow-hidden rounded-3xl group flex flex-col cursor-pointer hover:border-accent-gold-secondary/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-500 focus:ring-2 focus:ring-accent-gold-secondary outline-none"
              >
                <div className="h-48 bg-bg-dark-primary flex items-center justify-center relative border-b border-border-dark-soft overflow-hidden">
                  {(resource as any).featuredImage ? (
                    <img 
                      src={(resource as any).featuredImage} 
                      alt={resource.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-accent-purple-soft/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      {getIcon(resource.icon)}
                    </>
                  )}
                </div>
                <div className="p-8 flex-grow flex flex-col relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-purple-soft/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  <span className="text-xs font-bold uppercase text-accent-gold-secondary tracking-wider mb-3 relative z-10">{resource.type}</span>
                  <h3 className="text-xl font-display font-bold text-text-on-dark-primary mb-3 group-hover:text-accent-gold-secondary transition-colors relative z-10">{resource.title}</h3>
                  <p className="text-text-on-dark-secondary font-light text-sm leading-relaxed mb-6 flex-grow line-clamp-3 relative z-10">{resource.excerpt || resource.description}</p>
                  
                  {(resource.audioUrl || (resource.podcastAudioStatus === 'ready' && resource.podcastAudioUrl)) && (
                    <div className="mb-6 relative z-10" onClick={(e) => e.stopPropagation()}>
                      <audio 
                        controls 
                        className="w-full h-10 rounded-lg bg-white/5"
                        src={resource.audioUrl || resource.podcastAudioUrl}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  <span className="text-sm font-semibold text-text-on-dark-primary flex items-center group-hover:text-accent-gold-secondary transition-colors relative z-10">
                    {resource.icon === 'play' ? 'Watch Resource' : resource.icon === 'headphones' ? 'Listen Now' : 'View Gallery'} 
                    <ArrowRight className="w-4 h-4 ml-2 text-accent-gold-secondary" />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-bg-dark-secondary/50 backdrop-blur-sm rounded-3xl border border-dashed border-border-dark-soft">
              <p className="text-text-on-dark-secondary text-lg font-light">No {category || 'resources'} found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
