import { motion } from 'framer-motion';
import { SeverityLevel } from '@/types/crime';

interface RiskGaugeProps {
  score: number;
  level: SeverityLevel;
  isAnalyzing?: boolean;
}

const levelConfig = {
  violent: { label: 'VIOLENT', color: 'text-severity-violent', bg: 'bg-severity-violent' },
  property: { label: 'PROPERTY', color: 'text-severity-property', bg: 'bg-severity-property' },
  vandalism: { label: 'VANDALISM', color: 'text-severity-vandalism', bg: 'bg-severity-vandalism' },
  public: { label: 'PUBLIC', color: 'text-severity-public', bg: 'bg-severity-public' },
};

export function RiskGauge({ score, level, isAnalyzing }: RiskGaugeProps) {
  const config = levelConfig[level];
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="6"
          />
          {/* Progress arc */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="square"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: isAnalyzing ? circumference : strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={config.color}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isAnalyzing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-muted-foreground font-mono text-xs"
            >
              ANALYZING...
            </motion.div>
          ) : (
            <>
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className={`font-mono text-3xl font-bold ${config.color}`}
              >
                {score}%
              </motion.span>
            </>
          )}
        </div>
      </div>

      {/* Level badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`mt-4 px-4 py-1 ${config.bg} bg-opacity-20 border border-current text-primary-foreground`}
      >
        <span className="font-mono text-sm font-semibold tracking-widest">
          {isAnalyzing ? '---' : config.label}
        </span>
      </motion.div>
    </div>
  );
}
