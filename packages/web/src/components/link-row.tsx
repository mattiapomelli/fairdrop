import { QrCodeIcon } from "lucide-react";
import { useState } from "react";

import { CopyButton } from "@/components/copy-button";
import { QrCode } from "@/components/qr-code";
import { BaseDialogProps, Dialog, DialogContent } from "@/components/ui/dialog";

export function QrDialog({ link, ...props }: BaseDialogProps & { link: string }) {
  return (
    <Dialog {...props}>
      <DialogContent className="flex max-w-xl justify-center">
        <QrCode address={link} />
      </DialogContent>
    </Dialog>
  );
}

export function LinkRow({ link }: { link: string }) {
  const [showQr, setShowQr] = useState(false);

  return (
    <div className="flex items-center gap-4 text-lg">
      {link}
      <CopyButton text={link} />
      <button onClick={() => setShowQr(true)}>
        <QrCodeIcon />
      </button>
      <QrDialog open={showQr} onOpenChange={setShowQr} link={link} />
    </div>
  );
}
