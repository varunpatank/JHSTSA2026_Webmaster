'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { achievements } from '@/lib/hubData';

const categories = ['All', 'Leadership', 'Growth', 'Events', 'Community', 'Innovation', 'Competition'];
const tierOrder = { 'Legendary': 0, 'Epic': 1, 'Rare': 2, 'Uncommon': 3, 'Common': 4 };

type TierKey = keyof typeof tierOrder;

const tierColors = {
  'Legendary': 'from-amber-400 to-orange-500 border-amber-400',
  'Epic': 'from-purple-400 to-indigo-500 border-purple-400',
  'Rare': 'from-blue-400 to-cyan-500 border-blue-400',
  'Uncommon': 'from-green-300 to-teal-400 border-green-300',
  'Common': 'from-neutral-300 to-neutral-400 border-neutral-300'
};

const tierBg = {
  'Legendary': 'bg-gradient-to-br from-amber-50 to-orange-50',
  'Epic': 'bg-gradient-to-br from-purple-50 to-indigo-50',
  'Rare': 'bg-gradient-to-br from-blue-50 to-cyan-50',
  'Uncommon': 'bg-gradient-to-br from-green-50 to-teal-50',
  'Common': 'bg-neutral-50'
};

// Simulated user progress
const userProgress = {
  unlockedAchievements: ['ach-1', 'ach-3', 'ach-5', 'ach-9'],
  totalPoints: 450,
  rank: 12,
  streak: 5
};

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<typeof achievements[0] | null>(null);

  const filteredAchievements = useMemo(() => {
    return achievements
      .filter((ach) => {
        if (selectedCategory !== 'All' && ach.category !== selectedCategory) return false;
        if (showUnlockedOnly && !userProgress.unlockedAchievements.includes(ach.id)) return false;
        return true;
      })
      .sort((a, b) => tierOrder[a.rarity as TierKey] - tierOrder[b.rarity as TierKey]);
  }, [selectedCategory, showUnlockedOnly]);

  const unlockedCount = achievements.filter(a => userProgress.unlockedAchievements.includes(a.id)).length;
  const totalPoints = achievements
    .filter(a => userProgress.unlockedAchievements.includes(a.id))
    .reduce((sum, a) => sum + a.points, 0);

  // Leaderboard data (simulated)
  const leaderboard = [
    { rank: 1, name: 'Robotics Club', points: 1250, badges: 18 },
    { rank: 2, name: 'Debate Society', points: 1180, badges: 16 },
    { rank: 3, name: 'Science Olympiad', points: 1050, badges: 15 },
    { rank: 4, name: 'DECA Chapter', points: 980, badges: 14 },
    { rank: 5, name: 'Key Club', points: 920, badges: 13 },
    { rank: 6, name: 'Drama Club', points: 850, badges: 12 },
    { rank: 7, name: 'Math League', points: 780, badges: 11 },
    { rank: 8, name: 'Environmental Club', points: 720, badges: 10 },
    { rank: 9, name: 'Photography Club', points: 680, badges: 9 },
    { rank: 10, name: 'Chess Club', points: 620, badges: 8 },
  ];

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1920&q=80"
            alt="Achievements"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600/95 to-yellow-500/80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <Link href="/hub" className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-2">
            ← Back to Hub
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white">
            🏆 Achievements & Badges
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Earn badges for your club&apos;s accomplishments, compete on the leaderboard, 
            and showcase your achievements. Every milestone counts!
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#badges" className="btn-secondary">
              View Badges
            </a>
            <a href="#leaderboard" className="bg-white/20 backdrop-blur text-white px-6 py-2.5 font-semibold border-2 border-white/50 hover:bg-white hover:text-amber-600 transition-all rounded-lg">
              See Leaderboard
            </a>
          </div>
        </div>
      </section>

      {/* User Stats */}
      <section className="bg-white py-6 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-500 font-heading">{unlockedCount}/{achievements.length}</div>
              <div className="text-sm text-neutral-600">Badges Earned</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary-500 font-heading">{totalPoints}</div>
              <div className="text-sm text-neutral-600">Total Points</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 font-heading">#{userProgress.rank}</div>
              <div className="text-sm text-neutral-600">Current Rank</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary-500 font-heading">🔥 {userProgress.streak}</div>
              <div className="text-sm text-neutral-600">Week Streak</div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="py-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-neutral-700 font-heading">Progress to Next Rank</h3>
              <span className="text-sm text-neutral-500">550 points to rank up</span>
            </div>
            <div className="h-4 bg-neutral-200 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                style={{ width: `${(totalPoints / 1000) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-neutral-500">
              <span>Rank #{userProgress.rank}</span>
              <span>Rank #{userProgress.rank - 1}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Unlocks */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title mb-6">🎉 Recently Unlocked</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {achievements
              .filter(a => userProgress.unlockedAchievements.includes(a.id))
              .slice(0, 4)
              .map((ach) => (
                <div 
                  key={ach.id} 
                  className={`flex-shrink-0 w-48 p-4 border-2 ${tierBg[ach.rarity as TierKey]} ${tierColors[ach.rarity as TierKey].split(' ')[2]} cursor-pointer hover:scale-105 transition-transform`}
                  onClick={() => setSelectedAchievement(ach)}
                >
                  <div className="text-4xl text-center mb-2">{ach.icon}</div>
                  <h4 className="font-bold text-sm text-center text-neutral-700">{ach.name}</h4>
                  <div className="text-xs text-center text-neutral-500 mt-1">+{ach.points} pts</div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section id="badges" className="py-8 bg-white border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 font-semibold transition-all
                    ${selectedCategory === cat
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 ml-auto cursor-pointer">
              <input
                type="checkbox"
                checked={showUnlockedOnly}
                onChange={(e) => setShowUnlockedOnly(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">Unlocked Only</span>
            </label>
          </div>
        </div>
      </section>

      {/* All Badges */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-neutral-600 mb-6">{filteredAchievements.length} badges</p>

          {/* Grouped by rarity */}
          {(['Legendary', 'Epic', 'Rare', 'Uncommon', 'Common'] as TierKey[]).map((tier) => {
            const tierAchievements = filteredAchievements.filter(a => a.rarity === tier);
            if (tierAchievements.length === 0) return null;

            return (
              <div key={tier} className="mb-8">
                <h3 className={`text-lg font-bold font-heading mb-4 flex items-center gap-2
                  ${tier === 'Legendary' ? 'text-amber-600' : 
                    tier === 'Epic' ? 'text-purple-600' : 
                    tier === 'Rare' ? 'text-blue-600' : 
                    tier === 'Uncommon' ? 'text-green-600' : 'text-neutral-600'}`}>
                  {tier === 'Legendary' && '✨'} 
                  {tier === 'Epic' && '💎'} 
                  {tier === 'Rare' && '💠'} 
                  {tier === 'Uncommon' && '◆'} 
                  {tier === 'Common' && '○'} 
                  {tier} ({tierAchievements.length})
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {tierAchievements.map((ach) => {
                    const isUnlocked = userProgress.unlockedAchievements.includes(ach.id);

                    return (
                      <div
                        key={ach.id}
                        onClick={() => setSelectedAchievement(ach)}
                        className={`relative p-4 border-2 cursor-pointer transition-all hover:scale-105 ${
                          isUnlocked 
                            ? `${tierBg[tier]} ${tierColors[tier].split(' ')[2]}` 
                            : 'bg-neutral-100 border-neutral-200 opacity-60'
                        }`}
                      >
                        {!isUnlocked && (
                          <div className="absolute top-2 right-2 text-lg">🔒</div>
                        )}
                        <div className={`text-4xl text-center mb-2 ${!isUnlocked && 'grayscale'}`}>
                          {ach.icon}
                        </div>
                        <h4 className="font-bold text-sm text-center text-neutral-700 line-clamp-1">
                          {ach.name}
                        </h4>
                        <div className="text-xs text-center text-neutral-500 mt-1">
                          {ach.points} pts
                        </div>
                        {isUnlocked && (
                          <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1">
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Leaderboard */}
      <section id="leaderboard" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title mb-8">🏅 Club Leaderboard</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Top 3 */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* 2nd Place */}
                <div className="pt-8">
                  <div className="card p-4 text-center bg-gradient-to-b from-neutral-100 to-white border-neutral-300">
                    <div className="text-3xl mb-2">🥈</div>
                    <div className="font-bold text-neutral-700">{leaderboard[1].name}</div>
                    <div className="text-2xl font-bold text-primary-500 font-heading">{leaderboard[1].points}</div>
                    <div className="text-xs text-neutral-500">{leaderboard[1].badges} badges</div>
                  </div>
                </div>

                {/* 1st Place */}
                <div>
                  <div className="card p-4 text-center bg-gradient-to-b from-amber-100 to-white border-amber-300 border-2">
                    <div className="text-4xl mb-2">🥇</div>
                    <div className="font-bold text-neutral-700">{leaderboard[0].name}</div>
                    <div className="text-3xl font-bold text-secondary-500 font-heading">{leaderboard[0].points}</div>
                    <div className="text-xs text-neutral-500">{leaderboard[0].badges} badges</div>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="pt-12">
                  <div className="card p-4 text-center bg-gradient-to-b from-amber-50 to-white border-amber-200">
                    <div className="text-2xl mb-2">🥉</div>
                    <div className="font-bold text-neutral-700 text-sm">{leaderboard[2].name}</div>
                    <div className="text-xl font-bold text-primary-500 font-heading">{leaderboard[2].points}</div>
                    <div className="text-xs text-neutral-500">{leaderboard[2].badges} badges</div>
                  </div>
                </div>
              </div>

              {/* Rest of leaderboard */}
              <div className="card">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-600">Rank</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-600">Club</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-neutral-600">Points</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-neutral-600">Badges</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.slice(3).map((entry) => (
                      <tr key={entry.rank} className="border-t border-neutral-100 hover:bg-neutral-50">
                        <td className="px-4 py-3 font-semibold text-neutral-500">#{entry.rank}</td>
                        <td className="px-4 py-3 font-medium text-neutral-700">{entry.name}</td>
                        <td className="px-4 py-3 text-right font-bold text-primary-500">{entry.points}</td>
                        <td className="px-4 py-3 text-right text-neutral-500">{entry.badges}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Your Position */}
            <div>
              <div className="card p-6 bg-gradient-to-br from-primary-50 to-white sticky top-4">
                <h3 className="font-bold text-neutral-700 font-heading mb-4">Your Club&apos;s Position</h3>
                <div className="text-center py-6">
                  <div className="text-5xl font-bold text-primary-500 font-heading">#{userProgress.rank}</div>
                  <div className="text-neutral-500 mt-2">Current Rank</div>
                </div>
                <div className="space-y-3 border-t border-neutral-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Total Points</span>
                    <span className="font-bold text-primary-500">{totalPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Badges Earned</span>
                    <span className="font-bold text-primary-500">{unlockedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Points to #11</span>
                    <span className="font-bold text-green-600">+170</span>
                  </div>
                </div>
                <Link href="/hub/health" className="btn-primary w-full mt-6 text-center block">
                  Improve Your Score
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white max-w-md w-full p-8 ${tierBg[selectedAchievement.rarity as TierKey]}`}>
            <div className="flex items-center justify-between mb-6">
              <span className={`px-3 py-1 text-sm font-bold ${
                selectedAchievement.rarity === 'Legendary' ? 'bg-amber-500 text-white' :
                selectedAchievement.rarity === 'Epic' ? 'bg-purple-500 text-white' :
                selectedAchievement.rarity === 'Rare' ? 'bg-blue-500 text-white' :
                selectedAchievement.rarity === 'Uncommon' ? 'bg-green-500 text-white' :
                'bg-neutral-400 text-white'
              }`}>
                {selectedAchievement.rarity}
              </span>
              <button 
                onClick={() => setSelectedAchievement(null)}
                className="text-neutral-500 hover:text-neutral-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="text-center mb-6">
              <div className={`text-6xl mb-4 ${!userProgress.unlockedAchievements.includes(selectedAchievement.id) && 'grayscale'}`}>
                {selectedAchievement.icon}
              </div>
              <h2 className="text-2xl font-bold text-primary-500 font-heading">{selectedAchievement.name}</h2>
              <p className="text-neutral-600 mt-2">{selectedAchievement.description}</p>
            </div>

            <div className="bg-white/80 p-4 mb-6">
              <h4 className="font-semibold text-neutral-700 mb-2">How to Earn</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                {selectedAchievement.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary-500">•</span> {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-2xl font-bold text-secondary-500 font-heading">{selectedAchievement.points}</span>
                <span className="text-neutral-500 ml-1">points</span>
              </div>
              <span className={`px-3 py-1 text-sm font-semibold ${
                userProgress.unlockedAchievements.includes(selectedAchievement.id)
                  ? 'bg-green-100 text-green-700'
                  : 'bg-neutral-100 text-neutral-500'
              }`}>
                {userProgress.unlockedAchievements.includes(selectedAchievement.id) ? '✓ Unlocked' : '🔒 Locked'}
              </span>
            </div>

            <button 
              onClick={() => setSelectedAchievement(null)}
              className="btn-primary w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
