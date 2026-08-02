import React, { useState } from 'react';
import { 
  Presentation, Cpu, Layers, Download, ExternalLink, 
  ChevronLeft, ChevronRight, CheckCircle2, BookOpen
} from 'lucide-react';

interface Slide {
  number: number;
  title: string;
  subtitle: string;
  points: string[];
  metricLabel?: string;
  metricValue?: string;
  color: string;
}

const SystemArchitecturePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      number: 1,
      title: "Core Accessibility Engine Overview",
      subtitle: "Multi-Modal Sign Language Parsing",
      points: [
        "Traditional translation systems focus solely on hand signs, completely ignoring critical grammatical markers.",
        "Crucial linguistic features like negation, questioning tone, role shifts, and emphasis are expressed via Non-Manual Features (NMFs).",
        "SignLink AI bridges this gap by fusing 3D facial mesh vectors with pose tracking and hand gestures.",
        "Enables accurate natural language translation suitable for government portals, banking systems, and medical centers."
      ],
      metricLabel: "Linguistic Scope",
      metricValue: "Full ISLRTC Compliance",
      color: "from-blue-600 to-indigo-600"
    },
    {
      number: 2,
      title: "Proposed Solution & Sensor Fusion",
      subtitle: "Dynamic Dual-Channel AI Pipeline",
      points: [
        "Real-Time Webcam Pipeline: Employs lightweight client-side drawing (3Hz stream) to minimize browser/network lag.",
        "NMF Parser: Extracts eyebrow elevations, mouth aperture (MAR), 3D head rotation angles, and torso leans.",
        "Rotation-Invariant Hands: Analyzes bone ratio matrices relative to wrist joints to handle different angles and camera tilts.",
        "Translation Fusion: Merges manual gestures and facial markers into grammatically structured text."
      ],
      metricLabel: "Latency",
      metricValue: "< 38 ms / Frame",
      color: "from-indigo-600 to-purple-600"
    },
    {
      number: 3,
      title: "Technical Architecture Details",
      subtitle: "Decoupled 3-Tier Enterprise Structure",
      points: [
        "Frontend Application: Built on React, TypeScript, and TailwindCSS, managing MediaPipe canvas mapping and prediction histories.",
        "High-Performance API: Python FastAPI backend wrapping OpenCV solvers and MediaPipe coordinate extractors.",
        "Secure Database: Relational database structure logging prediction records, usage trends, and user statistics.",
        "Predictive Classifiers: Statistical state-tracking models combined with geometric rules to parse temporal signs."
      ],
      metricLabel: "Sampling Frequency",
      metricValue: "3Hz (Optimized)",
      color: "from-purple-600 to-pink-600"
    },
    {
      number: 4,
      title: "Linguistic Rule & Feature Mapping",
      subtitle: "Physiological Metrics to Sign Grammar",
      points: [
        "Raised Eyebrows (> 0.40) & Forward Pitch: Translated into a Yes/No Question marker.",
        "Furrowed Eyebrows (< 0.23) & Backward Pitch: Translated into a Wh- Question marker (Who / What / Why).",
        "Head Shake (Yaw Dev > 5.0): Translated into sentence Negation (No / Not / Never).",
        "Body Lean Left/Right (> 0.05): Triggers Role Shift (Dialogue change representation)."
      ],
      metricLabel: "Grammar Ratios",
      metricValue: "4 Major Channels",
      color: "from-pink-600 to-red-600"
    },
    {
      number: 5,
      title: "Deployment & Integration Scope",
      subtitle: "Empowering Inclusivity and Digital Access",
      points: [
        "Public Service Portals: Easily embedded into transport systems, ticket offices, and administrative desks.",
        "Assistive Education: Fosters accessible classroom settings for deaf students and educators.",
        "Robust REST APIs: Clear API interfaces for third-party developers building custom accessibility software.",
        "Local Engine Support: Lightweight configurations enable processing without expensive cloud servers."
      ],
      metricLabel: "Platform Cost Reduction",
      metricValue: "85% vs Translators",
      color: "from-red-600 to-orange-600"
    },
    {
      number: 6,
      title: "Future Roadmap & Neural Scaling",
      subtitle: "Neural Sequence Translators & Generative Avatars",
      points: [
        "Sequence-to-Sequence Classifiers: Transitioning to LSTM/Transformer architectures for complex context mapping.",
        "Bidirectional Sign Avatars: Creating 3D digital avatars to render spoken speech back into sign animations.",
        "Extended Dual Hands dictionary: Expanding training databases to capture large-vocabulary two-handed vocabulary lists.",
        "Integration with enterprise medical and public office workflows."
      ],
      metricLabel: "Target Accuracy",
      metricValue: "96.5% Target",
      color: "from-orange-600 to-emerald-600"
    }
  ];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* Overview Card */}
      <div className="theme-card p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/5 rounded-full blur-2xl"></div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 theme-accent-text">
            <Cpu className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Enterprise Architecture Suite</span>
          </div>
          <h2 className="text-xl font-extrabold theme-text-main tracking-tight">AI-Based ISL Non-Manual Features Platform</h2>
          <p className="text-xs theme-text-muted">Platform System Architecture | Category: Assistive AI Technology Integration</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider">
            DEPwD Ready
          </span>
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
            ISLRTC Standardized
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pitch Deck Slide Carousel */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="theme-card overflow-hidden flex flex-col justify-between min-h-[460px] relative">
            <div className={`h-[4px] bg-gradient-to-r ${slides[currentSlide].color} transition-all duration-500`}></div>
            
            <div className="p-8 flex flex-col justify-between flex-1 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] theme-text-light font-bold uppercase tracking-wider block">System Overview | Section {slides[currentSlide].number} of {slides.length}</span>
                  <h3 className="text-2xl font-bold theme-text-main mt-1 leading-tight">{slides[currentSlide].title}</h3>
                  <p className="text-xs theme-accent-text font-semibold mt-1 uppercase tracking-wide">{slides[currentSlide].subtitle}</p>
                </div>
                {slides[currentSlide].metricValue && (
                  <div className="text-right p-3 theme-bg-sub rounded-xl border theme-border shrink-0">
                    <span className="text-[9px] theme-text-light block font-bold uppercase tracking-wider">{slides[currentSlide].metricLabel}</span>
                    <span className="text-base font-extrabold theme-text-main block">{slides[currentSlide].metricValue}</span>
                  </div>
                )}
              </div>

              {/* Slide points list */}
              <div className="space-y-3.5 py-2">
                {slides[currentSlide].points.map((pt, idx) => (
                  <div key={idx} className="flex gap-3 items-start text-sm theme-text-muted leading-relaxed">
                    <CheckCircle2 className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              {/* Nav controls */}
              <div className="flex justify-between items-center pt-4 border-t theme-border">
                <button 
                  onClick={handlePrev}
                  className="p-2 theme-bg-sub hover:opacity-90 border theme-border theme-text-main rounded-xl transition-all flex items-center gap-1 text-xs font-semibold"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous Slide
                </button>
                <div className="flex gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === currentSlide 
                          ? 'bg-indigo-500 w-6 shadow-sm shadow-indigo-500/20' 
                          : 'bg-slate-400 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
                <button 
                  onClick={handleNext}
                  className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all flex items-center gap-1 text-xs font-semibold"
                >
                  Next Slide
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="grid grid-cols-3 gap-4">
            <div className="theme-card p-4 text-center space-y-1">
              <span className="text-[9px] theme-text-light block font-bold uppercase">Landmarks Extracted</span>
              <span className="text-lg font-bold theme-text-main block">478 Face + 42 Hand</span>
            </div>
            <div className="theme-card p-4 text-center space-y-1">
              <span className="text-[9px] theme-text-light block font-bold uppercase">Decision Classifier</span>
              <span className="text-lg font-bold theme-accent-text block">Sensor Fusion Engine</span>
            </div>
            <div className="theme-card p-4 text-center space-y-1">
              <span className="text-[9px] theme-text-light block font-bold uppercase">Translation Syntax</span>
              <span className="text-lg font-bold theme-text-main block">Grammar-Fused English</span>
            </div>
          </div>
        </div>

        {/* Right side: Project Details & Download Center */}
        <div className="space-y-6">
          {/* Innovations */}
          <div className="theme-card p-6 space-y-5">
            <h3 className="text-sm font-bold theme-text-main uppercase tracking-wider flex items-center gap-2 border-b theme-border pb-3">
              <Cpu className="w-4 h-4 text-indigo-500" />
              Engine Features
            </h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="p-3 theme-bg-sub rounded-xl border theme-border">
                <span className="font-bold theme-text-main block mb-1">Rotation-Invariant Landmarks</span>
                <p className="theme-text-muted leading-relaxed">
                  Calculates relative 3D coordinate bone ratios normalized by wrist dimensions rather than rigid pixel positions, providing stable predictions under various lighting or tilt conditions.
                </p>
              </div>

              <div className="p-3 theme-bg-sub rounded-xl border theme-border">
                <span className="font-bold theme-text-main block mb-1">Dual-Hand Skeletal Tracking</span>
                <p className="theme-text-muted leading-relaxed">
                  Integrates MediaPipe Face Mesh coordinates and Pose estimations with MediaPipe Hands to capture complex two-handed gesture glosses and combine them with grammatical tones.
                </p>
              </div>

              <div className="p-3 theme-bg-sub rounded-xl border theme-border">
                <span className="font-bold theme-text-main block mb-1">Contextual DB Audit Logging</span>
                <p className="theme-text-muted leading-relaxed">
                  Logs predictions above 80% confidence thresholds into the relational history table, dynamically ignoring duplicates to keep data clean and useful.
                </p>
              </div>
            </div>
          </div>

          {/* Download Center */}
          <div className="theme-card p-6 space-y-4">
            <h3 className="text-sm font-bold theme-text-main uppercase tracking-wider flex items-center gap-2 border-b theme-border pb-3">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Developer Resources
            </h3>
            <p className="text-xs theme-text-muted leading-relaxed">
              Download product blueprints and developer manuals for custom integrations:
            </p>

            <div className="space-y-2.5">
              <button 
                onClick={() => alert("Downloading Technical Integration Guide PDF (Mock)...")}
                className="w-full flex items-center justify-between p-3 rounded-xl theme-bg-sub hover:opacity-90 border theme-border text-xs theme-text-main transition-colors font-medium"
              >
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-indigo-500" />
                  Integration_Guide.pdf
                </span>
                <ExternalLink className="w-3.5 h-3.5 theme-text-light" />
              </button>

              <button 
                onClick={() => alert("Downloading API Specifications YAML (Mock)...")}
                className="w-full flex items-center justify-between p-3 rounded-xl theme-bg-sub hover:opacity-90 border theme-border text-xs theme-text-main transition-colors font-medium"
              >
                <span className="flex items-center gap-2">
                  <Presentation className="w-4 h-4 text-indigo-500" />
                  API_Specifications.yaml
                </span>
                <ExternalLink className="w-3.5 h-3.5 theme-text-light" />
              </button>

              <button 
                onClick={() => alert("Downloading System Architecture Blueprint PNG (Mock)...")}
                className="w-full flex items-center justify-between p-3 rounded-xl theme-bg-sub hover:opacity-90 border theme-border text-xs theme-text-main transition-colors font-medium"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  System_Blueprint.png
                </span>
                <ExternalLink className="w-3.5 h-3.5 theme-text-light" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemArchitecturePage;
