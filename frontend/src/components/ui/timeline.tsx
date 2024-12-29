"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  date: string; // Date string
  title: string; // Event title
  description?: string; // Optional description
  icon?: React.ReactNode; // Optional custom icon
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  date,
  title,
  description,
  icon,
}) => {
  return (
    <div className="flex items-start space-x-4">
      {/* Icon or Default Marker */}
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border border-muted bg-background text-muted-foreground"
        )}
      >
        {icon || (
          <span className="text-sm font-medium">
            {new Date(date).getDate()}
          </span>
        )}
      </div>

      {/* Event Details */}
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
};

interface TimelineProps {
  events: TimelineItemProps[]; // Array of timeline events
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="space-y-6">
      {events.map((event, index) => (
        <div key={index}>
          <TimelineItem {...event} />
          {/* Connector Line */}
          {index < events.length - 1 && (
            <div className="ml-4 h-6 border-l border-muted" />
          )}
        </div>
      ))}
    </div>
  );
};

export { Timeline, TimelineItem };
