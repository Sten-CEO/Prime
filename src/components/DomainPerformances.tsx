import { Card } from "@/components/ui/card";
import { Pencil, Plus, GripVertical, Star } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { AddPerformanceModal } from "@/components/modals/AddPerformanceModal";
import { RatePerformanceModal } from "@/components/modals/RatePerformanceModal";
import { useToast } from "@/hooks/use-toast";

interface Performance {
  id: string;
  name: string;
  score: number;
}

interface DomainPerformancesProps {
  domainName: string;
  performances: Performance[];
}

export const DomainPerformances = ({ domainName, performances: initialPerformances }: DomainPerformancesProps) => {
  const [performances, setPerformances] = useState(initialPerformances);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [ratingPerf, setRatingPerf] = useState<Performance | null>(null);
  const { toast } = useToast();

  const handleEdit = (id: string, score: number) => {
    setEditingId(id);
    setEditValue(score);
  };

  const handleSave = (id: string) => {
    setPerformances(performances.map(p => 
      p.id === id ? { ...p, score: editValue } : p
    ));
    setEditingId(null);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    
    const newPerformances = [...performances];
    const draggedItem = newPerformances[draggedIndex];
    
    newPerformances.splice(draggedIndex, 1);
    newPerformances.splice(targetIndex, 0, draggedItem);
    
    setPerformances(newPerformances);
    setDraggedIndex(null);
  };

  const handleAdd = (performance: { name: string; icon: string; score: number }) => {
    const newPerf = {
      id: `p${performances.length + 1}`,
      name: `${performance.icon} ${performance.name}`,
      score: performance.score
    };
    setPerformances([...performances, newPerf]);
    toast({ title: "Performance ajoutée", description: `${performance.name} a été ajoutée avec succès.` });
  };

  const handleRate = (id: string, score: number, note: string) => {
    setPerformances(performances.map(p => 
      p.id === id ? { ...p, score } : p
    ));
    toast({ title: "Note enregistrée", description: `Votre note de ${score}/100 a été enregistrée.` });
  };

  const handleDelete = (id: string) => {
    setPerformances(performances.filter(p => p.id !== id));
    toast({ title: "Performance supprimée", description: "La performance a été supprimée." });
  };

  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Performances Libres</h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all text-white/70 hover:text-white text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter</span>
        </button>
      </div>
      
      <div className="space-y-3">
        {performances.map((perf, index) => (
          <div
            key={perf.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className={`flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] transition-all group cursor-move ${
              draggedIndex === index ? 'opacity-50' : ''
            }`}
          >
            <GripVertical className="w-4 h-4 text-white/40 flex-shrink-0" />
            
            <span className="text-sm text-white/80 flex-1">{perf.name}</span>
            
            {editingId === perf.id ? (
              <div className="flex items-center gap-3 flex-1 animate-fade-in">
                <Slider
                  value={[editValue]}
                  onValueChange={(value) => setEditValue(value[0])}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-white w-12 text-right">
                  {editValue.toFixed(0)}
                </span>
                <button
                  onClick={() => handleSave(perf.id)}
                  className="px-3 py-1 rounded-lg bg-success/20 border border-success/40 text-success text-xs hover:bg-success/30 transition-all"
                >
                  ✓
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">
                  {perf.score}<span className="text-white/60">/100</span>
                </span>
                <button
                  onClick={() => setRatingPerf(perf)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all opacity-0 group-hover:opacity-100"
                  title="Noter aujourd'hui"
                >
                  <Star className="w-3.5 h-3.5 text-white/70" />
                </button>
                <button
                  onClick={() => handleEdit(perf.id, perf.score)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all opacity-0 group-hover:opacity-100"
                  title="Modifier"
                >
                  <Pencil className="w-3.5 h-3.5 text-white/70" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <AddPerformanceModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAdd={handleAdd}
      />

      {ratingPerf && (
        <RatePerformanceModal
          open={!!ratingPerf}
          onOpenChange={() => setRatingPerf(null)}
          performanceName={ratingPerf.name}
          onRate={(score, note) => handleRate(ratingPerf.id, score, note)}
        />
      )}
    </Card>
  );
};