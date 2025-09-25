import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = "neutral",
  className 
}) => {
  const changeColors = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-gray-600"
  };
  
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className="p-2 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg">
            <ApperIcon name={icon} className="h-5 w-5 text-primary-600" />
          </div>
        </div>
        <div className="mb-2">
          <p className="text-2xl font-bold gradient-text">{value}</p>
        </div>
        {change && (
          <div className={cn("flex items-center text-sm", changeColors[changeType])}>
            <ApperIcon 
              name={changeType === "positive" ? "TrendingUp" : changeType === "negative" ? "TrendingDown" : "Minus"} 
              className="h-4 w-4 mr-1" 
            />
            {change}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;