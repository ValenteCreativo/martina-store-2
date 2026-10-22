'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';

export default function LoginPage() {
  const router = useRouter();
  const { ready, authenticated, login } = usePrivy();

  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // The server verifies the Privy access token and ADMIN_PRIVY_DIDS on each sensitive request.
  useEffect(() => {
    const verify = async () => {
      if (!ready || !authenticated) return;
      setIsChecking(true);
      setError(null);
      router.push('/admin');
    };

    verify();
  }, [ready, authenticated, router]);

  const handleLogin = async () => {
    setError(null);
    await login();
  };

  return (
    <main className="min-h-screen flex items-center justify-center sacred-minimal">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md p-8"
      >
        <div className="glass-minimal p-12 rounded-lg">
          <div className="text-center mb-8">
            <div className="flex justify-center gap-2 mb-6">
              <div className="sacred-dot animate-subtle-glow" />
              <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '1s' }} />
              <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '2s' }} />
            </div>
            <h1 className="text-3xl font-light tracking-wider mb-2">Acceso admin</h1>
            <p className="text-sm text-[#c8bfba] font-light">
              Inicia con Privy. El servidor verifica los permisos del panel.
            </p>
          </div>

          {error && <div className="text-sm text-[#4a3434] text-center mb-4">{error}</div>}

          <button
            onClick={handleLogin}
            disabled={!ready || isChecking}
            className="w-full btn-elegant"
          >
            {!ready || isChecking ? 'Verificando...' : authenticated ? 'Entrar' : 'Sign in with Privy'}
          </button>
        </div>
      </motion.div>
    </main>
  );
}
