import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, Skull } from 'lucide-react';
import { CrimeEvent, SeverityLevel } from '@/types/crime';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface EventFeedProps {
  events: CrimeEvent[];
  onEventClick: (event: CrimeEvent) => void;
  isAnalyzing?: boolean;
}

const severityConfig: Record<SeverityLevel, { icon: typeof AlertTriangle; color: string; pulse: boolean }> = {
  violent: { icon: Skull, color: 'text-severity-violent', pulse: true },
  property: { icon: AlertTriangle, color: 'text-severity-property', pulse: true },
  vandalism: { icon: AlertCircle, color: 'text-severity-vandalism', pulse: false },
  public: { icon: Info, color: 'text-severity-public', pulse: false },
};

export function EventFeed({ events, onEventClick, isAnalyzing }: EventFeedProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 px-2">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Live Feed
        </h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-severity-violent rounded-full animate-pulse" />
          <span className="font-mono text-xs text-muted-foreground">
            {events.length} Active
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-tactical space-y-2 relative px-2">
        <AnimatePresence mode="popLayout">
          {isAnalyzing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-32"
            >
              <span className="font-mono text-xs text-muted-foreground animate-pulse">
                SCANNING EVENTS...
              </span>
            </motion.div>
          ) : (
            events.map((event, index) => {
              const config = severityConfig[event.severity];
              const Icon = config.icon;

              return (
                <motion.button
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onEventClick(event)}
                  className={cn(
                    'w-full text-left p-3 border border-border bg-secondary/50 transition-all duration-200',
                    'hover:bg-secondary hover:border-primary group'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('mt-0.5', config.color, config.pulse && 'pulse-danger')}>
                      <Icon className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-semibold uppercase truncate">
                          {event.type}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-1 truncate group-hover:text-foreground transition-colors">
                        {event.location.address}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
