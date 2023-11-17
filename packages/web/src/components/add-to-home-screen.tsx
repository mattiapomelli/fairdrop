"use client";

import { useAddToHomescreen } from "@/lib/hooks/use-add-to-home-screen";

import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";

export const AddToHomeScreen = () => {
  const { showPrompt, setShowPrompt, promptToInstall } = useAddToHomescreen();

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <div className="flex flex-col gap-4">
        <h3>Install the app</h3>
        <p>This app can be installed and added to your home screen.</p>
        <Button onClick={promptToInstall}>Add to home screen</Button>
      </div>
    </Dialog>
  );
};
