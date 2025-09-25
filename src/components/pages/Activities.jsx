import React, { useState, useEffect } from "react";
import ActivityItem from "@/components/molecules/ActivityItem";
import ActivityForm from "@/components/organisms/ActivityForm";
import Modal from "@/components/organisms/Modal";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { activityService } from "@/services/api/activityService";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      setActivities(activitiesData);
      setContacts(contactsData);
      setDeals(dealsData);
      setFilteredActivities(activitiesData);
    } catch (err) {
      setError("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  useEffect(() => {
    let filtered = activities;
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(searchLower) ||
        activity.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter(activity => activity.type === typeFilter);
    }
    
    setFilteredActivities(filtered);
  }, [activities, searchTerm, typeFilter]);
  
  const handleCreateActivity = () => {
    setSelectedActivity(null);
    setShowForm(true);
  };
  
  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setShowForm(true);
  };
  
  const handleDeleteActivity = async (activity) => {
    if (window.confirm(`Are you sure you want to delete the activity "${activity.title}"?`)) {
      try {
        await activityService.delete(activity.Id);
        toast.success("Activity deleted successfully");
        loadData();
      } catch (err) {
        toast.error("Failed to delete activity");
      }
    }
  };
  
  const handleSaveActivity = async (activityData) => {
    try {
      if (selectedActivity) {
        await activityService.update(selectedActivity.Id, activityData);
      } else {
        await activityService.create(activityData);
      }
      setShowForm(false);
      setSelectedActivity(null);
      loadData();
    } catch (err) {
      throw new Error("Failed to save activity");
    }
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedActivity(null);
  };
  
  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? `${contact.firstName} ${contact.lastName}` : "Unknown Contact";
  };
  
  const getDealTitle = (dealId) => {
    const deal = deals.find(d => d.Id === dealId);
    return deal ? deal.title : null;
  };
  
  // Enhance activities with contact and deal information
  const enhancedActivities = filteredActivities.map(activity => ({
    ...activity,
    contactName: getContactName(activity.contactId),
    dealTitle: activity.dealId ? getDealTitle(activity.dealId) : null
  }));
  
  if (loading) return <Loading type="skeleton" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600">Track all customer interactions and communications</p>
        </div>
        <Button onClick={handleCreateActivity} className="flex items-center">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Log Activity
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search activities..."
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            <option value="call">Phone Call</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
            <option value="note">Note</option>
            <option value="task">Task</option>
          </Select>
        </div>
      </div>
      
      {/* Activities Timeline */}
      {enhancedActivities.length > 0 ? (
        <Card>
          <div className="space-y-6">
            {enhancedActivities.map((activity, index) => (
              <motion.div
                key={activity.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <ActivityItem 
                      activity={activity}
                      isLast={index === enhancedActivities.length - 1}
                    />
                    <div className="ml-11 -mt-6 mb-4">
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <ApperIcon name="User" className="h-3 w-3 mr-1" />
                          {activity.contactName}
                        </span>
                        {activity.dealTitle && (
                          <span className="flex items-center">
                            <ApperIcon name="Target" className="h-3 w-3 mr-1" />
                            {activity.dealTitle}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditActivity(activity)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ApperIcon name="Edit" className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(activity)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      ) : (
        <Empty
          title="No activities found"
          description={searchTerm || typeFilter 
            ? "Try adjusting your search or filter criteria" 
            : "Start tracking customer interactions by logging your first activity"
          }
          icon="Activity"
          actionLabel={!searchTerm && !typeFilter ? "Log Your First Activity" : null}
          onAction={!searchTerm && !typeFilter ? handleCreateActivity : null}
        />
      )}
      
      {/* Activity Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCancelForm}
        title={selectedActivity ? "Edit Activity" : "Log New Activity"}
        size="lg"
      >
        <ActivityForm
          activity={selectedActivity}
          contacts={contacts}
          deals={deals}
          onSave={handleSaveActivity}
          onCancel={handleCancelForm}
        />
      </Modal>
    </div>
  );
};

export default Activities;