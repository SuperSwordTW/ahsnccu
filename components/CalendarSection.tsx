"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CalendarEvent {
  date: string;
  event: string;
  applicable_grades: string;
}

export default function CalendarSection({ category = "全校" }: { category?: string }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Record<string, { title: string; color: string }[]>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{ title: string; dateStr: string; color: string } | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const handleNext = () => {
    if (isMobile) setCurrentDate(new Date(currentYear, currentMonth, currentDate.getDate() + 7));
    else setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handlePrev = () => {
    if (isMobile) setCurrentDate(new Date(currentYear, currentMonth, currentDate.getDate() - 7));
    else setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  // Generate unified grid items based on view mode
  const gridItems: ({ type: "blank"; index: number } | { type: "day"; dateStr: string; dayNum: number; dateObj: Date })[] = [];

  if (isMobile) {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      gridItems.push({ type: "day", dateStr, dayNum: d.getDate(), dateObj: d });
    }
  } else {
    for (let i = 0; i < firstDayOfMonth; i++) {
      gridItems.push({ type: "blank", index: i });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(currentYear, currentMonth, i);
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      gridItems.push({ type: "day", dateStr, dayNum: i, dateObj: d });
    }
  }

  const monthNames = [
    "一月", "二月", "三月", "四月", "五月", "六月",
    "七月", "八月", "九月", "十月", "十一月", "十二月"
  ];

  // Helper to map grade/event types to colors
  const getColor = (grade: string) => {
    if (grade.includes("高一")) return "bg-pink-100 text-pink-700 border-pink-200";
    if (grade.includes("高二")) return "bg-amber-100 text-amber-700 border-amber-200";
    if (grade.includes("高三")) return "bg-purple-100 text-purple-700 border-purple-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  useEffect(() => {
    const fetchEvents = async () => {
      let firstDay: string, lastDay: string;

      if (isMobile) {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        firstDay = `${startOfWeek.getFullYear()}-${String(startOfWeek.getMonth() + 1).padStart(2, "0")}-${String(startOfWeek.getDate()).padStart(2, "0")}`;
        lastDay = `${endOfWeek.getFullYear()}-${String(endOfWeek.getMonth() + 1).padStart(2, "0")}-${String(endOfWeek.getDate()).padStart(2, "0")}`;
      } else {
        firstDay = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`;
        lastDay = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${new Date(currentYear, currentMonth + 1, 0).getDate()}`;
      }

      const isMidSchool = ["國一", "國二", "國三"].includes(category);
      const tableName = isMidSchool ? "calendar-mid" : "calendar";

      let query = supabase
        .from(tableName)
        .select("*")
        .gte("date", firstDay)
        .lte("date", lastDay);

      if (category !== "全校") {
        // Use .or() to include events specifically for this grade OR for the whole school ("全校").
        // We use .ilike to catch strings that contain multiple grades (e.g., "高一、高二").
        query = query.or(`applicable_grades.ilike.%${category}%,applicable_grades.eq.全校`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching events:", error);
        return;
      }

      // Group events by day of the month
      const grouped: Record<string, { title: string; color: string }[]> = {};
      data.forEach((item: CalendarEvent) => {
        const dateKey = item.date.split("T")[0]; // YYYY-MM-DD
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push({
          title: item.event,
          color: getColor(item.applicable_grades)
        });
      });

      setEvents(grouped);
    };

    fetchEvents();
  }, [currentYear, currentMonth, currentDate, isMobile, category]);

  return (
    <section className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between px-1 mt-4 md:mt-0">
        <h2 className="text-lg font-medium flex items-center gap-2 text-neutral-800">
          <span className="w-2 h-2 rounded-none bg-neutral-400 transform rotate-45" /> 行事曆
        </h2>
      </div>
      <Card className="p-6 bg-white border-neutral-100 shadow-sm rounded-3xl w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium tracking-wide text-neutral-900">
          {currentYear}年 {monthNames[currentMonth]}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePrev} className="rounded-full border-neutral-200">
            <ChevronLeft className="w-4 h-4 text-neutral-600" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext} className="rounded-full border-neutral-200">
            <ChevronRight className="w-4 h-4 text-neutral-600" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-neutral-200 rounded-xl overflow-hidden border border-neutral-200">
        {/* Days Header */}
        {weekDays.map((day) => (
          <div key={day} className="bg-neutral-50 py-3 text-center text-xs font-medium text-neutral-500">
            {day}
          </div>
        ))}

        {/* Grid Items (Unified Blank & Day Rendering) */}
        {gridItems.map((item, index) => {
          if (item.type === "blank") {
            return <div key={`blank-${item.index}`} className="bg-white min-h-[100px] p-2" />;
          }

          const isToday =
            item.dayNum === new Date().getDate() &&
            item.dateObj.getMonth() === new Date().getMonth() &&
            item.dateObj.getFullYear() === new Date().getFullYear();

          const dayEvents = events[item.dateStr] || [];

          return (
            <div key={item.dateStr} className="bg-white min-h-[100px] p-2 border-t border-neutral-100 flex flex-col gap-1 transition-colors hover:bg-neutral-50">
              <span
                className={`text-sm inline-flex items-center justify-center w-7 h-7 rounded-full ${
                  isToday ? "bg-neutral-900 text-white font-medium" : "text-neutral-700"
                }`}
              >
                {item.dayNum}
              </span>
              <div className="flex flex-col gap-1 mt-1">
                {isMobile ? (
                  <div className="flex flex-wrap gap-1 justify-center mt-1">
                    {dayEvents.map((event, i) => (
                      <div
                        key={`dot-${i}`}
                        className={`w-2 h-2 rounded-full border ${event.color}`}
                      />
                    ))}
                  </div>
                ) : (
                  dayEvents.map((event, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedEvent({ title: event.title, dateStr: item.dateStr, color: event.color })}
                      className={`px-2 py-1 rounded-md border cursor-pointer transition-all active:scale-95 hover:brightness-95 ${event.color}`}
                      title={event.title}
                    >
                      <div className="text-[0.625rem] line-clamp-2 leading-tight whitespace-normal">
                        {event.title}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Agenda View */}
      {isMobile && (
        <div className="mt-6 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-neutral-500 px-2">本週行程</h3>
          {gridItems.filter(item => item.type === "day" && (events[item.dateStr] || []).length > 0).length === 0 ? (
            <div className="text-sm text-neutral-400 text-center py-6 bg-neutral-50 rounded-xl">本週無行程</div>
          ) : (
            <div className="flex flex-col gap-3">
              {gridItems.map((item) => {
                if (item.type === "blank") return null;
                const dayEvents = events[item.dateStr] || [];
                if (dayEvents.length === 0) return null;

                const isToday =
                  item.dayNum === new Date().getDate() &&
                  item.dateObj.getMonth() === new Date().getMonth() &&
                  item.dateObj.getFullYear() === new Date().getFullYear();

                return (
                  <div key={`agenda-${item.dateStr}`} className="flex gap-4 items-start p-2">
                    <div className="flex flex-col items-center min-w-[3rem] pt-1">
                      <span className="text-xs font-medium text-neutral-400 mb-1">{weekDays[item.dateObj.getDay()]}</span>
                      <span className={`text-lg font-bold flex items-center justify-center w-8 h-8 rounded-full ${
                        isToday ? "bg-neutral-900 text-white" : "text-neutral-700"
                      }`}>
                        {item.dayNum}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      {dayEvents.map((event, i) => (
                        <div
                          key={i}
                          onClick={() => setSelectedEvent({ title: event.title, dateStr: item.dateStr, color: event.color })}
                          className={`p-3 rounded-xl border cursor-pointer transition-all active:scale-95 ${event.color}`}
                        >
                          <div className="text-sm leading-relaxed font-medium">
                            {event.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] transition-opacity"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col transform transition-all"
            onClick={(e) => e.stopPropagation()} // Prevents closing when tapping inside the modal
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 p-4 bg-neutral-50/50">
              <span className="text-sm font-medium text-neutral-600">
                {selectedEvent.dateStr.replace(/-/g, "/")}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200" 
                onClick={() => setSelectedEvent(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className={`inline-block px-2 py-1 mb-4 rounded-md border text-[0.6875rem] font-medium ${selectedEvent.color}`}>
                詳細內容
              </div>
              <p className="text-neutral-800 text-[0.9375rem] leading-relaxed break-words whitespace-pre-wrap">
                {selectedEvent.title}
              </p>
            </div>
          </div>
        </div>
      )}
      </Card>
    </section>
  );
}