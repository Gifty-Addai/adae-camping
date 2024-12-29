import React from 'react';
import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';

interface StatisticsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card className="flex items-center p-2 bg-card shadow-md rounded-lg">
      <div className={`p-3 rounded-full ${color} w-8 h-8`}>
        {icon}
      </div>
      <div className="ml-4">
        <Label className="text-sm font-medium text-white">
          {title}
        </Label>
        <p className="text-lg font-semibold text-card-foreground">
          {value}
        </p>
      </div>
    </Card>
  );
};

export default StatisticsCard;
