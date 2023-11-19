import { Check, Copy } from "lucide-react";
import { useRef, useState } from "react";

const copyToClipboard = (text: string) => {
  return navigator.clipboard.writeText(text);
};

interface CopyButtonProps {
  text: string;
  className?: string;
}

export const CopyButton = ({ text, className }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<NodeJS.Timeout>();

  const copy = async () => {
    await copyToClipboard(text);
    setCopied(true);

    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={copy} className={className}>
      {copied ? <Check /> : <Copy />}
    </button>
  );
};
