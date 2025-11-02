// src/components/PrankModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// Import your local GIF (make sure it's at src/assets/fraud.gif)
import fraudGif from "@/assets/fraud.gif";

interface PrankModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrankModal({ open, onOpenChange }: PrankModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // --- CHANGE HERE ---
        // This makes the modal take 75% of the viewport width,
        // but no more than 896px (max-w-4xl).
        className="w-[75vw] max-w-4xl bg-gray-900 border-pink-500 text-white font-pixel"
      >
        <DialogHeader>
          <DialogTitle className="text-pink-500 text-3xl">
            You have been scammed!
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-lg">
            Be more cautious.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <img
            src={fraudGif}
            alt="Scam Alert GIF"
            // We use aspect-video (16:9) to match the recommended 640x360 size
            className="w-full rounded-md pixel-box aspect-video"
          />
          <p className="text-center text-2xl font-medium text-gray-200">
            This was a test. Always double-check links, spelling, and
            offers that seem too good to be true!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}