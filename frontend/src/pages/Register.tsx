import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Cpu,
  Mail,
  Lock,
  User,
  Sparkles,
  Brain,
  ScanFace,
  ShieldCheck,
  Loader2,
  Eye,
  Sun,
  Moon
} from "lucide-react";

import { useAuth } from "../store/AuthContext";
import { useTheme } from "../store/ThemeContext";


const RegisterPage: React.FC = () => {


  const { register } = useAuth();
  const { theme, setTheme } = useTheme();

  const navigate = useNavigate();


  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");




  const handleSubmit = async(
    e:React.FormEvent
  )=>{


    e.preventDefault();

    setError("");



    if(password !== confirmPassword){

      setError(
        "Passwords do not match."
      );

      return;

    }



    setLoading(true);



    try{


      await register(
        name,
        email,
        password
      );


      navigate(
        "/login?registered=true"
      );


    }
    catch(err:any){


      setError(
        err.response?.data?.detail ||
        "Registration failed."
      );


    }
    finally{

      setLoading(false);

    }


  };





return (

<div className="
min-h-screen
flex
items-center
justify-center
p-6
relative
overflow-hidden
theme-text-main
">



{/* Animated Background */}


<div className="
absolute
w-[500px]
h-[500px]
bg-indigo-500/20
rounded-full
blur-[120px]
top-10
left-10
animate-pulse
"/>



<div className="
absolute
w-[400px]
h-[400px]
bg-purple-500/20
rounded-full
blur-[120px]
bottom-10
right-10
animate-pulse
"/>



<div className="
relative
z-10
w-full
max-w-5xl
grid
lg:grid-cols-2
gap-12
items-center
">
{/* LEFT AI SECTION */}


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


Join


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

Create your account and experience AI-powered Indian Sign Language translation.

</p>


</div>






{/* FEATURE CARDS */}


<div className="space-y-4">



<div className="
flex
items-center
gap-4
p-5
rounded-3xl
theme-card
hover:scale-[1.03]
transition
">


<div className="
w-12
h-12
rounded-2xl
bg-cyan-500/20
flex
items-center
justify-center
">

<Brain className="text-cyan-500"/>

</div>



<div>

<h3 className="font-bold">

AI Recognition

</h3>


<p className="text-sm theme-text-muted">

Real-time sign and expression analysis

</p>


</div>


</div>







<div className="
flex
items-center
gap-4
p-5
rounded-3xl
theme-card
hover:scale-[1.03]
transition
">


<div className="
w-12
h-12
rounded-2xl
bg-purple-500/20
flex
items-center
justify-center
">

<ScanFace className="text-purple-500"/>

</div>



<div>

<h3 className="font-bold">

Non-Manual Features

</h3>


<p className="text-sm theme-text-muted">

Facial expressions and body movements

</p>


</div>


</div>







<div className="
flex
items-center
gap-4
p-5
rounded-3xl
theme-card
hover:scale-[1.03]
transition
">


<div className="
w-12
h-12
rounded-2xl
bg-emerald-500/20
flex
items-center
justify-center
">

<ShieldCheck className="text-emerald-500"/>

</div>



<div>

<h3 className="font-bold">

Secure Platform

</h3>


<p className="text-sm theme-text-muted">

Privacy focused accessibility solution

</p>


</div>


</div>



</div>



</div>







{/* REGISTER CARD */}


<div className="
theme-card
rounded-[2rem]
p-8
shadow-2xl
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

Create Account

</h2>



<p className="
theme-text-muted
mt-2
">

Start your accessibility journey

</p>


</div>






{error && (

<div className="
mb-5
p-4
rounded-2xl
bg-red-500/10
border
border-red-400/30
text-sm
">

{error}

</div>

)}



<form
onSubmit={handleSubmit}
className="space-y-5"
>
{/* NAME */}

<div>

<label className="
text-xs
font-bold
uppercase
tracking-wider
theme-text-muted
">

Full Name

</label>


<div className="relative mt-2">


<User className="
absolute
left-4
top-3.5
w-5
theme-text-light
"/>



<input

type="text"

placeholder="Harshini C"

value={name}

onChange={(e)=>setName(e.target.value)}

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

placeholder="name@email.com"

value={email}

onChange={(e)=>setEmail(e.target.value)}

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


<Lock className="
absolute
left-4
top-3.5
w-5
theme-text-light
"/>



<input

type="password"

placeholder="••••••••"

value={password}

onChange={(e)=>setPassword(e.target.value)}

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








{/* CONFIRM PASSWORD */}



<div>

<label className="
text-xs
font-bold
uppercase
tracking-wider
theme-text-muted
">

Confirm Password

</label>



<div className="relative mt-2">


<Lock className="
absolute
left-4
top-3.5
w-5
theme-text-light
"/>



<input

type="password"

placeholder="••••••••"

value={confirmPassword}

onChange={(e)=>setConfirmPassword(e.target.value)}

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







{/* BUTTON */}



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
transition
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

<Loader2 className="animate-spin"/>

Creating Account...

</>


) : (

<>

<Sparkles/>

Create Account

</>

)

}


</button>




</form>





</div>





</div>









{/* FOOTER */}

<div className="
text-center
mt-8
">

<p className="theme-text-muted">

Already have an account?{" "}

<Link

to="/login"

className="
theme-accent-text
font-bold
hover:underline
"

>

Sign In

</Link>

</p>


</div>


</div>



);

};





export default RegisterPage;

