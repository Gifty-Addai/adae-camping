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
    <Card className="flex items-center p-4 bg-[#2a2a2a] border border-[#3d3d3d] shadow-md rounded-xl hover:border-[#8b7355] transition-all">
      <div className={`p-3 rounded-full ${color} w-10 h-10 flex items-center justify-center`}>
        {icon}
      </div>
      <div className="ml-4">
        <Label className="text-sm font-medium text-gray-300">
          {title}
        </Label>
        <p className="text-2xl font-semibold text-gray-100">
          {value}
        </p>
      </div>
    </Card>
  );
};

export default StatisticsCard;
