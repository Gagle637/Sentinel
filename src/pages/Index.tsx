import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { LeftSidebar } from '@/components/LeftSidebar';
import { RightSidebar } from '@/components/RightSidebar';
import { BottomPanel } from '@/components/BottomPanel';
import { MapView } from '@/components/MapView';
import {
  mockEvents,
  generateRiskAnalysis,
  generateTrendData,
} from '@/data/mockCrimeData';
import { CrimeEvent, TimeRange, SeverityLevel } from '@/types/crime';

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTime, setSelectedTime] = useState<TimeRange>('6h');
  const [selectedTypes, setSelectedTypes] = useState<SeverityLevel[]>([
    'violent',
    'property',
    'vandalism',
    'public',
  ]);
  const [riskAnalysis, setRiskAnalysis] = useState(generateRiskAnalysis());
  const [trendData, setTrendData] = useState(generateTrendData(6));
  const [events] = useState(mockEvents);
  const [focusedEvent, setFocusedEvent] = useState<CrimeEvent | null>(null);

  const handleMapClick = useCallback((coords: { lat: number; lng: number }) => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      setRiskAnalysis(generateRiskAnalysis());
      setIsAnalyzing(false);
    }, 1500);
  }, []);

  const handleEventClick = useCallback((event: CrimeEvent) => {
    setFocusedEvent(event);
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setRiskAnalysis(generateRiskAnalysis());
      setIsAnalyzing(false);
    }, 800);
  }, []);

  const handleTimeChange = useCallback((time: TimeRange) => {
    setSelectedTime(time);
    setIsAnalyzing(true);
    
    const hours = time === '1h' ? 1 : time === '6h' ? 6 : 24;
    
    setTimeout(() => {
      setTrendData(generateTrendData(hours));
      setRiskAnalysis(generateRiskAnalysis());
      setIsAnalyzing(false);
    }, 500);
  }, []);

  const handleTypeToggle = useCallback((type: SeverityLevel) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }, []);

  // Filter events by selected types
  const filteredEvents = events.filter((e) =>
    selectedTypes.includes(e.severity as SeverityLevel)
  );

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar
          analysis={riskAnalysis}
          isAnalyzing={isAnalyzing}
          selectedTime={selectedTime}
          onTimeChange={handleTimeChange}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 relative">
            <MapView
              events={filteredEvents}
              onMapClick={handleMapClick}
              focusedEvent={focusedEvent}
              selectedTypes={selectedTypes}
              onTypeToggle={handleTypeToggle}
            />
          </div>
          
          <BottomPanel data={trendData} isAnalyzing={isAnalyzing} />
        </main>

        <RightSidebar
          events={filteredEvents}
          onEventClick={handleEventClick}
          isAnalyzing={isAnalyzing}
        />
      </div>
    </div>
  );
};

export default Index;
