"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Share2, Smartphone, SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isIOS() {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

export function AppInstallCTA() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIosHelpOpen, setIsIosHelpOpen] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    setIsIos(isIOS());
    setStandalone(isStandalone());

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => setDeferredPrompt(null);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const buttonLabel = useMemo(() => {
    if (deferredPrompt) return "Descargar app";
    if (isIos) return "Instalar en iPhone";
    return "Instalar app";
  }, [deferredPrompt, isIos]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      return;
    }

    if (isIos) {
      setIsIosHelpOpen(true);
    }
  };

  if (standalone) return null;

  return (
    <>
      <Button
        type="button"
        onClick={handleInstall}
        className="shrink-0 bg-white text-matilde-red hover:bg-matilde-yellow-light"
      >
        <Download className="mr-2 h-4 w-4" />
        {buttonLabel}
      </Button>

      <Dialog open={isIosHelpOpen} onOpenChange={setIsIosHelpOpen}>
        <DialogContent className="max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="font-serif text-matilde-red">
              Instalar en iPhone
            </DialogTitle>
            <DialogDescription>
              En iOS, abre Safari y sigue estos pasos para añadirla a tu
              pantalla de inicio.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm text-matilde-brown">
            <div className="flex items-start gap-3 rounded-2xl bg-matilde-yellow-light/40 px-4 py-3">
              <Share2 className="mt-0.5 h-4 w-4 shrink-0 text-matilde-red" />
              <p>Toca el botón de compartir de Safari.</p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-matilde-yellow-light/40 px-4 py-3">
              <SquarePlus className="mt-0.5 h-4 w-4 shrink-0 text-matilde-red" />
              <p>Selecciona “Añadir a pantalla de inicio”.</p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-matilde-yellow-light/40 px-4 py-3">
              <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-matilde-red" />
              <p>Confirma para guardar la app como acceso directo.</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => setIsIosHelpOpen(false)}
              className="bg-matilde-red text-white hover:bg-matilde-red-dark"
            >
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
