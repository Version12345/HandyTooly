'use client';

import React, { useState, useMemo } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';

interface Generation {
  name: string;
  years: string;
  startYear: number;
  endYear: number;
  description: string;
  characteristics: string[];
  definingMoments: DefiningMoment[];
  icon: string;
  color: string;
  backgroundColor: string;
}

interface DefiningMoment {
  title: string;
  description: string;
}

export default function GenerationFinder() {
  const lastGen = generations[generations.length - 1];
  const [selectedGeneration, setSelectedGeneration] = useState<string>(lastGen.name);
  const [showResult, setShowResult] = useState(true);

  const currentGeneration = useMemo(() => {
    if (!selectedGeneration) return null;
    
    return generations.find(gen => gen.name === selectedGeneration) || null;
  }, [selectedGeneration]);

  const handleCalculate = () => {
    setShowResult(true);
  };

  const yearRangeOptions = generations.map(gen => ({
    label: `${gen.years} (${gen.name})`,
    value: gen.name,
    generation: gen
  }));

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.GenerationFinder}
      educationContent={educationContent}
    >
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Your Generation:
            </label>
            <div className="flex gap-3 items-center">
              <select
                value={selectedGeneration}
                onChange={(e) => {
                  setSelectedGeneration(e.target.value);
                  handleCalculate();
                }}
                className="flex–1 px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-blue-500"
              >
                <option value="">Choose your birth year range...</option>
                {yearRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button
                onClick={handleCalculate}
                className="px-6 py-2 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 transition-colors flex items-center gap-2"
              >
                Calculate
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {showResult && currentGeneration && (
          <div className="space-y-6">
            {/* Generation Header */}
            <div className={`rounded-lg p-8 text-white ${currentGeneration.color}`}>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{currentGeneration.icon}</span>
                <div>
                  <h2 className="font-bold" style={{ color: 'white', margin: 0, fontSize: '2rem' }}>  
                    {currentGeneration.name}
                  </h2>
                  <p className="text-xl opacity-90">({currentGeneration.years})</p>
                </div>
              </div>
              <p className="text-lg leading-relaxed opacity-95">
                {currentGeneration.description}
              </p>
            </div>

            {/* Generation Details */}
            {/* Characteristics */}
            <div className={`${currentGeneration.backgroundColor} rounded-lg p-6`}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>✨</span>
                Key Characteristics
              </h3>
              <ul style={{ marginLeft: 0, paddingLeft: 0 }}>
                {currentGeneration.characteristics.map((characteristic, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700 ml-0 pl-0">
                    <span className="text-gray-900 text-sm mt–1">●</span>
                    <span>{characteristic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Defining Moments */}
            <div className={`${currentGeneration.backgroundColor} rounded-lg p-6`}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>🎯</span>
                Defining Moments
              </h3>
              {currentGeneration.definingMoments.map((moment, index) => (
                <div key={index} className="bg-white rounded-lg p-4 my-3">
                  <div>
                    <div className="font-medium">{moment.title}</div>
                    <div className="text-sm text-gray-600">{moment.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showResult && !currentGeneration && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="text-center">
              <span className="text-4xl mb-4 block">🤔</span>
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                Generation Not Found
              </h3>
              <p className="text-yellow-700">
                Please select a generation from the dropdown to see the results.
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

const educationContent = (
  <div>
    <h3>Understanding Generational Cohorts</h3>
    <p>
      <strong>Generational Theory:</strong> Generations are defined by shared experiences, 
      major events, and cultural touchstones that shape their worldview and values. While 
      individual experiences vary, generational cohorts often share common characteristics.
    </p>
    <p>
      <strong>Birth Year Ranges:</strong> Generational boundaries are somewhat fluid and 
      different organizations may use slightly different year ranges. The dates used here 
      represent commonly accepted ranges based on major demographic and cultural shifts.
    </p>
    <p>
      <strong>Cultural Impact:</strong> Each generation experiences formative events during 
      their youth that influence their perspectives on work, technology, politics, and society. 
      Understanding these influences helps explain generational differences and similarities.
    </p>
    <p>
      <strong>Modern Generations:</strong> Recent generations have shorter spans due to the 
      rapid pace of technological and social change. Generation Alpha, born from 2013 onwards, 
      is growing up in an era of AI, climate change awareness, and global connectivity.
    </p>
  </div>
);

const generations: Generation[] = [
  {
    name: 'Lost Generation',
    years: '1883–1900',
    startYear: 1883,
    endYear: 1900,
    description: 'The Lost Generation refers to those who came of age during World War I. This term was popularized by Ernest Hemingway and Gertrude Stein, describing a generation that was "lost" both literally and figuratively by the war.',
    characteristics: [
      'Experienced World War I firsthand as soldiers or witnesses, shaping their worldview through unprecedented violence and loss',
      'Disillusionment with traditional values and social norms that seemed inadequate after the devastating reality of modern warfare',
      'Literary and artistic innovation that broke from conventional forms to express the chaos and fragmentation of modern experience',
      'Questioning of authority and institutions that had led society into such catastrophic conflict and social upheaval'
    ],
    definingMoments: [
      { 
        title: 'World War I (1914–1918)', 
        description: 'The "Great War" that devastated Europe and marked the end of old empires, causing widespread disillusionment' 
      }, { 
        title: 'The Great Depression begins (1929)', 
        description: 'Economic collapse that brought widespread unemployment and poverty worldwide' 
      }, { 
        title: 'Rise of modernist literature and art', 
        description: 'Revolutionary artistic movements that broke from traditional forms and conventions' 
      }, { 
        title: 'Spanish Flu pandemic (1918–1920)', 
        description: 'Deadly global pandemic that killed millions and changed public health approaches' 
      }, { 
        title: 'Prohibition era begins (1920)', 
        description: 'Ban on alcohol in the US that led to speakeasies, organized crime, and cultural rebellion' 
      }
    ],
    icon: '🎭',
    color: 'bg-amber-700',
    backgroundColor: 'bg-amber-50'
  },
  {
    name: 'Greatest Generation',
    years: '1901–1927',
    startYear: 1901,
    endYear: 1927,
    description: 'The Greatest Generation, also known as the G.I. Generation, lived through the Great Depression and fought in World War II. They are characterized by their strong work ethic, civic duty, and sacrifice for the common good.',
    characteristics: [
      'Strong sense of civic duty and collective responsibility, believing in sacrificing personal interests for the greater good of society',
      'Sacrificial and hardworking nature developed through overcoming economic hardship and wartime challenges with determination',
      'Belief in institutions and hierarchy as necessary structures for social order, having seen them succeed during national crises',
      'Frugal and resourceful mindset born from Depression-era scarcity, valuing thrift and making the most of available resources'
    ],
    definingMoments: [
      { 
        title: 'The Great Depression (1929–1939)', 
        description: 'Severe economic downturn that taught resilience, frugality, and the value of hard work' 
      }, { 
        title: 'World War II (1939–1945)', 
        description: 'Global conflict that united the nation and demonstrated American strength and sacrifice' 
      }, { 
        title: 'New Deal programs implementation', 
        description: 'Government programs that provided jobs and social safety nets during economic crisis' 
      }, { 
        title: 'Pearl Harbor attack (1941)', 
        description: 'Surprise attack that galvanized America into World War II and unified the country' 
      }, { 
        title: 'D-Day and victory in Europe (1944–1945)', 
        description: 'Allied invasion that marked the beginning of the end of Nazi Germany' 
      }
    ],
    icon: '🎖️',
    color: 'bg-blue-700',
    backgroundColor: 'bg-blue-50'
  },
  {
    name: 'Silent Generation',
    years: '1928–1945',
    startYear: 1928,
    endYear: 1945,
    description: 'The Silent Generation grew up during the Great Depression and World War II but were too young to participate in the war. They are known for being conformist, hard-working, and for valuing security and stability.',
    characteristics: [
      'Conformist and rule-following behavior, preferring to work within established systems rather than challenge social norms',
      'Value security and stability above risk-taking, having witnessed the chaos of war and economic uncertainty in their youth',
      'Strong work ethic and dedication to career advancement, believing that steady employment leads to prosperity and respect',
      'Respect for authority and institutions as pillars of society, trusting established hierarchies and traditional power structures'
    ],
    definingMoments: [
      { 
        title: 'Post-WWII economic boom', 
        description: 'Unprecedented prosperity and growth that created the modern American middle class' 
      }, { 
        title: 'McCarthyism and Cold War tensions', 
        description: 'Anti-communist paranoia and nuclear fears that shaped political discourse' 
      }, { 
        title: 'Korean War (1950–1953)', 
        description: '"Forgotten war" that established America as a global police force during the Cold War' 
      }, { 
        title: 'Civil Rights Movement beginnings', 
        description: 'Early stirrings of racial equality movements that challenged social norms' 
      }, { 
        title: 'Suburban expansion and prosperity', 
        description: 'Mass migration to suburbs enabled by cars, highways, and government programs' 
      }
    ],
    icon: '🤐',
    color: 'bg-gray-600',
    backgroundColor: 'bg-gray-50'
  },
  {
    name: 'Baby Boomers',
    years: '1946–1964',
    startYear: 1946,
    endYear: 1964,
    description: 'Baby Boomers are the post-World War II generation, born during the significant spike in birth rates. They experienced economic prosperity, social change, and were central to the counterculture movements of the 1960s.',
    characteristics: [
      'Optimistic and idealistic outlook on life, believing in the possibility of social progress and positive change through collective action',
      'Questioning of authority and traditional power structures, especially regarding war, civil rights, and social conventions',
      'Emphasis on personal growth and self-discovery, pursuing individual fulfillment and authentic expression over conformity',
      'Competitive and ambitious nature driving career success, shaped by economic prosperity and expanding educational opportunities'
    ],
    definingMoments: [
      { 
        title: 'JFK assassination (1963)', 
        description: 'Tragic loss of young president that shattered America\'s innocence and optimism' 
      }, { 
        title: 'Civil Rights Movement and March on Washington (1963)', 
        description: 'Pivotal moment in the fight for racial equality and social justice' 
      }, { 
        title: 'Vietnam War (1955–1975)', 
        description: 'Controversial conflict that divided the nation and fueled anti-war protests' 
      }, { 
        title: 'Woodstock and counterculture (1969)', 
        description: 'Music festival that symbolized peace, love, and rebellion against establishment' 
      }, { 
        title: 'Moon landing (1969)', 
        description: 'Historic achievement that demonstrated American technological superiority and human potential' 
      }, { 
        title: 'Watergate scandal (1974)', 
        description: 'Political corruption that eroded trust in government and authority figures' 
      }
    ],
    icon: '☮️',
    color: 'bg-purple-600',
    backgroundColor: 'bg-purple-50'
  },
  {
    name: 'Generation X',
    years: '1965–1980',
    startYear: 1965,
    endYear: 1980,
    description: 'Generation X grew up during a time of shifting societal values. They are known for their independence, skepticism, and adaptability. Often called the "latchkey generation," they experienced the rise of personal computers and MTV.',
    characteristics: [
      'Independent and self-reliant nature developed from being latchkey kids, learning to solve problems and make decisions autonomously',
      'Skeptical of institutions and large organizations, having witnessed corporate layoffs and government scandals during their formative years',
      'Entrepreneurial spirit and willingness to take calculated risks, preferring to create their own opportunities rather than rely on traditional employment',
      'Work-life balance focused approach to career, prioritizing personal time and family relationships over climbing corporate ladders'
    ],
    definingMoments: [
      { 
        title: 'MTV launch (1981)', 
        description: 'Music television that revolutionized pop culture and created the first global youth culture' 
      }, { 
        title: 'Challenger disaster (1986)', 
        description: 'Space shuttle explosion that shattered childhood innocence and technological optimism' 
      }, { 
        title: 'Fall of Berlin Wall (1989)', 
        description: 'End of Cold War that brought hope for peace but also economic uncertainty' 
      }, { 
        title: 'Personal computer revolution', 
        description: 'Rise of PCs and early internet that transformed work, communication, and daily life' 
      }, { 
        title: 'Gulf War (1991)', 
        description: 'First televised war that showcased precision technology and changed media coverage of conflicts' 
      }, { 
        title: 'Grunge music and alternative culture', 
        description: 'Seattle-based movement that rejected mainstream materialism and corporate values' 
      }
    ],
    icon: '💿',
    color: 'bg-green-600',
    backgroundColor: 'bg-green-50'
  },
  {
    name: 'Millennials',
    years: '1981–1996',
    startYear: 1981,
    endYear: 1996,
    description: 'Generation Y, commonly known as Millennials, encompasses those born between 1981 and 1996. They came of age during the rapid rise of the internet and digital technology, which fundamentally shaped their upbringing.',
    characteristics: [
      'Tech-savvy and digital natives who grew up with the internet, seamlessly integrating technology into all aspects of life and communication',
      'Value diversity and inclusion as core principles, actively promoting equality and representation across race, gender, and sexual orientation',
      'Socially conscious and activist mindset, using social media and grassroots organizing to advocate for causes they believe in',
      'Preference for experiences over possessions, prioritizing travel, education, and personal growth rather than accumulating material wealth'
    ],
    definingMoments: [
      { 
        title: 'Rise of the Internet and Social Media', 
        description: 'Digital revolution that connected the world and transformed communication forever' 
      }, { 
        title: '9/11 terrorist attacks (2001)', 
        description: 'Tragic attacks that shaped national security policies and global perspectives on terrorism' 
      }, { 
        title: 'Great Recession (2007-2009)', 
        description: 'Economic crisis that impacted job prospects and shaped financial attitudes for years' 
      }, { 
        title: 'Barack Obama presidency (2009-2017)', 
        description: 'Historic presidency that brought hope for change and progress on social issues' 
      }, { 
        title: 'Social media platforms emergence', 
        description: 'Facebook, Instagram, and Twitter transformed social interaction and self-expression' 
      }, { 
        title: 'Climate change awareness', 
        description: 'Growing recognition of environmental crisis that became a defining political and social issue' 
      }
    ],
    icon: '📱',
    color: 'bg-blue-500',
    backgroundColor: 'bg-blue-50'
  },
  {
    name: 'Generation Z',
    years: '1997–2012',
    startYear: 1997,
    endYear: 2012,
    description: 'Generation Z is the first truly digital native generation, having grown up with smartphones, social media, and instant access to information. They are known for their entrepreneurial mindset, social awareness, and pragmatic approach to life.',
    characteristics: [
      'True digital natives who have never known life without smartphones and social media, creating and consuming content as natural forms of expression',
      'Entrepreneurial and pragmatic approach to careers, starting businesses early and seeking multiple income streams rather than traditional employment',
      'Highly diverse and inclusive generation that embraces different identities and cultures as normal parts of their social landscape',
      'Socially and environmentally conscious activists who demand immediate action on climate change and social justice issues through direct engagement'
    ],
    definingMoments: [
      { 
        title: 'Smartphones and social media ubiquity', 
        description: 'Mobile technology that made internet access constant and reshaped social interaction' 
      }, { 
        title: 'Great Recession impact on families', 
        description: 'Economic downturn that affected family stability and career expectations from an early age' 
      }, { 
        title: 'School shootings and safety concerns', 
        description: 'Tragic events that normalized security measures and active shooter drills in schools' 
      }, { 
        title: 'Climate change activism', 
        description: 'Urgent environmental movement led by young activists demanding immediate action on global warming' 
      }, { 
        title: 'COVID-19 pandemic (2020-present)', 
        description: 'Global health crisis that disrupted education, social development, and future planning' 
      }, { 
        title: 'TikTok and short-form content rise', 
        description: 'Platform that revolutionized entertainment, creativity, and attention spans globally' 
      }
    ],
    icon: '🚀',
    color: 'bg-indigo-500',
    backgroundColor: 'bg-indigo-50'
  },
  {
    name: 'Generation Alpha',
    years: '2013–Present',
    startYear: 2013,
    endYear: 2025,
    description: 'Generation Alpha is the newest generation, born into a world of AI, voice assistants, and advanced technology. They are growing up with climate change as a major global issue and experiencing unprecedented technological advancement.',
    characteristics: [
      'Born into AI and smart technology environments, interacting with voice assistants and intelligent systems as naturally as previous generations used phones',
      'Highly connected and global in perspective, forming friendships and consuming content across international boundaries through digital platforms',
      'Environmentally aware from birth due to constant climate change discourse, growing up with sustainability and green technology as baseline expectations',
      'Adaptive to rapid change and technological advancement, expecting continuous innovation and updates as normal parts of daily life'
    ],
    definingMoments: [
      { 
        title: 'COVID-19 pandemic and remote learning', 
        description: 'Global crisis that normalized virtual education and digital-first childhood experiences' 
      }, { 
        title: 'Rise of AI and voice assistants', 
        description: 'Artificial intelligence integration that made smart technology a natural part of daily life' 
      }, { 
        title: 'Climate change activism intensifies', 
        description: 'Inherited environmental crisis that shapes policy discussions and future planning from birth' 
      }, { 
        title: 'Streaming services dominance', 
        description: 'On-demand entertainment that eliminated traditional TV schedules and broadcasting models' 
      }, { 
        title: 'Electric vehicles mainstream adoption', 
        description: 'Transportation revolution that normalized sustainable technology and environmental consciousness' 
      }, { 
        title: 'Virtual and augmented reality integration', 
        description: 'Immersive technologies that blur the lines between digital and physical worlds' 
      }
    ],
    icon: '🤖',
    color: 'bg-emerald-500',
    backgroundColor: 'bg-emerald-50'
  }
];
