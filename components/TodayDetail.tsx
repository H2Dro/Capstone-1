
import React from 'react';
import { Icon } from './Icon';
import { ActivityItem, MedicationItem, AppointmentItem } from '../types';

interface TodayDetailProps {
  activities: ActivityItem[];
  medications: MedicationItem[];
  appointments: AppointmentItem[];
  onBack: () => void;
  onToggleMedication: (id: string) => void;
}

type TimelineItem = {
    id: string;
    type: 'activity' | 'medication' | 'appointment';
    time: string;
    title: string;
    subtitle?: string;
    icon: string;
    color: string;
    sortTime: number; // minutes from midnight
    data: any;
};

export const TodayDetail: React.FC<TodayDetailProps> = ({ 
    activities, 
    medications, 
    appointments, 
    onBack,
    onToggleMedication
}) => {
    
    // Helper to parse time string to minutes for sorting
    const parseTime = (timeStr: string) => {
        const cleanTimeStr = timeStr.split('-')[0].trim();
        const [time, period] = cleanTimeStr.split(/(?=[ap]m)/i); 
        if (!time) return 0;
        
        let [hours, minutes] = time.split(':').map(Number);
        const isPM = cleanTimeStr.toLowerCase().includes('pm');
        const isAM = cleanTimeStr.toLowerCase().includes('am');
        
        if (isPM && hours !== 12) hours += 12;
        if (isAM && hours === 12) hours = 0;
        
        return (hours || 0) * 60 + (minutes || 0);
    };

    // Merge and Process Data
    const timelineItems: TimelineItem[] = [
        ...activities.map(a => ({
            id: a.id,
            type: 'activity' as const,
            time: a.time,
            title: a.title,
            subtitle: a.date,
            icon: a.icon,
            color: 'text-orange-600 bg-orange-50',
            sortTime: parseTime(a.time),
            data: a
        })),
        ...medications.map(m => ({
            id: m.id,
            type: 'medication' as const,
            time: m.time,
            title: `Take ${m.name}`,
            subtitle: `${m.dosage} • ${m.taken ? 'Taken' : 'Pending'}`,
            icon: 'pill',
            color: m.taken ? 'text-green-600 bg-green-50' : 'text-brand-600 bg-brand-50',
            sortTime: parseTime(m.time),
            data: m
        })),
        ...appointments.map(a => ({
            id: a.id,
            type: 'appointment' as const,
            time: a.time,
            title: `Dr. ${a.doctorName}`,
            subtitle: a.specialty,
            icon: 'stethoscope',
            color: 'text-blue-600 bg-blue-50',
            sortTime: parseTime(a.time),
            data: a
        }))
    ].sort((a, b) => a.sortTime - b.sortTime);

    // Group items
    const morningItems = timelineItems.filter(i => i.sortTime < 720); // Before 12 PM
    const afternoonItems = timelineItems.filter(i => i.sortTime >= 720 && i.sortTime < 1020); // 12 PM - 5 PM
    const eveningItems = timelineItems.filter(i => i.sortTime >= 1020); // After 5 PM

    const renderSection = (title: string, items: TimelineItem[], icon: string, headerColor: string) => {
        return (
            <div className="w-full">
                <div className={`flex items-center justify-between p-4 rounded-2xl ${headerColor} border border-white/50 backdrop-blur-sm mb-3 sticky top-2 z-10 shadow-sm`}>
                    <div className="flex items-center gap-3">
                        <div className="bg-white/60 p-2 rounded-xl">
                            <Icon name={icon} size={20} className="text-slate-800" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
                    </div>
                    <span className="text-xs font-bold bg-white/50 px-2.5 py-1 rounded-lg text-slate-800">
                        {items.length} Events
                    </span>
                </div>

                <div className="flex flex-col gap-3">
                    {items.length === 0 ? (
                        <div className="bg-white/50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center opacity-70 mb-4">
                            <p className="font-bold text-slate-400 text-sm">Nothing scheduled</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div 
                                key={`${item.type}-${item.id}`} 
                                className={`bg-white p-5 rounded-[1.25rem] border border-slate-100 shadow-sm flex flex-col gap-3 transition-transform active:scale-[0.99] ${
                                    item.type === 'medication' && item.data.taken ? 'opacity-80 bg-green-50/20' : ''
                                }`}
                                onClick={() => {
                                    if (item.type === 'medication') onToggleMedication(item.id);
                                }}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-3 items-center">
                                        <div className={`p-2.5 rounded-xl ${item.color}`}>
                                            <Icon name={item.icon} size={20} />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{item.type}</span>
                                            <h4 className={`font-bold text-slate-900 text-lg leading-tight ${item.data.taken ? 'text-green-800' : ''}`}>
                                                {item.title}
                                            </h4>
                                        </div>
                                    </div>
                                    {item.type === 'medication' && (
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${item.data.taken ? 'bg-green-500 border-green-500 text-white' : 'border-slate-200 text-slate-200'}`}>
                                            <Icon name="check" size={16} />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="pl-[3.25rem]">
                                    <p className="text-sm text-slate-500 font-medium mb-2">
                                        {item.subtitle}
                                        {item.type === 'medication' && !item.data.taken && (
                                            <span className="text-brand-600 ml-2 font-bold">• Tap to log</span>
                                        )}
                                    </p>
                                    <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-slate-600 font-bold text-xs">
                                        <Icon name="clock" size={12} />
                                        <span>{item.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    const currentFullDate = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
    });

    return (
        <div className="flex flex-col animate-fade-in pb-12">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
                        <Icon name="back" size={24} />
                    </button>
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100">
                         <Icon name="cloud-sun" size={16} />
                         <span className="text-xs font-bold">68°F</span>
                    </div>
                </div>
                
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-1">Today's<br/>Schedule</h1>
                    <p className="text-slate-500 font-medium">{currentFullDate}</p>
                </div>
                
                <div className="flex gap-3 mt-6 relative z-10">
                    <div className="flex-1 flex flex-col gap-1 bg-brand-50 p-3 rounded-2xl border border-brand-100">
                        <div className="flex items-center gap-2 text-brand-700">
                            <Icon name="pill" size={14} />
                            <span className="text-xs font-bold uppercase tracking-wide">Meds</span>
                        </div>
                        <div className="flex items-end gap-1">
                            <span className="text-2xl font-bold text-brand-900">{medications.filter(m => m.taken).length}</span>
                            <span className="text-xs font-medium text-brand-600 mb-1.5">/ {medications.length}</span>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-1 bg-orange-50 p-3 rounded-2xl border border-orange-100">
                        <div className="flex items-center gap-2 text-orange-700">
                            <Icon name="sun" size={14} />
                            <span className="text-xs font-bold uppercase tracking-wide">Activity</span>
                        </div>
                        <div className="flex items-end gap-1">
                            <span className="text-2xl font-bold text-orange-900">{activities.length}</span>
                            <span className="text-xs font-medium text-orange-600 mb-1.5">Tasks</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {renderSection('Morning', morningItems, 'sunrise', 'bg-orange-100/80')}
                {renderSection('Afternoon', afternoonItems, 'sun', 'bg-blue-100/80')}
                {renderSection('Evening', eveningItems, 'sunset', 'bg-indigo-100/80')}
            </div>
        </div>
    );
};
