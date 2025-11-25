import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Home, Award, BookOpen, Target, User, Settings, Bell, Calendar, Crosshair, Sparkles, TrendingUp, Focus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/locales/translations";

const Parametres = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [timezone, setTimezone] = useState("Europe/Paris");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  
  const [dailyReminder, setDailyReminder] = useState(true);
  const [dailyReminderTime, setDailyReminderTime] = useState("21:00");
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [targetAlerts, setTargetAlerts] = useState(true);
  
  const [animations, setAnimations] = useState(true);
  const [showEmptyDays, setShowEmptyDays] = useState(true);
  const [focusMode, setFocusMode] = useState(false);

  const handleSavePreferences = () => {
    toast({
      title: t.preferencesUpdated,
      description: "Vos préférences ont été enregistrées avec succès",
    });
  };

  return (
    <div className="min-h-screen bg-black relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/src/assets/black-shapes-bg.jpg')" }}
      />

      {/* Glass Sidebar */}
      <div className="fixed left-6 top-6 bottom-6 w-20 z-20">
        <div className="h-full backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.08] flex flex-col items-center py-6 px-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]">
          <div className="mb-4">
            <span className="text-white font-bold text-lg tracking-tight">Prime.</span>
          </div>
          
          <Separator className="w-10 bg-white/20 mb-8" />
          
          <div className="flex-none">
            <button 
              onClick={() => navigate("/accueil")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <Home className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <Separator className="w-10 bg-white/20 mx-auto my-4" />
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            <button 
              onClick={() => navigate("/domaines/business")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <Award className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button 
              onClick={() => navigate("/journal")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors">
              <Target className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <Separator className="w-10 bg-white/20 mx-auto my-2" />
          </div>
          
          <div className="flex-none flex flex-col gap-4 mt-8">
            <button 
              onClick={() => navigate("/profil")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <User className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.08] transition-colors">
              <Settings className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 ml-32 min-h-screen">
        <div className="max-w-4xl mx-auto p-8 space-y-6">
          <h1 className="text-4xl font-bold text-white mb-8">{t.settingsTitle}</h1>

          {/* Bloc 1 - Préférences générales */}
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-3xl p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            <h2 className="text-2xl font-semibold text-white mb-6">{t.generalPreferences}</h2>
            <div className="space-y-6">
              <div>
                <label className="text-sm text-white/70 mb-2 block">{t.language}</label>
                <Select value={language} onValueChange={(val) => setLanguage(val as Language)}>
                  <SelectTrigger className="bg-white/[0.05] border-white/[0.1] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/[0.1]">
                    <SelectItem value="fr" className="text-white">{t.french}</SelectItem>
                    <SelectItem value="en" className="text-white">{t.english}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">{t.timezone}</label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="bg-white/[0.05] border-white/[0.1] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/[0.1]">
                    <SelectItem value="Europe/Paris" className="text-white">Europe/Paris</SelectItem>
                    <SelectItem value="America/New_York" className="text-white">America/New York</SelectItem>
                    <SelectItem value="Asia/Bangkok" className="text-white">Asia/Bangkok</SelectItem>
                    <SelectItem value="Australia/Sydney" className="text-white">Australia/Sydney</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-white/70 mb-2 block">{t.dateFormat}</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="dd-mm-yyyy"
                      checked={dateFormat === "DD/MM/YYYY"}
                      onChange={() => setDateFormat("DD/MM/YYYY")}
                      className="w-4 h-4 text-primary bg-white/[0.05] border-white/[0.1]"
                    />
                    <label htmlFor="dd-mm-yyyy" className="text-white/80 cursor-pointer">JJ/MM/AAAA</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="mm-dd-yyyy"
                      checked={dateFormat === "MM/DD/YYYY"}
                      onChange={() => setDateFormat("MM/DD/YYYY")}
                      className="w-4 h-4 text-primary bg-white/[0.05] border-white/[0.1]"
                    />
                    <label htmlFor="mm-dd-yyyy" className="text-white/80 cursor-pointer">MM/JJ/AAAA</label>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSavePreferences}
                className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl px-6 py-3 hover:bg-white/[0.04] hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] text-white font-medium"
              >
                {t.save}
              </button>
            </div>
          </div>

          {/* Bloc 2 - Rappels & notifications */}
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-3xl p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            <h2 className="text-2xl font-semibold text-white mb-6">{t.remindersNotifications}</h2>
            <div className="space-y-4">
              <div className="backdrop-blur-xl bg-white/[0.01] border border-white/[0.05] rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Bell className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-white font-medium">{t.dailyReminder}</p>
                      <p className="text-white/60 text-sm">{t.dailyReminderDesc}</p>
                    </div>
                  </div>
                  <Switch checked={dailyReminder} onCheckedChange={setDailyReminder} />
                </div>
                {dailyReminder && (
                  <div className="mt-4 ml-9">
                    <Select value={dailyReminderTime} onValueChange={setDailyReminderTime}>
                      <SelectTrigger className="bg-white/[0.05] border-white/[0.1] text-white w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-white/[0.1]">
                        <SelectItem value="20:00" className="text-white">20:00</SelectItem>
                        <SelectItem value="21:00" className="text-white">21:00</SelectItem>
                        <SelectItem value="22:00" className="text-white">22:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="backdrop-blur-xl bg-white/[0.01] border border-white/[0.05] rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-white font-medium">{t.weeklyReport}</p>
                      <p className="text-white/60 text-sm">{t.weeklyReportDesc}</p>
                    </div>
                  </div>
                  <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} />
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/[0.01] border border-white/[0.05] rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Crosshair className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-white font-medium">{t.targetAlerts}</p>
                      <p className="text-white/60 text-sm">{t.targetAlertsDesc}</p>
                    </div>
                  </div>
                  <Switch checked={targetAlerts} onCheckedChange={setTargetAlerts} />
                </div>
              </div>
            </div>
          </div>

          {/* Bloc 3 - Affichage & expérience */}
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-3xl p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            <h2 className="text-2xl font-semibold text-white mb-6">{t.displayExperience}</h2>
            <div className="space-y-4">
              <div className="backdrop-blur-xl bg-white/[0.01] border border-white/[0.05] rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-white font-medium">{t.visualAnimations}</p>
                      <p className="text-white/60 text-sm">{t.visualAnimationsDesc}</p>
                    </div>
                  </div>
                  <Switch checked={animations} onCheckedChange={setAnimations} />
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/[0.01] border border-white/[0.05] rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-white font-medium">{t.showEmptyDays}</p>
                      <p className="text-white/60 text-sm">{t.showEmptyDaysDesc}</p>
                    </div>
                  </div>
                  <Switch checked={showEmptyDays} onCheckedChange={setShowEmptyDays} />
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/[0.01] border border-white/[0.05] rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Focus className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-white font-medium">{t.focusMode}</p>
                      <p className="text-white/60 text-sm">{t.focusModeDesc}</p>
                    </div>
                  </div>
                  <Switch checked={focusMode} onCheckedChange={setFocusMode} />
                </div>
              </div>
            </div>
            <p className="text-xs text-white/40 mt-4 text-center">
              {t.autoSave}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parametres;
