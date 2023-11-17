"use client";

import { useAddToHomescreeniOS } from "@/lib/hooks/use-add-to-home-screen-ios";

import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";

export function AddToHomeScreeniOS() {
  const [showPrompt, setShowPrompt] = useAddToHomescreeniOS();

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <div className="flex flex-col gap-4">
        <h3>Install the app</h3>
        <p>
          This app can be installed and added to your home screen. Click on the Share button and
          then &quot;Add to Home Screen&quot;
        </p>
        <Button onClick={() => setShowPrompt(false)}>Ok</Button>
      </div>
    </Dialog>
  );
}
