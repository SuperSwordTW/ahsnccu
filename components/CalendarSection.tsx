"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data: In a real app, you'd fetch this from your backend
const MOCK_EVENTS: Record<number, { title: string; color: string }[]> = {
  12: [{ title: "第1次段考", color: "bg-red-100 text-red-700 border-red-200" }],
  13: [{ title: "第1次段考", color: "bg-red-100 text-red-700 border-red-200" }],
  20: [{ title: "全校朝會", color: "bg-blue-100 text-blue-700 border-blue-200" }],
  25: [{ title: "社團聯展", color: "bg-emerald-100 text-emerald-700 border-emerald-200" }],
};

export default function CalendarSection() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  const monthNames = [
    "一月", "二月", "三月", "四月", "五月", "六月",
    "七月", "八月", "九月", "十月", "十一月", "十二月"
  ];

  return (
    <Card className="p-6 bg-white border-neutral-100 shadow-sm rounded-3xl w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium tracking-wide text-neutral-900">
          {currentYear}年 {monthNames[currentMonth]}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth} className="rounded-full border-neutral-200">
            <ChevronLeft className="w-4 h-4 text-neutral-600" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="rounded-full border-neutral-200">
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

        {/* Blank spots for offset */}
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="bg-white min-h-[100px] p-2" />
        ))}

        {/* Days of the month */}
        {days.map((day) => {
          const isToday =
            day === new Date().getDate() &&
            currentMonth === new Date().getMonth() &&
            currentYear === new Date().getFullYear();

          const dayEvents = MOCK_EVENTS[day] || [];

          return (
            <div key={day} className="bg-white min-h-[100px] p-2 border-t border-neutral-100 flex flex-col gap-1 transition-colors hover:bg-neutral-50">
              <span
                className={`text-sm inline-flex items-center justify-center w-7 h-7 rounded-full ${
                  isToday ? "bg-neutral-900 text-white font-medium" : "text-neutral-700"
                }`}
              >
                {day}
              </span>
              <div className="flex flex-col gap-1 mt-1">
                {dayEvents.map((event, i) => (
                  <div
                    key={i}
                    className={`text-[10px] px-2 py-1 rounded-md border truncate ${event.color}`}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}