import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

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
  RotateCcw
} from "lucide-react";


const WorkspacePage: React.FC = () => {


  const videoRef = useRef<HTMLVideoElement | null>(null);


  const [streaming, setStreaming] = useState(false);
  const [translation, setTranslation] = useState(
  "Waiting for camera input..."
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





  // Demo animation (replace later with MediaPipe)

  useEffect(() => {


    const timer = setInterval(() => {


      setFeatures({

        eyebrows:
          ["raised","normal","furrowed"]
          [Math.floor(Math.random()*3)],


        eyes:
          ["open","closed"]
          [Math.floor(Math.random()*2)],


        mouth:
          ["open","closed","smile"]
          [Math.floor(Math.random()*3)],


        head:
          "left",


        body:
          "center",


        expression:
          "neutral"

      });



    },3000);



    return () => clearInterval(timer);


  }, []);








  const startCamera = async()=>{


    try{


      const stream =
      await navigator.mediaDevices.getUserMedia({

        video:true,

        audio:false

      });



      if(videoRef.current){

        videoRef.current.srcObject = stream;

      }


      setStreaming(true);


    }

    catch(error){

      alert("Camera permission denied");

    }


  };







  const stopCamera = ()=>{


    const stream =
    videoRef.current?.srcObject as MediaStream | null;


    stream?.getTracks()
    .forEach(track=>track.stop());


    setStreaming(false);


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


          stroke=stroke="#22d3ee"

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


          stroke=stroke="#22d3ee"

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



<div className="

xl:col-span-2

bg-[#0B1020]

border

border-white/10

rounded-3xl

p-6

">



<div className="

flex

justify-between

items-center

mb-5

">



<h2 className="

text-xl

font-semibold

flex

gap-2

items-center

">


<Camera

className="text-cyan-400"

/>


Live Capture


</h2>





<button

onClick={

streaming

?

stopCamera

:

startCamera

}


className="

px-5

py-2

rounded-xl

bg-cyan-500/20

border

border-cyan-400/30

"

>


{

streaming

?

"Stop Camera"

:

"Start Camera"

}


</button>




</div>







<div className="

relative

aspect-video

bg-black

rounded-2xl

overflow-hidden

">



<video

ref={videoRef}

autoPlay

playsInline

className="

w-full

h-full

object-cover

"

/>





{

!streaming &&


<div className="

absolute

inset-0

flex

flex-col

items-center

justify-center

text-gray-400

">


<Camera size={55}/>


<p className="mt-3">

Camera Preview

</p>


</div>


}



</div>








<div className="

grid

grid-cols-2

gap-4

mt-5

">



<button

className="

bg-white/5

border

border-white/10

rounded-xl

p-4

flex

justify-center

gap-2

"


>


<Upload size={18}/>


Upload Video


</button>





<button

className="

bg-white/5

border

border-white/10

rounded-xl

p-4

flex

justify-center

gap-2

"

>


<ImageIcon size={18}/>


Upload Image


</button>



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



<div className="

mt-8

grid

lg:grid-cols-3

gap-6

">





<div className="

lg:col-span-2

bg-[#0B1020]

border

border-white/10

rounded-3xl

p-6

">



<h2 className="

text-xl

font-semibold

flex

gap-2

items-center

mb-5

">


<Sparkles

className="text-purple-400"

/>


Translation Output


</h2>






<div className="

h-40

bg-black/30

rounded-2xl

flex

items-center

justify-center

">


<p className="

text-3xl

font-bold

text-cyan-300

">

Hello, How are you?

</p>



</div>



</div>








<div className="

bg-[#0B1020]

border

border-white/10

rounded-3xl

p-6

">


<h2 className="

text-xl

font-semibold

flex

gap-2

mb-5

items-center

">


<Activity

className="text-green-400"

/>


Diagnostics


</h2>



<p className="text-gray-400">

Model

</p>


<p className="font-semibold">

MediaPipe Face Mesh

</p>



<br/>


<p className="text-gray-400">

Status

</p>


<p className="text-green-400">

Running

</p>



</div>



</div>









{/* HISTORY */}



<div className="

mt-8

bg-[#0B1020]

border

border-white/10

rounded-3xl

p-6

">


<h2 className="

text-xl

font-semibold

flex

gap-2

items-center

mb-5

">


<RotateCcw

className="text-purple-400"

/>


Translation History


</h2>





<div className="space-y-3">


<div className="

bg-white/5

rounded-xl

p-4

flex

justify-between

">


<span>

Hello, How are you?

</span>


<span className="text-green-400">

94%

</span>


</div>




<div className="

bg-white/5

rounded-xl

p-4

flex

justify-between

">


<span>

Thank you

</span>


<span className="text-green-400">

91%

</span>


</div>



</div>


</div>






</div>


);



};



export default WorkspacePage;