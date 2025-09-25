import React, { useState, useEffect } from "react";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import DealForm from "@/components/organisms/DealForm";
import Modal from "@/components/organisms/Modal";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  
  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load deals");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  const handleCreateDeal = () => {
    setSelectedDeal(null);
    setShowForm(true);
  };
  
  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setShowForm(true);
  };
  
  const handleDeleteDeal = async (deal) => {
    if (window.confirm(`Are you sure you want to delete the deal "${deal.title}"?`)) {
      try {
        await dealService.delete(deal.Id);
        toast.success("Deal deleted successfully");
        loadData();
      } catch (err) {
        toast.error("Failed to delete deal");
      }
    }
  };
  
  const handleDealUpdate = async (updatedDeal) => {
    try {
      await dealService.update(updatedDeal.Id, updatedDeal);
      toast.success("Deal updated successfully");
      loadData();
    } catch (err) {
      toast.error("Failed to update deal");
    }
  };
  
  const handleSaveDeal = async (dealData) => {
    try {
      if (selectedDeal) {
        await dealService.update(selectedDeal.Id, dealData);
      } else {
        await dealService.create(dealData);
      }
      setShowForm(false);
      setSelectedDeal(null);
      loadData();
    } catch (err) {
      throw new Error("Failed to save deal");
    }
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedDeal(null);
  };
  
  const calculateTotalValue = () => {
    return deals.reduce((total, deal) => total + deal.value, 0);
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
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals Pipeline</h1>
          <p className="text-gray-600">
            Track and manage your sales opportunities • Total Value: {formatCurrency(calculateTotalValue())}
          </p>
        </div>
        <Button onClick={handleCreateDeal} className="flex items-center">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Deal
        </Button>
      </div>
      
      {/* Pipeline Board */}
      {deals.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <PipelineBoard
            deals={deals}
            onDealUpdate={handleDealUpdate}
            onEditDeal={handleEditDeal}
            onDeleteDeal={handleDeleteDeal}
          />
        </div>
      ) : (
        <Empty
          title="No deals in your pipeline"
          description="Start tracking your sales opportunities by creating your first deal"
          icon="Target"
          actionLabel="Create Your First Deal"
          onAction={handleCreateDeal}
        />
      )}
      
      {/* Deal Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCancelForm}
        title={selectedDeal ? "Edit Deal" : "Add New Deal"}
        size="lg"
      >
        <DealForm
          deal={selectedDeal}
          contacts={contacts}
          onSave={handleSaveDeal}
          onCancel={handleCancelForm}
        />
      </Modal>
    </div>
  );
};

export default Deals;