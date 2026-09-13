import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import LoginForm from "../components/auth/LoginForm";
import LogoHeader from "../components/layout/LogoHeader";
import Background from "../components/layout/Background";

const LoginPage = () => {
  return (
    <Background imagePath="/background.jpg">
      <div className="min-h-screen flex flex-col">
        <LogoHeader />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Card header */}
            <div className="flex items-center gap-2 bg-brand-primary px-5 py-3.5 rounded-t-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
              </svg>
              <span className="text-white font-semibold text-base tracking-wide">
                Alumni Connect
              </span>
            </div>

            {/* Card body */}
            <div className="bg-white rounded-b-lg shadow-lg px-8 py-8">
              <LoginForm />
            </div>

            {/* Separator */}
            <div className="mt-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-white/70">
              <span className="h-px flex-1 bg-white/25" />
              Separate portal
              <span className="h-px flex-1 bg-white/25" />
            </div>

            <Link
              to="/admin/login"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              <ShieldCheck className="h-4 w-4" />
              Administrators sign in here
            </Link>
          </div>
        </div>
      </div>
    </Background>
  );
};

export default LoginPage;