import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { ArrowLeft, Calendar, User, Share2, Headphones, CirclePlay, ArrowRight, Mic, Loader2, Download, AlertCircle, Mail, Video, MapPin, Check } from 'lucide-react';
import { SEO } from '../components/SEO';
import { FadeInUp } from '../components/FadeInUp';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { doc, onSnapshot, collection, query, where, getDocs, orderBy, limit, setDoc, getDoc } from 'firebase/firestore';

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
  blog?: string;
  featuredImage?: string;
  createdAt?: string;
  audioPlatform?: string;
  audioUrl?: string;
  audioEmbedUrl?: string;
  videoUrl?: string;
  duration?: string;
  speaker?: string;
  date?: string;
  location?: string;
  status?: string;
}

export function SermonDetail() {
  const { id, slug } = useParams();
  const location = useLocation();
  const [user, authLoading] = useAuthState(auth);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [resource, setResource] = useState<Resource | null>(null);
  const [relatedResources, setRelatedResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Newsletter state
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isAdmin = user?.email === ADMIN_EMAIL || userRole === 'admin';

  // Development bypass
  const isDevBypass = typeof window !== 'undefined' && (
    window.location.hostname.includes('ais-dev') || 
    new URLSearchParams(location.search).get('bypass') === 'dev-token-2026'
  );

  useEffect(() => {
    if (user) {
      const fetchUserRole = async () => {
        console.log(`User logged in: ${user.email} (${user.uid}). Fetching role...`);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const role = userDoc.data()?.role || 'user';
            console.log(`User role found: ${role}`);
            setUserRole(role);
          } else {
            console.log("No user document found in Firestore. Defaulting to 'user' role.");
            setUserRole('user');
          }
        } catch (err) {
          console.error("Error fetching user role from Firestore:", err);
          setUserRole('user');
        }
      };
      fetchUserRole();
    } else {
      console.log("No user logged in.");
      setUserRole(null);
    }
  }, [user]);

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/embed/')) {
      return url.split('youtube.com/embed/')[1]?.split('?')[0];
    }
    if (url.includes('youtube.com/watch')) {
      try {
        return new URL(url).searchParams.get('v');
      } catch (e) {
        return null;
      }
    }
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1]?.split('?')[0];
    }
    return null;
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    // Reset state when identifier or auth changes
    setLoading(true);
    setError(null);

    const identifier = slug || id;
    if (!identifier) return;

    // If user is logged in but we don't know their role yet, wait.
    // Except if they are the hardcoded admin email.
    if (user && user.email !== ADMIN_EMAIL && userRole === null) {
      return;
    }

    const queryParams = new URLSearchParams(location.search);
    const isPreview = queryParams.get('preview') === 'true';

    if (isPreview && (isAdmin || isDevBypass)) {
      const previewDataStr = localStorage.getItem(`preview_sermon_${id || identifier}`);
      if (previewDataStr) {
        try {
          const previewData = JSON.parse(previewDataStr) as Resource;
          previewData.youtubeId = previewData.youtubeId || getYoutubeId(previewData.audioEmbedUrl || '') || getYoutubeId(previewData.audioUrl || '') || getYoutubeId(previewData.videoUrl || '') || undefined;
          setResource(previewData);
          setLoading(false);
          return;
        } catch (e) {
          console.error("Error parsing preview data:", e);
        }
      }
    }

    if (isPreview && !user && !authLoading && !isDevBypass) {
      setError("Authentication required to view preview. Please sign in as an admin.");
      setLoading(false);
      return;
    }

    let unsubscribe = () => {};

    const setupListener = async () => {
      try {
        let docRef;
        console.log(`Setting up listener for identifier: ${identifier} (isPreview: ${isPreview}, isAdmin: ${isAdmin}, isDevBypass: ${isDevBypass})`);
        
        // If we have a slug, try to find the document by slug first
        if (slug) {
          console.log(`Searching for sermon with slug: ${slug}`);
          // Only filter by status for non-admins to avoid permission errors
          const slugQuery = isAdmin
            ? query(collection(db, 'sermons'), where('slug', '==', slug), limit(1))
            : query(collection(db, 'sermons'), where('slug', '==', slug), where('status', '==', 'published'), limit(1));
          
          const slugSnapshot = await getDocs(slugQuery);
          
          if (!slugSnapshot.empty) {
            const foundId = slugSnapshot.docs[0].id;
            console.log(`Found sermon ID ${foundId} for slug ${slug}`);
            docRef = doc(db, 'sermons', foundId);
          } else {
            console.warn(`No sermon found with slug ${slug}`);
            // If not an admin and slug query failed, it's likely not found or not published
            if (!isAdmin) {
              setError("Sermon not found or you don't have permission to view it.");
              setLoading(false);
              return;
            }
            // If admin, we can try to listen by ID in case the slug IS the ID
            docRef = doc(db, 'sermons', slug);
          }
        } else {
          console.log(`Fetching sermon by ID: ${id}`);
          docRef = doc(db, 'sermons', id as string);
        }

        console.log(`Attaching onSnapshot to: sermons/${docRef.id}`);
        unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = { id: docSnap.id, ...docSnap.data() } as Resource;
            
            // Double check status for non-admins
            if (!isAdmin && data.status !== 'published') {
              setError("Sermon not found or you don't have permission to view it.");
              setLoading(false);
              return;
            }

            data.youtubeId = data.youtubeId || getYoutubeId(data.audioEmbedUrl || '') || getYoutubeId(data.audioUrl || '') || getYoutubeId(data.videoUrl || '') || undefined;
            
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
                .map(d => {
                  const rData = { id: d.id, ...d.data(), category: d.data().category || 'Sermons' } as Resource;
                  rData.youtubeId = rData.youtubeId || getYoutubeId(rData.audioEmbedUrl || '') || getYoutubeId(rData.audioUrl || '') || getYoutubeId(rData.videoUrl || '') || undefined;
                  return rData;
                })
                .filter(r => String(r.id) !== String(data.id))
                .slice(0, 8);
              setRelatedResources(related);
            }).catch(err => {
              console.error("Error fetching related resources:", err);
            });
          } else {
            console.warn(`Sermon document not found: ${docRef.id}`);
            const getDemoData = (identifier: string) => {
              const allDemoData: Resource[] = [
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
                },
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

              const res = allDemoData.find(r => r.id === identifier || r.slug === identifier);
              if (res) {
                const related = allDemoData
                  .filter(r => r.category === res.category && r.id !== res.id)
                  .slice(0, 8);
                return { resource: res, related };
              }
              return null;
            };

            const demoData = getDemoData(slug || id as string);
            if (demoData) {
              setResource(demoData.resource);
              setRelatedResources(demoData.related);
            } else {
              setResource(null);
            }
          }
          setLoading(false);
        }, (error) => {
          console.error(`Firestore Error in SermonDetail for document ${docRef.id}:`, error);
          try {
            handleFirestoreError(error, OperationType.GET, `sermons/${docRef.id}`);
          } catch (err: any) {
            setError(err.message || "Missing or insufficient permissions");
          }
          setLoading(false);
        });
      } catch (error: any) {
        console.error("Error setting up listener:", error);
        setError(error.message || "Error setting up listener");
        setLoading(false);
      }
    };

    setupListener();

    return () => unsubscribe();
  }, [id, slug, isAdmin, authLoading, isDevBypass, location.search]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubscribing(true);
    setSubscribeError(null);
    setSubscribeSuccess(false);

    try {
      const subscriberRef = doc(db, 'subscribers', email.toLowerCase().trim());
      const subscriberSnap = await getDoc(subscriberRef);

      if (subscriberSnap.exists()) {
        setSubscribeError('You are already subscribed to our newsletter.');
        setIsSubscribing(false);
        return;
      }

      await setDoc(subscriberRef, {
        email: email.toLowerCase().trim(),
        createdAt: new Date().toISOString(),
        sourcePage: location.pathname
      });

      setSubscribeSuccess(true);
      setEmail('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubscribeSuccess(false);
      }, 5000);
    } catch (error: any) {
      console.error("Subscription Error:", error);
      try {
        handleFirestoreError(error, OperationType.CREATE, 'subscribers');
      } catch (err: any) {
        setSubscribeError(err.message || 'Failed to subscribe. Please try again.');
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-bg-primary">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-2xl font-display font-bold text-text-primary mb-4">Error Loading Resource</h1>
        <p className="text-text-secondary mb-8 max-w-md text-center">{error}</p>
        <Link to="/resources/sermons" className="text-accent-gold-primary font-semibold flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Resources
        </Link>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-bg-primary">
        <h1 className="text-2xl font-display font-bold text-text-primary mb-4">Resource Not Found</h1>
        <Link to="/resources/sermons" className="text-accent-gold-primary font-semibold flex items-center">
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
      case 'play': return <CirclePlay className="w-12 h-12 text-accent-gold-secondary fill-current" />;
      case 'headphones': return <Headphones className="w-12 h-12 text-accent-gold-secondary fill-current" />;
      case 'calendar': return <Calendar className="w-12 h-12 text-accent-gold-secondary fill-current" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-20 relative overflow-hidden">
      <SEO 
        title={resource.title} 
        description={resource.excerpt || resource.description} 
        image={resource.featuredImage}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="article"
      />
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.05),transparent_50%)]"></div>
      <div className="divine-glow top-0 right-0 opacity-20"></div>

      {/* Header / Navigation */}
      <div className="sticky top-20 z-20 bg-bg-primary/80 backdrop-blur-xl border-b border-border-soft py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link to={`/resources/${resource.category?.toLowerCase().replace(/\s+/g, '-') || 'sermons'}`} className="text-text-secondary hover:text-accent-gold-primary font-medium flex items-center transition-colors text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to {resource.category || 'Resources'}
          </Link>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleShare}
              className="p-2.5 bg-bg-secondary hover:bg-accent-gold-soft rounded-full transition-all text-text-secondary hover:text-accent-gold-primary border border-border-soft"
              title="Share Teaching"
            >
              {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-16 relative z-10">
        <FadeInUp>
          <div className="mb-12 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-gold-soft border border-border-gold text-accent-gold-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
              {resource.type}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8 text-text-primary leading-tight">
              {resource.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-text-secondary font-light">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2.5 text-accent-gold-primary/60" />
                <span>
                  {resource.date ? resource.date : (resource.category === 'Sermons' && (resource as any).createdAt 
                    ? `Published ${new Date((resource as any).createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`
                    : 'Published May 2025')}
                </span>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2.5 text-accent-gold-primary/60" />
                <span>{resource.speaker || 'Pastor Efe Ovenseri'}</span>
              </div>
              {resource.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2.5 text-accent-gold-primary/60" />
                  <span>{resource.location}</span>
                </div>
              )}
            </div>
          </div>
        </FadeInUp>

        {/* Primary Media Section (Video or Image) */}
        {(resource.youtubeId || resource.featuredImage) && (
          <FadeInUp delay={0.1}>
            <div className="mb-20">
              {resource.youtubeId ? (
                <div className="aspect-video w-full rounded-[2rem] overflow-hidden shadow-premium bg-black border border-border-soft">
                  <YouTube 
                    videoId={resource.youtubeId} 
                    opts={opts} 
                    onReady={(event) => {}}
                    onError={(e) => console.error("YouTube Player Error:", e)}
                    className="w-full h-full"
                  />
                </div>
              ) : resource.featuredImage ? (
                <div className="w-full rounded-[2rem] overflow-hidden shadow-premium bg-bg-secondary border border-border-soft">
                  <img 
                    src={resource.featuredImage} 
                    alt={resource.title} 
                    className="w-full h-auto object-cover max-h-[600px]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : null}
            </div>
          </FadeInUp>
        )}

        {/* Audio Section */}
        {(resource.audioEmbedUrl || resource.audioUrl) && (
          <FadeInUp delay={0.15}>
            <div className="glass-card p-10 mb-20 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Headphones className="w-48 h-48 text-accent-gold-primary" />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-display font-bold text-text-primary mb-8 flex items-center">
                  <Headphones className="w-6 h-6 mr-3 text-accent-gold-primary" />
                  Listen to this Teaching
                </h3>
                
                {resource.audioEmbedUrl ? (
                  <div className="aspect-video w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-black border border-border-soft">
                    <iframe 
                      src={resource.audioEmbedUrl} 
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      title="Audio Player"
                    ></iframe>
                  </div>
                ) : resource.audioUrl ? (
                  <div className="max-w-xl">
                    <audio 
                      controls 
                      className="w-full h-14 rounded-xl bg-bg-secondary border border-border-soft"
                      src={resource.audioUrl}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : null}
              </div>
            </div>
          </FadeInUp>
        )}

        <FadeInUp delay={0.2}>
          <div className="bg-white light-card rounded-[3rem] p-8 md:p-20 mb-24 relative overflow-hidden shadow-premium border border-border-soft">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold-soft rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
            
            <div className="max-w-3xl mx-auto relative z-10">
              <div className="flex items-center gap-6 mb-16">
                <div className="w-16 h-1.5 bg-accent-gold-primary rounded-full" />
                <h2 className="text-3xl md:text-4xl font-display font-bold">Today’s Teaching</h2>
              </div>

              <div className="sermon-article-content prose prose-lg prose-invert max-w-none">
                {resource.blog ? (
                  <>
                    <div>
                      <MarkdownRenderer content={resource.blog} />
                    </div>
                    
                    {/* Key Takeaway Section */}
                    <div className="mt-16 p-10 bg-bg-primary/5 rounded-[2rem] border border-accent-gold-primary/20 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <ArrowRight className="w-20 h-20 text-accent-gold-primary" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="p-3 bg-accent-gold-primary text-white rounded-xl shadow-lg">
                            <ArrowRight className="w-6 h-6" />
                          </div>
                          <h3 className="text-2xl font-display font-bold">Takeaway for This Week</h3>
                        </div>
                        <p className="text-lg leading-relaxed italic font-light">
                          The essence of this teaching is that spiritual growth is not a destination but a continuous journey of alignment with divine purpose. As we apply these principles, we move from mere knowledge to transformative experience.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-2xl font-display font-bold italic border-l-4 border-accent-gold-primary pl-8 py-6 bg-bg-primary/5 rounded-r-2xl mb-12">
                      {resource.excerpt || resource.description}
                    </p>
                    <div className="h-px bg-black/10 my-12" />
                    <p className="text-lg leading-relaxed font-light mb-10">
                      In this transformative session, Pastor Efe Ovenseri explores the intersection of spiritual calling and practical excellence. Drawing from years of global experience in both ministry and the marketplace, he provides a roadmap for believers seeking to make a significant impact in their spheres of influence.
                    </p>
                    
                    <div className="p-10 bg-bg-primary/5 rounded-[2rem] border border-black/10">
                      <h3 className="text-2xl font-display font-bold mb-6">Summary</h3>
                      <p className="text-lg leading-relaxed italic font-light">
                        This teaching serves as a catalyst for personal and spiritual growth, encouraging every believer to step into their God-given potential with confidence and clarity.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Divider */}
              <div className="mt-20 pt-12 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="opacity-50 text-[10px] font-bold tracking-[0.2em] uppercase">
                  © {new Date().getFullYear()} Pastor Efe Ovenseri Ministries
                </div>
                <div className="flex items-center gap-8">
                  <button 
                    onClick={handleShare}
                    className="text-accent-gold-primary hover:text-white font-bold text-xs transition-all flex items-center gap-2 uppercase tracking-widest"
                  >
                    {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Share2 className="w-4 h-4" /> Share</>}
                  </button>
                  <button className="text-accent-gold-primary hover:text-white font-bold text-xs transition-all flex items-center gap-2 uppercase tracking-widest">
                    <Download className="w-4 h-4" /> Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Newsletter Section */}
        <FadeInUp delay={0.25}>
          <div className="mb-24 glass-card p-12 md:p-20 text-center relative overflow-hidden">
            <div className="divine-glow top-0 left-1/2 -translate-x-1/2 opacity-10"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="w-16 h-16 mx-auto bg-accent-gold-soft rounded-2xl flex items-center justify-center mb-8 border border-border-gold">
                <Mail className="w-8 h-8 text-accent-gold-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-6">
                Weekly Spiritual Insights
              </h2>
              <p className="text-lg text-text-secondary mb-12 font-light leading-relaxed">
                Join our global community. Receive weekly devotionals, leadership principles, and exclusive updates directly from Pastor Efe Ovenseri.
              </p>
              
              {subscribeSuccess ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-green-600 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                  <Check className="w-12 h-12 mb-4" />
                  <p className="font-bold text-xl">Subscription Confirmed</p>
                  <p className="text-sm mt-2 opacity-80">Welcome to the inner circle of spiritual growth.</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address" 
                    required
                    className="flex-grow px-6 py-4 rounded-xl bg-bg-secondary border border-border-soft text-text-primary placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent-gold-primary/50 transition-all"
                  />
                  <button 
                    type="submit" 
                    disabled={isSubscribing}
                    className="gold-premium-btn px-8 py-4 rounded-xl font-bold text-sm whitespace-nowrap disabled:opacity-50"
                  >
                    {isSubscribing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Subscribe'}
                  </button>
                </form>
              )}
              {subscribeError && <p className="mt-4 text-red-500 text-xs font-medium">{subscribeError}</p>}
            </div>
          </div>
        </FadeInUp>

        {/* Related Resources Section */}
        {relatedResources.length > 0 && (
          <FadeInUp delay={0.3}>
            <div className="pt-20 border-t border-border-soft">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-display font-bold text-text-primary flex items-center">
                  <div className="w-8 h-1 bg-accent-gold-primary mr-4 rounded-full" />
                  Related Resources
                </h2>
                <div className="hidden md:flex gap-2">
                  <button 
                    onClick={() => {
                      const el = document.getElementById('related-carousel');
                      if (el) el.scrollBy({ left: -400, behavior: 'smooth' });
                    }}
                    className="p-2 rounded-full border border-border-soft hover:border-accent-gold-primary text-text-secondary hover:text-accent-gold-primary transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('related-carousel');
                      if (el) el.scrollBy({ left: 400, behavior: 'smooth' });
                    }}
                    className="p-2 rounded-full border border-border-soft hover:border-accent-gold-primary text-text-secondary hover:text-accent-gold-primary transition-all"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div 
                id="related-carousel"
                className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
              >
                {relatedResources.map((related) => (
                  <Link 
                    key={related.id}
                    to={`/resources/sermons/${related.slug || related.id}`}
                    className="glass-card p-8 group flex flex-col hover:border-accent-gold-primary/30 transition-all duration-500 min-w-[300px] md:min-w-[350px] snap-start"
                  >
                    <div className="h-40 bg-bg-secondary rounded-2xl flex items-center justify-center mb-6 border border-border-soft group-hover:bg-accent-gold-soft transition-colors overflow-hidden">
                      {related.featuredImage ? (
                        <img 
                          src={related.featuredImage} 
                          alt={related.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="p-6 opacity-40 group-hover:opacity-100 transition-opacity">
                          {getIcon(related.icon)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold-primary">
                        {related.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-display font-bold text-text-primary mb-4 group-hover:text-accent-gold-primary transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    
                    <div className="mt-auto pt-6 border-t border-border-soft flex items-center text-xs font-bold uppercase tracking-widest text-text-primary group-hover:text-accent-gold-primary transition-colors">
                      <span>View</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
