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

  const handleCreateSermon = async () => {
    try {
      const newSermon = {
        title: "Untitled Sermon",
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
      await updateDoc(doc(db, 'sermons', selectedSermon.id), formData);
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
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
      </div>
    );
  }

  const filteredSermons = sermons.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.topic?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-surface-100 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-surface-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-text-main">Pipeline</span>
          </div>
          <button onClick={logout} className="p-2 text-text-muted hover:text-red-500 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-surface-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search sermons..."
              className="w-full pl-10 pr-4 py-2 bg-surface-50 border border-surface-100 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
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
                  ? 'bg-brand-50 border-brand-200 shadow-sm' 
                  : 'hover:bg-surface-50 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  s.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-surface-100 text-text-muted'
                }`}>
                  {s.status}
                </span>
                <span className="text-[10px] text-text-muted font-mono">
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-display font-bold text-text-main line-clamp-1">{s.title}</h3>
              {s.podcastAudioStatus === 'ready' && (
                <div className="mt-2 flex items-center text-[10px] text-brand-500 font-bold">
                  <Mic className="w-3 h-3 mr-1" /> Podcast Ready
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-surface-100">
          <button 
            onClick={handleCreateSermon}
            className="w-full py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all shadow-sm flex items-center justify-center gap-2"
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
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-display font-bold text-text-main mb-2">
                    {isEditing ? 'Editing Sermon' : selectedSermon.title}
                  </h1>
                  <p className="text-text-muted flex items-center gap-2">
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
                      className="px-6 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                    >
                      {saveStatus === 'saving' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 bg-white border border-surface-100 text-text-main rounded-xl font-bold hover:bg-surface-50 transition-all shadow-sm"
                    >
                      Edit Content
                    </button>
                  )}
                </div>
              </div>

              {saveStatus === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-600 font-bold flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" /> Sermon saved successfully!
                </motion.div>
              )}

              <div className="space-y-8">
                {/* Basic Info */}
                <section className="bg-white p-8 rounded-3xl border border-surface-100 shadow-saas">
                  <h2 className="text-xl font-display font-bold text-text-main mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-brand-500" /> Basic Information
                  </h2>
                  <div className="grid gap-6">
                    <div>
                      <label className="block text-sm font-bold text-text-main mb-2">Sermon Title</label>
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-surface-50 border border-surface-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all disabled:opacity-60"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-text-main mb-2">Topic</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-surface-50 border border-surface-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all disabled:opacity-60"
                          value={formData.topic}
                          onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-text-main mb-2">Category</label>
                        <select 
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-surface-50 border border-surface-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all disabled:opacity-60"
                          value={formData.category}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        >
                          <option value="Sermons">Sermons</option>
                          <option value="Leadership Podcasts">Leadership Podcasts</option>
                          <option value="Events">Events</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-text-main mb-2">Status</label>
                        <select 
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-surface-50 border border-surface-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all disabled:opacity-60"
                          value={formData.status}
                          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                        >
                          <option value="draft">Draft</option>
                          <option value="processed">Processed</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-text-main mb-2">Sermon Goal</label>
                      <textarea 
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-4 py-3 bg-surface-50 border border-surface-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all disabled:opacity-60"
                        value={formData.goal}
                        onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                      />
                    </div>
                  </div>
                </section>

                {/* Manuscript */}
                <section className="bg-white p-8 rounded-3xl border border-surface-100 shadow-saas">
                  <h2 className="text-xl font-display font-bold text-text-main mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-brand-500" /> Sermon Manuscript
                  </h2>
                  <textarea 
                    disabled={!isEditing}
                    rows={10}
                    placeholder="Paste your sermon notes or full manuscript here..."
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all disabled:opacity-60 font-mono text-sm"
                    value={formData.manuscript}
                    onChange={(e) => setFormData(prev => ({ ...prev, manuscript: e.target.value }))}
                  />
                  {isEditing && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button 
                        onClick={() => generateAIContent('blog')}
                        disabled={!!isGenerating}
                        className="px-4 py-2 bg-brand-50 text-brand-500 rounded-lg font-bold text-sm hover:bg-brand-100 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {isGenerating === 'blog' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                        Generate Blog
                      </button>
                      <button 
                        onClick={() => generateAIContent('youtube')}
                        disabled={!!isGenerating}
                        className="px-4 py-2 bg-red-50 text-red-500 rounded-lg font-bold text-sm hover:bg-red-100 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {isGenerating === 'youtube' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Youtube className="w-4 h-4" />}
                        Generate YT Script
                      </button>
                      <button 
                        onClick={() => generateAIContent('social')}
                        disabled={!!isGenerating}
                        className="px-4 py-2 bg-blue-50 text-blue-500 rounded-lg font-bold text-sm hover:bg-blue-100 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {isGenerating === 'social' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                        Generate Socials
                      </button>
                      <button 
                        onClick={() => generateAIContent('email')}
                        disabled={!!isGenerating}
                        className="px-4 py-2 bg-gold-50 text-gold-600 rounded-lg font-bold text-sm hover:bg-gold-100 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {isGenerating === 'email' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                        Generate Email
                      </button>
                    </div>
                  )}
                </section>

                {/* AI Content Sections */}
                <div className="grid gap-8">
                  {/* Blog Section */}
                  <section className="bg-white p-8 rounded-3xl border border-surface-100 shadow-saas">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-display font-bold text-text-main flex items-center gap-2">
                        <FileText className="w-5 h-5 text-brand-500" /> Blog Post
                      </h2>
                      {formData.blog && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>
                    <textarea 
                      disabled={!isEditing}
                      rows={8}
                      className="w-full px-4 py-3 bg-surface-50 border border-surface-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all disabled:opacity-60 text-sm"
                      value={formData.blog}
                      onChange={(e) => setFormData(prev => ({ ...prev, blog: e.target.value }))}
                    />
                  </section>

                  {/* YouTube Section */}
                  <section className="bg-white p-8 rounded-3xl border border-surface-100 shadow-saas">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-display font-bold text-text-main flex items-center gap-2">
                        <Youtube className="w-5 h-5 text-red-500" /> YouTube Script
                      </h2>
                      {formData.youtubeScript && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>
                    <textarea 
                      disabled={!isEditing}
                      rows={8}
                      className="w-full px-4 py-3 bg-surface-50 border border-surface-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all disabled:opacity-60 text-sm"
                      value={formData.youtubeScript}
                      onChange={(e) => setFormData(prev => ({ ...prev, youtubeScript: e.target.value }))}
                    />
                  </section>

                  {/* Social & Email */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <section className="bg-white p-8 rounded-3xl border border-surface-100 shadow-saas">
                      <h2 className="text-xl font-display font-bold text-text-main mb-6 flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-blue-500" /> Social Posts
                      </h2>
                      <textarea 
                        disabled={!isEditing}
                        rows={6}
                        className="w-full px-4 py-3 bg-surface-50 border border-surface-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all disabled:opacity-60 text-sm"
                        value={formData.socialPosts}
                        onChange={(e) => setFormData(prev => ({ ...prev, socialPosts: e.target.value }))}
                      />
                    </section>
                    <section className="bg-white p-8 rounded-3xl border border-surface-100 shadow-saas">
                      <h2 className="text-xl font-display font-bold text-text-main mb-6 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-gold-500" /> Email Newsletter
                      </h2>
                      <textarea 
                        disabled={!isEditing}
                        rows={6}
                        className="w-full px-4 py-3 bg-surface-50 border border-surface-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all disabled:opacity-60 text-sm"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </section>
                  </div>
                </div>

                {/* Podcast Control */}
                <section className="bg-brand-500 p-8 rounded-3xl text-white shadow-brand overflow-hidden relative">
                  <Mic className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
                  <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <h2 className="text-2xl font-display font-bold mb-2">Podcast Generation</h2>
                        <p className="text-brand-100 opacity-80">
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
                            <span className="bg-white/20 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" /> Ready
                            </span>
                            <button 
                              onClick={() => handleGeneratePodcast(selectedSermon.id)}
                              className="bg-white text-brand-500 px-6 py-3 rounded-xl font-bold hover:bg-brand-50 transition-all"
                            >
                              Regenerate
                            </button>
                          </div>
                        ) : selectedSermon.podcastAudioStatus === 'generating' ? (
                          <div className="bg-white/20 px-6 py-3 rounded-xl font-bold flex items-center gap-3">
                            <Loader2 className="w-5 h-5 animate-spin" /> Generating...
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleGeneratePodcast(selectedSermon.id)}
                            className="bg-white text-brand-500 px-8 py-4 rounded-xl font-bold hover:bg-brand-50 transition-all shadow-lg flex items-center gap-2"
                          >
                            <Mic className="w-5 h-5" /> Generate Podcast
                          </button>
                        )}
                      </div>
                    </div>

                    {selectedSermon.podcastAudioStatus === 'ready' && selectedSermon.podcastAudioUrl && (
                      <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                        <p className="text-xs font-bold uppercase tracking-widest mb-3 opacity-60">Preview Audio</p>
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
                      <div className="p-4 bg-red-500/20 border border-white/10 rounded-2xl text-xs text-red-100 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span><strong>Error:</strong> {selectedSermon.podcastError}</span>
                        <button 
                          onClick={() => handleGeneratePodcast(selectedSermon.id)}
                          className="ml-auto underline font-bold"
                        >
                          Retry
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-text-muted" />
              </div>
              <h2 className="text-2xl font-display font-bold text-text-main mb-2">No Sermon Selected</h2>
              <p className="text-text-muted max-w-md">Select a sermon from the sidebar or create a new one to start your content pipeline.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
