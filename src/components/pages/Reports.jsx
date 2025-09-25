import React, { useState, useEffect } from "react";
import MetricCard from "@/components/molecules/MetricCard";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";
import { motion } from "framer-motion";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";

const Reports = () => {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [contactsData, dealsData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ]);
      
      setContacts(contactsData);
      setDeals(dealsData);
      setActivities(activitiesData);
    } catch (err) {
      setError("Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  const calculateMetrics = () => {
    const totalContacts = contacts.length;
    const activeContacts = contacts.filter(c => c.status === "active").length;
    const prospectContacts = contacts.filter(c => c.status === "prospect").length;
    
    const totalDeals = deals.length;
    const closedDeals = deals.filter(d => d.stage === "closed").length;
    const totalRevenue = deals
      .filter(d => d.stage === "closed")
      .reduce((sum, deal) => sum + deal.value, 0);
    const pipelineValue = deals
      .filter(d => d.stage !== "closed")
      .reduce((sum, deal) => sum + deal.value, 0);
    
    const conversionRate = totalDeals > 0 ? (closedDeals / totalDeals) * 100 : 0;
    
    // Activities this month
    const thisMonth = new Date();
    const monthStart = startOfMonth(thisMonth);
    const monthEnd = endOfMonth(thisMonth);
    
    const monthlyActivities = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= monthStart && activityDate <= monthEnd;
    }).length;
    
    return {
      totalContacts,
      activeContacts,
      prospectContacts,
      totalDeals,
      closedDeals,
      totalRevenue,
      pipelineValue,
      conversionRate,
      monthlyActivities
    };
  };
  
  const getDealsByStage = () => {
    const stages = ["lead", "qualified", "proposal", "negotiation", "closed"];
    return stages.map(stage => {
      const stageDeals = deals.filter(d => d.stage === stage);
      return {
        stage: stage.charAt(0).toUpperCase() + stage.slice(1),
        count: stageDeals.length,
        value: stageDeals.reduce((sum, deal) => sum + deal.value, 0),
        percentage: deals.length > 0 ? (stageDeals.length / deals.length) * 100 : 0
      };
    });
  };
  
  const getTopContacts = () => {
    const contactDeals = contacts.map(contact => {
      const contactDealsData = deals.filter(d => d.contactId === contact.Id);
      const totalValue = contactDealsData.reduce((sum, deal) => sum + deal.value, 0);
      const dealCount = contactDealsData.length;
      
      return {
        ...contact,
        dealCount,
        totalValue
      };
    });
    
    return contactDeals
      .filter(contact => contact.dealCount > 0)
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5);
  };
  
  const getActivityBreakdown = () => {
    const types = ["call", "email", "meeting", "note", "task"];
    return types.map(type => {
      const typeActivities = activities.filter(a => a.type === type);
      return {
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count: typeActivities.length,
        percentage: activities.length > 0 ? (typeActivities.length / activities.length) * 100 : 0
      };
    });
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  if (loading) return <Loading type="skeleton" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  
  const metrics = calculateMetrics();
  const stageBreakdown = getDealsByStage();
  const topContacts = getTopContacts();
  const activityBreakdown = getActivityBreakdown();
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">Insights into your sales performance and customer relationships</p>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(metrics.totalRevenue)}
            icon="DollarSign"
            change={`${metrics.closedDeals} closed deals`}
            changeType="positive"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MetricCard
            title="Pipeline Value"
            value={formatCurrency(metrics.pipelineValue)}
            icon="TrendingUp"
            change={`${metrics.totalDeals - metrics.closedDeals} active deals`}
            changeType="positive"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MetricCard
            title="Conversion Rate"
            value={`${metrics.conversionRate.toFixed(1)}%`}
            icon="Target"
            change={`${metrics.closedDeals}/${metrics.totalDeals} deals`}
            changeType={metrics.conversionRate > 50 ? "positive" : "neutral"}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MetricCard
            title="Monthly Activities"
            value={metrics.monthlyActivities}
            icon="Activity"
            change="This month"
            changeType="neutral"
          />
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pipeline Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Pipeline Breakdown
              </h2>
              <ApperIcon name="PieChart" className="h-5 w-5 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              {stageBreakdown.map((stage) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {stage.stage}
                    </span>
                    <span className="text-sm text-gray-600">
                      {stage.count} deals • {formatCurrency(stage.value)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stage.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
        
        {/* Top Contacts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Top Contacts by Value
              </h2>
              <ApperIcon name="Users" className="h-5 w-5 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              {topContacts.map((contact, index) => (
                <div key={contact.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {contact.firstName} {contact.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{contact.company}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(contact.totalValue)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {contact.dealCount} deal{contact.dealCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}
              
              {topContacts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Users" className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No contact data available</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
        
        {/* Contact Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Contact Status
              </h2>
              <ApperIcon name="UserCheck" className="h-5 w-5 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Active</span>
                </div>
                <span className="text-green-700 font-semibold">
                  {metrics.activeContacts}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Prospect</span>
                </div>
                <span className="text-blue-700 font-semibold">
                  {metrics.prospectContacts}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Inactive</span>
                </div>
                <span className="text-gray-700 font-semibold">
                  {metrics.totalContacts - metrics.activeContacts - metrics.prospectContacts}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
        
        {/* Activity Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Activity Breakdown
              </h2>
              <ApperIcon name="BarChart" className="h-5 w-5 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              {activityBreakdown.map((activity) => (
                <div key={activity.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {activity.type}
                    </span>
                    <span className="text-sm text-gray-600">
                      {activity.count} ({activity.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-secondary-500 to-accent-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${activity.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              
              {activityBreakdown.every(activity => activity.count === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Activity" className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No activity data available</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;