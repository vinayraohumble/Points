import React, { useState } from 'react';
import { Transaction, ChildProfile } from '../../types';
import { exportTransactionsToCsv, exportAppStateToJson } from '../../utils/storage';
import { Search, Download, FileSpreadsheet, AlertCircle, ArrowUpRight, ArrowDownRight, Heart } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ParentLedgerProps {
  profile: ChildProfile;
  transactions: Transaction[];
  onAddCorrection: (
    type: 'points' | 'money',
    amount: number,
    direction: 'add' | 'remove',
    reason: string
  ) => void;
}

export const ParentLedger: React.FC<ParentLedgerProps> = ({
  profile,
  transactions,
  onAddCorrection,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'money' | 'points'>('all');
  const [dirFilter, setDirFilter] = useState<'all' | 'add' | 'remove'>('all');
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);

  // Correction form state
  const [corType, setCorType] = useState<'points' | 'money'>('money');
  const [corDir, setCorDir] = useState<'add' | 'remove'>('remove');
  const [corAmount, setCorAmount] = useState('100');
  const [corReason, setCorReason] = useState('Ledger correction for duplicate deposit');

  const filtered = transactions.filter((tx) => {
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
    if (dirFilter !== 'all' && tx.direction !== dirFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchCat = (tx.category || '').toLowerCase().includes(q);
      const matchReason = (tx.reason || '').toLowerCase().includes(q);
      const matchMemory = (tx.memoryNote || '').toLowerCase().includes(q);
      if (!matchCat && !matchReason && !matchMemory) return false;
    }
    return true;
  });

  const handleDownloadCsv = () => {
    sound.playTap(profile.preferences.soundEnabled);
    const csv = exportTransactionsToCsv(transactions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${profile.name}_odyssey_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExecuteCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(corAmount) || 0;
    if (amt <= 0) return;
    onAddCorrection(corType, amt, corDir, corReason);
    setShowCorrectionModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Actions Bar */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entries, memories, or reasons..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-semibold focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="money">Real Money (🪙)</option>
            <option value="points">Adventure Points (⭐)</option>
          </select>

          <select
            value={dirFilter}
            onChange={(e) => setDirFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-semibold focus:outline-none"
          >
            <option value="all">All Directions</option>
            <option value="add">Added (+)</option>
            <option value="remove">Removed (−)</option>
          </select>

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors cursor-pointer"
            title="Download CSV Ledger"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCorrectionModal(true)}
            className="px-3 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
          >
            Correcting Entry
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto rounded-3xl bg-slate-900/80 border border-white/10 shadow-lg">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-slate-950/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
              <th className="py-3 px-4">Date / Time</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Category & Reason</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Balance Run</th>
              <th className="py-3 px-4">Actor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No matching ledger transactions found.
                </td>
              </tr>
            ) : (
              filtered.map((tx) => {
                const date = new Date(tx.timestamp);
                const isMoney = tx.type === 'money';
                const isAdd = tx.direction === 'add';

                return (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                      {date.toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      <span className="text-[10px] text-slate-400 block">
                        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          isMoney
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {isMoney ? '🪙 Money' : '⭐ Points'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{tx.category}</div>
                      <div className="text-slate-300 line-clamp-1">{tx.reason}</div>
                      {tx.memoryNote && (
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-200/90 italic">
                          <Heart className="w-3 h-3 text-pink-400 flex-shrink-0" />
                          <span>“{tx.memoryNote}”</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono tabular-nums">
                      <span
                        className={`font-extrabold text-sm ${
                          isAdd ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isAdd ? '+' : '−'}
                        {isMoney ? `${profile.currency}${tx.amount}` : `${tx.amount} ⭐`}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-300 tabular-nums">
                      {isMoney
                        ? `${profile.currency}${tx.newBalance.toLocaleString()}`
                        : `${tx.newBalance} ⭐`}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 capitalize">
                      {tx.performedBy}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Correcting Entry Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl">
            <h3 className="font-display font-extrabold text-lg text-white mb-2">
              Create Audited Correcting Transaction
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              To protect 10-year ledger integrity, errors are rectified via an explicit correction
              entry rather than destroying history.
            </p>

            <form onSubmit={handleExecuteCorrection} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Type</label>
                  <select
                    value={corType}
                    onChange={(e) => setCorType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-bold"
                  >
                    <option value="money">Real Money (🪙)</option>
                    <option value="points">Adventure Points (⭐)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Direction</label>
                  <select
                    value={corDir}
                    onChange={(e) => setCorDir(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-bold"
                  >
                    <option value="remove">Deduct / Reverse (−)</option>
                    <option value="add">Credit / Add (+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Amount</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={corAmount}
                  onChange={(e) => setCorAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-sm font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  Correction Reason / Audit Memo
                </label>
                <input
                  type="text"
                  required
                  value={corReason}
                  onChange={(e) => setCorReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold shadow"
                >
                  Record Correction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
