import { Card } from "@/components/ui/card";
import { PrimeTargetCard } from "@/components/PrimeTargetCard";
import { DropZone } from "@/components/DropZone";
import { Plus } from "lucide-react";
import { useState } from "react";

interface Objective {
  id: number;
  title: string;
  progress: number;
  deadline: string;
  status: "in-progress" | "completed" | "delayed";
  completed: boolean;
}

interface DomainObjectivesProps {
  objectives: Objective[];
}

export const DomainObjectives = ({ objectives: initialObjectives }: DomainObjectivesProps) => {
  const [objectives, setObjectives] = useState(initialObjectives);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null) return;
    
    const newObjectives = [...objectives];
    const draggedItem = newObjectives[draggedIndex];
    
    newObjectives.splice(draggedIndex, 1);
    const insertIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
    newObjectives.splice(insertIndex, 0, draggedItem);
    
    setObjectives(newObjectives);
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white ml-2">Objectifs Actifs</h3>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all text-white/70 hover:text-white text-sm">
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      <div className="space-y-1">
        {objectives.map((objective, index) => (
          <div key={objective.id}>
            <DropZone index={index} onDrop={handleDrop} />
            <PrimeTargetCard 
              {...objective} 
              index={index}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              isDragging={draggedIndex === index}
            />
          </div>
        ))}
        <DropZone index={objectives.length} onDrop={handleDrop} />
      </div>
    </div>
  );
};
