import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, Calendar, Crosshair, Sparkles, TrendingUp, Focus, Palette, FolderCog, Settings } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/locales/translations";
import { DomainColorModal } from "@/components/modals/DomainColorModal";
import { ManageDomainsModal } from "@/components/modals/ManageDomainsModal";
import bgImage from "@/assets/black-shapes-bg.jpg";

const Parametres = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [timezone, setTimezone] = useState(() => localStorage.getItem('prime_timezone') || "Europe/Paris");
  const [dateFormat, setDateFormat] = useState(() => localStorage.getItem('prime_dateformat') || "DD/MM/YYYY");
  
  const [dailyReminder, setDailyReminder] = useState(true);
  const [dailyReminderTime, setDailyReminderTime] = useState("21:00");
  const [customReminderTime, setCustomReminderTime] = useState("21:00");
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [targetAlerts, setTargetAlerts] = useState(true);
  
  const [animations, setAnimations] = useState(true);
  const [showEmptyDays, setShowEmptyDays] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  
  const [domainColorModalOpen, setDomainColorModalOpen] = useState(false);
  const [manageDomainsModalOpen, setManageDomainsModalOpen] = useState(false);

  const handleSavePreferences = () => {
    localStorage.setItem('prime_timezone', timezone);
    localStorage.setItem('prime_dateformat', dateFormat);
    toast({
      title: t.preferencesUpdated,
      description: "Vos préférences ont été enregistrées avec succès",
    });
  };

  return (
    <div className="min-h-screen bg-black relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Glass Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="relative z-10 ml-32 min-h-screen">
        <div className="max-w-6xl mx-auto p-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-white">{t.settingsTitle}</h1>
            <p className="text-white/50 text-sm">Personnalisez votre expérience Prime.</p>
          </div>

          {/* Grid layout - 2 colonnes */}
          <div className="grid grid-cols-2 gap-6">
            {/* Colonne gauche - Préférences & Notifications */}
            <div className="space-y-6">
              {/* Préférences générales */}
              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] space-y-5">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] flex items-center justify-center border border-white/[0.1] shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  {t.generalPreferences}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wider">{t.language}</label>
                    <Select value={language} onValueChange={(val) => setLanguage(val as Language)}>
                      <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white hover:bg-white/[0.05] transition-colors h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-white/[0.1]">
                        <SelectItem value="fr" className="text-white">{t.french}</SelectItem>
                        <SelectItem value="en" className="text-white">{t.english}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs text-white/50 mb-2 block uppercase tracking-wider">{t.timezone}</label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white hover:bg-white/[0.05] transition-colors h-10">
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
                    <label className="text-xs text-white/50 mb-3 block uppercase tracking-wider">{t.dateFormat}</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="radio"
                            checked={dateFormat === "DD/MM/YYYY"}
                            onChange={() => setDateFormat("DD/MM/YYYY")}
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 rounded-full border-2 border-white/[0.2] bg-white/[0.03] peer-checked:border-white/[0.6] peer-checked:bg-white/[0.1] transition-all flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <span className="text-white/70 text-sm group-hover:text-white transition-colors">JJ/MM/AAAA</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="radio"
                            checked={dateFormat === "MM/DD/YYYY"}
                            onChange={() => setDateFormat("MM/DD/YYYY")}
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 rounded-full border-2 border-white/[0.2] bg-white/[0.03] peer-checked:border-white/[0.6] peer-checked:bg-white/[0.1] transition-all flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <span className="text-white/70 text-sm group-hover:text-white transition-colors">MM/JJ/AAAA</span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleSavePreferences}
                    className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-xl px-4 py-2.5 hover:bg-white/[0.12] hover:border-white/[0.15] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all cursor-pointer text-white text-sm font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                  >
                    {t.save}
                  </button>
                </div>
              </div>

              {/* Affichage & expérience */}
              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] space-y-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] flex items-center justify-center border border-white/[0.1] shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  {t.displayExperience}
                </h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-white/[0.05]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center border border-white/[0.08] hover:bg-white/[0.08] transition-all">
                        <Sparkles className="w-4 h-4 text-white/80" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{t.visualAnimations}</p>
                        <p className="text-white/40 text-xs">{t.visualAnimationsDesc}</p>
                      </div>
                    </div>
                    <Switch checked={animations} onCheckedChange={setAnimations} />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-white/[0.05]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center border border-white/[0.08] hover:bg-white/[0.08] transition-all">
                        <TrendingUp className="w-4 h-4 text-white/80" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{t.showEmptyDays}</p>
                        <p className="text-white/40 text-xs">{t.showEmptyDaysDesc}</p>
                      </div>
                    </div>
                    <Switch checked={showEmptyDays} onCheckedChange={setShowEmptyDays} />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center border border-white/[0.08] hover:bg-white/[0.08] transition-all">
                        <Focus className="w-4 h-4 text-white/80" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{t.focusMode}</p>
                        <p className="text-white/40 text-xs">{t.focusModeDesc}</p>
                      </div>
                    </div>
                    <Switch checked={focusMode} onCheckedChange={setFocusMode} />
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite - Rappels & notifications */}
            <div className="space-y-6">
              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] space-y-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] flex items-center justify-center border border-white/[0.1] shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  {t.remindersNotifications}
                </h2>
                
                <div className="space-y-3">
                  <div className="backdrop-blur-xl bg-white/[0.01] border border-white/[0.05] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center border border-white/[0.08] hover:bg-white/[0.08] transition-all">
                          <Bell className="w-4 h-4 text-white/80" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{t.dailyReminder}</p>
                          <p className="text-white/40 text-xs">{t.dailyReminderDesc}</p>
                        </div>
                      </div>
                      <Switch checked={dailyReminder} onCheckedChange={setDailyReminder} />
                    </div>
                    {dailyReminder && (
                      <div className="pl-11 animate-fade-in space-y-3">
                        <div>
                          <label className="text-xs text-white/50 mb-2 block">Heure prédéfinie</label>
                          <Select value={dailyReminderTime} onValueChange={setDailyReminderTime}>
                            <SelectTrigger className="bg-white/[0.05] border-white/[0.08] text-white h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-black/90 border-white/[0.1]">
                              <SelectItem value="20:00" className="text-white">20:00</SelectItem>
                              <SelectItem value="21:00" className="text-white">21:00</SelectItem>
                              <SelectItem value="22:00" className="text-white">22:00</SelectItem>
                              <SelectItem value="custom" className="text-white">Personnalisée</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {dailyReminderTime === "custom" && (
                          <div className="animate-fade-in">
                            <label className="text-xs text-white/50 mb-2 block">Heure personnalisée</label>
                            <input
                              type="time"
                              value={customReminderTime}
                              onChange={(e) => setCustomReminderTime(e.target.value)}
                              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/[0.15] transition-all"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="backdrop-blur-xl bg-white/[0.01] border border-white/[0.05] rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center border border-white/[0.08] hover:bg-white/[0.08] transition-all">
                          <Calendar className="w-4 h-4 text-white/80" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{t.weeklyReport}</p>
                          <p className="text-white/40 text-xs">{t.weeklyReportDesc}</p>
                        </div>
                      </div>
                      <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} />
                    </div>
                  </div>

                  <div className="backdrop-blur-xl bg-white/[0.01] border border-white/[0.05] rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center border border-white/[0.08] hover:bg-white/[0.08] transition-all">
                          <Crosshair className="w-4 h-4 text-white/80" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{t.targetAlerts}</p>
                          <p className="text-white/40 text-xs">{t.targetAlertsDesc}</p>
                        </div>
                      </div>
                      <Switch checked={targetAlerts} onCheckedChange={setTargetAlerts} />
                    </div>
                  </div>

                  <div className="backdrop-blur-xl bg-white/[0.01] border border-white/[0.05] rounded-xl p-4">
                    <button
                      onClick={() => setDomainColorModalOpen(true)}
                      className="w-full flex items-center gap-3 hover:bg-white/[0.03] transition-all rounded-lg p-1"
                    >
                      <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center border border-white/[0.08] hover:bg-white/[0.08] transition-all">
                        <Palette className="w-4 h-4 text-white/80" />
                      </div>
                      <div className="text-left">
                        <p className="text-white text-sm font-medium">Changer les couleurs des domaines</p>
                        <p className="text-white/40 text-xs">Personnaliser la couleur de chaque domaine</p>
                      </div>
                    </button>
                  </div>

                  <div className="backdrop-blur-xl bg-white/[0.01] border border-white/[0.05] rounded-xl p-4">
                    <button
                      onClick={() => setManageDomainsModalOpen(true)}
                      className="w-full flex items-center gap-3 hover:bg-white/[0.03] transition-all rounded-lg p-1"
                    >
                      <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center border border-white/[0.08] hover:bg-white/[0.08] transition-all">
                        <FolderCog className="w-4 h-4 text-white/80" />
                      </div>
                      <div className="text-left">
                        <p className="text-white text-sm font-medium">Gérer domaines & catégories</p>
                        <p className="text-white/40 text-xs">Supprimer des domaines ou catégories</p>
                      </div>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-white/30 text-center pt-2">
                  {t.autoSave}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DomainColorModal 
        open={domainColorModalOpen} 
        onOpenChange={setDomainColorModalOpen}
      />
      
      <ManageDomainsModal 
        open={manageDomainsModalOpen} 
        onOpenChange={setManageDomainsModalOpen}
      />
    </div>
  );
};

export default Parametres;
