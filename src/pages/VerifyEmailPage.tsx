import { Link } from "react-router-dom";
import { VerifyCodeCard } from "../components/auth/VerifyCodeCard";
import { DEMO_CODE } from "../lib/demoCode";
import LogoHeader from "../components/layout/LogoHeader";
import Background from "../components/layout/Background";

const VerifyEmailPage = () => {
  const handleVerify = async (code: string) => {
    return code === DEMO_CODE;
  };

  return (
    <Background imagePath="/background.jpg">
      <div className="min-h-screen flex flex-col">
        <LogoHeader />
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md">
            <VerifyCodeCard
              title="Verify your email"
              subtitle="Confirm your email address to activate your Alumni Connect account."
              destination="you@example.com"
              onVerify={handleVerify}
              successTitle="Email verified successfully!"
              successDescription="Your account is active. You can now sign in and start connecting with the Exploits University community."
              successAction={
                <Link
                  to="/login"
                  className="rounded-md bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primaryLight"
                >
                  Go to Sign In
                </Link>
              }
              backLink={
                <Link
                  to="/login"
                  className="text-sm font-medium text-brand-primary hover:underline"
                >
                  ← Back to sign in
                </Link>
              }
              demoHint={`Demo: use code ${DEMO_CODE}`}
            />
          </div>
        </div>
      </div>
    </Background>
  );
};

export default VerifyEmailPage;