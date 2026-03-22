import { PlayCircle, Headphones, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { SEO } from '../components/SEO';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface Resource {
  id: string | number;
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
      where('status', '==', 'published')
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
        })
        .filter(s => {
          const isPublished = s.status?.toLowerCase() === 'published';
          const matchesCategory = s.category === currentCategory;
          return isPublished && matchesCategory;
        });

      console.log(`Filtered to ${firestoreSermons.length} published resources for category: ${currentCategory}`);
      setResources(firestoreSermons);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching sermons:", error);
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
      case 'play': return <PlayCircle className="w-16 h-16 text-brand-500 group-hover:scale-110 transition-transform duration-300 fill-current" />;
      case 'headphones': return <Headphones className="w-16 h-16 text-gold-500 group-hover:scale-110 transition-transform duration-300 fill-current" />;
      case 'calendar': return <Calendar className="w-16 h-16 text-brand-500 group-hover:scale-110 transition-transform duration-300 fill-current" />;
      default: return <PlayCircle className="w-16 h-16 text-brand-500 group-hover:scale-110 transition-transform duration-300 fill-current" />;
    }
  };

  return (
    <div className="page-section bg-white active">
      <SEO title={pageInfo.title} description={pageInfo.description} />
      <div className="bg-surface-50 border-b border-surface-100 pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-main mb-6">{pageInfo.title}</h1>
          <p className="text-xl text-text-muted leading-relaxed">{pageInfo.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-text-muted">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-brand-500" />
              <p className="text-lg font-medium">Loading {category || 'resources'}...</p>
            </div>
          ) : resources.length > 0 ? (
            resources.map(resource => (
              <div 
                key={resource.id} 
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/resources/sermon/${resource.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/resources/sermon/${resource.id}`);
                  }
                }}
                className="bg-white rounded-2xl border border-surface-100 shadow-sm hover:shadow-saas-lg transition-all duration-300 overflow-hidden group flex flex-col cursor-pointer focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <div className="h-48 bg-surface-50 flex items-center justify-center relative border-b border-surface-100 overflow-hidden">
                  {(resource as any).featuredImage ? (
                    <img 
                      src={(resource as any).featuredImage} 
                      alt={resource.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <>
                      <div className={`absolute inset-0 ${resource.icon === 'headphones' ? 'bg-gold-500' : 'bg-brand-500'} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                      {getIcon(resource.icon)}
                    </>
                  )}
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <span className={`text-xs font-bold uppercase ${resource.icon === 'headphones' ? 'text-gold-600' : 'text-brand-500'} tracking-wider mb-3`}>{resource.type}</span>
                  <h3 className={`text-xl font-display font-bold text-text-main mb-3 group-hover:${resource.icon === 'headphones' ? 'text-gold-600' : 'text-brand-500'} transition-colors`}>{resource.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-6 flex-grow line-clamp-3">{resource.excerpt || resource.description}</p>
                  
                  {(resource.audioUrl || (resource.podcastAudioStatus === 'ready' && resource.podcastAudioUrl)) && (
                    <div className="mb-6" onClick={(e) => e.stopPropagation()}>
                      <audio 
                        controls 
                        className="w-full h-10 rounded-lg bg-surface-50"
                        src={resource.audioUrl || resource.podcastAudioUrl}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  <span className="text-sm font-semibold text-text-main flex items-center">
                    {resource.icon === 'play' ? 'Watch Resource' : resource.icon === 'headphones' ? 'Listen Now' : 'View Gallery'} 
                    <ArrowRight className={`w-4 h-4 ml-2 ${resource.icon === 'headphones' ? 'text-gold-500' : 'text-brand-500'}`} />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-surface-50 rounded-3xl border border-dashed border-surface-200">
              <p className="text-text-muted text-lg">No {category || 'resources'} found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
