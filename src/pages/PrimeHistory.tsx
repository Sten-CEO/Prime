import { useState } from "react";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { Sidebar } from "@/components/Sidebar";
import { completedObjectives, domains, chartData } from "@/data/mockData";
import { CheckCircle2, TrendingUp } from "lucide-react";

const PrimeHistory = () => {
  const [filter, setFilter] = useState<"all" | string>("all");
  const [period, setPeriod] = useState<"3m" | "1y">("3m");

  const filteredObjectives =
    filter === "all"
      ? completedObjectives
      : completedObjectives.filter((obj) => obj.domain === filter);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      <Sidebar />

      <div className="relative z-10 ml-20 px-20 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Prime History</h1>
            <p className="text-white/60">Historique de vos performances et objectifs complétés</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-5">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-accent-green" />
                <h3 className="text-white/80 text-sm">Objectifs complétés</h3>
              </div>
              <div className="text-4xl font-bold text-white">
                {completedObjectives.length}
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-accent-blue" />
                <h3 className="text-white/80 text-sm">Score moyen (mois)</h3>
              </div>
              <div className="text-4xl font-bold text-white">84</div>
            </div>

            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-accent-violet" />
                <h3 className="text-white/80 text-sm">Progression annuelle</h3>
              </div>
              <div className="text-4xl font-bold text-white">+32%</div>
            </div>
          </div>

          {/* Chart */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Progression Globale</h2>
              <div className="flex gap-2">
                {(["3m", "1y"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-2 rounded-xl transition-colors ${
                      period === p
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {p === "3m" ? "3 mois" : "1 an"}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-48 flex items-end justify-between gap-3">
              {chartData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col justify-end">
                  <div
                    className="w-full bg-gradient-to-t from-accent-violet/60 to-accent-blue/60 rounded-t-xl"
                    style={{ height: `${(data.business || 0)}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`backdrop-blur-md rounded-xl px-4 py-2 transition-colors ${
                filter === "all"
                  ? "bg-white/20 text-white border border-white/20"
                  : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
              }`}
            >
              Tous
            </button>
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setFilter(domain.id)}
                className={`backdrop-blur-md rounded-xl px-4 py-2 transition-colors ${
                  filter === domain.id
                    ? "bg-white/20 text-white border border-white/20"
                    : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                }`}
              >
                {domain.name}
              </button>
            ))}
          </div>

          {/* Completed Objectives */}
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-white">Objectifs Complétés</h2>
            {filteredObjectives.map((obj) => (
              <div
                key={obj.id}
                className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-accent-green" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{obj.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-white/60 text-sm">{obj.domain}</span>
                        <span className="text-white/40">•</span>
                        <span className="text-white/60 text-sm">
                          Complété le {new Date(obj.completedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimeHistory;
