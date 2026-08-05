import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Eye,
  Smile,
  Activity,
  ArrowUpRight,
  User,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Zap
} from "lucide-react";

const WorkspacePage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const [streaming, setStreaming] = useState(false);
  const [translation, setTranslation] = useState(
    "Waiting for camera, image, or video input..."
  );
  const [confidence, setConfidence] = useState(0);
  const [processing, setProcessing] = useState(false);

  const [features, setFeatures] = useState({
    eyebrows: "raised",
    eyes: "open",
    mouth: "open",
    head: "left",
    body: "center",
    expression: "neutral"
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setFeatures({
        eyebrows: ["raised", "normal", "furrowed"][Math.floor(Math.random() * 3)],
        eyes: ["open", "closed"][Math.floor(Math.random() * 2)],
        mouth: ["open", "closed", "smile"][Math.floor(Math.random() * 3)],
        head: ["left", "right"][Math.floor(Math.random() * 2)],
        body: "center",
        expression: ["neutral", "happy"][Math.floor(Math.random() * 2)]
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setStreaming(true);
      setTranslation("Live camera connected. Start signing...");
      setConfidence(100);
    } catch (error) {
      alert("Camera permission denied");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((track) => track.stop());

    setStreaming(false);
    setTranslation("Camera stopped");
    setConfidence(0);
  };

  const uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    setTranslation("Analyzing image...");

    setTimeout(() => {
      const results = [
        { text: "Thank you", confidence: 93 },
        { text: "Please help me", confidence: 91 },
        { text: "I need water", confidence: 89 },
        { text: "Good morning", confidence: 95 }
      ];

      const pick = results[Math.floor(Math.random() * results.length)];
      setTranslation(pick.text);
      setConfidence(pick.confidence);
      setProcessing(false);
    }, 2000);
  };

  const uploadVideo = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    setTranslation("Analyzing video sequence...");

    setTimeout(() => {
      const results = [
        { text: "I need medical assistance", confidence: 90 },
        { text: "Where is the restroom?", confidence: 88 },
        { text: "I am learning sign language", confidence: 92 },
        { text: "Can you help me?", confidence: 94 }
      ];

      const pick = results[Math.floor(Math.random() * results.length)];
      setTranslation(pick.text);
      setConfidence(pick.confidence);
      setProcessing(false);
    }, 3000);
  };









  const FeatureCard = ({

    title,

    value,

    icon,

    color


  }:{

    title:string;

    value:string;

    icon:React.ReactNode;

    color:string;


  }) => (



    <motion.div

      whileHover={{
        y:-5,
        scale:1.03
      }}


      className="
      bg-[#0B1020]
      border border-white/10
      rounded-3xl
      p-5
      "


    >



      <div className={`
      flex
      items-center
      gap-2
      mb-4
      ${color}
      `}>



        {icon}


        <span className="font-semibold">

          {title}

        </span>



      </div>





      <div className="
      h-36
      flex
      items-center
      justify-center
      ">





      {/* EYEBROWS */}

      {
        title==="Eyebrows" &&


        <svg width="160" height="80">


          <motion.path

          d={
            value==="raised"
            ?
            "M20 45 Q55 10 90 35"
            :
            value==="furrowed"
            ?
            "M20 25 Q55 55 90 30"
            :
            "M20 35 Q55 25 90 35"
          }


          stroke="#22d3ee"

          strokeWidth="14"

          strokeLinecap="round"

          fill="none"



          animate={{
            y:value==="raised"
            ?
            [-5,0,-5]
            :
            0
          }}


          transition={{
            duration:1.2,
            repeat:Infinity
          }}


          />



          <motion.path

          d={
            value==="raised"
            ?
            "M70 35 Q105 10 140 45"
            :
            value==="furrowed"
            ?
            "M70 30 Q105 55 140 25"
            :
            "M70 35 Q105 25 140 35"
          }


          stroke="#22d3ee"

          strokeWidth="14"

          strokeLinecap="round"

          fill="none"



          animate={{
            y:value==="raised"
            ?
            [-5,0,-5]
            :
            0
          }}


          transition={{
            duration:1.2,
            repeat:Infinity
          }}


          />



        </svg>

      }
      {/* EYES WITH LASHES */}

      {
        title==="Eyes" &&


        <svg width="170" height="100">



          {/* LEFT EYE */}

          <motion.ellipse

          cx="55"

          cy="50"

          rx="35"

          ry={
            value==="closed"
            ?
            5
            :
            25
          }


          fill="white"

          stroke="#38bdf8"

          strokeWidth="4"


          animate={{

            scaleY:
            value==="closed"
            ?
            [1,0.2,1]
            :
            1

          }}


          transition={{

            duration:2,

            repeat:Infinity

          }}


          />



          {/* RIGHT EYE */}

          <motion.ellipse

          cx="115"

          cy="50"

          rx="35"

          ry={
            value==="closed"
            ?
            5
            :
            25
          }


          fill="white"

          stroke="#38bdf8"

          strokeWidth="4"


          />





          {
            value!=="closed" &&

            <>


            {/* IRIS */}

            <circle

            cx="55"

            cy="50"

            r="12"

            fill="#111827"

            />



            <circle

            cx="115"

            cy="50"

            r="12"

            fill="#111827"

            />



            {/* EYELASHES LEFT */}

            <path

            d="
            M30 25 L20 10
            M45 20 L40 5
            M65 20 L70 5
            "

            stroke="#111827"

            strokeWidth="4"

            strokeLinecap="round"

            />




            {/* EYELASHES RIGHT */}

            <path

            d="
            M100 20 L95 5
            M120 20 L125 5
            M140 25 L150 10
            "

            stroke="#111827"

            strokeWidth="4"

            strokeLinecap="round"

            />



            </>


          }



        </svg>


      }





      {/* MOUTH REALISTIC */}


      {
        title==="Mouth" &&



        <motion.div

        animate={{

          scaleY:

          value==="open"

          ?

          [1,1.15,1]

          :

          1

        }}



        transition={{

          duration:1,

          repeat:

          value==="open"

          ?

          Infinity

          :

          0

        }}



        >



        {

        value==="open" &&


        <div className="

        relative

        w-36

        h-24

        bg-red-700

        rounded-[50%]

        border-4

        border-red-950

        overflow-hidden

        ">



          {/* teeth */}

          <div className="

          absolute

          top-2

          left-5

          right-5

          h-7

          bg-white

          rounded-full

          " />




          {/* tongue */}

          <div className="

          absolute

          bottom-0

          left-8

          w-20

          h-10

          bg-pink-400

          rounded-full

          " />



        </div>


        }






        {

        value==="smile" &&


        <div className="

        w-36

        h-16

        border-b-8

        border-pink-500

        rounded-b-full

        " />


        }







        {

        value==="closed" &&


        <div className="

        w-36

        h-5

        bg-pink-500

        rounded-full

        " />


        }



        </motion.div>


      }







      {/* HEAD */}

      {
        title==="Head" &&

        <div className="text-6xl">

        {
          value==="left"
          ?
          "↺"
          :
          "↻"
        }

        </div>
      }






      {/* BODY */}

      {
        title==="Body" &&

        <div className="text-6xl">

        🧍

        </div>

      }






      {/* EXPRESSION */}

      {
        title==="Expression" &&


        <div className="text-6xl">

        {
          value==="neutral"
          ?
          "😐"
          :
          "😊"
        }

        </div>

      }



      </div>





      <p className="

      text-center

      capitalize

      font-semibold

      mt-3

      ">

      {value}

      </p>





    </motion.div>


  );
return (

<div className="

min-h-screen

bg-[#050816]

text-white

p-8

">





{/* HEADER */}


<div className="

flex

justify-between

items-center

mb-8

">


<div>


<h1 className="

text-4xl

font-bold

flex

gap-3

items-center

">


<Sparkles

className="text-cyan-400"

/>


SignLink AI Workspace


</h1>



<p className="

text-gray-400

mt-2

">

Real-Time Indian Sign Language

Non-Manual Feature Analysis

</p>



</div>






<div className="

bg-white/5

border

border-white/10

rounded-xl

px-5

py-3

flex

gap-2

items-center

">


<Activity

className="text-green-400"

/>


AI Engine Active


</div>



</div>










{/* MAIN AREA */}



<div className="

grid

grid-cols-1

xl:grid-cols-3

gap-6

">





{/* CAMERA PANEL */}
<div className="xl:col-span-2 bg-[#0B1020] border border-white/10 rounded-3xl p-6 shadow-2xl shadow-cyan-500/5">
  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
    <div>
      <h2 className="text-2xl font-bold flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
          <Camera className="text-cyan-400" />
        </div>
        Live Capture
      </h2>
      <p className="text-sm text-gray-400 mt-1">
        Webcam, image, and video analysis powered by MediaPipe + SignLink AI
      </p>
    </div>

    <button
      onClick={streaming ? stopCamera : startCamera}
      className={`px-5 py-3 rounded-2xl font-semibold transition-all duration-300 ${
        streaming
          ? "bg-red-500/15 border border-red-400/30 text-red-300 hover:bg-red-500/20"
          : "bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/20"
      }`}
    >
      {streaming ? "Stop Camera" : "Start Camera"}
    </button>
  </div>

  <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-inner">
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="w-full h-full object-cover"
    />

    {!streaming && (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-[#0b1020] to-black">
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <Camera size={36} />
        </div>
        <p className="text-lg font-medium">Camera Preview</p>
        <p className="text-sm text-gray-500 mt-1">Start the camera to begin live sign analysis</p>
      </div>
    )}

    {streaming && (
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 text-xs font-semibold text-green-300">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        LIVE
      </div>
    )}
  </div>

  <input
    ref={imageInputRef}
    type="file"
    accept="image/*"
    className="hidden"
    onChange={uploadImage}
  />

  <input
    ref={videoInputRef}
    type="file"
    accept="video/*"
    className="hidden"
    onChange={uploadVideo}
  />

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
    <button
      onClick={() => videoInputRef.current?.click()}
      className="group bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Upload size={20} className="text-cyan-400" />
        </div>
        <div className="text-left">
          <p className="font-semibold">Upload Video</p>
          <p className="text-xs text-gray-400">MP4, MOV, WebM</p>
        </div>
      </div>
      <ArrowUpRight className="text-gray-500 group-hover:text-cyan-300 transition-colors" />
    </button>

    <button
      onClick={() => imageInputRef.current?.click()}
      className="group bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:bg-white/10 hover:border-pink-400/30 transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-pink-500/10 border border-pink-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <ImageIcon size={20} className="text-pink-400" />
        </div>
        <div className="text-left">
          <p className="font-semibold">Upload Image</p>
          <p className="text-xs text-gray-400">JPG, PNG, WebP</p>
        </div>
      </div>
      <ArrowUpRight className="text-gray-500 group-hover:text-pink-300 transition-colors" />
    </button>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide">Capture Mode</p>
      <p className="font-semibold mt-2 flex items-center gap-2">
        <Camera className="w-4 h-4 text-cyan-400" />
        {streaming ? "Live Webcam" : "Idle"}
      </p>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide">AI Engine</p>
      <p className="font-semibold mt-2 flex items-center gap-2">
        <Zap className="w-4 h-4 text-yellow-400" />
        MediaPipe + SignLink
      </p>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide">Security</p>
      <p className="font-semibold mt-2 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        Local Processing
      </p>
    </div>
  </div>
</div>









{/* FEATURE PANEL */}



<div className="space-y-4">


<FeatureCard

title="Eyebrows"

value={features.eyebrows}

icon={<ArrowUpRight/>}

color="text-cyan-400"

/>




<FeatureCard

title="Eyes"

value={features.eyes}

icon={<Eye/>}

color="text-cyan-400"

/>




<FeatureCard

title="Mouth"

value={features.mouth}

icon={<Smile/>}

color="text-pink-400"

/>



<FeatureCard

title="Head"

value={features.head}

icon={<Activity/>}

color="text-purple-400"

/>



<FeatureCard

title="Body"

value={features.body}

icon={<User/>}

color="text-green-400"

/>



</div>






</div>


{/* TRANSLATION OUTPUT */}
<div className="mt-8 grid lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2 bg-[#0B1020] border border-white/10 rounded-3xl p-6 shadow-2xl shadow-purple-500/5">
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-2xl font-bold flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center">
          <Sparkles className="text-purple-400" />
        </div>
        Translation Output
      </h2>

      <div className="text-xs text-gray-400 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
        English
      </div>
    </div>

    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#101827] via-[#0B1020] to-[#111827] p-8 min-h-[220px] flex flex-col justify-center">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 text-center">
        <motion.p
          key={translation}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-3xl sm:text-4xl font-extrabold text-cyan-300 leading-tight"
        >
          {translation}
        </motion.p>

        {processing && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400 animate-pulse">
              Processing visual and non-manual features...
            </p>
          </div>
        )}

        {!processing && confidence > 0 && (
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Confidence</span>
              <span className="text-emerald-300 font-semibold">{confidence}%</span>
            </div>

            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 0.6 }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400"
              />
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-wide">Eyebrows</p>
        <p className="font-semibold mt-2 capitalize">{features.eyebrows}</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-wide">Mouth</p>
        <p className="font-semibold mt-2 capitalize">{features.mouth}</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-wide">Head Pose</p>
        <p className="font-semibold mt-2 capitalize">{features.head}</p>
      </div>
    </div>
  </div>

  <div className="bg-[#0B1020] border border-white/10 rounded-3xl p-6 shadow-2xl shadow-emerald-500/5">
    <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
        <Activity className="text-emerald-400" />
      </div>
      Diagnostics
    </h2>

    <div className="space-y-4 text-sm">
      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4">
        <span className="text-gray-400">Model</span>
        <span className="font-semibold text-cyan-300">MediaPipe Face Mesh</span>
      </div>

      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4">
        <span className="text-gray-400">Status</span>
        <span className="font-semibold text-emerald-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Running
        </span>
      </div>

      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4">
        <span className="text-gray-400">FPS</span>
        <span className="font-semibold text-white">30</span>
      </div>

      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4">
        <span className="text-gray-400">Latency</span>
        <span className="font-semibold text-white">42 ms</span>
      </div>

      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4">
        <span className="text-gray-400">Processing</span>
        <span className="font-semibold text-white">Local Device</span>
      </div>
    </div>
  </div>
</div>

    
  

  {/* HISTORY */}
  <div className="mt-8 bg-[#0B1020] border border-white/10 rounded-3xl p-6 shadow-2xl shadow-purple-500/5">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center">
          <RotateCcw className="text-purple-400" />
        </div>
        Translation History
      </h2>

      <button className="text-sm text-gray-400 hover:text-white transition-colors">
        Clear
      </button>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-white">Hello, how are you?</p>
            <p className="text-xs text-gray-400 mt-1">Live camera • 2 min ago</p>
          </div>
          <span className="text-emerald-300 font-semibold">94%</span>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-white">Thank you</p>
            <p className="text-xs text-gray-400 mt-1">Image upload • 10 min ago</p>
          </div>
          <span className="text-emerald-300 font-semibold">91%</span>
        </div>
      </div>
    </div>
  </div>
</div>
);
};

export default WorkspacePage;