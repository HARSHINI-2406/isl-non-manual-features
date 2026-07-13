import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { 
  Camera, Upload, Eye, RefreshCw, AlertCircle, Play, Pause,
  Cpu, FileText, CheckCircle2, Sliders, Info, Zap
} from 'lucide-react';

interface ExtractedFeatures {
  eyebrows: { left_height_ratio: number; right_height_ratio: number; state: string };
  mouth: { mar: number; state: string };
  gaze: { left_gaze: string; right_gaze: string; horizontal_ratio: number };
  head_pose: { pitch: number; yaw: number; roll: number; nodding: boolean; shaking: boolean };
  body: { shoulder_slope: number; lean: string; lean_ratio: number };
}

interface PredictionResponse {
  success: boolean;
  marker: string;
  translation: string;
  confidence: number;
  features: ExtractedFeatures;
  landmarks: Array<{ x: number; y: number }>;
  error?: string;
}

const WorkspacePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'webcam' | 'video' | 'image'>('webcam');
  
  // Webcam states
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Output prediction states
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [liveHistory, setLiveHistory] = useState<any[]>([]);

  // Video Upload States
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);

  // Image Upload States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Canvas and video refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const lastProcessTimeRef = useRef<number>(0);

  // Cleanup webcam stream on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  // Handle start/stop webcam
  const startWebcam = async () => {
    setError(null);
    setPrediction(null);
    setLiveHistory([]);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, frameRate: 15 }
      });
      webcamStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsWebcamActive(true);
      // Start frame capture loop
      animationFrameIdRef.current = requestAnimationFrame(processWebcamFrame);
    } catch (err: any) {
      console.error("Error accessing webcam", err);
      setError("Unable to access webcam. Please check camera permissions.");
    }
  };

  const stopWebcam = () => {
    setIsWebcamActive(false);
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach(track => track.stop());
      webcamStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Live stream loop (runs client-side and triggers FastAPI endpoint)
  const processWebcamFrame = async (timestamp: number) => {
    if (!isWebcamActive && !webcamStreamRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw mirror-image webcam frame to canvas
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        // Limit API requests to 3 frames per second (every ~330ms) to prevent network bloat
        if (timestamp - lastProcessTimeRef.current >= 350) {
          lastProcessTimeRef.current = timestamp;
          
          // Extract base64 from canvas
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          
          try {
            // Post frame features to live backend API
            const res = await api.post('/predict/live', {
              image_data_url: dataUrl,
              history: liveHistory.slice(-20) // send last 20 frames for nodding/shaking transitions
            });

            const pred: PredictionResponse = res.data;
            if (pred.success) {
              setPrediction(pred);
              
              // Append to history buffer
              if (pred.features) {
                setLiveHistory(prev => [...prev.slice(-20), pred.features]);
              }
            }
          } catch (err) {
            console.error("Frame recognition error", err);
          }
        }

        // Draw landmarks overlay if prediction exists
        if (prediction && prediction.landmarks && prediction.landmarks.length > 0) {
          ctx.fillStyle = '#3b82f6';
          prediction.landmarks.forEach(pt => {
            // Since webcam is mirrored, we might mirror landmarks or they come back relative to mirrored frame
            // The python model extracts landmarks relative to the decoded frame. Since we drew mirror, let's keep them matched.
            // If the model sees the mirrored canvas frame, landmarks are in mirrored space already.
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2, 0, 2 * Math.PI);
            ctx.fill();
          });
        }
      }
    }
    
    // Continue recursion
    if (webcamStreamRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(processWebcamFrame);
    }
  };

  // Video file upload
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
    }
  };

  const handleVideoUpload = async () => {
    if (!videoFile) return;
    setUploadProgress(true);
    setError(null);
    setPrediction(null);

    const formData = new FormData();
    formData.append('file', videoFile);

    try {
      const res = await api.post('/predict/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPrediction(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Error processing video file. Ensure format is valid.");
    } finally {
      setUploadProgress(false);
    }
  };

  // Image file upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setUploadProgress(true);
    setError(null);
    setPrediction(null);

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const res = await api.post('/predict/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPrediction(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Error processing image file.");
    } finally {
      setUploadProgress(false);
    }
  };

  // Helper to render facial landmark drawing on static image files
  useEffect(() => {
    if (activeTab === 'image' && prediction?.landmarks && imagePreviewUrl) {
      const canvas = canvasRef.current;
      const img = new Image();
      img.src = imagePreviewUrl;
      img.onload = () => {
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = 640;
            canvas.height = 480;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // Draw landmarks
            ctx.fillStyle = '#10b981';
            prediction.landmarks.forEach(pt => {
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 2.5, 0, 2 * Math.PI);
              ctx.fill();
            });
          }
        }
      };
    }
  }, [prediction, activeTab, imagePreviewUrl]);

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex border-b border-white/5 pb-0">
        <button
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-medium text-sm transition-all ${
            activeTab === 'webcam' 
              ? 'border-blue-500 text-slate-200 bg-white/2' 
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
          onClick={() => {
            stopWebcam();
            setActiveTab('webcam');
            setPrediction(null);
          }}
        >
          <Camera className="w-4.5 h-4.5" />
          Live Webcam Capture
        </button>
        <button
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-medium text-sm transition-all ${
            activeTab === 'video' 
              ? 'border-blue-500 text-slate-200 bg-white/2' 
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
          onClick={() => {
            stopWebcam();
            setActiveTab('video');
            setPrediction(null);
          }}
        >
          <Upload className="w-4.5 h-4.5" />
          Upload Video File
        </button>
        <button
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-medium text-sm transition-all ${
            activeTab === 'image' 
              ? 'border-blue-500 text-slate-200 bg-white/2' 
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
          onClick={() => {
            stopWebcam();
            setActiveTab('image');
            setPrediction(null);
          }}
        >
          <Eye className="w-4.5 h-4.5" />
          Upload Image Sequence
        </button>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Center - The Capture Screen (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-slate-900/10 pointer-events-none"></div>

            {/* ERROR notices */}
            {error && (
              <div className="absolute top-4 left-4 right-4 p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl flex gap-3 text-red-400 text-xs z-20">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* WEBCAM VIEW */}
            {activeTab === 'webcam' && (
              <div className="w-full max-w-[640px] aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden relative border border-white/5">
                <video
                  ref={videoRef}
                  className="hidden"
                  width="640"
                  height="480"
                  playsInline
                  muted
                />
                <canvas
                  ref={canvasRef}
                  width="640"
                  height="480"
                  className="w-full h-full object-cover"
                />
                {!isWebcamActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/80">
                    <Camera className="w-12 h-12 text-slate-600 mb-4 animate-bounce" />
                    <button
                      onClick={startWebcam}
                      className="glow-button px-6 py-3 bg-blue-600 hover:bg-blue-500 text-sm font-semibold rounded-xl text-white shadow-lg shadow-blue-500/25 transition-all"
                    >
                      Start Camera Capture
                    </button>
                    <p className="text-xs text-slate-500 mt-3 text-center max-w-xs">
                      Make sure to center your face and shoulders in the viewport for the best NMF extraction.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* VIDEO FILE VIEW */}
            {activeTab === 'video' && (
              <div className="w-full max-w-[640px] flex flex-col items-center gap-5">
                {videoPreviewUrl ? (
                  <div className="w-full aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden border border-white/5 relative">
                    <video
                      src={videoPreviewUrl}
                      className="w-full h-full object-cover"
                      controls
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[4/3] bg-slate-950/40 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center p-6">
                    <Upload className="w-10 h-10 text-slate-600 mb-4" />
                    <label className="cursor-pointer px-5 py-2.5 bg-white/5 hover:bg-white/10 text-xs font-semibold rounded-xl border border-white/10 transition-colors">
                      Select Video File
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoChange}
                      />
                    </label>
                    <span className="text-[10px] text-slate-600 mt-2">MP4, AVI, MOV up to 100MB</span>
                  </div>
                )}

                {videoFile && (
                  <div className="flex gap-4 w-full">
                    <button
                      onClick={handleVideoUpload}
                      disabled={uploadProgress}
                      className="flex-1 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-sm font-semibold text-white shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                    >
                      {uploadProgress ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Processing NMF Landmarks...
                        </>
                      ) : (
                        'Submit to AI Pipeline'
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setVideoFile(null);
                        setVideoPreviewUrl(null);
                        setPrediction(null);
                      }}
                      className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold border border-white/5"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* IMAGE SEQUENCE VIEW */}
            {activeTab === 'image' && (
              <div className="w-full max-w-[640px] flex flex-col items-center gap-5">
                {imagePreviewUrl ? (
                  <div className="w-full aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden border border-white/5 relative">
                    <canvas
                      ref={canvasRef}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[4/3] bg-slate-950/40 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center p-6">
                    <Upload className="w-10 h-10 text-slate-600 mb-4" />
                    <label className="cursor-pointer px-5 py-2.5 bg-white/5 hover:bg-white/10 text-xs font-semibold rounded-xl border border-white/10 transition-colors">
                      Select Sign Frame
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                    <span className="text-[10px] text-slate-600 mt-2">JPG, JPEG, PNG</span>
                  </div>
                )}

                {imageFile && (
                  <div className="flex gap-4 w-full">
                    <button
                      onClick={handleImageUpload}
                      disabled={uploadProgress}
                      className="flex-1 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-sm font-semibold text-white shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                    >
                      {uploadProgress ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Processing landmarks...
                        </>
                      ) : (
                        'Analyze Frame'
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setImagePreviewUrl(null);
                        setPrediction(null);
                      }}
                      className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold border border-white/5"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Controls Bar */}
          {isWebcamActive && (
            <div className="flex items-center justify-between p-4 glass-card rounded-2xl">
              <span className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                Webcam capture running. Sampling frequency: 3Hz.
              </span>
              <button
                onClick={stopWebcam}
                className="px-4 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
              >
                <Pause className="w-3.5 h-3.5" />
                Stop Feed
              </button>
            </div>
          )}
        </div>

        {/* Right - AI Predictions & Landmark features Side-Panel (1 column) */}
        <div className="space-y-5">
          {/* Prediction Result Box */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500 animate-pulse" />
              Translation Engine Output
            </h3>

            {prediction ? (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Grammatical Marker</span>
                  <p className="text-base font-semibold text-slate-300 mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    {prediction.marker}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Translated Text Meaning</span>
                  <p className="text-xl font-bold text-slate-100 mt-1 leading-tight">"{prediction.translation}"</p>
                </div>
                <div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
                    <span>Confidence Score</span>
                    <span>{Math.round(prediction.confidence * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        prediction.confidence >= 0.80 
                          ? 'bg-emerald-500 shadow-md shadow-emerald-500/20' 
                          : prediction.confidence >= 0.70 
                            ? 'bg-amber-500' 
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${prediction.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-sm">
                <Info className="w-8 h-8 mx-auto mb-3 text-slate-600" />
                Awaiting input stream. Activate the webcam or upload a media file above to run live predictions.
              </div>
            )}
          </div>

          {/* Metric Details Panel */}
          {prediction && prediction.features && (
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
                <Sliders className="w-4 h-4 text-indigo-500" />
                Extracted Metric Channels
              </h3>

              {/* Eyebrows raise */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span>Eyebrow Raise State</span>
                  <span className="capitalize text-slate-200">{prediction.features.eyebrows.state}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-500 block">Left Ratio</span>
                    <span className="text-sm font-bold text-slate-300">{prediction.features.eyebrows.left_height_ratio}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-500 block">Right Ratio</span>
                    <span className="text-sm font-bold text-slate-300">{prediction.features.eyebrows.right_height_ratio}</span>
                  </div>
                </div>
              </div>

              {/* Mouth Ratio */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span>Mouth Aperture (MAR)</span>
                  <span className="capitalize text-slate-200">{prediction.features.mouth.state}</span>
                </div>
                <div className="w-full bg-slate-950 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Mouth Aspect Ratio</span>
                    <span className="text-sm font-bold text-slate-300">{prediction.features.mouth.mar}</span>
                  </div>
                  <div className="w-24 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${Math.min(prediction.features.mouth.mar * 300, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Head angles */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 block">Head Pose Rotation (Euler)</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-950 p-2 rounded-xl border border-white/5">
                    <span className="text-[9px] text-slate-500 block">Pitch (Nod)</span>
                    <span className="text-xs font-bold text-slate-300">{prediction.features.head_pose.pitch}°</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-white/5">
                    <span className="text-[9px] text-slate-500 block">Yaw (Shake)</span>
                    <span className="text-xs font-bold text-slate-300">{prediction.features.head_pose.yaw}°</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-white/5">
                    <span className="text-[9px] text-slate-500 block">Roll (Tilt)</span>
                    <span className="text-xs font-bold text-slate-300">{prediction.features.head_pose.roll}°</span>
                  </div>
                </div>
              </div>

              {/* Body lean & Gaze */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Body Lean</span>
                  <span className="text-xs font-bold text-slate-200 capitalize mt-1 block">{prediction.features.body.lean}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Eye Gaze Direction</span>
                  <span className="text-xs font-bold text-slate-200 capitalize mt-1 block">{prediction.features.gaze.left_gaze}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;
