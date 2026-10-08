import React, { useState } from 'react';
import { Reward, ChildProfile } from '../../types';
import { X, Plus, Check, Trash2, Clock, Gift, Sparkles } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ManageRewardsModalProps {
  profile: ChildProfile;
  rewards: Reward[];
  onApproveRedeem: (rewardId: string) => void;
  onDeclineRedeem: (rewardId: string) => void;
  onAddReward: (reward: Omit<Reward, 'id' | 'status'>) => void;
  onDeleteReward: (rewardId: string) => void;
  onClose: () => void;
}

export const ManageRewardsModal: React.FC<ManageRewardsModalProps> = ({
  profile,
  rewards,
  onApproveRedeem,
  onDeclineRedeem,
  onAddReward,
  onDeleteReward,
  onClose,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pointsCost, setPointsCost] = useState('500');
  const [moneyCost, setMoneyCost] = useState('');
  const [icon, setIcon] = useState('🎁');
  const [category, setCategory] = useState('Experience');

  const pendingRequests = rewards.filter((r) => r.status === 'requested');

  const emojiPresets = ['🎁', '📚', '🎨', '🍦', '🎮', '🚲', '🔭', '🚀', '⚽', '🍕', '🎪', '🧸'];

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    const pts = parseInt(pointsCost, 10) || 100;
    const money = moneyCost ? parseFloat(moneyCost) : undefined;
    onAddReward({
      title,
      description,
      pointsCost: pts,
      moneyCost: money,
      icon,
      category,
      requiresParentApproval: true,
    });
    sound.playStarSparkle(profile.preferences.soundEnabled);
    setIsAdding(false);
    setTitle('');
    setDescription('');
    setPointsCost('500');
    setMoneyCost('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-xl text-pink-300">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-white">
                Reward Chest Manager
              </h3>
              <p className="text-xs text-slate-300">
                Create and approve real-world goals for {profile.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pending Requests Alert */}
        {pendingRequests.length > 0 && (
          <div className="mt-3 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-400/40 flex-shrink-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 mb-2">
              <Clock className="w-3.5 h-3.5 animate-spin" /> Pending Redemption Approvals ({pendingRequests.length})
            </h4>
            <div className="space-y-2">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{req.icon}</span>
                    <div>
                      <span className="text-xs font-bold text-white block">{req.title}</span>
                      <span className="text-[11px] text-amber-300 font-semibold">
                        Cost: {req.pointsCost} ⭐
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onDeclineRedeem(req.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => onApproveRedeem(req.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Section Scrollable */}
        <div className="overflow-y-auto space-y-4 pr-1 flex-1 py-3">
          {isAdding ? (
            <form onSubmit={handleCreateReward} className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                New Reward Goal
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Science Planetarium Night"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Books, Experience, Toy"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Special outing to look at celestial constellations..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Points Cost (⭐)</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={pointsCost}
                    onChange={(e) => setPointsCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Real Money Cost ({profile.currency}) - Optional</label>
                  <input
                    type="number"
                    min="0"
                    value={moneyCost}
                    onChange={(e) => setMoneyCost(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Pick Icon</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {emojiPresets.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setIcon(em)}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg cursor-pointer transition-transform ${
                        icon === em
                          ? 'bg-amber-400/20 border-amber-400 ring-2 ring-amber-400/40 scale-110'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold shadow"
                >
                  Save Reward
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-dashed border-white/20 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" /> Add New Custom Reward
            </button>
          )}

          {/* List of Existing Rewards */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Rewards ({rewards.length})
            </h4>

            {rewards.map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl flex-shrink-0">
                    {r.icon}
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-sm text-white">{r.title}</h5>
                    <div className="flex items-center gap-2 text-xs mt-0.5">
                      <span className="font-extrabold text-amber-300">{r.pointsCost} ⭐</span>
                      {r.moneyCost && (
                        <span className="text-emerald-400 font-semibold">
                          · {profile.currency}{r.moneyCost}
                        </span>
                      )}
                      <span className="text-slate-400">· {r.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      r.status === 'redeemed'
                        ? 'bg-slate-800 text-slate-400'
                        : r.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : r.status === 'requested'
                        ? 'bg-amber-400/20 text-amber-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {r.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteReward(r.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete Reward"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
