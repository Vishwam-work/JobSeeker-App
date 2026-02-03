"use client"
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Mail, 
  Smartphone, 
  User, 
  Lock, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  Briefcase,
  Search,
  Bell
} from 'lucide-react';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import Header from '@/components/Header';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";



export default function RegistrationVerificationPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    workStatus: 'fresh'
  });
  
  // Verification States: 'idle' | 'sending' | 'sent' | 'verifying' | 'verified'
  const [emailStatus, setEmailStatus] = useState('idle');
  const [phoneStatus, setPhoneStatus] = useState('idle');
  const [isEmailOtp, setisEmailOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Mock OTP storage

  const [emailOtp, setEmailOtp] = useState(['', '', '', '']);
  const [phoneOtp, setPhoneOtp] = useState(['', '', '', '']);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset verification if field changes after verification
    if (name === 'email' && emailStatus === 'verified') setEmailStatus('idle');
    if (name === 'phone' && phoneStatus === 'verified') setPhoneStatus('idle');
  };

  // Mock Send OTP Action
  const sendOtp = (type) => {
    const setStatus = type === 'email' ? setEmailStatus : setPhoneStatus;
    if (type === 'email' && !formData.email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    const value = type === 'email' ? formData.email : formData.phone;
    
    if (!value) return; // Simple validation

    setStatus('sending');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('sent');
      // In a real app, you'd trigger a toast notification here
    }, 1500);
    setisEmailOtp(true);
  };

  // Mock Verify OTP Action
  const verifyOtp = (type) => {
    const setStatus = type === 'email' ? setEmailStatus : setPhoneStatus;
    
    setStatus('verifying');

    // Simulate API verification
    setTimeout(() => {
      setStatus('verified');
    }, 1500);

   
  };

  // Helper for OTP Input logic
  const handleOtpChange = (index, value, type) => {
    if (isNaN(value)) return;
    
    const newOtp = type === 'email' ? [...emailOtp] : [...phoneOtp];
    newOtp[index] = value;
    
    if (type === 'email') setEmailOtp(newOtp);
    else setPhoneOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`${type}-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header/>
      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-slate-100">
          
          {/* Left Panel: Value Proposition (Matches the "On registering" section) */}
          <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-violet-50 to-indigo-50 p-12 flex-col justify-between relative overflow-hidden">
            {/* Decorative background blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-8">
                <User size={40} className="text-violet-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Create your profile</h1>n3
              <p className="text-slate-500 mb-8">Join millions of professionals finding their dream jobs.</p>

              <div className="space-y-6">
                <BenefitItem 
                  icon={<Briefcase size={20} />}
                  title="Build your professional identity"
                  desc="Let top recruiters find you instantly."
                />
                <BenefitItem 
                  icon={<Bell size={20} />}
                  title="Smart job alerts"
                  desc="Get relevant openings delivered to your inbox."
                />
                <BenefitItem 
                  icon={<Search size={20} />}
                  title="Accelerate your career"
                  desc="Find opportunities that match your skills."
                />
              </div>
            </div>

            <div className="relative z-10 mt-12">
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-700">10k+ joined today</span>
                </div>
                <p className="text-xs text-slate-500">"The verification process was super smooth. Got hired in 3 days!"</p>
              </div>
            </div>
          </div>

          {/* Right Panel: The Form */}
          <div className="lg:w-7/12 p-8 md:p-12 lg:p-16 relative">
             <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2 lg:hidden">
                  Create your JobSeeker profile
                </h2>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                      Full name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                      <input 
                        type="text" 
                        name="fullName"
                        placeholder="What is your name?" 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-600 transition-all placeholder:text-slate-400 text-sm"
                      />
                    </div>
                  </div>

                  {/* Email ID with Verification */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                      Email ID :<span className="text-rose-500">*</span>
                      {emailStatus === 'verified' && <span className="ml-auto text-xs text-green-600 font-medium flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full"><CheckCircle2 size={12}/> Verified</span>}
                    </label>
                    
                    <div className="relative group">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                      <input 
                        type="email" 
                        name="email"
                        disabled={emailStatus === 'verified'}
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Tell us your Email ID" 
                        className={`w-full pl-10 pr-24 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 text-sm
                          ${emailStatus === 'verified' 
                            ? 'border-green-200 bg-green-50 text-green-800' 
                            : 'border-slate-200 focus:ring-violet-100 focus:border-violet-600'
                          }`}
                      />
                      
                      {/* Verify Button Inline */}
                      {emailStatus !== 'verified' && (
                        <button
                          type="button"
                          onClick={() => sendOtp('email')}
                          disabled={!formData.email || emailStatus === 'sending' || emailStatus === 'sent'}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {emailStatus === 'sending' ? <Loader2 size={14} className="animate-spin"/> : emailStatus === 'sent' ? 'Resend OTP' : 'Verify OTP'}
                        </button>
                      )}
                    </div>
                    
                    {/* OTP Input for Email
                    {(emailStatus === 'sent' || emailStatus === 'verifying') && (
                     <div>
                     <InputOTP
                       maxLength={6}
                       value={otp}
                       onChange={(val) => setOtp(val)}
                     >
                       <InputOTPGroup>
                         <InputOTPSlot index={0}/>
                         <InputOTPSlot index={1}/>
                         <InputOTPSlot index={2}/>
                         <InputOTPSlot index={3}/>
                         <InputOTPSlot index={4}/>
                         <InputOTPSlot index={5}/>
                       </InputOTPGroup>
                     </InputOTP>
                   </div>
                    )}
                    <p className="text-xs text-slate-400 pl-1">We'll send relevant jobs and updates to this email.</p> */}
                  </div>

                  {/* Password */}
                  {/* <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                      <input 
                        type="password" 
                        name="password"
                        placeholder="(Minimum 6 characters)" 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-600 transition-all placeholder:text-slate-400 text-sm"
                      />
                    </div>
                  </div> */}

                  {/* Mobile Number with Verification */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                      Mobile Number <span className="text-rose-500">*</span>
                      {phoneStatus === 'verified' && <span className="ml-auto text-xs text-green-600 font-medium flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full"><CheckCircle2 size={12}/> Verified</span>}
                    </label>
                    
                    <div className="flex gap-2">
                      <div className="w-20 flex-shrink-0 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">+91</span>
                        <input type="text" disabled className="w-full pl-8 pr-2 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 text-center cursor-not-allowed" placeholder="" />
                      </div>
                      <div className="relative flex-1 group">
                        <Smartphone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={phoneStatus === 'verified'}
                          placeholder="Enter your mobile number" 
                          className={`w-full pl-10 pr-24 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 text-sm
                            ${phoneStatus === 'verified' 
                              ? 'border-green-200 bg-green-50 text-green-800' 
                              : 'border-slate-200 focus:ring-violet-100 focus:border-violet-600'
                            }`}
                        />
                         {/* Verify Button Inline */}
                         {phoneStatus !== 'verified' && (
                          <button
                            type="button"
                            onClick={() => sendOtp('phone')}
                            disabled={!formData.phone || phoneStatus === 'sending' || phoneStatus === 'sent'}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {phoneStatus === 'sending' ? <Loader2 size={14} className="animate-spin"/> : phoneStatus === 'sent' ? 'Resend OTP' : 'Verify OTP'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* OTP Input for Phone */}
                    {(phoneStatus === 'sent' || phoneStatus === 'verifying') && (
                      <OtpInputSection 
                        id="phone" 
                        otp={phoneOtp} 
                        onChange={handleOtpChange} 
                        status={phoneStatus}
                        onVerify={() => verifyOtp('phone')}
                        targetEmail={formData.phone}
                        isPhone
                      />
                    )}
                    <p className="text-xs text-slate-400 pl-1">Recruiters will contact you on this number.</p>
                  </div>

                  {/* Register Button */}
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      className="w-full bg-violet-600 text-white font-bold py-4 rounded-xl hover:bg-violet-700 active:scale-[0.99] transition-all shadow-lg shadow-violet-200 flex items-center justify-center gap-2 group"
                    >
                      Register Now
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4">
                      By clicking Register, you agree to the <a href="#" className="text-violet-600 hover:underline">Terms and Conditions</a> & <a href="#" className="text-violet-600 hover:underline">Privacy Policy</a>
                    </p>
                  </div>

                </form>
             </div>
          </div>
        </div>
      </main>

   <Dialog open={isEmailOtp} onOpenChange={setisEmailOtp}>
      <DialogContent>

        <div className="bg-gradient-to-b from-indigo-100/50 to-white px-6 pt-10 pb-6 flex flex-col items-center text-center">
          <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-md mb-4 ring-8 ring-indigo-50">


            {/* logo of the portal here */}


          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Enter Your OTP
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            We sent a code to 
            <span className="font-semibold text-slate-800"> user@email.com </span>
          </p>
      </div>
    <div className="flex justify-center my-6">
      <InputOTP
        maxLength={6}
        value={otp}
        onChange={(val) => setOtp(val)}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0}/>
          <InputOTPSlot index={1}/>
          <InputOTPSlot index={2}/>
          <InputOTPSlot index={3}/>
          <InputOTPSlot index={4}/>
          <InputOTPSlot index={5}/>
        </InputOTPGroup>
      </InputOTP>
    </div>

    <button
      className="w-full bg-indigo-600 text-white py-3 rounded-xl"
      onClick={async () => {
        try {
          const res = await fetch("https://jobseeker-backend-jy1y.onrender.com/api/verify-otp/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email, otp }),
          });

          const data = await res.json();

          if (!res.ok) {
            alert(data.error || "Invalid OTP");
            return;
          }

          // OTP Success
          setIsOtpVerified(true);
          setIsOtpOpen(false);
          alert("OTP Verified Successfully!");

        } catch (err) {
          console.error(err);
        }
      }}
    >
      Verify
    </button>
    
        </DialogContent>
      </Dialog>

      {/* Footer / Trust Badges (Optional) */}
      <footer className="w-full py-6 text-center text-slate-400 text-sm hidden lg:block">
        <div className="flex items-center justify-center gap-6 opacity-70">
           <span className="flex items-center gap-1"><ShieldCheck size={14}/> 100% Data Privacy</span>
           <span>&bull;</span>
           <span>ISO 27001 Certified</span>
        </div>
      </footer>
    </div>
  );
}

// Sub-component for Benefits List on Left Panel
function BenefitItem({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-500 flex-shrink-0 mt-1">
        <CheckCircle2 size={20} />
      </div>
      <div>
        <h3 className="font-bold text-slate-800 text-sm lg:text-base flex items-center gap-2">
          {title}
        </h3>
        <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// Sub-component for OTP Inputs (The "Interactive" part
 