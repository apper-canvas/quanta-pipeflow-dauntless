import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { format } from "date-fns";

const DealForm = ({ deal, contacts = [], onSave, onCancel }) => {
  const [formData, setFormData] = useState({
title_c: "",
    value_c: "",
    stage_c: "lead",
    contact_id_c: "",
    expected_close_date_c: "",
    probability_c: "25",
    description_c: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (deal) {
setFormData({
        ...deal,
        value_c: deal.value_c.toString(),
        probability_c: deal.probability_c.toString(),
        expected_close_date_c: format(new Date(deal.expected_close_date_c), "yyyy-MM-dd")
      });
    }
  }, [deal]);
  
  const validateForm = () => {
    const newErrors = {};
    
if (!formData.title_c.trim()) {
      newErrors.title_c = "Title is required";
    }
    
if (!formData.value_c || isNaN(formData.value_c) || parseFloat(formData.value_c) <= 0) {
      newErrors.value_c = "Valid deal value is required";
    }
    
if (!formData.contact_id_c) {
      newErrors.contact_id_c = "Contact is required";
    }
    
if (!formData.expected_close_date_c) {
      newErrors.expected_close_date_c = "Expected close date is required";
    }
    
if (!formData.probability_c || isNaN(formData.probability_c) || parseInt(formData.probability_c) < 0 || parseInt(formData.probability_c) > 100) {
      newErrors.probability_c = "Probability must be between 0 and 100";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const dealData = {
...formData,
        value_c: parseFloat(formData.value_c),
        probability_c: parseInt(formData.probability_c)
      };
      
      await onSave(dealData);
      toast.success(deal ? "Deal updated successfully" : "Deal created successfully");
    } catch (error) {
      toast.error("Failed to save deal");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
<Input
        label="Deal Title"
        name="title_c"
        value={formData.title_c}
        onChange={handleChange}
        error={errors.title_c}
        placeholder="Enter deal title"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Input
          label="Deal Value ($)"
          name="value_c"
          type="number"
          step="0.01"
          min="0"
          value={formData.value_c}
          onChange={handleChange}
          error={errors.value_c}
          placeholder="0.00"
        />
        
<Select
          label="Stage"
          name="stage_c"
          value={formData.stage_c}
          onChange={handleChange}
        >
          <option value="lead">Lead</option>
          <option value="qualified">Qualified</option>
          <option value="proposal">Proposal</option>
          <option value="negotiation">Negotiation</option>
          <option value="closed">Closed</option>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Select
          label="Contact"
          name="contact_id_c"
          value={formData.contact_id_c}
          onChange={handleChange}
          error={errors.contact_id_c}
        >
          <option value="">Select a contact</option>
          {contacts.map(contact => (
            <option key={contact.Id} value={contact.Id}>
              {contact.first_name_c} {contact.last_name_c} - {contact.company_c}
            </option>
          ))}
        </Select>
        
<Input
          label="Expected Close Date"
          name="expected_close_date_c"
          type="date"
          value={formData.expected_close_date_c}
          onChange={handleChange}
          error={errors.expected_close_date_c}
        />
      </div>
      
<Input
        label="Probability (%)"
        name="probability_c"
        type="number"
        min="0"
        max="100"
        value={formData.probability_c}
        onChange={handleChange}
        error={errors.probability_c}
        placeholder="0-100"
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
name="description_c"
          value={formData.description_c}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
          placeholder="Enter deal description"
        />
      </div>
      
      <div className="flex space-x-3 pt-4">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <ApperIcon name="Save" className="h-4 w-4 mr-2" />
              {deal ? "Update Deal" : "Create Deal"}
            </>
          )}
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default DealForm;