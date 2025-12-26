import type React from "react";

interface StatusCardProps {
  title: string;
  bgColor: string;
  value: number;
  icon: React.ReactNode;
}

function StatusCard({ title, bgColor, value, icon }: StatusCardProps) {
  return (
    <div
      className={`p-6 rounded-2xl shadow-sm border border-gray-100 ${bgColor} transition-transform hover:scale-105`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium mb-6">{title}</p>
          <h3 className="text-2xl font-bold">{value} MMK</h3>
        </div>
        <div className="p-2 bg-white/50 rounded-lg">{icon} </div>
      </div>
    </div>
  );
}

export default StatusCard;
