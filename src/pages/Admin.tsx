import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, loginWithGoogle, logout, handleFirestoreError, OperationType } from '../firebase';
import { SEO } from '../components/SEO';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, Timestamp, getDoc, setDoc } from 'firebase/firestore';
import { GoogleGenAI } from "@google/genai";
import { 
  Plus, 
  Search, 
  FileText, 
  Video, 
  Share2, 
  Mail, 
  Save, 
  Trash2, 
  Send, 
  Mic, 
  Loader2, 
  ChevronRight, 
  CheckCircle,
  AlertCircle,
  Clock,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Eye,
  Globe,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ADMIN_EMAIL = "officialgiganticcomputers@gmail.com";

export function Admin() {
  const [user, loadingAuth] = useAuthState(auth);
  const [sermons, setSermons] = useState<any[]>([]);
  const [selectedSermon, setSelectedSermon] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'details' | 'manuscript' | 'ai' | 'generated' | 'media' | 'publish'>('details');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    goal: "",
    manuscript: "",
    blog: "",
    youtubeScript: "",
    socialPosts: "",
    email: "",
    excerpt: "",
    featuredImage: "",
    category: "Sermons" as string,
    status: "draft" as "draft" | "published" | "scheduled" | "processed",
    scheduledDate: "",
    audioPlatform: "youtube",
    audioUrl: "",
    audioEmbedUrl: "",
    videoUrl: ""
  });

  const [lastAutoSavedAt, setLastAutoSavedAt] = useState<Date | null>(null);
  const formDataRef = useRef(formData);
  const lastSavedDataRef = useRef(JSON.stringify(formData));

  const navigate = useNavigate();

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      // Handle youtu.be/ID
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return id ? `https://www.youtube.com/embed/${id}` : url;
      }
      // Handle youtube.com/watch?v=ID
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        const id = urlObj.searchParams.get('v');
        return id ? `https://www.youtube.com/embed/${id}` : url;
      }
    } catch (e) {
      return url;
    }
    return url;
  };

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Auto-save logic
  useEffect(() => {
    if (!selectedSermon || !isEditing) {
      setLastAutoSavedAt(null);
      return;
    }

    const intervalId = setInterval(async () => {
      const currentFormData = formDataRef.current;
      const currentDataStr = JSON.stringify(currentFormData);
      
      // Only auto-save if there are changes
      if (currentDataStr === lastSavedDataRef.current) return;

      try {
        const slug = generateSlug(currentFormData.title || "Untitled Sermon");
        const dataToSave = { ...currentFormData, slug };
        
        await updateDoc(doc(db, 'sermons', selectedSermon.id), dataToSave);
        lastSavedDataRef.current = currentDataStr;
        setLastAutoSavedAt(new Date());
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [selectedSermon?.id, isEditing]);

  // Data Scrub utility to fix inconsistent status labels
  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL || sermons.length === 0) return;

    const scrubData = async () => {
      let scrubbedCount = 0;
      for (const sermon of sermons) {
        // Fix the long UI label if it was accidentally saved to the database
        if (sermon.status === 'Published (Live on site)') {
          try {
            await updateDoc(doc(db, 'sermons', sermon.id), { status: 'published' });
            scrubbedCount++;
          } catch (error) {
            console.error(`Failed to scrub sermon ${sermon.id}:`, error);
          }
        }
      }
      if (scrubbedCount > 0) {
        console.log(`Data scrub complete. Fixed ${scrubbedCount} sermons with inconsistent status labels.`);
      }
    };

    scrubData();
  }, [user, sermons.length]);

  useEffect(() => {
    if (!loadingAuth && (!user || user.email !== ADMIN_EMAIL)) {
      navigate('/signin');
    }
  }, [user, loadingAuth, navigate]);

  // Ensure user document exists for admin
  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) return;

    const checkUserDoc = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists()) {
          console.log("Creating admin user document...");
          await setDoc(userDocRef, {
            email: user.email,
            role: 'admin',
            createdAt: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error("Error checking/creating user document:", error);
      }
    };

    checkUserDoc();
  }, [user]);

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) return;

    const q = query(collection(db, 'sermons'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSermons(data);
      
      // Update selectedSermon if it's currently selected to reflect background changes (like podcast status)
      setSelectedSermon(prev => {
        if (!prev) return null;
        const updated = data.find(s => s.id === prev.id);
        return updated || prev;
      });
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'sermons');
    });

    return () => unsubscribe();
  }, [user]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleCreateSermon = async () => {
    try {
      const newSermon = {
        title: "Untitled Sermon",
        slug: "untitled-sermon",
        status: "draft",
        category: "Sermons",
        createdAt: new Date().toISOString(),
        audioPlatform: "youtube",
        audioUrl: "",
        audioEmbedUrl: "",
        videoUrl: ""
      };
      const docRef = await addDoc(collection(db, 'sermons'), newSermon);
      setSelectedSermon({ id: docRef.id, ...newSermon });
      setIsEditing(true);
      const initialFormData = {
        title: "Untitled Sermon",
        topic: "",
        goal: "",
        manuscript: "",
        blog: "",
        youtubeScript: "",
        socialPosts: "",
        email: "",
        excerpt: "",
        featuredImage: "",
        category: "Sermons",
        status: "draft" as "draft" | "published" | "scheduled" | "processed",
        scheduledDate: "",
        audioPlatform: "youtube",
        audioUrl: "",
        audioEmbedUrl: "",
        videoUrl: ""
      };
      setFormData(initialFormData);
      lastSavedDataRef.current = JSON.stringify(initialFormData);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'sermons');
    }
  };

  const handleSaveSermon = async () => {
    if (!selectedSermon) return;
    setSaveStatus('saving');
    try {
      const slug = generateSlug(formData.title || "Untitled Sermon");
      const dataToSave = { ...formData, slug };
      await updateDoc(doc(db, 'sermons', selectedSermon.id), dataToSave);
      lastSavedDataRef.current = JSON.stringify(formData);
      setIsEditing(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      handleFirestoreError(error, OperationType.UPDATE, `sermons/${selectedSermon.id}`);
    }
  };

  const handlePreviewSermon = () => {
    if (!selectedSermon) return;
    
    // Prepare preview data
    const previewData = {
      ...formData,
      id: selectedSermon.id,
      createdAt: selectedSermon.createdAt || new Date().toISOString(),
      slug: generateSlug(formData.title || "Untitled Sermon")
    };
    
    // Save to localStorage
    localStorage.setItem(`preview_sermon_${selectedSermon.id}`, JSON.stringify(previewData));
    
    // Open in new tab
    const url = `/resources/sermon/${selectedSermon.id}?preview=true`;
    window.open(url, '_blank');
  };

  const handleDeleteSermon = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this sermon?")) return;
    try {
      await deleteDoc(doc(db, 'sermons', id));
      if (selectedSermon?.id === id) {
        setSelectedSermon(null);
        setIsEditing(false);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `sermons/${id}`);
    }
  };

  const generateAIContent = async (type: 'blog' | 'youtube' | 'social' | 'email') => {
    if (!formData.manuscript && !formData.topic) {
      alert("Please provide a manuscript or at least a topic to generate content.");
      return;
    }

    setIsGenerating(type);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API Key is not configured. Please add it to your environment variables as VITE_GEMINI_API_KEY.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const promptMap = {
        blog: `Act as a professional Christian blogger. Transform the following sermon manuscript into a structured, engaging blog post. Use clear headings, bullet points for key takeaways, and a warm, authoritative tone. No HTML tags.
        
        Title: ${formData.title}
        Topic: ${formData.topic}
        Goal: ${formData.goal}
        Manuscript: ${formData.manuscript}`,
        
        youtube: `Act as a YouTube scriptwriter for a ministry channel. Create a clean, engaging video script based on this sermon. Include a hook, main points, and a call to action. No HTML tags.
        
        Title: ${formData.title}
        Manuscript: ${formData.manuscript}`,
        
        social: `Create 3 engaging social media posts (Instagram/Facebook style) based on this sermon. Include relevant hashtags. No HTML tags.
        
        Title: ${formData.title}
        Topic: ${formData.topic}`,
        
        email: `Write a professional email newsletter to the congregation about this new teaching. Include a summary and a link to watch/listen. No HTML tags.
        
        Title: ${formData.title}
        Topic: ${formData.topic}`
      };

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: promptMap[type],
      });

      const content = response.text || "";
      setFormData(prev => ({ ...prev, [type === 'youtube' ? 'youtubeScript' : type]: content }));
    } catch (error) {
      console.error("AI Generation failed:", error);
      alert("AI Generation failed. Please check your API key and try again.");
    } finally {
      setIsGenerating(null);
    }
  };

  if (loadingAuth || (!user || user.email !== ADMIN_EMAIL)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight">
        <Loader2 className="w-12 h-12 text-gold animate-spin" />
      </div>
    );
  }

  if (user && user.email === ADMIN_EMAIL && !user.emailVerified) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-midnight p-8 text-center">
        <AlertCircle className="w-16 h-16 text-gold mb-6" />
        <h1 className="text-3xl font-display font-bold mb-4 gold-gradient-text">Email Verification Required</h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto font-light leading-relaxed">
          To access the administrative dashboard, your email address must be verified. Please check your inbox for a verification link.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="gold-premium-btn px-8 py-3.5"
          >
            I've Verified My Email
          </button>
          <button 
            onClick={logout}
            className="gold-outline-btn px-8 py-3.5"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const filteredSermons = sermons.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.topic?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-page-container min-h-screen bg-midnight flex text-white relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        .admin-page-container select, 
        .admin-page-container option {
          color: #FFFFFF !important;
          background-color: #1A1A1A !important;
        }
      ` }} />
      <SEO title="Admin Pipeline" description="Admin Dashboard for Pastor Efe Ovenseri Ministries. Securely manage sermons, leadership podcasts, events, and AI-generated content for global ministry impact." />
      
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gold rounded-full flex items-center justify-center shadow-lg text-midnight active:scale-95 transition-transform"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-80 bg-black/90 backdrop-blur-2xl border-r border-white/5 flex flex-col h-screen sticky top-0
        transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center border border-gold/20">
              <LayoutDashboard className="w-5 h-5 text-gold" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight gold-gradient-text">Pipeline</span>
          </div>
          <button onClick={logout} className="p-2 text-gray-500 hover:text-gold transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search sermons..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-gold/50 outline-none transition-all text-white placeholder-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {filteredSermons.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                const initialData = {
                  title: s.title || "",
                  topic: s.topic || "",
                  goal: s.goal || "",
                  manuscript: s.manuscript || "",
                  blog: s.blog || "",
                  youtubeScript: s.youtubeScript || "",
                  socialPosts: s.socialPosts || "",
                  email: s.email || "",
                  excerpt: s.excerpt || "",
                  featuredImage: s.featuredImage || "",
                  category: s.category || "Sermons",
                  status: (s.status as any) || "draft",
                  scheduledDate: s.scheduledDate || "",
                  audioPlatform: s.audioPlatform || "youtube",
                  audioUrl: s.audioUrl || "",
                  audioEmbedUrl: s.audioEmbedUrl || "",
                  videoUrl: s.videoUrl || ""
                };
                setSelectedSermon(s);
                setFormData(initialData);
                lastSavedDataRef.current = JSON.stringify(initialData);
                setIsEditing(false);
              }}
              className={`w-full text-left p-5 rounded-2xl transition-all border group ${
                selectedSermon?.id === s.id 
                  ? 'bg-gold/10 border-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]' 
                  : 'hover:bg-white/5 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-md ${
                  s.status === 'published' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/5 text-gray-500 border border-white/10'
                }`}>
                  {s.status}
                </span>
                <span className="text-[10px] text-gray-600 font-mono">
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className={`font-display font-bold text-sm line-clamp-1 transition-colors ${
                selectedSermon?.id === s.id ? 'text-gold' : 'text-gray-300 group-hover:text-white'
              }`}>{s.title}</h3>
              {(s.audioEmbedUrl || s.audioUrl || s.videoUrl) && (
                <div className="mt-3 flex items-center text-[10px] text-gold/80 font-bold uppercase tracking-widest">
                  <Video className="w-3 h-3 mr-1.5 text-red-500" /> Media Attached
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={handleCreateSermon}
            className="w-full gold-premium-btn py-4 rounded-xl flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> New Sermon
          </button>
        </div>
      </div>


      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {selectedSermon ? (
            <motion.div 
              key={selectedSermon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h1 className="text-4xl font-display font-bold mb-3 gold-gradient-text">
                    {isEditing ? 'Editing Sermon' : selectedSermon.title}
                  </h1>
                  <p className="text-gray-500 flex items-center gap-2 text-sm font-light">
                    <Clock className="w-4 h-4 text-gold/50" />
                    Last updated {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleDeleteSermon(selectedSermon.id)}
                    className="p-3.5 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  {isEditing ? (
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={handlePreviewSermon}
                        className="gold-outline-btn px-6 py-3.5 flex items-center gap-2"
                      >
                        <Eye className="w-5 h-5" />
                        Preview
                      </button>
                      <button 
                        onClick={handleSaveSermon}
                        disabled={saveStatus === 'saving'}
                        className="gold-premium-btn px-8 py-3.5 flex items-center gap-2 disabled:opacity-50"
                      >
                        {saveStatus === 'saving' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="gold-outline-btn px-8 py-3.5"
                    >
                      Edit Content
                    </button>
                  )}
                </div>
              </div>

              {lastAutoSavedAt && (
                <div className="flex justify-end mb-6">
                  <p className="text-[10px] text-gray-600 flex items-center gap-1.5 uppercase tracking-widest font-bold">
                    <Clock className="w-3 h-3 text-gold/40" />
                    Draft auto-saved at {lastAutoSavedAt.toLocaleTimeString()}
                  </p>
                </div>
              )}

              {/* Tabs Navigation */}
              <div className="flex overflow-x-auto border-b border-white/5 mb-12 pb-px hide-scrollbar">
                {[
                  { id: 'details', label: 'Details', icon: FileText },
                  { id: 'manuscript', label: 'Manuscript', icon: FileText },
                  { id: 'ai', label: 'AI Generation', icon: Loader2 },
                  { id: 'generated', label: 'Generated Content', icon: FileText },
                  { id: 'media', label: 'Media', icon: Mic },
                  { id: 'publish', label: 'Publish', icon: Send }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-3 px-8 py-5 font-bold text-xs uppercase tracking-[0.2em] border-b-2 transition-all ${
                      activeTab === tab.id 
                        ? 'border-gold text-gold bg-gold/5' 
                        : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-gold' : 'text-gray-600'}`} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {saveStatus === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-5 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 font-bold flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5" /> Sermon saved successfully!
                </motion.div>
              )}


              <div className="space-y-8">
                {/* Details Tab */}
                {activeTab === 'details' && (
                  <motion.section 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-10"
                  >
                    <h2 className="text-xl font-display font-bold mb-8 flex items-center gap-3 gold-gradient-text">
                      <FileText className="w-5 h-5 text-gold" /> Basic Information
                    </h2>
                    <div className="grid gap-8">
                      <div>
                        <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-3">Sermon Title</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all text-white placeholder-gray-600"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-3">Topic</label>
                          <input 
                            type="text" 
                            disabled={!isEditing}
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all text-white placeholder-gray-600"
                            value={formData.topic}
                            onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-3">Category</label>
                          <div className="relative">
                            <select 
                              disabled={!isEditing}
                              className="admin-select-override appearance-none w-full px-5 py-4 pr-12 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all text-white"
                              value={formData.category}
                              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            >
                              <option value="Sermons" className="admin-select-override">Sermons</option>
                              <option value="Leadership Podcasts" className="admin-select-override">Leadership Podcasts</option>
                              <option value="Events" className="admin-select-override">Events</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gold/50">
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-3">Sermon Goal</label>
                        <textarea 
                          disabled={!isEditing}
                          rows={3}
                          className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all text-white placeholder-gray-600 resize-none"
                          value={formData.goal}
                          onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                        />
                      </div>
                    </div>
                  </motion.section>
                )}

                {/* Manuscript Tab */}
                {activeTab === 'manuscript' && (
                  <motion.section 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-10"
                  >
                    <h2 className="text-xl font-display font-bold mb-8 flex items-center gap-3 gold-gradient-text">
                      <FileText className="w-5 h-5 text-gold" /> Sermon Manuscript
                    </h2>
                    <textarea 
                      disabled={!isEditing}
                      rows={15}
                      placeholder="Paste your sermon notes or full manuscript here..."
                      className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all font-mono text-sm text-gray-300 placeholder-gray-700 leading-relaxed"
                      value={formData.manuscript}
                      onChange={(e) => setFormData(prev => ({ ...prev, manuscript: e.target.value }))}
                    />
                  </motion.section>
                )}

                {/* AI Generation Tab */}
                {activeTab === 'ai' && (
                  <motion.section 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-10"
                  >
                    <h2 className="text-xl font-display font-bold mb-8 flex items-center gap-3 gold-gradient-text">
                      <Loader2 className="w-5 h-5 text-gold" /> AI Content Generation
                    </h2>
                    <p className="text-gray-400 mb-10 font-light leading-relaxed">
                      Use the manuscript and basic information to automatically generate content for different platforms.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="p-8 border border-white/5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center border border-gold/20 group-hover:border-gold/40 transition-all">
                            <FileText className="w-6 h-6 text-gold" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white">Blog Post</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Article Transformation</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => generateAIContent('blog')}
                          disabled={!!isGenerating || !isEditing}
                          className="w-full py-3.5 bg-white/5 border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gold hover:text-midnight transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                        >
                          {isGenerating === 'blog' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate Blog'}
                        </button>
                      </div>

                      <div className="p-8 border border-white/5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20 group-hover:border-red-500/40 transition-all">
                            <Video className="w-6 h-6 text-red-500" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white">YouTube Script</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Video Hook & Flow</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => generateAIContent('youtube')}
                          disabled={!!isGenerating || !isEditing}
                          className="w-full py-3.5 bg-white/5 border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                        >
                          {isGenerating === 'youtube' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate Script'}
                        </button>
                      </div>

                      <div className="p-8 border border-white/5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/40 transition-all">
                            <Share2 className="w-6 h-6 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white">Social Media</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Engagement Pack</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => generateAIContent('social')}
                          disabled={!!isGenerating || !isEditing}
                          className="w-full py-3.5 bg-white/5 border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                        >
                          {isGenerating === 'social' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate Posts'}
                        </button>
                      </div>

                      <div className="p-8 border border-white/5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center border border-gold/20 group-hover:border-gold/40 transition-all">
                            <Mail className="w-6 h-6 text-gold" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white">Email Newsletter</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Congregation Update</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => generateAIContent('email')}
                          disabled={!!isGenerating || !isEditing}
                          className="w-full py-3.5 bg-white/5 border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gold hover:text-midnight transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                        >
                          {isGenerating === 'email' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate Email'}
                        </button>
                      </div>
                    </div>
                  </motion.section>
                )}

                {/* Generated Content Tab */}
                {activeTab === 'generated' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid gap-10"
                  >
                    <section className="glass-card p-10">
                      <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-display font-bold gold-gradient-text flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gold" /> Blog Post
                        </h2>
                        {formData.blog && <CheckCircle className="w-5 h-5 text-green-500" />}
                      </div>
                      <textarea 
                        disabled={!isEditing}
                        rows={8}
                        className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all text-sm text-gray-300 placeholder-gray-700 leading-relaxed"
                        value={formData.blog}
                        onChange={(e) => setFormData(prev => ({ ...prev, blog: e.target.value }))}
                      />
                    </section>

                    <section className="glass-card p-10">
                      <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-display font-bold flex items-center gap-3 text-red-500">
                          <Video className="w-5 h-5" /> YouTube Script
                        </h2>
                        {formData.youtubeScript && <CheckCircle className="w-5 h-5 text-green-500" />}
                      </div>
                      <textarea 
                        disabled={!isEditing}
                        rows={8}
                        className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all text-sm text-gray-300 placeholder-gray-700 leading-relaxed"
                        value={formData.youtubeScript}
                        onChange={(e) => setFormData(prev => ({ ...prev, youtubeScript: e.target.value }))}
                      />
                    </section>

                    <div className="grid md:grid-cols-2 gap-10">
                      <section className="glass-card p-10">
                        <h2 className="text-xl font-display font-bold mb-8 flex items-center gap-3 text-blue-500">
                          <Share2 className="w-5 h-5" /> Social Posts
                        </h2>
                        <textarea 
                          disabled={!isEditing}
                          rows={6}
                          className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all text-sm text-gray-300 placeholder-gray-700 leading-relaxed"
                          value={formData.socialPosts}
                          onChange={(e) => setFormData(prev => ({ ...prev, socialPosts: e.target.value }))}
                        />
                      </section>
                      <section className="glass-card p-10">
                        <h2 className="text-xl font-display font-bold mb-8 flex items-center gap-3 gold-gradient-text">
                          <Mail className="w-5 h-5 text-gold" /> Email Newsletter
                        </h2>
                        <textarea 
                          disabled={!isEditing}
                          rows={6}
                          className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all text-sm text-gray-300 placeholder-gray-700 leading-relaxed"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </section>
                    </div>
                  </motion.div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                  <motion.section 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-10"
                  >
                    <h2 className="text-xl font-display font-bold mb-8 flex items-center gap-3 gold-gradient-text">
                      <Video className="w-5 h-5 text-red-500" /> External Media Links
                    </h2>
                    
                    <div className="grid gap-8 max-w-2xl">
                      <div className="p-8 border border-white/5 rounded-2xl bg-white/5">
                        <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-3">Audio/Video Platform</label>
                        <div className="relative mb-8">
                          <select 
                            disabled={!isEditing}
                            className="admin-select-override appearance-none w-full px-5 py-4 pr-12 bg-[#1A1A1A] border border-white/10 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all text-white text-sm md:text-base"
                            value={formData.audioPlatform}
                            onChange={(e) => setFormData(prev => ({ ...prev, audioPlatform: e.target.value }))}
                          >
                            <option value="youtube" className="admin-select-override">YouTube</option>
                            <option value="spotify" className="admin-select-override">Spotify</option>
                            <option value="apple" className="admin-select-override">Apple Podcasts</option>
                            <option value="other" className="admin-select-override">Other</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gold/50">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>

                        <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-3">Media URL (e.g., YouTube Watch URL)</label>
                        <input 
                          type="url"
                          disabled={!isEditing}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all text-white placeholder-gray-600 mb-8"
                          value={formData.audioUrl}
                          onChange={(e) => {
                            const url = e.target.value;
                            setFormData(prev => ({ 
                              ...prev, 
                              audioUrl: url,
                              audioEmbedUrl: getYoutubeEmbedUrl(url)
                            }));
                          }}
                        />

                        <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-3">Embed URL (Auto-generated for YouTube)</label>
                        <input 
                          type="url"
                          disabled={!isEditing}
                          placeholder="https://www.youtube.com/embed/..."
                          className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all text-white placeholder-gray-600"
                          value={formData.audioEmbedUrl}
                          onChange={(e) => setFormData(prev => ({ ...prev, audioEmbedUrl: e.target.value }))}
                        />
                        <p className="text-xs text-gray-500 mt-4 font-light">
                          Paste a standard YouTube link above, and the embed URL will be generated automatically.
                        </p>
                      </div>
                    </div>
                  </motion.section>
                )}

                {/* Publish Tab */}
                {activeTab === 'publish' && (
                  <motion.section 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-10"
                  >
                    <h2 className="text-xl font-display font-bold mb-8 flex items-center gap-3 gold-gradient-text">
                      <Send className="w-5 h-5 text-gold" /> Publish Settings
                    </h2>
                    
                    <div className="grid gap-8 max-w-xl">
                      <div className="p-8 border border-white/5 rounded-2xl bg-white/5">
                        <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-4">Visibility Status</label>
                        <div className="relative mb-6">
                          <select 
                            disabled={!isEditing}
                            className="admin-select-override appearance-none w-full px-5 py-4 pr-12 bg-[#1A1A1A] border border-white/10 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all text-white text-sm md:text-base"
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                          >
                            <option value="draft" className="admin-select-override">Draft (Hidden)</option>
                            <option value="processed" className="admin-select-override">Processed (Internal Review)</option>
                            <option value="scheduled" className="admin-select-override">Scheduled</option>
                            <option value="published" className="admin-select-override">Published (Live on site)</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gold/50">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>

                        {formData.status === 'scheduled' && (
                          <div className="animate-in fade-in slide-in-from-top-4 duration-300 mb-6">
                            <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-3">Publish Date & Time</label>
                            <input 
                              type="datetime-local"
                              disabled={!isEditing}
                              value={formData.scheduledDate}
                              onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all text-white"
                              style={{ color: '#FFFFFF' }}
                            />
                            <p className="mt-2 text-[10px] text-gray-500 italic">The teaching will automatically go live at this time.</p>
                          </div>
                        )}

                        <p className="text-xs text-gray-500 font-light">
                          {formData.status === 'published' 
                            ? 'Only "Published" sermons will appear on the public resources page.' 
                            : formData.status === 'scheduled'
                            ? `This teaching is hidden and will be published on ${formData.scheduledDate ? new Date(formData.scheduledDate).toLocaleString() : 'the selected date'}.`
                            : 'This teaching is currently hidden from the public.'}
                        </p>
                      </div>

                      {isEditing && (
                        <div className="flex flex-col gap-4">
                          <button 
                            onClick={handlePreviewSermon}
                            className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                          >
                            <Eye className="w-5 h-5 text-gold" />
                            Preview Content
                          </button>
                          <button 
                            onClick={handleSaveSermon}
                            disabled={saveStatus === 'saving'}
                            className="gold-premium-btn w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {saveStatus === 'saving' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {saveStatus === 'saving' ? 'Saving...' : 'Save & Update Status'}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.section>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
                <FileText className="w-10 h-10 text-gold/40" />
              </div>
              <h2 className="text-3xl font-display font-bold gold-gradient-text mb-4">No Sermon Selected</h2>
              <p className="text-gray-500 max-w-md font-light leading-relaxed">Select a sermon from the sidebar or create a new one to start your content pipeline.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
