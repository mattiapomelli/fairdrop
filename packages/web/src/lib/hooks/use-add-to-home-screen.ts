import { useEffect, useRef, useState } from "react";

interface IBeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const useAddToHomescreen = () => {
  const promptEvent = useRef<IBeforeInstallPromptEvent>();
  const [showPrompt, setShowPrompt] = useState(false);

  const promptToInstall = () => {
    if (promptEvent.current) {
      return promptEvent.current.prompt();
    }

    return Promise.reject(
      new Error('Tried installing before browser sent "beforeinstallprompt" event'),
    );
  };

  useEffect(() => {
    const ready = (event: IBeforeInstallPromptEvent) => {
      event.preventDefault();
      promptEvent.current = event;
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", ready as EventListenerOrEventListenerObject);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        ready as EventListenerOrEventListenerObject,
      );
    };
  }, []);

  return { showPrompt, setShowPrompt, promptToInstall };
};
