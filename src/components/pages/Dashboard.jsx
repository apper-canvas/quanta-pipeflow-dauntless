import React, { useState, useEffect } from "react";
import MetricCard from "@/components/molecules/MetricCard";
import ActivityItem from "@/components/molecules/ActivityItem";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [contactsData, dealsData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getRecent(5)
      ]);
      
      setContacts(contactsData);
      setDeals(dealsData);
      setActivities(activitiesData);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const calculateMetrics = () => {
    const totalContacts = contacts.length;
    const activeContacts = contacts.filter(c => c.status === "active").length;
    const totalDeals = deals.length;
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const closedDeals = deals.filter(d => d.stage === "closed").length;
    const pipelineValue = deals
      .filter(d => d.stage !== "closed")
      .reduce((sum, deal) => sum + deal.value, 0);
    
    return {
      totalContacts,
      activeContacts,
      totalDeals,
      totalValue,
      closedDeals,
      pipelineValue
    };
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const getDealsByStage = () => {
    const stages = ["lead", "qualified", "proposal", "negotiation", "closed"];
    return stages.map(stage => ({
      stage,
      count: deals.filter(d => d.stage === stage).length,
      value: deals.filter(d => d.stage === stage).reduce((sum, deal) => sum + deal.value, 0)
    }));
  };
  
  if (loading) return <Loading type="skeleton" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;
  
  const metrics = calculateMetrics();
  const stageData = getDealsByStage();
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-primary-100">
              Here's what's happening with your sales pipeline today.
            </p>
          </div>
          <div className="hidden md:block">
            <ApperIcon name="TrendingUp" className="h-16 w-16 text-primary-200" />
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MetricCard
            title="Total Contacts"
            value={metrics.totalContacts}
            icon="Users"
            change={`${metrics.activeContacts} active`}
            changeType="positive"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MetricCard
            title="Active Deals"
            value={metrics.totalDeals}
            icon="Target"
            change={`${metrics.closedDeals} closed`}
            changeType="positive"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MetricCard
            title="Pipeline Value"
            value={formatCurrency(metrics.pipelineValue)}
            icon="DollarSign"
            change="Active deals"
            changeType="neutral"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(metrics.totalValue)}
            icon="TrendingUp"
            change="All deals"
            changeType="positive"
          />
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Pipeline Overview
              </h2>
              <ApperIcon name="BarChart3" className="h-5 w-5 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              {stageData.map((stage, index) => (
                <div key={stage.stage} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"></div>
                    <span className="font-medium capitalize text-gray-900">
                      {stage.stage}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {stage.count} deals
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatCurrency(stage.value)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
        
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Activities
              </h2>
              <ApperIcon name="Activity" className="h-5 w-5 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <ActivityItem 
                  key={activity.Id} 
                  activity={activity} 
                  isLast={index === activities.length - 1}
                />
              ))}
              
              {activities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Activity" className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No recent activities</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;