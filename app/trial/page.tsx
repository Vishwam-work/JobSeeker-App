"use client";
import { useState } from "react";

const Trial = () => {
    const [email, setEmail] = useState(0);
    return (
        <div>
            <h1>Trial : {email}</h1>
            <button
            onClick={()=>setEmail(email+1)}
            >Click me</button>
        </div>
    )
}
export default Trial;