import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Video, Shield, BarChart3, ChevronRight, Mail, MapPin, Eye } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navigation */}
      <header className="h-20 glass-nav fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            ISL NMF Capture
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#about" className="hover:text-white transition-colors">About ISL</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#framework" className="hover:text-white transition-colors">AI Pipeline</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold hover:text-white transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="glow-button px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-12 flex flex-col items-center text-center overflow-hidden">
        {/* Background Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none"></div>

        <div className="max-w-4xl relative z-10">
          <span className="px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6 inline-block animate-pulse">
            Advanced Computer Vision
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-8 leading-tight">
            Capturing Non-Manual Features of{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Indian Sign Language
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 font-normal mb-10 max-w-2xl mx-auto leading-relaxed">
            A state-of-the-art SaaS platform decoding facial expressions, head angles, eye gaze, and torso movements to translate ISL grammatical markers into text translations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-base font-semibold text-white shadow-xl shadow-blue-500/20 transition-all group"
            >
              Start Free Trial
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#about" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-base font-semibold transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* About ISL Section */}
      <section id="about" className="py-20 bg-slate-900/40 border-y border-white/5 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-blue-500 font-semibold text-sm uppercase tracking-wider">Grammatical Foundation</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-6">What are Non-Manual Features?</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              In Indian Sign Language (ISL), hand gestures (manual features) are only part of the language. Crucial grammatical markers—like negation, questions, emphasis, conditional clauses, and role-shifting—are conveyed entirely through <strong>Non-Manual Features (NMFs)</strong>.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-400">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">Facial & Eyebrow Expressions</h4>
                  <p className="text-sm text-slate-400 mt-1">Raised eyebrows signify yes/no questions, while furrowed eyebrows indicate Wh- questions (who, what, where).</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 text-indigo-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">Head Movements & Body Lean</h4>
                  <p className="text-sm text-slate-400 mt-1">Head shaking denotes negation; nodding denotes affirmation. Torso leaning left or right changes character references (Role Shift).</p>
                </div>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
            <h3 className="font-bold text-lg mb-4 text-blue-400">ISL Grammatical Map</h3>
            <div className="space-y-3.5">
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="font-medium">Raised Eyebrows + Tilt Forward</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">Yes/No Question</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="font-medium">Furrowed Eyebrows + Tilt Backward</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400">Wh- Question</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="font-medium">Head Shaking + Furrowed Brow</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400">Negation ("No")</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="font-medium">Gaze Shift + Torso Leaning Side</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400">Role Shift (Indirect speech)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-500 font-semibold text-sm uppercase tracking-wider">Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2">Comprehensive Workspace Tools</h2>
          <p className="text-slate-400 mt-4">Everything required to record, analyze, translate, and audit Indian Sign Language non-manual grammar.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card glass-card-hover rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 mb-6">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-200">Real-Time Webcam</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Stream camera frames directly into our pipeline for sub-second live recognition and feedback overlays.</p>
          </div>

          <div className="glass-card glass-card-hover rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-200">MediaPipe Mesh</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Extracts over 470 spatial landmarks to map subtle changes in brows, eyelids, irises, and mouth shape.</p>
          </div>

          <div className="glass-card glass-card-hover rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-500 mb-6">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-200">Deep Analytics</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Visualize trends, confidence averages, sign occurrences, and user accuracy charts over time.</p>
          </div>

          <div className="glass-card glass-card-hover rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-pink-600/10 flex items-center justify-center text-pink-500 mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-200">Audit Logs</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Maintain comprehensive search history logs of all conversions, image inputs, and classification values.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-900/20 border-t border-white/5 px-6 lg:px-12 w-full mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-4">ISL NMF Recognition Platform</h3>
            <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
              Research project focused on mapping the non-manual grammatical components of Indian Sign Language to enable natural language translation.
            </p>
            <div className="space-y-3.5 text-sm text-slate-400">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>Advanced AI Research Lab, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>support@isl-nmf-recognition.org</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-200 mb-4">Subscribe to Research Updates</h4>
            <p className="text-sm text-slate-400 mb-4">Get notified when new models are trained or papers published.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter email address" 
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-sm focus:outline-none focus:border-blue-500"
              />
              <button className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 mt-12 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <span>&copy; 2026 ISL Non-Manual Feature Recognition Project. All rights reserved.</span>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
