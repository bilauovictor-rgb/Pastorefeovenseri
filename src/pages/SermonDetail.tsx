import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { ArrowLeft, Calendar, User, Share2, Headphones, PlayCircle, ArrowRight, Mic, Loader2, Download, AlertCircle, Mail } from 'lucide-react';
import { SEO } from '../components/SEO';
import { FadeInUp } from '../components/FadeInUp';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { doc, onSnapshot, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

const ADMIN_EMAIL = "officialgiganticcomputers@gmail.com";

interface Resource {
  id: string | number;
  slug?: string;
  type: string;
  title: string;
  description?: string;
  excerpt?: string;
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
  const { id, slug } = useParams();
  const [user] = useAuthState(auth);
  const [resource, setResource] = useState<Resource | null>(null);
  const [relatedResources, setRelatedResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Newsletter state
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const identifier = slug || id;
    if (!identifier) return;

    let unsubscribe = () => {};

    const setupListener = async () => {
      try {
        let docRef;
        
        // If we have a slug, try to find the document by slug first
        if (slug) {
          const slugQuery = query(collection(db, 'sermons'), where('slug', '==', slug), limit(1));
          const slugSnapshot = await getDocs(slugQuery);
          
          if (!slugSnapshot.empty) {
            docRef = doc(db, 'sermons', slugSnapshot.docs[0].id);
          } else {
            // Fallback: maybe the slug is actually an ID
            docRef = doc(db, 'sermons', slug);
          }
        } else {
          // We have an ID
          docRef = doc(db, 'sermons', id as string);
        }

        unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = { id: docSnap.id, ...docSnap.data() } as Resource;
            setResource(data);
            
            // Fetch related resources once
            const q = query(
              collection(db, 'sermons'),
              where('category', '==', data.category || 'Sermons'),
              where('status', '==', 'published'),
              orderBy('createdAt', 'desc')
            );
            getDocs(q).then(snapshot => {
              const related = snapshot.docs
                .map(d => ({ id: d.id, ...d.data(), category: d.data().category || 'Sermons' } as Resource))
                .filter(r => String(r.id) !== String(data.id))
                .slice(0, 3);
              setRelatedResources(related);
            }).catch(err => {
              console.error("Error fetching related resources:", err);
            });
          } else {
            setResource(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("Firestore Error in SermonDetail:", error);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error setting up listener:", error);
        setLoading(false);
      }
    };

    setupListener();

    return () => unsubscribe();
  }, [id, slug]);

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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubscribing(true);
    // Simulate API call for future backend integration
    setTimeout(() => {
      setIsSubscribing(false);
      setSubscribeSuccess(true);
      setEmail('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubscribeSuccess(false);
      }, 5000);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-dark-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold-secondary"></div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-bg-dark-primary">
        <h1 className="text-2xl font-display font-bold text-text-on-dark-primary mb-4">Resource Not Found</h1>
        <Link to="/resources/sermons" className="text-accent-gold-secondary font-semibold flex items-center">
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
      case 'play': return <PlayCircle className="w-12 h-12 text-accent-gold-secondary fill-current" />;
      case 'headphones': return <Headphones className="w-12 h-12 text-accent-gold-secondary fill-current" />;
      case 'calendar': return <Calendar className="w-12 h-12 text-accent-gold-secondary fill-current" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden bg-bg-dark-primary">
      <SEO 
        title={resource.title} 
        description={resource.excerpt || resource.description} 
        image={resource.featuredImage}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="article"
      />
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-dark-primary via-bg-dark-secondary to-bg-dark-tertiary opacity-90 z-0"></div>
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-accent-purple-soft/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-accent-purple-soft/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* Header / Navigation */}
      <div className="glass-nav py-6 sticky top-20 z-20 border-b border-border-dark-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to={`/resources/${resource.category?.toLowerCase().replace(/\s+/g, '-') || 'sermons'}`} className="text-text-on-dark-secondary hover:text-accent-gold-secondary font-medium flex items-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to {resource.category || 'Resources'}
          </Link>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-on-dark-secondary">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
        <FadeInUp>
          <div className="mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 bg-white/5 border border-border-dark-soft text-accent-gold-secondary backdrop-blur-sm">
              {resource.type}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text-on-dark-primary mb-6 leading-snug">
              {resource.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-text-on-dark-secondary mb-8">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-accent-gold-secondary" />
                <span>
                  {resource.category === 'Sermons' && (resource as any).createdAt 
                    ? `Published ${new Date((resource as any).createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`
                    : 'Published May 2025'}
                </span>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-accent-gold-secondary" />
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
                <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl bg-black ring-1 ring-border-dark-soft">
                  <YouTube 
                    videoId={resource.youtubeId} 
                    opts={opts} 
                    className="w-full h-full"
                  />
                </div>
              ) : resource.featuredImage ? (
                <div className="w-full rounded-3xl overflow-hidden shadow-2xl bg-white/5 ring-1 ring-border-dark-soft">
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
            <div className="bg-bg-dark-secondary/80 backdrop-blur-md border border-border-dark-soft rounded-3xl p-8 mb-16 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Mic className="w-24 h-24 text-accent-gold-secondary" />
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="max-w-xl">
                    <h3 className="text-xl font-display font-bold text-text-on-dark-primary mb-2 flex items-center">
                      <Headphones className="w-5 h-5 mr-2 text-accent-gold-secondary" />
                      {resource.audioUrl ? 'Listen to Teaching' : 'Audio Podcast'}
                    </h3>
                    <p className="text-text-on-dark-secondary text-sm">
                      {resource.audioUrl 
                        ? 'Listen to the original audio recording of this teaching.' 
                        : 'Experience this teaching as a high-quality audio podcast narrated by AI. Perfect for listening on the go.'}
                    </p>
                  </div>

                  <div className="flex-shrink-0 w-full md:w-auto">
                    {resource.audioUrl ? (
                      <audio 
                        controls 
                        className="w-full md:w-64 h-10 rounded-lg bg-white/5"
                        src={resource.audioUrl}
                      />
                    ) : resource.podcastAudioStatus === 'ready' ? (
                      <div className="flex flex-col gap-3">
                        <audio 
                          controls 
                          className="w-full md:w-64 h-10 rounded-lg bg-white/5"
                          src={resource.podcastAudioUrl}
                        />
                        <div className="flex items-center justify-between text-[10px] text-text-on-dark-secondary font-bold uppercase tracking-widest px-1">
                          <span className="flex items-center"><Mic className="w-3 h-3 mr-1" /> AI Narrated</span>
                          <a 
                            href={resource.podcastAudioUrl} 
                            download 
                            className="flex items-center hover:text-accent-gold-secondary transition-colors"
                          >
                            <Download className="w-3 h-3 mr-1" /> Download
                          </a>
                        </div>
                      </div>
                    ) : resource.podcastAudioStatus === 'generating' ? (
                      <div className="flex items-center text-accent-gold-secondary font-bold py-3 px-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Generating Audio...
                      </div>
                    ) : isAdmin ? (
                      <div className="flex flex-col items-end gap-3">
                        {resource.podcastAudioStatus === 'failed' && (
                          <div className="flex items-center text-red-400 text-xs font-bold mb-1">
                            <AlertCircle className="w-4 h-4 mr-1" /> Generation Failed
                          </div>
                        )}
                        <button 
                          onClick={handleGeneratePodcast}
                          disabled={isGenerating}
                          className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 gold-btn text-white rounded-xl font-bold transition-all disabled:opacity-50"
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
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400 flex items-start">
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
          <div className="bg-bg-dark-secondary/50 backdrop-blur-md border border-border-dark-soft rounded-[3rem] p-8 md:p-24 mb-24 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold-secondary/5 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-purple-soft/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
            
            <div className="max-w-3xl mx-auto relative z-10">
              <div className="flex items-center gap-5 mb-16">
                <div className="w-16 h-2 bg-accent-gold-secondary rounded-full" />
                <h2 className="text-3xl md:text-4xl font-display font-extrabold text-text-on-dark-primary">Today’s Teaching</h2>
              </div>

              <div className="sermon-article-content">
                {resource.blog ? (
                  <>
                    <MarkdownRenderer content={resource.blog} />
                    
                    {/* Key Takeaway Section */}
                    <div className="key-takeaway-box group bg-white/5 border border-border-dark-soft rounded-[2rem] p-8 md:p-12 mt-16">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-accent-gold-secondary text-bg-dark-primary rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                          <ArrowRight className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-display font-extrabold text-text-on-dark-primary">Takeaway for This Week</h3>
                      </div>
                      <p className="text-text-on-dark-secondary text-lg leading-relaxed italic">
                        The essence of this teaching is that spiritual growth is not a destination but a continuous journey of alignment with divine purpose. As we apply these principles, we move from mere knowledge to transformative experience.
                      </p>
                      <div className="mt-10 flex items-center text-accent-gold-secondary font-bold text-xs uppercase tracking-[0.2em]">
                        <span>Final Charge</span>
                        <div className="ml-6 flex-grow h-px bg-border-dark-soft" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="prose prose-xl max-w-none">
                    <p className="leading-relaxed mb-10 text-2xl text-text-on-dark-primary font-semibold italic border-l-4 border-accent-gold-secondary pl-8 py-6 bg-white/5 rounded-r-3xl">
                      {resource.excerpt || resource.description}
                    </p>
                    <div className="h-px bg-border-dark-soft my-12" />
                    <p className="leading-relaxed text-text-on-dark-secondary">
                      In this transformative session, Pastor Efe Ovenseri explores the intersection of spiritual calling and practical excellence. Drawing from years of global experience in both ministry and the marketplace, he provides a roadmap for believers seeking to make a significant impact in their spheres of influence.
                    </p>
                    
                    <div className="key-takeaway-box bg-white/5 border border-border-dark-soft rounded-[2rem] p-8 md:p-12 mt-16">
                      <h3 className="text-2xl font-display font-extrabold text-text-on-dark-primary mb-6">Summary</h3>
                      <p className="text-text-on-dark-secondary text-lg leading-relaxed italic">
                        This teaching serves as a catalyst for personal and spiritual growth, encouraging every believer to step into their God-given potential with confidence and clarity.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Divider */}
              <div className="mt-24 pt-12 border-t border-border-dark-soft flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-text-on-dark-muted text-sm font-semibold tracking-wide uppercase">
                  © {new Date().getFullYear()} Pastor Efe Ovenseri Ministries
                </div>
                <div className="flex items-center gap-6">
                  <button className="text-accent-gold-secondary hover:text-accent-gold-primary font-bold text-sm transition-colors flex items-center gap-2">
                    <Share2 className="w-4 h-4" /> Share Teaching
                  </button>
                  <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                  <button className="text-accent-gold-secondary hover:text-accent-gold-primary font-bold text-sm transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" /> Download Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Newsletter / Devotional Subscription */}
        <FadeInUp delay={0.25}>
          <div className="mb-24 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-bg-dark-secondary to-bg-dark-tertiary border border-border-dark-soft p-10 md:p-16 text-center shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-gold-secondary to-transparent opacity-50"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-gold-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-purple-soft/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="w-16 h-16 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                <Mail className="w-8 h-8 text-accent-gold-secondary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-text-on-dark-primary mb-4">
                Weekly Spiritual Insights
              </h2>
              <p className="text-lg text-text-on-dark-secondary mb-10 font-light leading-relaxed">
                Join our global community. Receive weekly devotionals, leadership principles, and exclusive updates directly from Pastor Efe Ovenseri.
              </p>
              
              {subscribeSuccess ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-green-400 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-bold text-lg">Thank you for subscribing!</p>
                  <p className="text-sm mt-1 opacity-80">Check your inbox for the latest insights.</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                  <div className="flex-grow relative">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address" 
                      required
                      className="w-full px-6 py-4 rounded-xl bg-bg-dark-primary/80 border border-border-dark-soft text-text-on-dark-primary placeholder-text-on-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-gold-secondary focus:border-transparent transition-all"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubscribing}
                    className="px-8 py-4 gold-premium-btn rounded-xl font-bold text-sm sm:text-base whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
                  >
                    {isSubscribing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Subscribe Now'
                    )}
                  </button>
                </form>
              )}
              <p className="text-xs text-text-on-dark-muted mt-6 uppercase tracking-wider font-semibold">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </FadeInUp>

        {/* Related Resources Section */}
        {relatedResources.length > 0 && (
          <FadeInUp delay={0.3}>
            <div className="pt-16 border-t border-border-dark-soft">
              <h2 className="text-2xl font-display font-bold text-text-on-dark-primary mb-8">Related Resources</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedResources.map((related) => (
                  <Link 
                    key={related.id}
                    to={`/resources/sermons/${related.slug || related.id}`}
                    className="bg-bg-dark-secondary/80 backdrop-blur-md border border-border-dark-soft rounded-3xl p-6 group flex flex-col hover:border-accent-gold-secondary/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-500"
                  >
                    <div className="h-32 bg-bg-dark-primary rounded-xl flex items-center justify-center mb-4 border border-border-dark-soft group-hover:bg-accent-purple-soft/5 transition-colors">
                      {getIcon(related.icon)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider mb-2 text-accent-gold-secondary">
                      {related.type}
                    </span>
                    <h3 className="text-lg font-display font-bold text-text-on-dark-primary mb-2 group-hover:text-accent-gold-secondary transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-text-on-dark-primary">
                      View <ArrowRight className="w-4 h-4 ml-1 text-accent-gold-secondary" />
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
