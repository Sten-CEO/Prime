import { useState } from "react";

interface DropZoneProps {
  index: number;
  onDrop: (targetIndex: number) => void;
}

export const DropZone = ({ index, onDrop }: DropZoneProps) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    onDrop(index);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`h-1 transition-all ${
        isOver ? "bg-white/60 h-1" : "bg-transparent h-1"
      }`}
    />
  );
};
