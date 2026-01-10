import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import { EventFeed } from './EventFeed';
import { CrimeEvent } from '@/types/crime';

interface RightSidebarProps {
  events: CrimeEvent[];
  onEventClick: (event: CrimeEvent) => void;
  isAnalyzing: boolean;
}

export function RightSidebar({ events, onEventClick, isAnalyzing }: RightSidebarProps) {
  return (
    <motion.aside
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-80 h-full panel-tactical flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-severity-critical/10 border border-severity-critical">
            <Radio className="w-5 h-5 text-severity-critical" />
          </div>
          <div>
            <h2 className="font-mono text-sm font-semibold tracking-wide">INCIDENT MONITOR</h2>
            <p className="font-mono text-[10px] text-muted-foreground">LIVE EVENT STREAM</p>
          </div>
        </div>
      </div>

      {/* Event Feed */}
      <div className="flex-1 p-4 overflow-hidden">
        <EventFeed events={events} onEventClick={onEventClick} isAnalyzing={isAnalyzing} />
      </div>
    </motion.aside>
  );
}
