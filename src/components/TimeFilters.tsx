import { TimeRange, SeverityLevel } from '@/types/crime';
import { cn } from '@/lib/utils';

interface TimeFiltersProps {
  selectedTime: TimeRange;
  onTimeChange: (time: TimeRange) => void;
}

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: '1h', label: '1H' },
  { value: '6h', label: '6H' },
  { value: '24h', label: '24H' },
];

const eventTypes: { value: SeverityLevel; label: string }[] = [
  { value: 'violent', label: 'VIOLENT' },
  { value: 'property', label: 'PROPERTY' },
  { value: 'vandalism', label: 'VANDALISM' },
  { value: 'public', label: 'PUBLIC' },
];

export function TimeFilters({
  selectedTime,
  onTimeChange,
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
    </div>
  );
}
