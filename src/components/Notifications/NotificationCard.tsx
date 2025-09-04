// src/components/NotificationCard.tsx
import React from "react";
import { Card, Typography, Badge } from "antd";

const { Text } = Typography;

export interface NotificationProps {
  id: number;
  icon: React.ReactNode;
  title: string;
  date: string;
  type: "warning" | "info" | "success" | "error";
  bgColor?: string;
}

export default function NotificationCard({
  icon,
  title,
  date,
  type,
  bgColor = "#f5f5f5",
}: NotificationProps) {
  return (
    <div
      className="cursor-pointer p-4 hover:shadow-sm transition-shadow duration-200"
    >
      <div className="flex items-start gap-4">
        <Badge
          count={0}
          dot
          color={
            type === "warning"
              ? "orange"
              : type === "info"
              ? "blue"
              : type === "success"
              ? "green"
              : "red"
          }
          offset={[-2, 2]}
        >
          <div
            className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full"
            style={{ backgroundColor: bgColor }}
          >
            {icon}
          </div>
        </Badge>
        <div className="flex-1">
          <Text className="block mb-1 font-medium">{title}</Text>
          <Text type="secondary" className="text-xs">
            {date}
          </Text>
        </div>
      </div>
    </div>
  );
}
