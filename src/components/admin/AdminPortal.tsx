import React, { useState } from 'react';
import { AppState } from '../../types';
import { verifyLedgerIntegrity, exportAppStateToJson } from '../../utils/storage';
import {
  Terminal,
  ShieldAlert,
  Database,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  Upload,
  ArrowLeft,
  Lock,
  Cpu,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface AdminPortalProps {
  appState: AppState;
  onClose: () => void;
  onResetSeed: () => void;
  onImportState: (newState: AppState) => void;
  onUpdateFeatureFlags: (flags: AppState['featureFlags']) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  appState,
  onClose,
  onResetSeed,
  onImportState,
  onUpdateFeatureFlags,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<'integrity' | 'flags' | 'audit' | 'raw_db'>('integrity');
  const [selectedChildId, setSelectedChildId] = useState<string>(appState.activeChildId);
  const [jsonText, setJsonText] = useState(exportAppStateToJson(appState));
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const verification = verifyLedgerIntegrity(appState, selectedChildId);
  const targetChild =
    appState.children.find((c) => c.profile.id === selectedChildId) || appState.children[0];
  const currency = targetChild?.profile.currency || '₹';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase === 'admin2026' || passphrase === appState.adminPassphraseHash) {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleFlagToggle = (key: keyof AppState['featureFlags']) => {
    onUpdateFeatureFlags({
      ...appState.featureFlags,
      [key]: !appState.featureFlags[key],
    });
  };

  const handleDownloadBackup = () => {
    const json = exportAppStateToJson(appState);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `odyssey_system_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleApplyJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.children || !Array.isArray(parsed.children)) {
        throw new Error('Invalid schema: Missing children accounts array');
      }
      onImportState(parsed);
      setImportStatus('✅ Database successfully imported & restored!');
      setTimeout(() => setImportStatus(null), 3000);
    } catch (err: any) {
      setImportStatus(`❌ Import Error: ${err.message}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in font-mono">
        <div className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-amber-400 mb-3">
            <Terminal className="w-7 h-7" />
          </div>

          <h3 className="font-bold text-lg text-white">System Admin & Developer Console</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Separated infrastructure authentication
          </p>

          <form onSubmit={handleLogin} className="mt-5 space-y-3">
            <div>
              <input
                type="password"
                required
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Admin Passphrase (default: admin2026)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs text-center focus:outline-none focus:border-amber-400"
              />
            </div>

            {authError && (
              <p className="text-[11px] text-red-400">Invalid administrator passphrase.</p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 text-xs hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-amber-400 text-zinc-950 text-xs font-bold"
              >
                Authenticate
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in font-mono">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[92vh] text-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-base text-white">
                Developer & System Infrastructure Portal
              </h3>
              <p className="text-xs text-zinc-400">
                Ledger validation, database backups, audit logs & feature flags
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return
          </button>
        </div>

        {/* Admin Tabs */}
        <div className="flex items-center gap-1.5 py-3 border-b border-zinc-800 flex-shrink-0">
          {[
            { id: 'integrity', label: '1. Ledger Integrity Audit', icon: Database },
            { id: 'flags', label: '2. Feature Flags', icon: Cpu },
            { id: 'audit', label: `3. Audit Logs (${appState.auditLogs.length})`, icon: ShieldAlert },
            { id: 'raw_db', label: '4. Raw JSON Database', icon: Terminal },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-zinc-950 font-bold'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Panes */}
        <div className="overflow-y-auto space-y-4 pr-1 flex-1 py-3 text-xs">
          {activeTab === 'integrity' && (
            <div className="space-y-4">
              {/* Child Profile Selector for Verification */}
              {appState.children.length > 1 && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-400 font-medium">Verify Child Account:</span>
                  <select
                    value={selectedChildId}
                    onChange={(e) => setSelectedChildId(e.target.value)}
                    className="bg-zinc-950 border border-zinc-700 text-amber-400 font-bold rounded-lg px-2.5 py-1 text-xs focus:outline-none"
                  >
                    {appState.children.map((c) => (
                      <option key={c.profile.id} value={c.profile.id}>
                        {c.profile.name} ({c.profile.schoolGrade})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  verification.isValid
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-red-950/40 border-red-500/40 text-red-200'
                }`}
              >
                {verification.isValid ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {verification.isValid
                      ? `Ledger Checksum for ${verification.childName}: 100% INTACT`
                      : `Integrity Discrepancy for ${verification.childName}`}
                  </h4>
                  <p className="mt-1 text-xs opacity-90">
                    {verification.isValid
                      ? 'All historical transaction amounts sum up exactly to the stored user stats with zero deviation.'
                      : verification.mismatchReason}
                  </p>
                </div>
              </div>

              {/* Stats Breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-400 block mb-1">Real Money Validation</span>
                  <div className="flex justify-between">
                    <span>Sum of Tx:</span>
                    <span className="font-bold text-emerald-400">
                      {currency}{verification.computedMoney.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Profile Balance:</span>
                    <span className="font-bold text-white">
                      {currency}{verification.profileMoney.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-400 block mb-1">Points Validation</span>
                  <div className="flex justify-between">
                    <span>Sum of Tx:</span>
                    <span className="font-bold text-amber-400">
                      {verification.computedPoints} ⭐
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Profile Points:</span>
                    <span className="font-bold text-white">
                      {verification.profilePoints} ⭐
                    </span>
                  </div>
                </div>
              </div>

              {/* Maintenance Actions */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                  Database Seeding & Recovery
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Reset to rich 10-year demo seed dataset?')) {
                        onResetSeed();
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border border-amber-400/40 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reload 10-Year Seed Journey
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadBackup}
                    className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Full JSON Backup
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'flags' && (
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">
                System Runtime Feature Flags
              </h4>
              <div className="space-y-2">
                {[
                  {
                    key: 'audioSynthesizer' as const,
                    title: 'Web Audio API Synthesizer',
                    desc: 'Real-time synthesized chime, fanfare & ambient notes',
                  },
                  {
                    key: 'ageAdaptiveStyling' as const,
                    title: 'Age-Adaptive UI Engine',
                    desc: 'Adjusts design hierarchy based on child grade & age group',
                  },
                  {
                    key: 'patienceCalculator' as const,
                    title: 'Patience Compounding Bonus Multiplier',
                    desc: 'Calculates non-speculative patience rewards for long-term saving',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800"
                  >
                    <div>
                      <span className="font-bold text-white block">{item.title}</span>
                      <span className="text-[11px] text-zinc-400">{item.desc}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFlagToggle(item.key)}
                      className={`px-3 py-1 rounded-xl font-bold text-xs cursor-pointer ${
                        appState.featureFlags[item.key]
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {appState.featureFlags[item.key] ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-2">
              {appState.auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-amber-400 uppercase font-bold">
                        {log.actor}
                      </span>
                      <span className="font-bold text-white">{log.action}</span>
                    </div>
                    <p className="text-zinc-300 text-xs mt-1">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'raw_db' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Direct JSON Inspector & Importer</span>
                {importStatus && <span className="text-xs font-bold">{importStatus}</span>}
              </div>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                rows={12}
                className="w-full p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[11px] focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleApplyJsonImport}
                className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
              >
                Apply Raw JSON Restore
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
