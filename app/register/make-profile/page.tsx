'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Chrome, CheckCircle, Mail, Lock, Phone, User, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function Register() {
  const [workStatus, setWorkStatus] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [receivePromotions, setReceivePromotions] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  const data = {
    full_name: fullName,
    email:email,
    password: password,
    mobile_number: mobile,
    work_status: workStatus,
    receive_promotions: receivePromotions,
  };
  console.log("DATA",data)

  try {
    const response = await fetch('http://127.0.0.1:8010/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to register');
    }

    const result = await response.json();
    console.log('Registration successful:', result);
    router.push('/login');

  } catch (error) {
    console.error('Registration error:', error);
  }
};


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                jobseeker
              </span>
            </Link>
            <div className="text-sm text-gray-600 text-center sm:text-right">
              Already Registered?{' '}
              <Link href="/login" className="text-purple-600 hover:underline font-medium">
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Side - Benefits */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 order-2 lg:order-1">
            <div className="text-center mb-6 md:mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 md:w-12 md:h-12 text-purple-600" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                On registering, you can
              </h2>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm md:text-base">Build your profile and let recruiters find you</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm md:text-base">Get job postings delivered right to your email</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm md:text-base">Find a job and grow your career</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 order-1 lg:order-2">
            <div className="mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Create your JobSeeker profile
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Search & apply to jobs from India's No.1 Job Site
              </p>
            </div>

            <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Full name*
                </Label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="fullName"
                    placeholder="What is your name?"
                    className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email ID*
                </Label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Tell us your Email ID"
                    className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={() => setIsOtpOpen(true)}
                    disabled ={!email}
                    className="mt-2 bg-indigo-600 text-white"
                  >
                    Verify OTP
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  We'll send relevant jobs and updates to this email
                </p>
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password*
                </Label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="(Minimum 6 characters)"
                    className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This helps your account stay protected
                </p>
              </div>

              <div>
                <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">
                  Mobile number*
                </Label>
                <div className="mt-1 relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="mobile"
                    placeholder="+91 Enter your mobile number"
                    className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}

                  />
                  <Button
                    type="button"

//changes here for otp of mobile number
                    // onClick={() => setIsOtpOpen(true)}


                    disabled ={!mobile}
                    className="mt-2 bg-indigo-600 text-white"
                  >
                    Verify OTP
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recruiters will contact you on this number
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Work status*
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card
                    className={`cursor-pointer transition-all ${
                      workStatus === 'experienced' ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => setWorkStatus('experienced')}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">💼</div>
                      <h3 className="font-medium text-gray-900 mb-1 text-sm">I'm experienced</h3>
                      <p className="text-xs text-gray-600">
                        I have work experience (excluding internships)
                      </p>
                    </CardContent>
                  </Card>
                  <Card
                    className={`cursor-pointer transition-all ${
                      workStatus === 'fresher' ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => setWorkStatus('fresher')}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">🎓</div>
                      <h3 className="font-medium text-gray-900 mb-1 text-sm">I'm a fresher</h3>
                      <p className="text-xs text-gray-600">
                        I am a student/ Haven't worked after graduation
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex items-start space-x-2">
               <Checkbox
                  id="updates"
                  className="mt-1"
                  checked={receivePromotions}
                  onCheckedChange={(value) => setReceivePromotions(value === true)}
                />
                <label htmlFor="updates" className="text-sm text-gray-600 leading-relaxed">
                  Send me important updates & promotions via SMS, Email, and{' '}
                  <span className="text-green-600 font-medium">WhatsApp</span>
                </label>
              </div>

              <Button 
                disabled={!isOtpVerified}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Register for Free
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <Button variant="outline" className="w-full h-12 border-gray-200 hover:bg-gray-50" type="button">
                <Chrome className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>

              <p className="text-xs text-gray-500 text-center leading-relaxed">
                By clicking Register, you agree to the{' '}
                <Link href="#" className="text-purple-600 hover:underline">
                  Terms and Conditions
                </Link>{' '}
                &{' '}
                <Link href="#" className="text-purple-600 hover:underline">
                  Privacy Policy
                </Link>{' '}
                of JobSeeker.com
              </p>
            </form>
            {/* <Dialog open={IsotpModalOpen} onOpenChange={setIsotpModalOpen}>
                <DialogContent className="sm:max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden p-0 border border-slate-100">
                    <div className="bg-gradient-to-b from-indigo-50/80 to-white px-6 pt-8 pb-4 flex flex-col items-center text-center">
                      <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 ring-4 ring-indigo-50 text-indigo-600">
                      </div>
                      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enter Your OTP</h1>
                      <p className="text-sm text-slate-500 mt-2">
                        We sent a code to <span className="font-medium text-slate-700">user@email.com</span>
                      </p>
                    </div>
                   <div className="flex justify-center my-6">
                    <InputOTP maxLength={6} >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                
                  <button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-medium py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    Verify
                  </button>

                  <div className="mt-6 text-center text-sm">
                  <p className="text-slate-500 flex items-center justify-center gap-1">
                    Didn't receive it? 
                    ( <button className="text-indigo-600 font-semibold hover:underline">
                        Resend Code
                      </button>
                    ) : (
                      <span className="text-slate-400 font-medium">Resend in 00</span>
                    )
                  </p>
                </div>
              </DialogContent>
            </Dialog> */}

{/* <Dialog open={IsotpModalOpen} onOpenChange={setIsotpModalOpen}>
  <DialogContent className="sm:max-w-md w-full bg-white rounded-2xl shadow-[0_8px_35px_rgba(0,0,0,0.15)] overflow-hidden p-0 border border-slate-200/60 backdrop-blur-xl">
   
    

    
    <div className="flex justify-center my-6">
      <InputOTP maxLength={6}>
        <InputOTPGroup className="gap-2">
          <InputOTPSlot index={0} className="h-12 w-10 rounded-md border border-slate-300 text-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all" />
          <InputOTPSlot index={1} className="h-12 w-10 rounded-md border border-slate-300 text-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all" />
          <InputOTPSlot index={2} className="h-12 w-10 rounded-md border border-slate-300 text-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all" />
          <InputOTPSlot index={3} className="h-12 w-10 rounded-md border border-slate-300 text-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all" />
          <InputOTPSlot index={4} className="h-12 w-10 rounded-md border border-slate-300 text-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all" />
          <InputOTPSlot index={5} className="h-12 w-10 rounded-md border border-slate-300 text-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all" />
        </InputOTPGroup>
      </InputOTP>
    </div>

    
    <button
      className="w-40 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400
      text-white font-semibold py-3 rounded-xl transition-all
      shadow-lg hover:shadow-xl active:scale-[0.98] mx-auto block"
    >
      Verify
    </button>

    <div className="mt-6 text-center text-sm pb-6">
      <p className="text-slate-600 flex items-center justify-center gap-1">
        Didn’t receive it? 
        <button className="text-indigo-600 font-semibold hover:underline underline-offset-2">
          Resend Code
        </button>
      </p>
    </div>

  </DialogContent>
</Dialog> */}


<Dialog open={isOtpOpen} onOpenChange={setIsOtpOpen}>
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
          const res = await fetch("http://127.0.0.1:8010/api/verify-otp/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
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

                 
   
 
          </div>
        </div>
      </div>
    </div>
  );
}