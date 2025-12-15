'use client';

import React, { useState, useEffect } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';

import '../../../styles/snowflakes.scss';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function ChristmasCountdown() {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isChristmas, setIsChristmas] = useState(false);
  const [isChristmasEve, setIsChristmasEve] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      
      // Christmas date for this year
      let christmas = new Date(currentYear, 11, 25); // December 25
      
      // If Christmas has passed this year, calculate for next year
      if (now > christmas) {
        christmas = new Date(currentYear + 1, 11, 25);
      }
      
      const timeDiff = christmas.getTime() - now.getTime();
      
      // Check if it's Christmas Day (December 25)
      const isToday = now.getDate() === 25 && now.getMonth() === 11;
      setIsChristmas(isToday);
      
      // Check if it's Christmas Eve (December 24)
      const isEve = now.getDate() === 24 && now.getMonth() === 11;
      setIsChristmasEve(isEve);
      
      if (isToday) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  const getChristmasEmoji = (): string => {
    if (isChristmas) return '🎄';
    if (isChristmasEve) return '🎅';
    if (timeRemaining.days <= 7) return '🎁';
    if (timeRemaining.days <= 30) return '❄️';
    return '🎄';
  };

  const getTitle = (): string => {
    if (isChristmas) return 'Merry Christmas! 🎄✨';
    if (isChristmasEve) return 'Christmas Eve! 🎅🌟';
    return 'Days Until Christmas';
  };

  const getSubtitle = (): string => {
    if (isChristmas) return 'Hope your day is filled with love, joy, and magical moments!';
    if (isChristmasEve) return 'Santa is on his way! 🛷';
    if (timeRemaining.days === 1) return 'Tomorrow is Christmas! 🎉';
    if (timeRemaining.days <= 7) return 'Christmas is almost here! 🎊';
    return 'The most wonderful time of the year is coming!';
  };

  if (!mounted) {
    return (
      <ToolLayout toolCategory={ToolNameLists.ChristmasCountdown}>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.ChristmasCountdown}
      educationContent={educationContent}
    >
      <div className={`relative min-h-96 p-6 rounded-md ${isChristmas ? 'overflow-hidden bg-red-100' : 'bg-white'}`}>
        {/* Christmas Lights Effect */}
        {isChristmas && (
          <>
            <div className="absolute top-0 left-0 right-0 bottom-0">
              <div className="snow">
                <div>
                  <div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-red-100">
              <div className="absolute top-10 left-0 right-0 h-4 z-20">
                <div className="flex justify-around items-center h-full">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full animate-pulse ${
                        i % 4 === 0 ? 'bg-red-500' :
                        i % 4 === 1 ? 'bg-green-500' :
                        i % 4 === 2 ? 'bg-sky-500' :
                        'bg-yellow-500'
                      }`}
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '1.5s',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <div className={`text-center space-y-8 ${isChristmas ? 'relative z-30' : ''}`}>
          {/* Header */}
          <div className="space-y-4">
            <div className="text-6xl mt-6">{getChristmasEmoji()}</div>
            <h1 className={`text-4xl md:text-5xl font-bold ${
              isChristmas 
                ? 'bg-gradient-to-r from-red-600 via-green-600 to-red-600 bg-clip-text text-transparent animate-pulse' 
                : 'text-gray-800'
            }`}>
              {getTitle()}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getSubtitle()}
            </p>
          </div>

          {/* Countdown Display */}
          {!isChristmas && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-red-100 rounded-lg p-6">
                <div className="text-4xl md:text-5xl font-bold text-red-700 mb-2">
                  {formatNumber(timeRemaining.days)}
                </div>
                <div className="text-red-800 font-medium text-lg">
                  {timeRemaining.days === 1 ? 'Day' : 'Days'}
                </div>
              </div>
              
              <div className="bg-green-100 rounded-lg p-6">
                <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                  {formatNumber(timeRemaining.hours)}
                </div>
                <div className="text-green-800 font-medium text-lg">
                  {timeRemaining.hours === 1 ? 'Hour' : 'Hours'}
                </div>
              </div>
              
              <div className="bg-sky-100 rounded-lg p-6">
                <div className="text-4xl md:text-5xl font-bold text-sky-600 mb-2">
                  {formatNumber(timeRemaining.minutes)}
                </div>
                <div className="text-sky-800 font-medium text-lg">
                  {timeRemaining.minutes === 1 ? 'Minute' : 'Minutes'}
                </div>
              </div>
              
              <div className="bg-yellow-100 rounded-lg p-6">
                <div className="text-4xl md:text-5xl font-bold text-yellow-600 mb-2">
                  {formatNumber(timeRemaining.seconds)}
                </div>
                <div className="text-yellow-800 font-medium text-lg">
                  {timeRemaining.seconds === 1 ? 'Second' : 'Seconds'}
                </div>
              </div>
            </div>
          )}

          {/* Christmas Day Special Message */}
          {isChristmas && (
            <div className="space-y-6">
              <div className="p-8 max-w-3xl mx-auto">
                <div className="text-6xl mb-4">🎅🎁🎄</div>
                <h2 className="text-3xl font-bold text-green-700 mb-4">
                  Christmas is Here! ✨
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  May your Christmas be filled with the warmth of family, the joy of friends, 
                  and the love of those dear to you. Wishing you peace, happiness, and all 
                  the magic this wonderful day brings! 🌟
                </p>
              </div>
              
              {/* Christmas Activities */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-6">
                <div className="bg-white p-6 rounded-lg">
                  <div className="text-3xl mb-3">🎁</div>
                  <h3 className="font-bold text-red-700 mb-2">Gift Time</h3>
                  <p className="text-red-600 text-sm">Time to unwrap those presents!</p>
                </div>
                <div className="bg-green-100 p-6 rounded-lg">
                  <div className="text-3xl mb-3">🍪</div>
                  <h3 className="font-bold text-green-700 mb-2">Christmas Feast</h3>
                  <p className="text-green-600 text-sm">Enjoy delicious holiday meals!</p>
                </div>
                <div className="bg-sky-100 p-6 rounded-lg">
                  <div className="text-3xl mb-3">👨‍👩‍👧‍👦</div>
                  <h3 className="font-bold text-sky-700 mb-2">Family Time</h3>
                  <p className="text-sky-600 text-sm">Cherish moments with loved ones!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

const educationContent = (
  <>
    {/* Fun Facts */}
    <div>
      <h3>Christmas Fun Facts</h3>
      <ul className="mb-4">
        <li>Christmas is celebrated on December 25th in most countries</li>
        <li>The first Christmas tree was decorated in Germany in the 1500s</li>
        <li>Santa&apos;s red suit was popularized by Coca-Cola advertisements</li>
        <li>&ldquo;Jingle Bells&rdquo; was originally written for Thanksgiving</li>
        <li>Christmas trees typically take 7&ndash;10 years to mature</li>
      </ul>
    </div>

    {/* Share the Joy */}
    <div>
      <h3>Spread the Christmas Spirit</h3>
      <p>
        Share this countdown with friends and family to build excitement for the most magical day of the year!
      </p>
      <p className="text-2xl">🎅 🎁 🎄 ⭐ 🔔</p>
    </div>
  </>
);