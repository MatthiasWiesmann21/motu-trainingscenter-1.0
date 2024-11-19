"use client";

import { useState } from 'react';

interface TabSwitcherProps {
  memberId: string;
}

const TabSwitcher = ({
  memberId
}: TabSwitcherProps) => {
  const [activeTab, setActiveTab] = useState('Boxen');

  return (
    <div className="w-full max-w-4xl mx-auto mt-10">
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 ${
            activeTab === 'Boxen' ? 'border-b-2 border-[#c21e2a] text-[#c21e2a]' : ''
          }`}
          onClick={() => setActiveTab('Boxen')}
        >
          Boxen
        </button>
        <button
          className={`ml-2 px-4 py-2 ${
            activeTab === 'Kickboxen' ? 'border-b-2 border-[#c21e2a] text-[#c21e2a]' : ''
          }`}
          onClick={() => setActiveTab('Kickboxen')}
        >
          Kickboxen
        </button>
        <button
          className={`ml-2 px-4 py-2 ${
            activeTab === 'BJJ' ? 'border-b-2 border-[#c21e2a] text-[#c21e2a]' : ''
          }`}
          onClick={() => setActiveTab('BJJ')}
        >
          BJJ
        </button>
        <button
          className={`ml-2 px-4 py-2 ${
            activeTab === 'MMA' ? 'border-b-2 border-[#c21e2a] text-[#c21e2a]' : ''
          }`}
          onClick={() => setActiveTab('MMA')}
        >
          MMA
        </button>
      </div>
      <div className="mt-4">
        {activeTab === 'Boxen' && <BoxenContent />}
        {activeTab === 'Kickboxen' && <KickboxenContent />}
        {activeTab === 'BJJ' && <BJJContent />}
        {activeTab === 'MMA' && <MMAContent />}
      </div>
    </div>
  );
};

const BoxenContent = () => (
  <div className='m-4'>
    <div className="dark:bg-[#0d071a] shadow rounded-lg p-6">
      <h2 className="text-lg font-medium">Teilgenommene Stunden</h2>
      <div className="mt-4 text-4xl">90</div>
    </div>
    <div className="dark:bg-[#0d071a] shadow rounded-lg p-6 mt-6">
      <h2 className="text-lg font-medium">Anzahl abgeschlossene Techniken</h2>
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div>Basics: 15</div>
        <div>Positioning: 20</div>
        <div>Angriff: 32</div>
        <div>Verteidigung: 23</div>
      </div>
    </div>
    <div className="dark:bg-[#0d071a] shadow rounded-lg p-6 mt-6">
      <h2 className="text-lg font-medium">Fehlend Techniken bis zum Aufstieg</h2>
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div>Basics: 5</div>
        <div>Positioning: 2</div>
        <div>Angriff: 3</div>
        <div>Verteidigung: 3</div>
      </div>
    </div>
  </div>
);

const KickboxenContent = () => (
    <div className='m-4'>
    <div className="dark:bg-[#0d071a] shadow rounded-lg p-6">
      <h2 className="text-lg font-medium">Teilgenommene Stunden</h2>
      <div className="mt-4 text-4xl">101</div>
    </div>
    <div className="dark:bg-[#0d071a] shadow rounded-lg p-6 mt-6">
      <h2 className="text-lg font-medium">Anzahl abgeschlossene Techniken</h2>
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div>Basics: 13</div>
        <div>Positioning: 23</div>
        <div>Angriff: 52</div>
        <div>Verteidigung: 13</div>
      </div>
    </div>
    <div className="dark:bg-[#0d071a] shadow rounded-lg p-6 mt-6">
      <h2 className="text-lg font-medium">Fehlend Techniken bis zum Aufstieg</h2>
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div>Basics: 22</div>
        <div>Positioning: 12</div>
        <div>Angriff: 31</div>
        <div>Verteidigung: 53</div>
      </div>
    </div>
  </div>
);

const BJJContent = () => (
    <div className='m-4'>
    <div className="dark:bg-[#0d071a] shadow rounded-lg p-6">
      <h2 className="text-lg font-medium">Teilgenommene Stunden</h2>
      <div className="mt-4 text-4xl">145</div>
    </div>
    <div className="dark:bg-[#0d071a] shadow rounded-lg p-6 mt-6">
      <h2 className="text-lg font-medium">Anzahl abgeschlossene Techniken</h2>
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div>Basics: 52</div>
        <div>Positioning: 27</div>
        <div>Angriff: 39</div>
        <div>Verteidigung: 27</div>
      </div>
    </div>
    <div className="dark:bg-[#0d071a] shadow rounded-lg p-6 mt-6">
      <h2 className="text-lg font-medium">Fehlend Techniken bis zum Aufstieg</h2>
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div>Basics: 22</div>
        <div>Positioning: 32</div>
        <div>Angriff: 12</div>
        <div>Verteidigung: 61</div>
      </div>
    </div>
  </div>
  );


const MMAContent = () => (
    <div className='m-4'>
    <div className="dark:bg-[#0d071a] shadow rounded-lg p-6">
      <h2 className="text-lg font-medium">Teilgenommene Stunden</h2>
      <div className="mt-4 text-4xl">133</div>
    </div>
    <div className="dark:bg-[#0d071a] shadow rounded-lg p-6 mt-6">
      <h2 className="text-lg font-medium">Anzahl abgeschlossene Techniken</h2>
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div>Basics: 25</div>
        <div>Positioning: 33</div>
        <div>Angriff: 32</div>
        <div>Verteidigung: 43</div>
      </div>
    </div>
    <div className="dark:bg-[#0d071a] shadow rounded-lg p-6 mt-6">
      <h2 className="text-lg font-medium">Fehlend Techniken bis zum Aufstieg</h2>
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div>Basics: 15</div>
        <div>Positioning: 12</div>
        <div>Angriff: 13</div>
        <div>Verteidigung: 23</div>
      </div>
    </div>
  </div>
  );

export default TabSwitcher;
