import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

import firebaseConfig from "./firebase-applet-config.json" with { type: "json" };

dotenv.config();

// Lazy initialization for Firebase Admin
let _db: admin.firestore.Firestore | null = null;

function getDb() {
  if (!_db) {
    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          projectId: firebaseConfig.projectId
        });
      }
      // Use the specific database ID from config if available
      _db = getFirestore(undefined, firebaseConfig.firestoreDatabaseId);
      console.log(`Firebase Admin initialized with database: ${firebaseConfig.firestoreDatabaseId}`);
    } catch (error) {
      console.error("Failed to initialize Firebase Admin:", error);
      throw error;
    }
  }
  return _db;
}

interface Resource {
  id: number;
  type: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  youtubeId?: string;
  audioUrl?: string;
  // Podcast fields
  podcastAudioUrl?: string;
  podcastAudioStatus?: "none" | "generating" | "ready" | "failed";
  podcastVoiceId?: string;
  podcastDuration?: number;
  podcastGeneratedAt?: string;
  podcastError?: string;
}

// In-memory store for mock data (other categories)
let staticResources: Resource[] = [
  {
    id: 2,
    type: "Audio Podcast",
    title: "Enterprise Meets Anointing",
    description: "Pastor Efe discusses practical strategies for balancing international business ventures with heavy ministerial responsibilities.",
    category: "Leadership Podcasts",
    icon: "headphones",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    podcastAudioStatus: "none"
  },
  {
    id: 3,
    type: "Event Update",
    title: "Availeith City Commissioning",
    description: "Relive the powerful moments from the May 2025 official commissioning and ordination ceremonies.",
    category: "Events",
    icon: "calendar",
    podcastAudioStatus: "none"
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/resources", async (req, res) => {
    try {
      const db = getDb();
      // Fetch sermons from Firestore
      const sermonsSnapshot = await db.collection('sermons')
        .where('status', '==', 'published')
        .get();
      
      const firestoreSermons = sermonsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        category: 'Sermons',
        type: 'Sermon',
        icon: 'play'
      }));

      // Only return Firestore sermons to avoid demo data overriding real content
      res.json(firestoreSermons);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      res.json([]);
    }
  });

  // ElevenLabs Generation Endpoint
  app.post("/api/generate-podcast/:id", async (req, res) => {
    const { id } = req.params;
    const { isFirestore = false } = req.body;

    console.log(`Received podcast generation request for ID: ${id}, isFirestore: ${isFirestore}`);

    let resource: any;
    let docRef: admin.firestore.DocumentReference | null = null;

    try {
      const db = getDb();
      if (isFirestore) {
        const collectionName = 'sermons';
        console.log(`Querying collection: ${collectionName} for document ID: ${id}`);
        docRef = db.collection(collectionName).doc(id);
        const docSnap = await docRef.get();
        
        if (!docSnap.exists) {
          console.error(`Sermon not found in Firestore: ${collectionName}/${id}`);
          return res.status(404).json({ error: "Sermon not found in database" });
        }
        resource = { id, ...docSnap.data() };
        console.log(`Found sermon: "${resource.title}"`);
      } else {
        resource = staticResources.find(r => r.id === Number(id));
        if (!resource) {
          console.error(`Static resource not found: ${id}`);
          return res.status(404).json({ error: "Resource not found" });
        }
      }

      if (resource.podcastAudioStatus === "generating") {
        return res.status(400).json({ error: "Generation already in progress" });
      }

      const blogContent = resource.blog || resource.description;
      if (!blogContent || blogContent.trim().length < 10) {
        console.error(`Insufficient content for podcast generation for ID: ${id}`);
        return res.status(400).json({ error: "Insufficient content to generate a podcast. Please provide a blog post or description." });
      }

      const apiKey = process.env.ELEVENLABS_API_KEY;
      const voiceId = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgmqS975pL9G';
      const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';

      if (!apiKey) {
        console.error("ELEVENLABS_API_KEY is missing. Podcast generation is disabled.");
        if (docRef) await docRef.update({ 
          podcastAudioStatus: "failed", 
          podcastError: "ElevenLabs API Key is not configured in environment variables." 
        });
        return res.status(503).json({ error: "ElevenLabs integration is not configured. Please add ELEVENLABS_API_KEY to your environment." });
      }

      console.log(`Using ElevenLabs Voice ID: ${voiceId}, Model ID: ${modelId}`);

      // Update status to generating
      if (docRef) await docRef.update({ 
        podcastAudioStatus: "generating", 
        podcastVoiceId: voiceId,
        podcastError: admin.firestore.FieldValue.delete()
      });
      else {
        resource.podcastAudioStatus = "generating";
        resource.podcastVoiceId = voiceId;
      }

      // Build speech text - sanitize by removing HTML and extra whitespace
      const speechText = `
        Title: ${resource.title}.
        ${blogContent}.
        This is a teaching by Pastor Efe Ovenseri.
        Thank you for listening to this divine message.
      `.replace(/<[^>]*>?/gm, '')
       .replace(/\s+/g, ' ')
       .trim();

      console.log(`Speech text prepared (${speechText.length} characters)`);

      // Respond early to the client
      res.json({ status: "generating", message: "Podcast generation started" });

      // Background generation
      (async () => {
        try {
          console.log(`Starting TTS generation for resource ${id}...`);
          
          const response = await axios({
            method: 'post',
            url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            data: {
              text: speechText,
              model_id: modelId,
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
              }
            },
            headers: {
              'xi-api-key': apiKey,
              'Content-Type': 'application/json',
              'Accept': 'audio/mpeg'
            },
            responseType: 'arraybuffer'
          });

          const bucketName = process.env.GCS_PODCAST_BUCKET;
          if (!bucketName) {
            throw new Error("GCS_PODCAST_BUCKET environment variable is missing. Cannot upload audio.");
          }

          const fileName = `podcasts/podcast-${id}-${Date.now()}.mp3`;
          const bucket = getStorage().bucket(bucketName);
          const file = bucket.file(fileName);

          console.log(`Uploading audio to GCS bucket: ${bucketName}, file: ${fileName}`);
          await file.save(Buffer.from(response.data), {
            metadata: { contentType: 'audio/mpeg' }
          });

          const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

          // Update resource metadata
          const updates = {
            podcastAudioUrl: publicUrl,
            podcastAudioStatus: "ready",
            podcastGeneratedAt: new Date().toISOString(),
            podcastError: admin.firestore.FieldValue.delete()
          };

          if (docRef) await docRef.update(updates);
          else {
            Object.assign(resource, updates);
            delete resource.podcastError;
          }
          
          console.log(`Successfully generated podcast for resource ${id}: ${updates.podcastAudioUrl}`);
        } catch (error: any) {
          const errorMsg = error.response?.data?.detail?.message || error.message;
          console.error(`ElevenLabs generation failed for resource ${id}:`, errorMsg);
          const errorUpdates = {
            podcastAudioStatus: "failed",
            podcastError: errorMsg
          };
          if (docRef) await docRef.update(errorUpdates);
          else Object.assign(resource, errorUpdates);
        }
      })();
    } catch (error: any) {
      console.error(`Error in podcast generation route for ID ${id}:`, error);
      res.status(500).json({ error: `Internal server error during podcast initialization: ${error.message}` });
    }
  });

  app.get("/api/metrics", (req, res) => {
    res.json({
      yearsOfService: 32,
      nationsReached: 7,
      coreMinistries: 4,
      divineDedication: 100
    });
  });

  app.get("/api/status", (req, res) => {
    res.json({
      isLive: true,
      nextService: "Sunday, 10:00 AM"
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
