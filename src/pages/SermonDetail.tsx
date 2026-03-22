import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { ArrowLeft, Calendar, User, Share2, Headphones, PlayCircle, ArrowRight, Mic, Loader2, Download, AlertCircle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { FadeInUp } from '../components/FadeInUp';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { doc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';

const ADMIN_EMAIL = "officialgiganticcomputers@gmail.com";

interface Resource {
  id: string | number;
  type: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  youtubeId?: string;
  audioUrl?: string;
  blog?: string;
  featuredImage?: string;
  createdAt?: string;
  // Podcast fields
  podcastAudioUrl?: string;
  podcastAudioStatus?: "none" | "generating" | "ready" | "failed";
  podcastVoiceId?: string;
  podcastDuration?: number;
  podcastGeneratedAt?: string;
  podcastError?: string;
}

export function SermonDetail() {
  const { id } = useParams();
  const [user] = useAuthState(auth);
  const [resource, setResource] = useState<Resource | null>(null);
  const [relatedResources, setRelatedResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (!id) return;

    // Real-time listener for the specific sermon
    const unsubscribe = onSnapshot(doc(db, 'sermons', id), (docSnap) => {
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as Resource;
        setResource(data);
        
        // Fetch related resources once
        const q = query(
          collection(db, 'sermons'),
          where('category', '==', data.category || 'Sermons'),
          where('status', '==', 'published')
        );
        getDocs(q).then(snapshot => {
          const related = snapshot.docs
            .map(d => ({ id: d.id, ...d.data() } as Resource))
            .filter(r => String(r.id) !== String(id))
            .slice(0, 3);
          setRelatedResources(related);
        });
      } else {
        setResource(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error in SermonDetail:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const handleGeneratePodcast = async () => {
    if (!resource) return;
    setIsGenerating(true);
    setLocalError(null);
    try {
      const response = await fetch(`/api/generate-podcast/${resource.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFirestore: typeof resource.id === 'string' })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start generation');
      }
      // No need to refresh, onSnapshot handles it
    } catch (err: any) {
      console.error('Podcast generation error:', err);
      setLocalError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-display font-bold text-text-main mb-4">Resource Not Found</h1>
        <Link to="/resources/sermons" className="text-brand-500 font-semibold flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Resources
        </Link>
      </div>
    );
  }

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'play': return <PlayCircle className="w-12 h-12 text-brand-500 fill-current" />;
      case 'headphones': return <Headphones className="w-12 h-12 text-gold-500 fill-current" />;
      case 'calendar': return <Calendar className="w-12 h-12 text-brand-500 fill-current" />;
      default: return null;
    }
  };

  return (
    <div className="bg-surface-50 min-h-screen pb-20">
      <SEO title={resource.title} description={resource.description} />
      
      {/* Header / Navigation */}
      <div className="bg-white border-b border-surface-100 py-6 sticky top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to={`/resources/${resource.category?.toLowerCase().replace(/\s+/g, '-') || 'sermons'}`} className="text-text-muted hover:text-brand-500 font-medium flex items-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to {resource.category || 'Resources'}
          </Link>
          <button className="p-2 hover:bg-surface-50 rounded-full transition-colors text-text-muted">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <FadeInUp>
          <div className="mb-12">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${resource.icon === 'headphones' ? 'bg-gold-100 text-gold-600' : 'bg-brand-50 text-brand-500'}`}>
              {resource.type}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text-main mb-6 leading-snug">
              {resource.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-text-muted mb-8">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-brand-500" />
                <span>
                  {resource.category === 'Sermons' && (resource as any).createdAt 
                    ? `Published ${new Date((resource as any).createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`
                    : 'Published May 2025'}
                </span>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-brand-500" />
                <span>Pastor Efe Ovenseri</span>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Primary Media Section (Video or Image) */}
        {(resource.youtubeId || resource.featuredImage) && (
          <FadeInUp delay={0.1}>
            <div className="mb-16">
              {resource.youtubeId ? (
                <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-saas-lg bg-black">
                  <YouTube 
                    videoId={resource.youtubeId} 
                    opts={opts} 
                    className="w-full h-full"
                  />
                </div>
              ) : resource.featuredImage ? (
                <div className="w-full rounded-3xl overflow-hidden shadow-saas-lg bg-surface-50">
                  <img 
                    src={resource.featuredImage} 
                    alt={resource.title} 
                    className="w-full h-auto object-cover max-h-[500px]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : null}
            </div>
          </FadeInUp>
        )}

        {/* Audio & Podcast Section */}
        {(resource.audioUrl || resource.podcastAudioUrl || resource.podcastAudioStatus === 'generating' || isAdmin) && (
          <FadeInUp delay={0.15}>
            <div className="bg-white rounded-3xl p-8 border border-surface-100 shadow-saas mb-16 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Mic className="w-24 h-24 text-brand-500" />
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="max-w-xl">
                    <h3 className="text-xl font-display font-bold text-text-main mb-2 flex items-center">
                      <Headphones className="w-5 h-5 mr-2 text-brand-500" />
                      {resource.audioUrl ? 'Listen to Teaching' : 'Audio Podcast'}
                    </h3>
                    <p className="text-text-muted text-sm">
                      {resource.audioUrl 
                        ? 'Listen to the original audio recording of this teaching.' 
                        : 'Experience this teaching as a high-quality audio podcast narrated by AI. Perfect for listening on the go.'}
                    </p>
                  </div>

                  <div className="flex-shrink-0 w-full md:w-auto">
                    {resource.audioUrl ? (
                      <audio 
                        controls 
                        className="w-full md:w-64 h-10 rounded-lg bg-surface-50"
                        src={resource.audioUrl}
                      />
                    ) : resource.podcastAudioStatus === 'ready' ? (
                      <div className="flex flex-col gap-3">
                        <audio 
                          controls 
                          className="w-full md:w-64 h-10 rounded-lg bg-surface-50"
                          src={resource.podcastAudioUrl}
                        />
                        <div className="flex items-center justify-between text-[10px] text-text-muted font-bold uppercase tracking-widest px-1">
                          <span className="flex items-center"><Mic className="w-3 h-3 mr-1" /> AI Narrated</span>
                          <a 
                            href={resource.podcastAudioUrl} 
                            download 
                            className="flex items-center hover:text-brand-500 transition-colors"
                          >
                            <Download className="w-3 h-3 mr-1" /> Download
                          </a>
                        </div>
                      </div>
                    ) : resource.podcastAudioStatus === 'generating' ? (
                      <div className="flex items-center text-brand-500 font-bold py-3 px-6 bg-brand-50 rounded-2xl border border-brand-100">
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Generating Audio...
                      </div>
                    ) : isAdmin ? (
                      <div className="flex flex-col items-end gap-3">
                        {resource.podcastAudioStatus === 'failed' && (
                          <div className="flex items-center text-red-500 text-xs font-bold mb-1">
                            <AlertCircle className="w-4 h-4 mr-1" /> Generation Failed
                          </div>
                        )}
                        <button 
                          onClick={handleGeneratePodcast}
                          disabled={isGenerating}
                          className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Starting...
                            </>
                          ) : (
                            <>
                              <PlayCircle className="w-5 h-5 mr-2" />
                              {resource.podcastAudioStatus === 'failed' ? 'Retry Podcast' : 'Generate Podcast'}
                            </>
                          )}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
                
                {(resource.podcastError || localError) && isAdmin && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 flex items-start">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <span className="font-bold uppercase tracking-wider text-[10px]">Technical Error Details</span>
                      <span>{resource.podcastError || localError}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </FadeInUp>
        )}

        <FadeInUp delay={0.2}>
          <div className="bg-white rounded-[3rem] p-8 md:p-24 border border-surface-100 shadow-saas-lg mb-24 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold-50/30 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-50/20 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
            
            <div className="max-w-3xl mx-auto relative z-10">
              <div className="flex items-center gap-5 mb-16">
                <div className="w-16 h-2 bg-gold-500 rounded-full" />
                <h2 className="text-3xl md:text-4xl font-display font-extrabold text-text-main">Today’s Teaching</h2>
              </div>

              <div className="sermon-article-content">
                {resource.blog ? (
                  <>
                    <MarkdownRenderer content={resource.blog} />
                    
                    {/* Key Takeaway Section */}
                    <div className="key-takeaway-box group">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gold-500 text-white rounded-2xl shadow-md transform group-hover:scale-110 transition-transform duration-300">
                          <ArrowRight className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-display font-extrabold text-text-main">Takeaway for This Week</h3>
                      </div>
                      <p className="text-text-muted text-lg leading-relaxed italic">
                        The essence of this teaching is that spiritual growth is not a destination but a continuous journey of alignment with divine purpose. As we apply these principles, we move from mere knowledge to transformative experience.
                      </p>
                      <div className="mt-10 flex items-center text-gold-600 font-bold text-xs uppercase tracking-[0.2em]">
                        <span>Final Charge</span>
                        <div className="ml-6 flex-grow h-px bg-gold-200" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="prose prose-xl max-w-none">
                    <p className="leading-relaxed mb-10 text-2xl text-text-main font-semibold italic border-l-4 border-gold-500 pl-8 py-6 bg-gold-50/30 rounded-r-3xl">
                      {resource.description}
                    </p>
                    <div className="h-px bg-surface-100 my-12" />
                    <p className="leading-relaxed">
                      In this transformative session, Pastor Efe Ovenseri explores the intersection of spiritual calling and practical excellence. Drawing from years of global experience in both ministry and the marketplace, he provides a roadmap for believers seeking to make a significant impact in their spheres of influence.
                    </p>
                    
                    <div className="key-takeaway-box">
                      <h3 className="text-2xl font-display font-extrabold text-text-main mb-6">Summary</h3>
                      <p className="text-text-muted text-lg leading-relaxed italic">
                        This teaching serves as a catalyst for personal and spiritual growth, encouraging every believer to step into their God-given potential with confidence and clarity.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Divider */}
              <div className="mt-24 pt-12 border-t border-surface-100 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-text-light text-sm font-semibold tracking-wide uppercase">
                  © {new Date().getFullYear()} Pastor Efe Ovenseri Ministries
                </div>
                <div className="flex items-center gap-6">
                  <button className="text-gold-600 hover:text-gold-700 font-bold text-sm transition-colors flex items-center gap-2">
                    <Share2 className="w-4 h-4" /> Share Teaching
                  </button>
                  <div className="w-1.5 h-1.5 bg-surface-200 rounded-full" />
                  <button className="text-gold-600 hover:text-gold-700 font-bold text-sm transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" /> Download Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Related Resources Section */}
        {relatedResources.length > 0 && (
          <FadeInUp delay={0.3}>
            <div className="pt-16 border-t border-surface-200">
              <h2 className="text-2xl font-display font-bold text-text-main mb-8">Related Resources</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedResources.map((related) => (
                  <Link 
                    key={related.id}
                    to={`/resources/sermon/${related.id}`}
                    className="bg-white rounded-2xl border border-surface-100 p-6 shadow-sm hover:shadow-saas transition-all duration-300 group flex flex-col"
                  >
                    <div className="h-32 bg-surface-50 rounded-xl flex items-center justify-center mb-4 border border-surface-100 group-hover:bg-surface-100 transition-colors">
                      {getIcon(related.icon)}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${related.icon === 'headphones' ? 'text-gold-600' : 'text-brand-500'}`}>
                      {related.type}
                    </span>
                    <h3 className="text-lg font-display font-bold text-text-main mb-2 group-hover:text-brand-500 transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-text-main">
                      View <ArrowRight className="w-4 h-4 ml-1 text-brand-500" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </FadeInUp>
        )}
      </div>
    </div>
  );
}
