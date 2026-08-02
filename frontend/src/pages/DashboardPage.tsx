import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

import {
  Video,
  CheckCircle2,
  Award,
  Activity,
  Clock,
  FileText,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Cpu,
  Sparkles,
  Brain,
} from "lucide-react";

import { useTheme } from "../store/ThemeContext";


interface StatsResponse {
  overview: {
    total_predictions: number;
    successful_conversions: number;
    accuracy: number;
    error_rate: number;
  };

  recent_activity: Array<{
    id:number;
    input_file:string;
    output_text:string;
    confidence:number;
    created_at:string;
  }>;

  distribution:Array<{
    label:string;
    count:number;
  }>;

  activity_over_time:Array<{
    date:string;
    count:number;
  }>;
}



const DashboardPage:React.FC =()=>{


const {theme}=useTheme();


const [data,setData]=useState<StatsResponse|null>(null);

const [loading,setLoading]=useState(true);

const [refreshing,setRefreshing]=useState(false);



const fetchStats=async(showRefresh=false)=>{

if(showRefresh)
setRefreshing(true);


try{

const response=await api.get("/dashboard/statistics");

setData(response.data);


}

catch(error){

console.error(
"Dashboard loading error",
error
);

}

finally{

setLoading(false);
setRefreshing(false);

}

};



useEffect(()=>{

fetchStats();

},[]);




if(loading){

return(

<div className="
min-h-screen
flex
flex-col
items-center
justify-center
theme-text-main
">

<div className="
w-14
h-14
rounded-full
border-4
border-indigo-500
border-t-transparent
animate-spin
">
</div>


<p className="
mt-5
text-sm
theme-text-muted
animate-pulse
">

Initializing AI analytics...

</p>


</div>

)

}



const overview=data?.overview;

const recent=data?.recent_activity || [];

const distribution=data?.distribution || [];

const activity=data?.activity_over_time || [];



const isDark=theme==="dark";

const isContrast=theme==="contrast";



const chartText =
isContrast
?
"#ffffff"
:
isDark
?
"#cbd5e1"
:
"#475569";



const chartGrid =
isDark
?
"rgba(255,255,255,0.08)"
:
"rgba(0,0,0,0.08)";



const colors=[

"#6366f1",
"#06b6d4",
"#10b981",
"#f59e0b",
"#ec4899",
"#8b5cf6"

];
return (

<div className="
relative
space-y-8
min-h-screen
overflow-hidden
">


{/* Animated Background */}

<div className="
absolute
top-0
left-0
w-full
h-full
- z-10
pointer-events-none
">


<div className="
absolute
w-96
h-96
bg-indigo-500/20
rounded-full
blur-3xl
top-20
left-10
animate-pulse
">
</div>


<div className="
absolute
w-80
h-80
bg-cyan-400/20
rounded-full
blur-3xl
right-10
bottom-20
animate-pulse
">
</div>


<div className="
absolute
w-72
h-72
bg-purple-500/20
rounded-full
blur-3xl
left-1/2
top-1/2
">
</div>


</div>



{/* Header */}


<div className="
relative
z-10
flex
flex-col
md:flex-row
justify-between
gap-5
">


<div>


<div className="
flex
items-center
gap-3
">

<div className="
p-3
rounded-2xl
bg-gradient-to-br
from-indigo-500
to-cyan-400
shadow-lg
animate-bounce
">

<Brain
className="
text-white
w-6
h-6
"
/>

</div>



<h1 className="
text-3xl
font-black
theme-text-main
">

AI Intelligence Dashboard

</h1>


</div>



<p className="
mt-3
theme-text-muted
">

Real-time Indian Sign Language interpretation analytics powered by AI.

</p>


</div>



<div className="
flex
gap-3
">


<button

onClick={()=>fetchStats(true)}

disabled={refreshing}

className="
px-5
py-3
rounded-2xl
theme-card
theme-text-main
flex
items-center
gap-2
hover:scale-105
transition-all
"

>


<RefreshCw
className={`
w-4
h-4
${refreshing?"animate-spin":""}
`}
/>


Refresh

</button>



<Link

to="/workspace"

className="
px-5
py-3
rounded-2xl
bg-gradient-to-r
from-indigo-600
to-cyan-500
text-white
font-semibold
flex
items-center
gap-2
shadow-xl
hover:scale-105
transition-all
"

>


<Video
className="
w-4
h-4
"/>


Launch Translator


</Link>


</div>


</div>





{/* Statistics Cards */}



<div className="
relative
z-10
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-6
">



<div className="
theme-card
p-6
hover:-translate-y-2
transition-all
duration-300
group
">


<div className="
flex
justify-between
items-center
">


<div>


<p className="
text-xs
uppercase
theme-text-muted
font-bold
">

Translations

</p>


<h2 className="
text-3xl
font-black
theme-text-main
mt-2
">

{overview?.total_predictions || 0}

</h2>


</div>


<div className="
p-4
rounded-2xl
bg-indigo-500/20
group-hover:rotate-12
transition
">

<Activity
className="
text-indigo-500
w-6
h-6
"/>

</div>


</div>


</div>





<div className="
theme-card
p-6
hover:-translate-y-2
transition-all
duration-300
group
">


<div className="
flex
justify-between
items-center
">


<div>

<p className="
text-xs
uppercase
theme-text-muted
font-bold
">

Successful

</p>


<h2 className="
text-3xl
font-black
theme-text-main
mt-2
">

{overview?.successful_conversions || 0}

</h2>


</div>


<div className="
p-4
rounded-2xl
bg-emerald-500/20
group-hover:rotate-12
transition
">


<CheckCircle2

className="
text-emerald-500
w-6
h-6
"

/>


</div>


</div>


</div>

<div className="
theme-card
p-6
hover:-translate-y-2
transition-all
duration-300
group
">


<div className="
flex
justify-between
items-center
">


<div>

<p className="
text-xs
uppercase
theme-text-muted
font-bold
">

Accuracy

</p>


<h2 className="
text-3xl
font-black
theme-text-main
mt-2
">

{overview?.accuracy || 0}%

</h2>


</div>


<div className="
p-4
rounded-2xl
bg-purple-500/20
group-hover:rotate-12
transition
">


<Award

className="
text-purple-500
w-6
h-6
"

/>


</div>


</div>


</div>





<div className="
theme-card
p-6
hover:-translate-y-2
transition-all
duration-300
group
">


<div className="
flex
justify-between
items-center
">


<div>

<p className="
text-xs
uppercase
theme-text-muted
font-bold
">

Error Rate

</p>


<h2 className="
text-3xl
font-black
theme-text-main
mt-2
">

{overview?.error_rate || 0}%

</h2>


</div>


<div className="
p-4
rounded-2xl
bg-red-500/20
group-hover:rotate-12
transition
">


<TrendingUp

className="
text-red-500
w-6
h-6
"

/>


</div>


</div>


</div>



</div>





{/* Charts */}



<div className="
relative
z-10
grid
grid-cols-1
lg:grid-cols-3
gap-6
">



{/* Activity Chart */}


<div className="
lg:col-span-2
theme-card
p-6
h-[420px]
hover:shadow-2xl
transition
">


<div className="
flex
items-center
gap-3
mb-5
">


<div className="
p-2
rounded-xl
bg-indigo-500/20
">

<Clock
className="
text-indigo-500
w-5
h-5
"
/>

</div>


<h3 className="
font-bold
theme-text-main
">

Translation Activity

</h3>


</div>



<ResponsiveContainer
width="100%"
height="85%"
>


<AreaChart data={activity}>


<CartesianGrid
strokeDasharray="3 3"
stroke={chartGrid}
/>


<XAxis
dataKey="date"
stroke={chartText}
/>


<YAxis
stroke={chartText}
/>


<Tooltip
contentStyle={{
background:
isDark
?
"#18181b"
:
"#ffffff",
borderRadius:"15px"
}}
/>


<Area

type="monotone"

dataKey="count"

stroke="#6366f1"

fill="#6366f1"

fillOpacity={0.25}

strokeWidth={3}

/>


</AreaChart>


</ResponsiveContainer>



</div>





{/* Sign Frequency Chart */}



<div className="
theme-card
p-6
h-[420px]
hover:shadow-2xl
transition
">


<div className="
flex
items-center
gap-3
mb-5
">


<div className="
p-2
rounded-xl
bg-cyan-500/20
">

<Cpu

className="
text-cyan-500
w-5
h-5
animate-pulse
"

/>

</div>


<h3 className="
font-bold
theme-text-main
">

Gesture Analysis

</h3>


</div>



<ResponsiveContainer
width="100%"
height="85%"
>


<BarChart data={distribution}>


<CartesianGrid

strokeDasharray="3 3"

stroke={chartGrid}

/>



<XAxis

dataKey="label"

stroke={chartText}

/>


<YAxis

stroke={chartText}

/>


<Tooltip/>


<Bar

dataKey="count"

radius={[10,10,0,0]}

>

{

distribution.map((_,index)=>(

<Cell

key={index}

fill={
colors[index % colors.length]
}

/>

))

}


</Bar>



</BarChart>


</ResponsiveContainer>


</div>



</div>
{/* Recent Activity */}

<div className="
relative
z-10
theme-card
p-6
hover:shadow-2xl
transition-all
">


<div className="
flex
items-center
justify-between
mb-6
">


<div className="
flex
items-center
gap-3
">


<div className="
p-2
rounded-xl
bg-purple-500/20
">


<FileText

className="
w-5
h-5
text-purple-500
"

/>


</div>


<h3 className="
font-bold
theme-text-main
">

Recent Translation Logs

</h3>


</div>



<Link

to="/history"

className="
flex
items-center
gap-2
text-sm
theme-accent-text
hover:underline
"

>


View History

<ArrowRight
className="
w-4
h-4
"

/>


</Link>


</div>





{
recent.length === 0 ? (


<div className="
py-10
text-center
theme-text-muted
">


<Sparkles

className="
mx-auto
mb-3
w-8
h-8
text-indigo-500
"

/>


No translations available yet.
Start using the AI translator.


</div>


):(


<div className="
space-y-4
">


{
recent.map((item)=>(


<div

key={item.id}

className="
flex
flex-col
md:flex-row
md:items-center
justify-between
gap-4
p-4
rounded-2xl
theme-bg-sub
hover:scale-[1.01]
transition-all
"


>


<div>


<p className="
font-semibold
theme-text-main
">

{item.output_text}

</p>


<p className="
text-xs
theme-text-muted
mt-1
">

{item.input_file}

</p>


</div>



<div className="
flex
items-center
gap-4
">


<span className="
px-3
py-1
rounded-full
bg-emerald-500/20
text-emerald-500
text-xs
font-bold
">


{Math.round(item.confidence)}%


</span>



<span className="
text-xs
theme-text-muted
">


{
new Date(
item.created_at
).toLocaleDateString()

}


</span>



</div>


</div>



))


}


</div>


)

}



</div>





</div>

);

};


export default DashboardPage;