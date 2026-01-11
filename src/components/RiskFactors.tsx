import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { RiskAnalysis } from '@/types/crime';

interface RiskFactorsProps {
  analysis: RiskAnalysis;
  isAnalyzing?: boolean;
}

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const trendColors = {
  up: 'text-severity-property',
  down: 'text-severity-public',
  stable: 'text-muted-foreground',
};

export function RiskFactors({ analysis, isAnalyzing }: RiskFactorsProps) {
  return (
    <div className="space-y-3">
      {/* Breakdown text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-muted-foreground border-l-2 border-primary pl-3"
      >
        {isAnalyzing ? 'Processing threat vectors...' : analysis.breakdown}
      </motion.p>

      {/* Factor bars */}
      <div className="space-y-2 mt-4">
        {analysis.factors.map((factor, index) => {
          const TrendIcon = trendIcons[factor.trend];
          
          return (
            <motion.div
              key={factor.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono uppercase tracking-wide">
                  {factor.label}
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-mono">{isAnalyzing ? '--' : factor.value}%</span>
                  <TrendIcon className={`w-3 h-3 ${trendColors[factor.trend]}`} />
                </div>
              </div>
              
              <div className="h-1.5 bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: isAnalyzing ? '0%' : `${factor.value}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="h-full bg-primary"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
