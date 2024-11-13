import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';

export default function InstallPWA() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    const result = await installPrompt.prompt();
    if (result.outcome === 'accepted') {
      setIsInstalled(true);
      setInstallPrompt(null);
    }
  };

  if (isInstalled) {
    return (
      <Button className="mt-2" variant="outline" disabled>
        Already Installed
      </Button>
    );
  }

  if (!installPrompt) {
    return null; // Hide button if not installable
  }

  return (
    <Button 
      className="mt-2" 
      variant="outline" 
      onClick={handleInstall}
    >
      Install App
    </Button>
  );
}