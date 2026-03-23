import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, loginWithGoogle, logout, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { GoogleGenAI } from "@google/genai";
import { 
  Plus, 
  Search, 
  FileText, 
  Youtube, 
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
  LogOut
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

  // Form state
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
    status: "draft" as const
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingAuth && (!user || user.email !== ADMIN_EMAIL)) {
      navigate('/signin');
    }
  }, [user, loadingAuth, navigate]);

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
        podcastAudioStatus: "none"
      };
      const docRef = await addDoc(collection(db, 'sermons'), newSermon);
      setSelectedSermon({ id: docRef.id, ...newSermon });
      setIsEditing(true);
      setFormData({
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
        status: "draft"
      });
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
      setIsEditing(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      handleFirestoreError(error, OperationType.UPDATE, `sermons/${selectedSermon.id}`);
    }
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
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API Key is not configured. Please add it to your environment variables.");
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

  const handleGeneratePodcast = async (id: string) => {
    try {
      const response = await fetch(`/api/generate-podcast/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFirestore: true })
      });
      if (!response.ok) throw new Error("Failed to start podcast generation");
      alert("Podcast generation started in the background.");
    } catch (error) {
      console.error("Podcast generation failed:", error);
      alert("Failed to start podcast generation.");
    }
  };

  if (loadingAuth || (!user || user.email !== ADMIN_EMAIL)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light-primary">
        <Loader2 className="w-12 h-12 text-accent-gold-primary animate-spin" />
      </div>
    );
  }

  const filteredSermons = sermons.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.topic?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg-light-primary flex">
      {/* Sidebar */}
      <div className="w-80 bg-white/80 backdrop-blur-xl border-r border-border-light-soft flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-border-light-soft flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-bg-dark-secondary rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-accent-gold-primary" />
            </div>
            <span className="font-display font-bold text-text-on-light-primary">Pipeline</span>
          </div>
          <button onClick={logout} className="p-2 text-text-on-light-muted hover:text-red-500 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-border-light-soft">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-on-light-muted" />
            <input 
              type="text" 
              placeholder="Search sermons..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-border-light-soft rounded-xl text-sm focus:ring-2 focus:ring-accent-gold-primary outline-none transition-all text-text-on-light-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredSermons.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSermon(s);
                setFormData({
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
                  status: s.status || "draft"
                });
                setIsEditing(false);
              }}
              className={`w-full text-left p-4 rounded-2xl transition-all border ${
                selectedSermon?.id === s.id 
                  ? 'bg-accent-purple-soft border-border-light-soft shadow-sm' 
                  : 'hover:bg-accent-purple-soft border-transparent'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  s.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-accent-purple-soft text-text-on-light-secondary'
                }`}>
                  {s.status}
                </span>
                <span className="text-[10px] text-text-on-light-muted font-mono">
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-display font-bold text-text-on-light-primary line-clamp-1">{s.title}</h3>
              {s.podcastAudioStatus === 'ready' && (
                <div className="mt-2 flex items-center text-[10px] text-bg-dark-secondary font-bold">
                  <Mic className="w-3 h-3 mr-1 text-accent-gold-primary" /> Podcast Ready
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-border-light-soft">
          <button 
            onClick={handleCreateSermon}
            className="w-full py-3 bg-bg-dark-secondary text-white rounded-xl font-bold hover:bg-bg-dark-tertiary transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5 text-accent-gold-primary" /> New Sermon
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
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-display font-bold text-text-on-light-primary mb-2">
                    {isEditing ? 'Editing Sermon' : selectedSermon.title}
                  </h1>
                  <p className="text-text-on-light-muted flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Last updated {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleDeleteSermon(selectedSermon.id)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  {isEditing ? (
                    <button 
                      onClick={handleSaveSermon}
                      disabled={saveStatus === 'saving'}
                      className="px-6 py-3 bg-bg-dark-secondary text-white rounded-xl font-bold hover:bg-bg-dark-tertiary transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                    >
                      {saveStatus === 'saving' ? <Loader2 className="w-5 h-5 animate-spin text-accent-gold-primary" /> : <Save className="w-5 h-5 text-accent-gold-primary" />}
                      {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 bg-white border border-border-light-soft text-text-on-light-primary rounded-xl font-bold hover:bg-bg-light-primary transition-all shadow-sm"
                    >
                      Edit Content
                    </button>
                  )}
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex overflow-x-auto border-b border-border-light-soft mb-8 pb-px hide-scrollbar">
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
                    className={`flex items-center gap-2 px-6 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id 
                        ? 'border-accent-gold-primary text-accent-gold-primary' 
                        : 'border-transparent text-text-on-light-muted hover:text-text-on-light-primary hover:border-border-light-soft'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {saveStatus === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-700 font-bold flex items-center gap-2"
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
                    className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-border-light-soft shadow-[0_8px_30px_rgba(26,11,46,0.04)]"
                  >
                    <h2 className="text-xl font-display font-bold text-text-on-light-primary mb-6 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-accent-gold-primary" /> Basic Information
                    </h2>
                    <div className="grid gap-6">
                      <div>
                        <label className="block text-sm font-bold text-text-on-light-primary mb-2">Sermon Title</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-white border border-border-light-soft rounded-xl focus:ring-2 focus:ring-accent-gold-primary outline-none transition-all disabled:opacity-60 text-text-on-light-primary"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-text-on-light-primary mb-2">Topic</label>
                          <input 
                            type="text" 
                            disabled={!isEditing}
                            className="w-full px-4 py-3 bg-white border border-border-light-soft rounded-xl focus:ring-2 focus:ring-accent-gold-primary outline-none transition-all disabled:opacity-60 text-text-on-light-primary"
                            value={formData.topic}
                            onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-text-on-light-primary mb-2">Category</label>
                          <select 
                            disabled={!isEditing}
                            className="w-full px-4 py-3 bg-white border border-border-light-soft rounded-xl focus:ring-2 focus:ring-accent-gold-primary outline-none transition-all disabled:opacity-60 text-text-on-light-primary"
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                          >
                            <option value="Sermons">Sermons</option>
                            <option value="Leadership Podcasts">Leadership Podcasts</option>
                            <option value="Events">Events</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-text-on-light-primary mb-2">Sermon Goal</label>
                        <textarea 
                          disabled={!isEditing}
                          rows={3}
                          className="w-full px-4 py-3 bg-white border border-border-light-soft rounded-xl focus:ring-2 focus:ring-accent-gold-primary outline-none transition-all disabled:opacity-60 text-text-on-light-primary"
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
                    className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-border-light-soft shadow-[0_8px_30px_rgba(26,11,46,0.04)]"
                  >
                    <h2 className="text-xl font-display font-bold text-text-on-light-primary mb-6 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-accent-gold-primary" /> Sermon Manuscript
                    </h2>
                    <textarea 
                      disabled={!isEditing}
                      rows={15}
                      placeholder="Paste your sermon notes or full manuscript here..."
                      className="w-full px-4 py-3 bg-white border border-border-light-soft rounded-xl focus:ring-2 focus:ring-accent-gold-primary outline-none transition-all disabled:opacity-60 font-mono text-sm text-text-on-light-primary"
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
                    className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-border-light-soft shadow-[0_8px_30px_rgba(26,11,46,0.04)]"
                  >
                    <h2 className="text-xl font-display font-bold text-text-on-light-primary mb-6 flex items-center gap-2">
                      <Loader2 className="w-5 h-5 text-accent-gold-primary" /> AI Content Generation
                    </h2>
                    <p className="text-text-on-light-secondary mb-8">
                      Use the manuscript and basic information to automatically generate content for different platforms.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-6 border border-border-light-soft rounded-2xl bg-bg-light-primary">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-accent-purple-soft rounded-xl flex items-center justify-center">
                            <FileText className="w-5 h-5 text-accent-gold-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-text-on-light-primary">Blog Post</h3>
                            <p className="text-xs text-text-on-light-muted">Transform manuscript into an article</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => generateAIContent('blog')}
                          disabled={!!isGenerating || !isEditing}
                          className="w-full py-3 bg-white border border-border-light-soft rounded-xl font-bold text-sm hover:bg-accent-purple-soft transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isGenerating === 'blog' ? <Loader2 className="w-4 h-4 animate-spin text-accent-gold-primary" /> : 'Generate Blog'}
                        </button>
                      </div>

                      <div className="p-6 border border-border-light-soft rounded-2xl bg-bg-light-primary">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                            <Youtube className="w-5 h-5 text-red-500" />
                          </div>
                          <div>
                            <h3 className="font-bold text-text-on-light-primary">YouTube Script</h3>
                            <p className="text-xs text-text-on-light-muted">Create a video script with hooks</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => generateAIContent('youtube')}
                          disabled={!!isGenerating || !isEditing}
                          className="w-full py-3 bg-white border border-border-light-soft rounded-xl font-bold text-sm hover:bg-red-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isGenerating === 'youtube' ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : 'Generate Script'}
                        </button>
                      </div>

                      <div className="p-6 border border-border-light-soft rounded-2xl bg-bg-light-primary">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Share2 className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="font-bold text-text-on-light-primary">Social Media</h3>
                            <p className="text-xs text-text-on-light-muted">Generate 3 engaging posts</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => generateAIContent('social')}
                          disabled={!!isGenerating || !isEditing}
                          className="w-full py-3 bg-white border border-border-light-soft rounded-xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isGenerating === 'social' ? <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> : 'Generate Posts'}
                        </button>
                      </div>

                      <div className="p-6 border border-border-light-soft rounded-2xl bg-bg-light-primary">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-accent-gold-soft rounded-xl flex items-center justify-center">
                            <Mail className="w-5 h-5 text-accent-gold-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-text-on-light-primary">Email Newsletter</h3>
                            <p className="text-xs text-text-on-light-muted">Draft a congregation update</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => generateAIContent('email')}
                          disabled={!!isGenerating || !isEditing}
                          className="w-full py-3 bg-white border border-border-light-soft rounded-xl font-bold text-sm hover:bg-accent-gold-soft transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isGenerating === 'email' ? <Loader2 className="w-4 h-4 animate-spin text-accent-gold-primary" /> : 'Generate Email'}
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
                    className="grid gap-8"
                  >
                    <section className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-border-light-soft shadow-[0_8px_30px_rgba(26,11,46,0.04)]">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-display font-bold text-text-on-light-primary flex items-center gap-2">
                          <FileText className="w-5 h-5 text-accent-gold-primary" /> Blog Post
                        </h2>
                        {formData.blog && <CheckCircle className="w-5 h-5 text-green-500" />}
                      </div>
                      <textarea 
                        disabled={!isEditing}
                        rows={8}
                        className="w-full px-4 py-3 bg-white border border-border-light-soft rounded-xl focus:ring-2 focus:ring-accent-gold-primary outline-none transition-all disabled:opacity-60 text-sm text-text-on-light-primary"
                        value={formData.blog}
                        onChange={(e) => setFormData(prev => ({ ...prev, blog: e.target.value }))}
                      />
                    </section>

                    <section className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-border-light-soft shadow-[0_8px_30px_rgba(26,11,46,0.04)]">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-display font-bold text-text-on-light-primary flex items-center gap-2">
                          <Youtube className="w-5 h-5 text-red-500" /> YouTube Script
                        </h2>
                        {formData.youtubeScript && <CheckCircle className="w-5 h-5 text-green-500" />}
                      </div>
                      <textarea 
                        disabled={!isEditing}
                        rows={8}
                        className="w-full px-4 py-3 bg-white border border-border-light-soft rounded-xl focus:ring-2 focus:ring-accent-gold-primary outline-none transition-all disabled:opacity-60 text-sm text-text-on-light-primary"
                        value={formData.youtubeScript}
                        onChange={(e) => setFormData(prev => ({ ...prev, youtubeScript: e.target.value }))}
                      />
                    </section>

                    <div className="grid md:grid-cols-2 gap-8">
                      <section className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-border-light-soft shadow-[0_8px_30px_rgba(26,11,46,0.04)]">
                        <h2 className="text-xl font-display font-bold text-text-on-light-primary mb-6 flex items-center gap-2">
                          <Share2 className="w-5 h-5 text-blue-500" /> Social Posts
                        </h2>
                        <textarea 
                          disabled={!isEditing}
                          rows={6}
                          className="w-full px-4 py-3 bg-white border border-border-light-soft rounded-xl focus:ring-2 focus:ring-accent-gold-primary outline-none transition-all disabled:opacity-60 text-sm text-text-on-light-primary"
                          value={formData.socialPosts}
                          onChange={(e) => setFormData(prev => ({ ...prev, socialPosts: e.target.value }))}
                        />
                      </section>
                      <section className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-border-light-soft shadow-[0_8px_30px_rgba(26,11,46,0.04)]">
                        <h2 className="text-xl font-display font-bold text-text-on-light-primary mb-6 flex items-center gap-2">
                          <Mail className="w-5 h-5 text-accent-gold-primary" /> Email Newsletter
                        </h2>
                        <textarea 
                          disabled={!isEditing}
                          rows={6}
                          className="w-full px-4 py-3 bg-white border border-border-light-soft rounded-xl focus:ring-2 focus:ring-accent-gold-primary outline-none transition-all disabled:opacity-60 text-sm text-text-on-light-primary"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </section>
                    </div>
                  </motion.div>
                )}

                {/* Media Tab (Podcast) */}
                {activeTab === 'media' && (
                  <motion.section 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-bg-dark-secondary p-8 rounded-3xl text-white shadow-lg overflow-hidden relative"
                  >
                    <Mic className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 text-accent-gold-primary" />
                    <div className="relative z-10 flex flex-col gap-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <h2 className="text-2xl font-display font-bold mb-2">Podcast Generation</h2>
                          <p className="text-text-on-dark-secondary">
                            {selectedSermon.podcastAudioStatus === 'ready' 
                              ? 'Your podcast audio is ready for the congregation.' 
                              : selectedSermon.podcastAudioStatus === 'generating'
                              ? 'AI is currently narrating your sermon. This may take a minute.'
                              : 'Convert this sermon into a high-quality AI podcast episode.'}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          {selectedSermon.podcastAudioStatus === 'ready' ? (
                            <div className="flex items-center gap-3">
                              <span className="bg-white/10 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-white/10">
                                <CheckCircle className="w-4 h-4 text-accent-gold-primary" /> Ready
                              </span>
                              <button 
                                onClick={() => handleGeneratePodcast(selectedSermon.id)}
                                className="bg-accent-gold-primary text-bg-dark-secondary px-6 py-3 rounded-xl font-bold hover:bg-accent-gold-secondary transition-all"
                              >
                                Regenerate
                              </button>
                            </div>
                          ) : selectedSermon.podcastAudioStatus === 'generating' ? (
                            <div className="bg-white/10 px-6 py-3 rounded-xl font-bold flex items-center gap-3 border border-white/10">
                              <Loader2 className="w-5 h-5 animate-spin text-accent-gold-primary" /> Generating...
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleGeneratePodcast(selectedSermon.id)}
                              className="bg-accent-gold-primary text-bg-dark-secondary px-8 py-4 rounded-xl font-bold hover:bg-accent-gold-secondary transition-all shadow-lg flex items-center gap-2"
                            >
                              <Mic className="w-5 h-5" /> Generate Podcast
                            </button>
                          )}
                        </div>
                      </div>

                      {selectedSermon.podcastAudioStatus === 'ready' && selectedSermon.podcastAudioUrl && (
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                          <p className="text-xs font-bold uppercase tracking-widest mb-3 opacity-60 text-accent-gold-primary">Preview Audio</p>
                          <audio 
                            controls 
                            className="w-full h-10 rounded-lg"
                            src={selectedSermon.podcastAudioUrl}
                          >
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}

                      {selectedSermon.podcastError && (
                        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-xs text-red-200 flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                          <span><strong>Error:</strong> {selectedSermon.podcastError}</span>
                          <button 
                            onClick={() => handleGeneratePodcast(selectedSermon.id)}
                            className="ml-auto underline font-bold hover:text-white"
                          >
                            Retry
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.section>
                )}

                {/* Publish Tab */}
                {activeTab === 'publish' && (
                  <motion.section 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-border-light-soft shadow-[0_8px_30px_rgba(26,11,46,0.04)]"
                  >
                    <h2 className="text-xl font-display font-bold text-text-on-light-primary mb-6 flex items-center gap-2">
                      <Send className="w-5 h-5 text-accent-gold-primary" /> Publish Settings
                    </h2>
                    
                    <div className="grid gap-6 max-w-xl">
                      <div className="p-6 border border-border-light-soft rounded-2xl bg-bg-light-primary">
                        <label className="block text-sm font-bold text-text-on-light-primary mb-4">Visibility Status</label>
                        <select 
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-white border border-border-light-soft rounded-xl focus:ring-2 focus:ring-accent-gold-primary outline-none transition-all disabled:opacity-60 text-text-on-light-primary"
                          value={formData.status}
                          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                        >
                          <option value="draft">Draft (Hidden)</option>
                          <option value="processed">Processed (Internal Review)</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="published">Published (Live on site)</option>
                        </select>
                        <p className="text-xs text-text-on-light-muted mt-3">
                          Only "Published" sermons will appear on the public resources page.
                        </p>
                      </div>

                      {isEditing && (
                        <button 
                          onClick={handleSaveSermon}
                          disabled={saveStatus === 'saving'}
                          className="w-full py-4 bg-bg-dark-secondary text-white rounded-xl font-bold hover:bg-bg-dark-tertiary transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {saveStatus === 'saving' ? <Loader2 className="w-5 h-5 animate-spin text-accent-gold-primary" /> : <Save className="w-5 h-5 text-accent-gold-primary" />}
                          {saveStatus === 'saving' ? 'Saving...' : 'Save & Update Status'}
                        </button>
                      )}
                    </div>
                  </motion.section>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-white/80 border border-border-light-soft rounded-full flex items-center justify-center mb-6 shadow-sm">
                <FileText className="w-10 h-10 text-accent-gold-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-text-on-light-primary mb-2">No Sermon Selected</h2>
              <p className="text-text-on-light-secondary max-w-md">Select a sermon from the sidebar or create a new one to start your content pipeline.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
