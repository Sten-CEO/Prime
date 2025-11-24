import { Card } from "@/components/ui/card";
import { PrimeTargetCard } from "@/components/PrimeTargetCard";
import { DropZone } from "@/components/DropZone";
import { Plus, ChevronDown, TrendingUp } from "lucide-react";
import { useState } from "react";

interface Objective {
  id: number;
  title: string;
  progress: number;
  deadline: string;
  status: "in-progress" | "completed" | "delayed";
  completed: boolean;
  notes?: string;
  subObjectives?: string[];
  history?: { date: string; progress: number }[];
}

interface DomainObjectivesProps {
  objectives: Objective[];
}

export const DomainObjectives = ({ objectives: initialObjectives }: DomainObjectivesProps) => {
  const [objectives, setObjectives] = useState(initialObjectives);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

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

  const handleProgress = (id: number, increment: number) => {
    setObjectives(objectives.map(obj => 
      obj.id === id ? { ...obj, progress: Math.min(100, obj.progress + increment) } : obj
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "bg-blue-500/20 border-blue-500/40";
      case "completed":
        return "bg-success/20 border-success/40";
      case "delayed":
        return "bg-warning/20 border-warning/40";
      default:
        return "bg-white/[0.05] border-white/[0.12]";
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "in-progress":
        return <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />;
      case "completed":
        return <TrendingUp className="w-3 h-3 text-success" />;
      case "delayed":
        return <div className="w-2 h-2 rounded-full bg-warning" />;
      default:
        return null;
    }
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
            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {getStatusIndicator(objective.status)}
                </div>
                <PrimeTargetCard 
                  {...objective} 
                  index={index}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedIndex === index}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1 bg-black/90 backdrop-blur-xl border border-white/[0.15] rounded-lg p-1">
                    <button
                      onClick={() => handleProgress(objective.id, 1)}
                      className="px-2 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-white/70 hover:text-white text-xs transition-all"
                      title="+1%"
                    >
                      +1%
                    </button>
                    <button
                      onClick={() => handleProgress(objective.id, 5)}
                      className="px-2 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-white/70 hover:text-white text-xs transition-all"
                      title="+5%"
                    >
                      +5%
                    </button>
                    <button
                      onClick={() => handleProgress(objective.id, 10)}
                      className="px-2 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-white/70 hover:text-white text-xs transition-all"
                      title="+10%"
                    >
                      +10%
                    </button>
                  </div>
                  <button
                    onClick={() => setExpandedId(expandedId === objective.id ? null : objective.id)}
                    className="w-6 h-6 flex items-center justify-center rounded bg-white/[0.05] hover:bg-white/[0.1] transition-all"
                  >
                    <ChevronDown className={`w-4 h-4 text-white/70 transition-transform ${
                      expandedId === objective.id ? 'rotate-180' : ''
                    }`} />
                  </button>
                </div>
              </div>

              {expandedId === objective.id && (
                <div className="ml-8 p-4 rounded-lg backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] space-y-3 animate-fade-in">
                  {objective.notes && (
                    <div>
                      <p className="text-xs text-white/60 mb-1">Notes</p>
                      <p className="text-sm text-white/80">{objective.notes}</p>
                    </div>
                  )}
                  
                  {objective.subObjectives && objective.subObjectives.length > 0 && (
                    <div>
                      <p className="text-xs text-white/60 mb-1">Sous-objectifs</p>
                      <ul className="space-y-1">
                        {objective.subObjectives.map((sub, idx) => (
                          <li key={idx} className="text-sm text-white/70 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                            {sub}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {objective.history && objective.history.length > 0 && (
                    <div>
                      <p className="text-xs text-white/60 mb-1">Historique</p>
                      <div className="space-y-1">
                        {objective.history.map((entry, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-white/60">{entry.date}</span>
                            <span className="text-white/80">{entry.progress}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <DropZone index={objectives.length} onDrop={handleDrop} />
      </div>
    </div>
  );
};