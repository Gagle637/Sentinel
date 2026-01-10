import { motion } from 'framer-motion';
import { Eye, Wifi, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-14 bg-card border-b border-border flex items-center justify-between px-6"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Eye className="w-6 h-6 text-primary" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-severity-critical rounded-full animate-pulse" />
        </div>
        <div>
          <h1 className="font-mono text-sm font-bold tracking-widest text-foreground">
            Sentinel
          </h1>
          <p className="font-mono text-[10px] text-muted-foreground -mt-0.5">
            CRIME ANALYSIS SYSTEM
          </p>
        </div>
      </div>

      {/* Status indicators */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-severity-low" />
          <span className="font-mono text-xs text-muted-foreground">CONNECTED</span>
        </div>

        <div className="w-px h-6 bg-border" />

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-mono text-xs text-foreground">
            {currentTime.toLocaleTimeString('en-US', { hour12: false })}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {currentTime.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()}
          </span>
        </div>
      </div>
    </motion.header>
  );
}
