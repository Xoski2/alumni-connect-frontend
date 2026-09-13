import { useEffect, useState } from "react";
import MultiStepRegistration from "../components/auth/MultiStepRegistration";
import { getBootstrapApi } from "../api/authApi";
import LogoHeader from "../components/layout/LogoHeader";
import Background from "../components/layout/Background";

const RegisterPage = () => {
  const [allowFirstAdmin, setAllowFirstAdmin] = useState(false);
  const [bootLoaded, setBootLoaded] = useState(false);

  useEffect(() => {
    getBootstrapApi()
      .then((b) => setAllowFirstAdmin(b.allowFirstAdminRegister))
      .catch(() => setAllowFirstAdmin(false))
      .finally(() => setBootLoaded(true));
  }, []);

  return (
    <Background imagePath="/mzc.webp">
      <div className="min-h-screen flex flex-col">
        <LogoHeader />
        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
          <div className="w-full max-w-xl">
            <h2 className="mb-3 text-center text-lg font-semibold tracking-wide text-white drop-shadow-lg">
              Registration Centre
            </h2>

            <div className="overflow-hidden rounded-xl bg-white shadow-2xl">
              <div className="flex items-center gap-2 bg-brand-primary px-5 py-3.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                </svg>
                <span className="text-base font-semibold tracking-wide text-white">
                  Alumni Connect
                </span>
              </div>

              <div className="px-5 py-6 sm:px-7">
                <h1 className="mb-5 text-center text-xl font-bold text-gray-900">
                  Join Alumni Connect
                </h1>
                <p className="-mt-2 mb-2 text-center text-sm text-muted-foreground">
                  Four quick steps: Personal details, academic history, security and
                  verification.
                </p>
                <p className="mb-5 text-center text-xs font-medium text-emerald-700">
                  Instant activation — you're signed in immediately after registering.
                  No administrator approval required.
                </p>

                {!bootLoaded ? (
                  <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
                  </div>
                ) : (
                  <MultiStepRegistration />
                )}
              </div>
            </div>

            {allowFirstAdmin && (
              <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-900">
                First-user mode is active — an administrator account can be created
                through the admin portal.
              </p>
            )}
          </div>
        </div>
      </div>
    </Background>
  );
};

export default RegisterPage;