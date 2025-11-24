import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const mockData = [
  { day: "Lun", Business: 8, Sport: 7, Social: 6, Santé: 9 },
  { day: "Mar", Business: 7, Sport: 8, Social: 7, Santé: 8 },
  { day: "Mer", Business: 9, Sport: 6, Social: 8, Santé: 7 },
  { day: "Jeu", Business: 8, Sport: 9, Social: 7, Santé: 9 },
  { day: "Ven", Business: 9, Sport: 8, Social: 9, Santé: 8 },
  { day: "Sam", Business: 7, Sport: 9, Social: 8, Santé: 9 },
  { day: "Dim", Business: 8, Sport: 7, Social: 9, Santé: 8 },
];

export const MultiDomainChart = () => {
  return (
    <Card className="backdrop-blur-2xl bg-white/[0.02] border border-white/[0.12] rounded-2xl p-8 relative overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
      {/* Aura effect - Soft white glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/[0.05] rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-aura-cyan/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Performance Multi-Domaines</h2>
          <span className="text-sm text-success font-medium drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]">+18% cette semaine</span>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--glass-border) / 0.1)" />
            <XAxis 
              dataKey="day" 
              stroke="rgba(255, 255, 255, 0.6)"
              style={{ fontSize: '12px', fill: 'white' }}
            />
            <YAxis 
              stroke="rgba(255, 255, 255, 0.6)"
              style={{ fontSize: '12px', fill: 'white' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--glass-bg) / 0.9)',
                border: '1px solid hsl(var(--glass-border) / 0.2)',
                borderRadius: '12px',
                backdropFilter: 'blur(12px)',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Business" 
              stroke="hsl(var(--aura-cyan))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--aura-cyan))', r: 5, filter: 'drop-shadow(0 0 8px hsl(var(--aura-cyan)))' }}
              activeDot={{ r: 7 }}
            />
            <Line 
              type="monotone" 
              dataKey="Sport" 
              stroke="hsl(var(--aura-green))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--aura-green))', r: 5, filter: 'drop-shadow(0 0 8px hsl(var(--aura-green)))' }}
              activeDot={{ r: 7 }}
            />
            <Line 
              type="monotone" 
              dataKey="Social" 
              stroke="hsl(var(--aura-pink))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--aura-pink))', r: 5, filter: 'drop-shadow(0 0 8px hsl(var(--aura-pink)))' }}
              activeDot={{ r: 7 }}
            />
            <Line 
              type="monotone" 
              dataKey="Santé" 
              stroke="hsl(var(--aura-purple))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--aura-purple))', r: 5, filter: 'drop-shadow(0 0 8px hsl(var(--aura-purple)))' }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
