import React, { useState } from "react";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { AccessCodeForm } from "./AccessCodeForm";
export enum AuthMode {
  SIGN_IN,
  SIGN_UP,
  FORGOT_PASSWORD,
}
const AuthContainer = () => {
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.SIGN_IN);
  const [accessCodeVerified, setAccessCodeVerified] = useState(false);
  const toggleSignInSignUp = () => {
    setAuthMode(prevMode => prevMode === AuthMode.SIGN_IN ? AuthMode.SIGN_UP : AuthMode.SIGN_IN);
    if (authMode === AuthMode.SIGN_IN) {
      setAccessCodeVerified(false);
    }
  };
  const handleAccessCodeVerified = () => {
    setAccessCodeVerified(true);
  };
  return <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <div className="flex justify-center mt-4 mb-16 py-0">
          <img alt="DayNote Logo" className="h-16" src="/lovable-uploads/9cb5361c-932f-4217-92e0-2981663384ec.png" />
        </div>
      </div>

      {authMode === AuthMode.FORGOT_PASSWORD ? <ForgotPasswordForm onBackToSignIn={() => setAuthMode(AuthMode.SIGN_IN)} /> : authMode === AuthMode.SIGN_UP ? accessCodeVerified ? <SignUpForm onToggleMode={toggleSignInSignUp} /> : <AccessCodeForm onVerified={handleAccessCodeVerified} /> : <SignInForm onToggleMode={toggleSignInSignUp} onForgotPassword={() => setAuthMode(AuthMode.FORGOT_PASSWORD)} />}
    </div>;
};
export default AuthContainer;