import { motion } from 'framer-motion';
import { TimeRange, EventType } from '@/types/crime';
import { cn } from '@/lib/utils';

interface TimeFiltersProps {
  selectedTime: TimeRange;
  selectedTypes: EventType[];
  onTimeChange: (time: TimeRange) => void;
  onTypeToggle: (type: EventType) => void;
}

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: '1h', label: '1H' },
  { value: '6h', label: '6H' },
  { value: '24h', label: '24H' },
];

const eventTypes: { value: EventType; label: string }[] = [
  { value: 'theft', label: 'THEFT' },
  { value: 'assault', label: 'ASSAULT' },
  { value: 'vandalism', label: 'VANDAL' },
  { value: 'burglary', label: 'BURGLARY' },
  { value: 'robbery', label: 'ROBBERY' },
];

export function TimeFilters({
  selectedTime,
  selectedTypes,
  onTimeChange,
  onTypeToggle,
}: TimeFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Time range selector */}
      <div>
        <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2 block">
          Time Range
        </label>
        <div className="flex gap-1">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => onTimeChange(range.value)}
              className={cn(
                'flex-1 py-2 px-3 font-mono text-xs font-semibold transition-all duration-200 border',
                selectedTime === range.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-secondary-foreground border-border hover:border-primary hover:text-primary'
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Event type toggles */}
      <div>
        <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2 block">
          Event Types
        </label>
        <div className="flex flex-wrap gap-1">
          {eventTypes.map((type) => {
            const isSelected = selectedTypes.includes(type.value);
            return (
              <motion.button
                key={type.value}
                onClick={() => onTypeToggle(type.value)}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'py-1 px-2 font-mono text-[10px] font-medium transition-all duration-200 border',
                  isSelected
                    ? 'bg-primary/20 text-primary border-primary'
                    : 'bg-transparent text-muted-foreground border-border hover:border-muted-foreground'
                )}
              >
                {type.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
