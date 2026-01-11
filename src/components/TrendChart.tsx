import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendDataPoint, SeverityLevel } from '@/types/crime';

interface TrendChartProps {
  data: TrendDataPoint[];
  isAnalyzing?: boolean;
}

const severityColors: Record<SeverityLevel, string> = {
  violent: 'hsl(0, 85%, 55%)',
  property: 'hsl(25, 95%, 55%)',
  vandalism: 'hsl(45, 95%, 55%)',
  public: 'hsl(190, 95%, 45%)',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-2">
        <p className="font-mono text-xs text-muted-foreground">{label}</p>
        <p className="font-mono text-sm font-semibold text-primary">
          {payload[0].value} incidents
        </p>
      </div>
    );
  }
  return null;
};

export function TrendChart({ data, isAnalyzing }: TrendChartProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Incident Frequency
        </h3>
        {isAnalyzing && (
          <span className="font-mono text-[10px] text-muted-foreground animate-pulse">
            LOADING...
          </span>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isAnalyzing ? 0.3 : 1 }}
        className="flex-1"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <XAxis
              dataKey="time"
              tick={{ fontSize: 9, fill: 'hsl(215, 15%, 55%)' }}
              axisLine={{ stroke: 'hsl(220, 15%, 20%)' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 9, fill: 'hsl(215, 15%, 55%)' }}
              axisLine={{ stroke: 'hsl(220, 15%, 20%)' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(220, 15%, 15%)' }} />
            <Bar dataKey="count" radius={0}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={severityColors[entry.severity]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2">
        {Object.entries(severityColors).map(([level, color]) => (
          <div key={level} className="flex items-center gap-1">
            <span
              className="w-2 h-2"
              style={{ backgroundColor: color }}
            />
            <span className="font-mono text-[10px] uppercase text-muted-foreground">
              {level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
