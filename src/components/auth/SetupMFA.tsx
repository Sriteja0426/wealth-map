import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Smartphone, Copy, Check, ArrowRight } from 'lucide-react';

const SetupMFA: React.FC = () => {
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Generate a fake secret key for demo
  const secretKey = 'HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ';
  
  // Handle input change for verification code
  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };
  
  // Handle key down for verification code
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };
  
  // Copy secret key to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(secretKey);
    setIsCopied(true);
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  
  // Verify code and complete setup
  const completeSetup = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    navigate('/');
  };
  
  // Skip MFA setup
  const skipSetup = () => {
    navigate('/');
  };
  
  // Auto-focus first input on mount
  useEffect(() => {
    if (step === 2) {
      const firstInput = document.getElementById('code-0');
      firstInput?.focus();
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900">
          Set up two-factor authentication
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Add an extra layer of security to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {step === 1 ? (
            <>
              <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
                <h3 className="text-sm font-medium text-primary-800 mb-2">Why use two-factor authentication?</h3>
                <p className="text-sm text-primary-700">
                  Two-factor authentication adds an extra layer of security to your account by requiring not only a password but also a second form of verification.
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-medium">1</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-neutral-900">Download an authenticator app</h4>
                    <p className="text-sm text-neutral-500 mt-1">
                      We recommend Google Authenticator or Authy. These are available for iOS and Android.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-medium">2</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-neutral-900">Set up your account in the app</h4>
                    <p className="text-sm text-neutral-500 mt-1">
                      You'll scan a QR code or enter a setup key to add PropWealth to your app.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-medium">3</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-neutral-900">Verify with a one-time code</h4>
                    <p className="text-sm text-neutral-500 mt-1">
                      Enter the 6-digit code from your app to complete setup.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={skipSetup}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 focus:outline-none"
                >
                  Skip for now
                </button>
                
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 flex justify-center">
                {/* This would be a QR code in a real implementation */}
                <div className="w-48 h-48 bg-neutral-100 border rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Smartphone className="h-12 w-12 text-neutral-400 mx-auto" />
                    <p className="mt-2 text-xs text-neutral-500">QR Code Placeholder</p>
                    <p className="mt-1 text-xs text-neutral-500">(Scan in authenticator app)</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Manual entry code
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={secretKey}
                    className="flex-1 block w-full px-3 py-2 border border-neutral-300 rounded-md bg-neutral-50 text-neutral-800 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="ml-2 p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 focus:outline-none"
                    aria-label="Copy to clipboard"
                  >
                    {isCopied ? (
                      <Check className="h-5 w-5 text-success-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  If you can't scan the QR code, enter this code manually in your app.
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Enter verification code from your app
                </label>
                <div className="flex justify-between space-x-2">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      pattern="[0-9]"
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="block w-10 h-12 text-center border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-lg"
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Back
                </button>
                
                <button
                  type="button"
                  onClick={completeSetup}
                  disabled={isLoading || verificationCode.some(digit => !digit)}
                  className={`flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                    (isLoading || verificationCode.some(digit => !digit)) ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Verifying..." : "Verify and complete"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupMFA;