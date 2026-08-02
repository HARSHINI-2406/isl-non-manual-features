import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Cpu,
  AlertTriangle,
  KeyRound,
  Mail,
  Loader2,
  Eye,
  Sun,
  Moon,
  CheckCircle2,
  Sparkles,
  Brain,
  ScanFace,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../store/AuthContext";
import { useTheme } from "../store/ThemeContext";


const LoginPage: React.FC = () => {

  const { login } = useAuth();
  const { theme, setTheme } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();


  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [rememberMe,setRememberMe] = useState(false);

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string | null>(null);



  const queryParams = new URLSearchParams(location.search);

  const isExpired =
    queryParams.get("expired") === "true";

  const isRegistered =
    queryParams.get("registered") === "true";





  const handleSubmit = async(
    e:React.FormEvent
  ) => {

    e.preventDefault();

    setError(null);


    if(!email || !password){

      setError(
        "Please enter both email and password."
      );

      return;

    }



    setLoading(true);


    try{


      await login(
        email,
        password,
        rememberMe
      );


      const origin =
      (location.state as any)
      ?.from
      ?.pathname || "/dashboard";


      navigate(origin);



    }catch(err:any){


      setError(
        err.response?.data?.detail ||
        "Invalid login credentials."
      );


    }
    finally{

      setLoading(false);

    }

  };




return (

<div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-all duration-500 theme-text-main">


{/* Background animation */}

<div className="
absolute 
w-[500px]
h-[500px]
rounded-full
bg-indigo-500/20
blur-[120px]
top-10
left-10
animate-pulse
"/>


<div className="
absolute 
w-[400px]
h-[400px]
rounded-full
bg-purple-500/20
blur-[120px]
bottom-10
right-10
animate-pulse
"/>




<div className="
w-full 
max-w-5xl 
grid 
lg:grid-cols-2 
gap-12 
items-center
relative z-10
">



{/* LEFT SIDE */}


<div className="hidden lg:block space-y-8">


<div>

<div className="
w-16 
h-16 
rounded-3xl
bg-gradient-to-br
from-indigo-500
to-purple-600
flex
items-center
justify-center
shadow-xl
mb-6
">

<Cpu className="text-white w-8 h-8"/>

</div>


<h1 className="
text-5xl
font-black
leading-tight
">

Welcome to

<span className="
block
bg-gradient-to-r
from-cyan-400
to-purple-500
bg-clip-text
text-transparent
">

SignLink AI

</span>

</h1>



<p className="
mt-5
text-lg
theme-text-muted
max-w-md
">

AI powered Indian Sign Language translation platform using hand gestures and non-manual features.

</p>


</div>
{/* AI FEATURE CARDS */}

<div className="space-y-4">


<div className="
flex items-center gap-4
p-5
rounded-3xl
theme-card
hover:scale-[1.03]
transition-all
duration-300
">

<div className="
w-12 h-12
rounded-2xl
bg-cyan-500/20
flex items-center justify-center
">

<Brain className="text-cyan-500"/>

</div>


<div>

<h3 className="font-bold text-lg">
AI Vision Processing
</h3>

<p className="text-sm theme-text-muted">
Real-time gesture and facial analysis
</p>

</div>

</div>






<div className="
flex items-center gap-4
p-5
rounded-3xl
theme-card
hover:scale-[1.03]
transition-all
duration-300
">


<div className="
w-12 h-12
rounded-2xl
bg-purple-500/20
flex items-center justify-center
">

<ScanFace className="text-purple-500"/>

</div>



<div>

<h3 className="font-bold text-lg">
Non-Manual Features
</h3>


<p className="text-sm theme-text-muted">
Understanding expressions and movements
</p>


</div>


</div>






<div className="
flex items-center gap-4
p-5
rounded-3xl
theme-card
hover:scale-[1.03]
transition-all
duration-300
">


<div className="
w-12 h-12
rounded-2xl
bg-emerald-500/20
flex items-center justify-center
">

<ShieldCheck className="text-emerald-500"/>

</div>



<div>

<h3 className="font-bold text-lg">
Secure Translation
</h3>


<p className="text-sm theme-text-muted">
Privacy focused accessibility system
</p>


</div>


</div>



</div>


</div>






{/* LOGIN CARD */}


<div className="
theme-card
rounded-[2rem]
p-8
shadow-2xl
backdrop-blur-xl
">


<div className="text-center mb-8">


<div className="
w-14
h-14
mx-auto
rounded-2xl
bg-gradient-to-br
from-indigo-500
to-purple-600
flex
items-center
justify-center
mb-4
">

<Cpu className="text-white"/>

</div>



<h2 className="
text-3xl
font-black
">

Sign In

</h2>


<p className="theme-text-muted mt-2">

Access your translation suite

</p>


</div>






{/* NOTIFICATIONS */}


{isExpired && (

<div className="
mb-5
p-4
rounded-2xl
bg-amber-500/10
border
border-amber-400/30
flex
gap-3
text-sm
">

<AlertTriangle className="w-5"/>

Session expired. Please login again.

</div>

)}





{isRegistered && (

<div className="
mb-5
p-4
rounded-2xl
bg-emerald-500/10
border
border-emerald-400/30
flex
gap-3
text-sm
">

<CheckCircle2 className="w-5"/>

Registration successful. Please login.

</div>

)}






{error && (

<div className="
mb-5
p-4
rounded-2xl
bg-red-500/10
border
border-red-400/30
flex
gap-3
text-sm
">

<AlertTriangle className="w-5"/>

{error}

</div>

)}






<form
onSubmit={handleSubmit}
className="space-y-5"
>



{/* EMAIL */}

<div>


<label className="
text-xs
font-bold
uppercase
tracking-wider
theme-text-muted
">

Email Address

</label>


<div className="relative mt-2">


<Mail className="
absolute
left-4
top-3.5
w-5
theme-text-light
"/>



<input

type="email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

placeholder="name@email.com"

className="
w-full
pl-12
py-3
rounded-2xl
theme-input
"

required

/>


</div>


</div>





{/* PASSWORD */}

<div>


<label className="
text-xs
font-bold
uppercase
tracking-wider
theme-text-muted
">

Password

</label>


<div className="relative mt-2">


<KeyRound className="
absolute
left-4
top-3.5
w-5
theme-text-light
"/>



<input

type="password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

placeholder="••••••••"

className="
w-full
pl-12
py-3
rounded-2xl
theme-input
"

required

/>


</div>


</div>
{/* REMEMBER ME */}

<div className="flex items-center justify-between pt-2">


<label className="flex items-center gap-3 cursor-pointer">


<input

type="checkbox"

checked={rememberMe}

onChange={(e)=>setRememberMe(e.target.checked)}

className="w-4 h-4 accent-indigo-600"

/>


<span className="text-sm theme-text-muted">

Remember my session

</span>


</label>



</div>








{/* LOGIN BUTTON */}


<button

type="submit"

disabled={loading}

className="
w-full
py-4
rounded-2xl
bg-gradient-to-r
from-indigo-600
to-purple-600
text-white
font-bold
shadow-xl
hover:scale-[1.03]
transition-all
duration-300
flex
items-center
justify-center
gap-3
disabled:opacity-50
"

>


{

loading ? (

<>

<Loader2 className="animate-spin w-5 h-5"/>

Authenticating...

</>


) : (

<>

<Sparkles className="w-5 h-5"/>

Sign In

</>

)

}



</button>



</form>





</div>




{/* FOOTER */}



<div className="
text-center
mt-8
space-y-5
">


<p className="theme-text-muted">


Don't have an account?{" "}



<Link

to="/register"

className="
theme-accent-text
font-bold
hover:underline
"

>

Create Account

</Link>



</p>







{/* THEME BUTTONS */}



<div className="
flex
justify-center
gap-3
">


<button

onClick={()=>setTheme("light")}

className={`
p-3
rounded-xl
border
transition-all

${theme==="light"
?
"bg-indigo-600 text-white"
:
"theme-bg-sub"
}

`}

title="Light Mode"

>

<Sun className="w-4 h-4"/>

</button>







<button

onClick={()=>setTheme("dark")}

className={`
p-3
rounded-xl
border
transition-all

${theme==="dark"
?
"bg-indigo-600 text-white"
:
"theme-bg-sub"
}

`}

title="Dark Mode"

>

<Moon className="w-4 h-4"/>

</button>







<button

onClick={()=>setTheme("contrast")}

className={`
p-3
rounded-xl
border
transition-all

${theme==="contrast"
?
"bg-yellow-400 text-black"
:
"theme-bg-sub"
}

`}

title="Contrast Mode"

>

<Eye className="w-4 h-4"/>

</button>




</div>



</div>




</div>


</div>


);

};


export default LoginPage;