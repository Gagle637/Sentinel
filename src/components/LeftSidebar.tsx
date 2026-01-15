import { motion } from 'framer-motion';
import { Shield, Target } from 'lucide-react';
import { RiskGauge } from './RiskGauge';
import { RiskFactors } from './RiskFactors';
import { TimeFilters } from './TimeFilters';
import { RiskAnalysis, TimeRange, SeverityLevel } from '@/types/crime';

interface LeftSidebarProps {
  analysis: RiskAnalysis;
  isAnalyzing: boolean;
  selectedTime: TimeRange;
  onTimeChange: (time: TimeRange) => void;
}

export function LeftSidebar({
  analysis,
  isAnalyzing,
  selectedTime,
  onTimeChange,
}: LeftSidebarProps) {
  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-80 h-full panel-tactical flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 border border-primary">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-mono text-sm font-semibold tracking-wide">THREAT ANALYSIS</h2>
            <p className="font-mono text-[10px] text-muted-foreground">REAL-TIME ASSESSMENT</p>
          </div>
        </div>
      </div>

      {/* Risk Score */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-primary" />
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Risk Level
          </span>
        </div>
        <RiskGauge score={analysis.score} level={analysis.level} isAnalyzing={isAnalyzing} />
      </div>

      {/* Risk Factors */}
      <div className="flex-1 p-4 border-b border-border overflow-y-auto scrollbar-tactical">
        <RiskFactors analysis={analysis} isAnalyzing={isAnalyzing} />
      </div>

      {/* Filters */}
      <div className="p-4">
        <TimeFilters
          selectedTime={selectedTime}
          onTimeChange={onTimeChange}
        />
      </div>
    </motion.aside>
  );
}
