import React, { useState, useRef, useEffect } from "react";
import DealCard from "@/components/molecules/DealCard";
import ApperIcon from "@/components/ApperIcon";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

const PipelineBoard = ({ deals, onDealUpdate, onEditDeal, onDeleteDeal }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  
  const stages = [
    { key: "lead", label: "Lead", color: "bg-blue-500" },
    { key: "qualified", label: "Qualified", color: "bg-purple-500" },
    { key: "proposal", label: "Proposal", color: "bg-orange-500" },
    { key: "negotiation", label: "Negotiation", color: "bg-yellow-500" },
    { key: "closed", label: "Closed", color: "bg-green-500" }
  ];
  
  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const getStageValue = (stage) => {
    const stageDeals = getDealsByStage(stage);
    return stageDeals.reduce((total, deal) => total + deal.value, 0);
  };
  
  const handleDragStart = (e, deal) => {
    setDraggedItem(deal);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
    e.dataTransfer.setDragImage(e.target, 0, 0);
  };
  
  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverColumn(null);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  
  const handleDragEnter = (stage) => {
    setDragOverColumn(stage);
  };
  
  const handleDragLeave = (e) => {
    // Only clear if leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverColumn(null);
    }
  };
  
  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    
    if (draggedItem && draggedItem.stage !== targetStage) {
      const updatedDeal = { ...draggedItem, stage: targetStage };
      onDealUpdate(updatedDeal);
    }
    
    setDraggedItem(null);
    setDragOverColumn(null);
  };
  
  return (
    <div className="flex space-x-6 overflow-x-auto pb-6">
      {stages.map((stage) => {
        const stageDeals = getDealsByStage(stage.key);
        const stageValue = getStageValue(stage.key);
        const isDragOver = dragOverColumn === stage.key;
        
        return (
          <div
            key={stage.key}
            className={cn(
              "flex-shrink-0 w-80 bg-gray-50 rounded-xl p-4 transition-all duration-200",
              isDragOver && "drag-over ring-2 ring-primary-500"
            )}
            onDragOver={handleDragOver}
            onDragEnter={() => handleDragEnter(stage.key)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.key)}
          >
            {/* Stage Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={cn("w-3 h-3 rounded-full", stage.color)}></div>
                  <h3 className="font-semibold text-gray-900">{stage.label}</h3>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {stageDeals.length}
                  </span>
                </div>
              </div>
              <p className="text-sm font-medium gradient-text">
                {formatCurrency(stageValue)}
              </p>
            </div>
            
            {/* Deals List */}
            <div className="space-y-3 min-h-[400px]">
              <AnimatePresence>
                {stageDeals.map((deal) => (
                  <div
                    key={deal.Id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal)}
                    onDragEnd={handleDragEnd}
                  >
                    <DealCard
                      deal={deal}
                      isDragging={draggedItem?.Id === deal.Id}
                      onEdit={onEditDeal}
                      onDelete={onDeleteDeal}
                    />
                  </div>
                ))}
              </AnimatePresence>
              
              {/* Empty State */}
              {stageDeals.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                    <ApperIcon name="Target" className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No deals in this stage</p>
                  {isDragOver && (
                    <p className="text-xs text-primary-600 mt-2">Drop deal here</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PipelineBoard;