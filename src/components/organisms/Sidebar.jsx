import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const navigationItems = [
    {
      label: "Dashboard",
      icon: "LayoutDashboard",
      path: "/"
    },
    {
      label: "Contacts",
      icon: "Users",
      path: "/contacts"
    },
    {
      label: "Deals",
      icon: "Target",
      path: "/deals"
    },
    {
      label: "Activities",
      icon: "Activity",
      path: "/activities"
    },
    {
      label: "Reports",
      icon: "BarChart3",
      path: "/reports"
    }
  ];
  
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0 lg:w-64">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Waves" className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">PipeFlow CRM</h1>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive(item.path)
                    ? "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border-r-2 border-primary-500"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <ApperIcon name={item.icon} className="h-5 w-5 mr-3" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
            onClick={onClose}
          ></div>
          
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Waves" className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold gradient-text">PipeFlow CRM</h1>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </button>
            </div>
            
            {/* Mobile Navigation */}
            <nav className="px-4 py-6 space-y-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive(item.path)
                      ? "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border-r-2 border-primary-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <ApperIcon name={item.icon} className="h-5 w-5 mr-3" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;