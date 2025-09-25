import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { format } from "date-fns";

const DealCard = ({ 
  deal, 
  isDragging = false, 
  onEdit, 
  onDelete,
  ...dragProps 
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };
  
  const getStageColor = (stage) => {
    const colors = {
      "lead": "bg-blue-500",
      "qualified": "bg-purple-500",
      "proposal": "bg-orange-500",
      "negotiation": "bg-yellow-500",
      "closed": "bg-green-500"
    };
    return colors[stage] || "bg-gray-500";
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={isDragging ? "dragging" : ""}
      {...dragProps}
    >
      <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-1 h-12 rounded-full ${getStageColor(deal.stage)} mr-3`}></div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{deal.title}</h4>
            <p className="text-lg font-bold gradient-text">
              {formatCurrency(deal.value)}
            </p>
          </div>
          <div className="flex space-x-1">
            <button 
              onClick={() => onEdit(deal)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ApperIcon name="Edit" className="h-4 w-4 text-gray-500" />
            </button>
            <button 
              onClick={() => onDelete(deal)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ApperIcon name="Trash2" className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Probability:</span>
            <span className="font-medium">{deal.probability}%</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Close Date:</span>
            <span className="font-medium">
              {format(new Date(deal.expectedCloseDate), "MMM dd")}
            </span>
          </div>
          
          {deal.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {deal.description}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default DealCard;