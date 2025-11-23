import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, ArrowRight, CheckCircle2 } from "lucide-react";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { Sidebar } from "@/components/Sidebar";
import { domains, objectives, insights, chartData } from "@/data/mockData";

const Home = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<"7j" | "30j" | "90j">("7j");

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="relative z-10 ml-20 px-20 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard Prime</h1>
            <p className="text-white/60">Vue globale de vos performances</p>
          </div>

          {/* Domain Cards */}
          <div className="grid grid-cols-3 gap-5">
            {domains.map((domain) => (
              <div
                key={domain.id}
                onClick={() => navigate(`/domaines?domain=${domain.id}`)}
                className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6 shadow-2xl cursor-pointer hover:bg-white/15 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{domain.name}</h3>
                    <p className="text-white/60 text-sm">{domain.daysTracked}/7 jours</p>
                  </div>
                  <div className="text-3xl font-bold text-white">{domain.score}</div>
                </div>
                <div className="flex items-center gap-2">
                  {domain.trend > 0 ? (
                    <TrendingUp className="w-4 h-4 text-accent-green" />
                  ) : domain.trend < 0 ? (
                    <TrendingDown className="w-4 h-4 text-accent-red" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-white/40" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      domain.trend > 0
                        ? "text-accent-green"
                        : domain.trend < 0
                        ? "text-accent-red"
                        : "text-white/40"
                    }`}
                  >
                    {domain.trend > 0 ? "+" : ""}
                    {domain.trend}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Évolution Multi-Domaines</h2>
              <div className="flex gap-2">
                {(["7j", "30j", "90j"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-2 rounded-xl transition-colors ${
                      period === p
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-3">
              {chartData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="flex-1 w-full flex flex-col justify-end relative">
                    <div
                      className="w-full bg-gradient-to-t from-accent-blue/60 to-accent-violet/60 rounded-t-xl"
                      style={{ height: `${data.business}%` }}
                    />
                  </div>
                  <span className="text-white/60 text-xs">{data.day}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-6 justify-center flex-wrap">
              {domains.map((domain) => (
                <div key={domain.id} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent-blue" />
                  <span className="text-white/80 text-sm">{domain.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-2 gap-5">
            {/* Prime Targets */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Prime Targets</h2>
                <button
                  onClick={() => navigate("/prime-targets")}
                  className="text-accent-blue hover:text-accent-blue/80 transition-colors text-sm"
                >
                  Voir tout →
                </button>
              </div>
              <div className="space-y-3">
                {objectives.slice(0, 3).map((obj) => (
                  <div
                    key={obj.id}
                    className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10 flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-accent-blue" />
                        <span className="text-white/90 text-sm font-medium">{obj.title}</span>
                      </div>
                      <span className="text-white/50 text-xs">{obj.domain}</span>
                      <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent-green rounded-full"
                          style={{ width: `${obj.progress}%` }}
                        />
                      </div>
                    </div>
                    <button className="ml-4">
                      <CheckCircle2 className="w-5 h-5 text-white/40 hover:text-accent-green transition-colors" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Insights Récents</h2>
                <button
                  onClick={() => navigate("/journal")}
                  className="text-accent-blue hover:text-accent-blue/80 transition-colors text-sm"
                >
                  Journal →
                </button>
              </div>
              <div className="space-y-3">
                {insights.map((insight) => (
                  <div
                    key={insight.id}
                    className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-accent-blue text-xs font-medium">{insight.domain}</span>
                      <span className="text-white/40 text-xs">•</span>
                      <span className="text-white/40 text-xs">{insight.date}</span>
                    </div>
                    <p className="text-white/90 text-sm">{insight.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="flex gap-4 justify-center">
            {[
              { label: "Domaines", path: "/domaines" },
              { label: "Journal", path: "/journal" },
              { label: "Prime History", path: "/prime-history" },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 px-8 py-4 shadow-xl hover:bg-white/15 transition-all"
              >
                <span className="text-white font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
