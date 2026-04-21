import { useSchoolSettings } from '../hooks/useSchoolSettings'
import { Megaphone, ExternalLink } from 'lucide-react'

export default function Ticker() {
  const settings = useSchoolSettings()

  if (!settings.ticker_text) return null

  return (
    <div className="bg-red-700 border-b border-white/5 relative z-50 h-10 overflow-hidden flex items-center shadow-lg shadow-red-900/10">
      {/* Label Badge */}
      <div className="bg-white px-4 h-full flex items-center gap-2 relative z-10 shadow-[5px_0_15px_rgba(0,0,0,0.2)]">
        <Megaphone className="h-4 w-4 text-red-700 animate-pulse" />
        <span className="text-red-700 font-black text-[10px] uppercase tracking-widest whitespace-nowrap">Important</span>
      </div>

      {/* Marquee Container */}
      <div className="flex-1 relative h-full flex items-center overflow-hidden">
        {/* Continuous Track */}
        <div className="flex w-max animate-marquee">
          {[1, 2].map((set) => (
            <div key={set} className="flex items-center gap-12 px-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-8 text-white/90 font-display font-medium text-xs tracking-wide">
                  {settings.ticker_link ? (
                    <a 
                      href={settings.ticker_link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="hover:text-white underline decoration-white/30 transition-all flex items-center gap-2 group whitespace-nowrap"
                    >
                      {settings.ticker_text}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <span className="whitespace-nowrap">{settings.ticker_text}</span>
                  )}
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30 shrink-0" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
