import React from "react";
import { Link } from "react-router-dom";

import {
  Cpu,
  Video,
  Shield,
  BarChart3,
  ChevronRight,
  Eye,
  Activity,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Globe,
  Zap,
  Brain,
  Hand,
  ScanFace
} from "lucide-react";

import { motion } from "framer-motion";


const LandingPage: React.FC = () => {

return (

<div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">


{/* TOP AI LIGHT BAR */}

<motion.div

animate={{x:["-100%","100%"]}}

transition={{
duration:3,
repeat:Infinity,
ease:"linear"
}}

className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 z-[100]"

/>





{/* NAVBAR */}

<header className="fixed top-1 left-0 right-0 h-20 z-50 px-6 lg:px-12 flex items-center justify-between bg-slate-950/70 backdrop-blur-xl border-b border-white/10">


<div className="flex items-center gap-3">


<motion.div

animate={{
rotate:[0,360]
}}

transition={{
duration:8,
repeat:Infinity,
ease:"linear"
}}

className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"

>

<Cpu/>

</motion.div>



<div>

<h1 className="font-black text-xl">
SignLink AI
</h1>


<p className="text-[10px] tracking-[0.3em] text-slate-400 uppercase">
Accessibility Platform
</p>


</div>


</div>





<nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-300">

<a href="#pipeline" className="hover:text-cyan-400">
AI Pipeline
</a>

<a href="#nmfs" className="hover:text-cyan-400">
Grammar & NMF
</a>

<a href="#features" className="hover:text-cyan-400">
Features
</a>

<a href="#specs" className="hover:text-cyan-400">
Specs
</a>


</nav>





<div className="flex items-center gap-4">

<Link
to="/login"
className="hidden sm:block text-slate-300 hover:text-cyan-400 font-semibold transition"
>
Sign In
</Link>


<Link
to="/register"
className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold shadow-xl hover:scale-105 transition"
>
Launch Suite
<ChevronRight className="inline ml-2"/>
</Link>

</div>


</header>









{/* HERO */}


<section className="relative min-h-screen flex items-center justify-center pt-32 px-6 overflow-hidden">


{/* BACKGROUND GLOW */}


<motion.div

animate={{
scale:[1,1.3,1],
opacity:[0.3,0.6,0.3]
}}

transition={{
duration:6,
repeat:Infinity
}}

className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full"

/>



<motion.div

animate={{
y:[0,-50,0]
}}

transition={{
duration:5,
repeat:Infinity
}}

className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/30 blur-[130px] rounded-full"

/>







<div className="relative z-10 max-w-7xl grid lg:grid-cols-2 gap-14 items-center">





{/* TEXT */}


<motion.div

initial={{
opacity:0,
x:-50
}}

animate={{
opacity:1,
x:0
}}

transition={{
duration:1
}}

>


<div className="flex gap-3 flex-wrap mb-8">


<span className="px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur text-xs font-bold">

<ShieldCheck className="inline w-4 mr-2 text-cyan-400"/>

AI Accessibility

</span>



<span className="px-5 py-2 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">

<Sparkles className="inline w-4 mr-2"/>

ISL Translation AI

</span>


</div>





<motion.h1

initial={{opacity:0,y:30}}

animate={{opacity:1,y:0}}

transition={{delay:.3}}

className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight"


>


Capturing


<span className="block bg-gradient-to-r from-cyan-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent">

Non-Manual Features

</span>


of Indian Sign Language


</motion.h1>





<p className="mt-8 text-lg text-slate-300 leading-relaxed">

AI-powered recognition of facial expressions, head movements,
body posture and hand gestures for real-time Indian Sign Language
to English translation.

</p>




<div className="flex gap-5 mt-10 flex-col sm:flex-row">


<Link

to="/register"

className="px-8 py-4 rounded-2xl bg-indigo-600 font-bold hover:scale-105 transition shadow-xl"

>

Get Started

<ChevronRight className="inline ml-2"/>

</Link>




<a

href="#pipeline"

className="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur"

>

Explore AI

</a>


</div>


</motion.div>





{/* AI CARD */}


<motion.div

initial={{
opacity:0,
x:50
}}

animate={{
opacity:1,
x:0
}}

transition={{
duration:1
}}

>


<motion.div

animate={{
y:[0,-15,0]
}}

transition={{
duration:4,
repeat:Infinity
}}

className="rounded-[2rem] bg-white/10 border border-white/20 backdrop-blur-xl p-8 shadow-2xl"

>


<div className="flex items-center gap-4 mb-8">


<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">

<Brain/>

</div>


<div>

<h2 className="text-2xl font-black">
AI Vision Engine
</h2>

<p className="text-slate-400">
Live Feature Processing
</p>

</div>


</div>
{[
  ["Facial Expression Detection", ScanFace],
  ["Hand Landmark Tracking", Hand],
  ["Body Pose Analysis", Activity],
  ["Text Generation", Brain]

].map(([text,Icon],index)=>(


<motion.div

key={text as string}

initial={{
opacity:0,
x:30
}}

animate={{
opacity:1,
x:0
}}

transition={{
delay:index*0.2
}}

whileHover={{
scale:1.05,
x:10
}}

className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 border border-white/10"

>


{/* @ts-ignore */}
<Icon className="text-cyan-300"/>


<span className="font-semibold">
{text}
</span>


</motion.div>


))}



<div className="mt-6 h-1 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 animate-pulse"/>


</motion.div>


</motion.div>


</div>


</section>








{/* PIPELINE SECTION */}



<section id="pipeline" className="relative py-28 overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">


<motion.div

animate={{
rotate:360
}}

transition={{
duration:30,
repeat:Infinity,
ease:"linear"
}}

className="absolute top-20 left-1/2 w-[500px] h-[500px] border border-cyan-400/10 rounded-full"

/>





<div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">


<div className="text-center mb-16">


<p className="text-cyan-400 uppercase tracking-[0.3em] text-xs font-bold">

AI Workflow

</p>



<h2 className="text-4xl lg:text-6xl font-black mt-4">

Multi-Modal Translation Pipeline

</h2>



<p className="text-slate-400 mt-5 max-w-3xl mx-auto">

A complete AI pipeline that transforms camera input,
landmark extraction and feature analysis into meaningful text.

</p>



</div>







<div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">


{[


[
"01",
"Video Capture",
"Live webcam streaming and frame processing",
Video
],



[
"02",
"MediaPipe AI",
"Face, hand and body landmark extraction",
Cpu
],



[
"03",
"Feature Intelligence",
"Understanding non-manual expressions",
Activity
],



[
"04",
"Language Output",
"Generating meaningful text",
CheckCircle2
]


].map(([number,title,desc,Icon],index)=>(



<motion.div


key={title as string}


initial={{
opacity:0,
y:50
}}


whileInView={{
opacity:1,
y:0
}}


transition={{
delay:index*0.15
}}


whileHover={{
y:-15,
scale:1.04
}}



className="relative group p-8 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl"


>


<div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition"/>



<div className="relative">


<div className="flex justify-between items-center">


<span className="text-cyan-400 font-black">

PHASE {number}

</span>



{/* @ts-ignore */}
<Icon className="text-purple-300 w-8 h-8"/>


</div>



<h3 className="text-2xl font-black mt-6">

{title}

</h3>


<p className="text-slate-400 mt-3">

{desc}

</p>



</div>


</motion.div>



))}


</div>


</div>


</section>
{/* NMF SECTION */}

<section 
id="nmfs"
className="relative py-28 bg-gradient-to-b from-slate-950 to-indigo-950 overflow-hidden"
>


<motion.div

animate={{
scale:[1,1.3,1]
}}

transition={{
duration:8,
repeat:Infinity
}}

className="absolute right-20 top-20 w-80 h-80 bg-purple-500/20 blur-[120px] rounded-full"

/>



<div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">


{/* LEFT */}


<motion.div

initial={{
opacity:0,
x:-40
}}

whileInView={{
opacity:1,
x:0
}}

transition={{
duration:0.8
}}

>


<p className="text-cyan-400 uppercase tracking-[0.3em] text-xs font-bold">

Grammatical Intelligence

</p>



<h2 className="text-4xl lg:text-6xl font-black mt-5">

Why Non-Manual Features Matter in ISL

</h2>



<p className="text-slate-300 text-lg mt-6 leading-relaxed">

Indian Sign Language is not only hand gestures.
Facial expressions, eye movement, head position,
and body posture provide important grammatical meaning.

</p>






<div className="space-y-5 mt-10">


<motion.div

whileHover={{
x:10
}}

className="p-6 rounded-3xl bg-white/10 backdrop-blur border border-white/10"

>


<Eye className="text-cyan-400 mb-4"/>


<h3 className="text-xl font-bold">

Facial Expressions

</h3>


<p className="text-slate-400 mt-2">

Detecting emotions, questions, emphasis and context.

</p>


</motion.div>






<motion.div

whileHover={{
x:10
}}

className="p-6 rounded-3xl bg-white/10 backdrop-blur border border-white/10"

>


<Activity className="text-emerald-400 mb-4"/>


<h3 className="text-xl font-bold">

Head & Body Movement

</h3>


<p className="text-slate-400 mt-2">

Understanding movement patterns and grammatical signals.

</p>


</motion.div>



</div>



</motion.div>








{/* RIGHT GRAMMAR MAP */}



<motion.div

initial={{
opacity:0,
scale:0.9
}}

whileInView={{
opacity:1,
scale:1
}}

className="rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/10 p-10 shadow-2xl"

>



<div className="flex items-center gap-4">


<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">

<Globe/>

</div>


<div>

<h3 className="text-3xl font-black">

ISL Grammar Map

</h3>

<p className="text-slate-400">

AI Pattern Recognition

</p>

</div>


</div>







<div className="mt-10 space-y-5">


{[

["Raised Brows","Yes / No Question"],
["Head Shake","Negation"],
["Eye Gaze","Topic Focus"],
["Body Shift","Context"]

].map(([a,b])=>(



<motion.div

whileHover={{
scale:1.04
}}

key={a}

className="flex justify-between items-center p-5 rounded-2xl bg-black/20 border border-white/10"

>


<span className="font-semibold">

{a}

</span>



<span className="text-cyan-300 text-sm font-bold">

{b}

</span>


</motion.div>



))}



</div>



</motion.div>




</div>


</section>









{/* FEATURES SECTION */}



<section

id="features"

className="py-28 bg-gradient-to-b from-indigo-950 to-slate-950"

>



<div className="max-w-7xl mx-auto px-6 lg:px-12">


<div className="text-center mb-16">


<p className="text-purple-300 uppercase tracking-[0.3em] text-xs font-bold">

Platform Features

</p>



<h2 className="text-4xl lg:text-6xl font-black mt-4">

Built For Real Accessibility

</h2>


</div>






<div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">



{[


[
"Real-Time Webcam",
"Live ISL capture through browser camera",
Video
],



[
"MediaPipe Tracking",
"AI powered face and hand analysis",
Cpu
],



[
"Performance Analytics",
"Confidence and latency monitoring",
BarChart3
],



[
"Secure Logging",
"Privacy focused architecture",
Shield
]



].map(([title,desc,Icon],index)=>(



<motion.div

key={title as string}

initial={{
opacity:0,
y:40
}}

whileInView={{
opacity:1,
y:0
}}

transition={{
delay:index*0.15
}}

whileHover={{
y:-15
}}



className="p-8 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/10"

>


{/* @ts-ignore */}

<Icon className="w-12 h-12 text-cyan-300 mb-6"/>


<h3 className="text-xl font-black">

{title}

</h3>


<p className="text-slate-400 mt-3">

{desc}

</p>


</motion.div>


))}



</div>



</div>



</section>
{/* SPECS SECTION */}

<section
id="specs"
className="relative py-28 bg-slate-950 overflow-hidden"
>


<motion.div

animate={{
x:[0,100,0],
y:[0,-50,0]
}}

transition={{
duration:10,
repeat:Infinity
}}

className="absolute left-20 top-20 w-96 h-96 bg-cyan-500/20 blur-[130px] rounded-full"

/>



<div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">





{/* LEFT */}

<motion.div

initial={{
opacity:0,
x:-40
}}

whileInView={{
opacity:1,
x:0
}}

>


<p className="text-cyan-400 uppercase tracking-[0.3em] text-xs font-bold">

Production Ready

</p>



<h2 className="text-4xl lg:text-6xl font-black mt-5">

Modern AI Architecture

</h2>



<p className="text-slate-300 text-lg mt-6 leading-relaxed">

SignLink AI combines computer vision, artificial intelligence,
and modern web technologies to create accessible communication.

</p>





<div className="grid grid-cols-2 gap-5 mt-10">


{[

["98.4%","Accuracy"],
["38ms","Latency"],
["3Hz","Capture"],
["100%","Privacy"]

].map(([num,label],index)=>(


<motion.div

key={label}

whileHover={{
scale:1.08
}}

className="p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10"

>


<h3 className="text-3xl font-black text-cyan-300">

{num}

</h3>


<p className="text-slate-400 mt-2">

{label}

</p>


</motion.div>



))}


</div>


</motion.div>







{/* RIGHT STACK */}



<motion.div

initial={{
opacity:0,
scale:.9
}}

whileInView={{
opacity:1,
scale:1
}}

className="rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/10 p-10"

>



<div className="flex items-center gap-4 mb-8">


<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">

<Zap/>

</div>


<div>

<h3 className="text-3xl font-black">

Technology Stack

</h3>

<p className="text-slate-400">

AI + Web Platform

</p>

</div>


</div>






<div className="space-y-4">


{[

["Frontend","React + TypeScript + Tailwind"],
["Backend","FastAPI + Python"],
["Computer Vision","MediaPipe Face, Pose & Hands"],
["Database","PostgreSQL / SQLite"],
["Deployment","Vite + Docker"]

].map(([a,b])=>(


<motion.div

whileHover={{
x:10
}}

key={a}

className="flex justify-between gap-5 p-5 rounded-2xl bg-black/20 border border-white/10"

>


<span className="font-bold">

{a}

</span>


<span className="text-slate-400 text-sm text-right">

{b}

</span>


</motion.div>



))}



</div>



</motion.div>



</div>


</section>








{/* FOOTER */}



<footer className="py-16 bg-black text-slate-400">


<div className="max-w-7xl mx-auto px-6 text-center">



<motion.div

animate={{
rotate:[0,360]
}}

transition={{
duration:10,
repeat:Infinity,
ease:"linear"
}}

className="inline-flex"

>

<Cpu className="w-12 h-12 text-cyan-400"/>

</motion.div>




<h3 className="text-white text-3xl font-black mt-5">

SignLink AI Platform

</h3>




<p className="mt-4 max-w-xl mx-auto">

Capturing non-manual features of Indian Sign Language
and converting them into meaningful text using AI.

</p>



<div className="mt-8 text-sm">

© 2026 SignLink AI. Accessibility Through Intelligence.

</div>



</div>


</footer>



</div>

);

};


export default LandingPage;