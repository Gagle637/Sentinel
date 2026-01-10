import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { TrendChart } from './TrendChart';
import { TrendDataPoint } from '@/types/crime';

interface BottomPanelProps {
  data: TrendDataPoint[];
  isAnalyzing: boolean;
}

export function BottomPanel({ data, isAnalyzing }: BottomPanelProps) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="h-40 panel-tactical border-t border-border"
    >
      <div className="h-full flex">
        {/* Label */}
        <div className="w-12 flex flex-col items-center justify-center border-r border-border">
          <Activity className="w-4 h-4 text-primary mb-2" />
          <span className="font-mono text-[10px] text-muted-foreground writing-mode-vertical transform -rotate-180" style={{ writingMode: 'vertical-rl' }}>
            TRENDS
          </span>
        </div>

        {/* Chart */}
        <div className="flex-1 p-4">
          <TrendChart data={data} isAnalyzing={isAnalyzing} />
        </div>
      </div>
    </motion.div>
  );
}
