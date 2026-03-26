import { useState } from 'react';

interface ScoreMapping {
  value: string;
  hours: string;
}

const defaultMappings: ScoreMapping[] = [
  { value: '0', hours: '0h' },
  { value: '1', hours: '2h' },
  { value: '2', hours: '4h' },
  { value: '3', hours: '6h' },
  { value: '5', hours: '8h' },
  { value: '8', hours: '12h' },
  { value: '13', hours: '1d' },
  { value: '21', hours: '2d' },
  { value: '34', hours: '3d' },
  { value: '55', hours: '5d' },
  { value: '89', hours: '1w' },
];

export default function ScoreTimePanel() {
  const [mappings, setMappings] = useState<ScoreMapping[]>(defaultMappings);

  const handleHoursChange = (index: number, newHours: string) => {
    const updated = [...mappings];
    updated[index] = { ...updated[index], hours: newHours };
    setMappings(updated);
  };

  return (
    <div className="w-20 sm:w-28 lg:w-36 h-full flex flex-col">
      <div className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mb-1 px-1">
        Legenda
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent px-1">
        <div className="space-y-0.5">
          {mappings.map((mapping, index) => (
            <div key={mapping.value} className="flex items-center gap-1 text-[10px] sm:text-xs">
              <span className="text-amber-400 font-bold w-4 sm:w-5 text-center">
                {mapping.value}
              </span>
              <span className="text-slate-400">=</span>
              <input
                type="text"
                value={mapping.hours}
                onChange={(e) => handleHoursChange(index, e.target.value)}
                className="
                  w-8 sm:w-10 lg:w-12 
                  bg-slate-800 border border-slate-700 
                  rounded px-1 py-0.5 
                  text-slate-300 text-[10px] sm:text-xs
                  focus:outline-none focus:border-amber-500 focus:bg-slate-700
                  text-center
                "
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
