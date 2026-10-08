import React, { useState } from 'react';
import { ChildAvatar } from '../../types';
import { PRESET_CHILD_PORTRAITS } from '../../utils/constants';

interface AvatarRendererProps {
  avatar: ChildAvatar;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCompanion?: boolean;
  className?: string;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  avatar,
  size = 'md',
  showCompanion = true,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    sm: { box: 'w-10 h-10', petSize: 'text-sm -bottom-1 -right-1', hatSize: 'scale-75 -top-2' },
    md: { box: 'w-16 h-16', petSize: 'text-xl -bottom-1 -right-1', hatSize: 'scale-90 -top-3' },
    lg: { box: 'w-24 h-24', petSize: 'text-2xl -bottom-2 -right-2', hatSize: 'scale-100 -top-4' },
    xl: { box: 'w-32 h-32', petSize: 'text-3xl -bottom-2 -right-2', hatSize: 'scale-125 -top-5' },
  };

  const comp = sizeMap[size];

  // Companion emoji mapping
  const companionEmoji: Record<string, string> = {
    robot: '🤖',
    dragon: '🐲',
    panda: '🐼',
    dog: '🐶',
    cat: '🐱',
    fox: '🦊',
  };

  // Accessory emoji mapping
  const accessoryEmoji: Record<string, string> = {
    explorer_hat: '🤠',
    goggles: '🥽',
    cape: '🦸',
    headphones: '🎧',
    crown: '👑',
    none: '',
  };

  // Determine photo URL if in photo mode
  let photoSrc: string | null = null;
  if (!imgError) {
    if (avatar.photoType === 'custom' && avatar.customPhotoUrl) {
      photoSrc = avatar.customPhotoUrl;
    } else if (avatar.photoType === 'portrait_girl') {
      photoSrc = PRESET_CHILD_PORTRAITS.portrait_girl;
    } else if (avatar.photoType === 'portrait_boy') {
      photoSrc = PRESET_CHILD_PORTRAITS.portrait_boy;
    } else if (avatar.customPhotoUrl && avatar.photoType !== 'avatar') {
      photoSrc = avatar.customPhotoUrl;
    }
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${comp.box} ${className}`}>
      {/* Background circular avatar frame */}
      <div
        className="w-full h-full rounded-full border-2 border-amber-300/40 shadow-inner overflow-hidden flex items-center justify-center transition-transform hover:scale-105 duration-200 bg-slate-900"
        style={{
          background: !photoSrc
            ? `radial-gradient(circle at 35% 35%, #FFFFFF 0%, ${avatar.outfitColor}44 70%, ${avatar.outfitColor} 100%)`
            : undefined,
        }}
      >
        {photoSrc ? (
          <img
            src={photoSrc}
            alt="Child Explorer"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Body / Outfit */}
            <path
              d="M25 90 C25 65 75 65 75 90 Z"
              fill={avatar.outfitColor}
            />
            {/* Collar detail */}
            <path
              d="M42 66 L50 74 L58 66 Z"
              fill="#FFFFFF"
              opacity="0.85"
            />

            {/* Neck */}
            <rect x="44" y="52" width="12" height="15" rx="3" fill={avatar.skinTone} />

            {/* Head */}
            <circle cx="50" cy="40" r="22" fill={avatar.skinTone} />

            {/* Cheeks blush */}
            <circle cx="37" cy="45" r="4" fill="#F43F5E" opacity="0.3" />
            <circle cx="63" cy="45" r="4" fill="#F43F5E" opacity="0.3" />

            {/* Eyes */}
            <ellipse cx="42" cy="38" rx="3" ry="4" fill="#1E293B" />
            <circle cx="41" cy="37" r="1" fill="#FFFFFF" />
            <ellipse cx="58" cy="38" rx="3" ry="4" fill="#1E293B" />
            <circle cx="57" cy="37" r="1" fill="#FFFFFF" />

            {/* Smile */}
            <path
              d="M44 46 Q50 52 56 46"
              stroke="#1E293B"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Hair styles */}
            {avatar.hairStyle === 'twin_braids' ? (
              <g fill={avatar.hairColor}>
                <path d="M28 35 C28 20 72 20 72 35 C72 27 50 22 28 35 Z" />
                <circle cx="27" cy="46" r="5" />
                <circle cx="26" cy="54" r="4.5" />
                <circle cx="25" cy="61" r="3.5" />
                <circle cx="73" cy="46" r="5" />
                <circle cx="74" cy="54" r="4.5" />
                <circle cx="75" cy="61" r="3.5" />
              </g>
            ) : avatar.hairStyle === 'ponytail' ? (
              <g fill={avatar.hairColor}>
                <path d="M28 35 C28 18 72 18 72 35 C72 25 50 20 28 35 Z" />
                <path d="M68 28 C78 20 84 32 75 42 C72 36 68 32 68 28 Z" />
              </g>
            ) : avatar.hairStyle === 'curls' ? (
              <g fill={avatar.hairColor}>
                <circle cx="34" cy="24" r="9" />
                <circle cx="48" cy="20" r="10" />
                <circle cx="64" cy="24" r="9" />
                <circle cx="28" cy="34" r="8" />
                <circle cx="72" cy="34" r="8" />
              </g>
            ) : (
              <path
                d="M28 35 C30 18 42 16 50 17 C58 15 70 20 72 35 C68 28 55 24 50 26 C45 24 34 28 28 35 Z"
                fill={avatar.hairColor}
              />
            )}
          </svg>
        )}
      </div>

      {/* Accessory overlay (when in avatar mode or with hats) */}
      {!photoSrc && avatar.accessory !== 'none' && (
        <span
          className={`absolute pointer-events-none transform ${comp.hatSize}`}
          title={avatar.accessory}
        >
          {accessoryEmoji[avatar.accessory]}
        </span>
      )}

      {/* Companion pet badge in bottom right corner */}
      {showCompanion && avatar.companion && (
        <span
          className={`absolute ${comp.petSize} bg-white/90 dark:bg-slate-800/90 rounded-full shadow-md border border-amber-300/60 p-0.5 flex items-center justify-center transform transition-transform hover:scale-125`}
          title={`Companion: ${avatar.companion}`}
        >
          {companionEmoji[avatar.companion] || '✨'}
        </span>
      )}
    </div>
  );
};
