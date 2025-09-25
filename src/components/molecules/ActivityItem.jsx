import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const ActivityItem = ({ activity, isLast = false }) => {
  const getActivityIcon = (type) => {
    const icons = {
      call: "Phone",
      email: "Mail",
      meeting: "Calendar",
      note: "FileText",
      task: "CheckSquare"
    };
    return icons[type] || "Activity";
  };
  
  const getActivityColor = (type) => {
    const colors = {
      call: "bg-blue-100 text-blue-600",
      email: "bg-green-100 text-green-600",
      meeting: "bg-purple-100 text-purple-600",
      note: "bg-gray-100 text-gray-600",
      task: "bg-orange-100 text-orange-600"
    };
    return colors[type] || "bg-gray-100 text-gray-600";
  };
  
  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0 relative">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
getActivityColor(activity.type_c)
        )}>
          <ApperIcon name={getActivityIcon(activity.type_c)} className="h-4 w-4" />
        </div>
        {!isLast && (
          <div className="absolute top-8 left-1/2 transform -translate-x-px w-0.5 h-8 bg-gray-200"></div>
        )}
      </div>
      
      <div className="flex-1 pb-8">
        <div className="flex items-center justify-between">
<h4 className="text-sm font-semibold text-gray-900">{activity.title_c}</h4>
          <span className="text-xs text-gray-500">
{format(new Date(activity.date_c), "MMM dd, HH:mm")}
          </span>
        </div>
{activity.description_c && (
          <p className="text-sm text-gray-600 mt-1">{activity.description_c}</p>
        )}
      </div>
    </div>
  );
};

export default ActivityItem;