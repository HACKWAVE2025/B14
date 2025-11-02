// src/components/PrankButton.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface PrankButtonProps {
  onPlay: () => void;
  onPrankClick: () => void;
}

export function PrankButton({ onPlay, onPrankClick }: PrankButtonProps) {
  const [isPrank, setIsPrank] = useState(false);

  // On component load, randomly decide if this is a prank button
  useEffect(() => {
    const randomValue = Math.random();
    if (randomValue < 0.5) {
      // 50% chance of being a prank
      setIsPrank(true);
    }
  }, []);

  if (isPrank) {
    // Prank 1: The typo button "Qyest"
    return (
      <Button
        onClick={onPrankClick}
        className="btn-pixel-main w-full mt-auto animate-pulse"
        size="sm"
      >
        <Play className="w-4 h-4 mr-2" />
        Execute Qyest
      </Button>
    );
  }

  // The real button
  return (
    <Button onClick={onPlay} className="btn-pixel-main w-full mt-auto" size="sm">
      <Play className="w-4 h-4 mr-2" />
      Execute Quest
    </Button>
  );
}