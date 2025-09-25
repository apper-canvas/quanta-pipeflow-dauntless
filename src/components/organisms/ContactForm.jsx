import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ContactForm = ({ contact, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
first_name_c: "",
    last_name_c: "",
    email_c: "",
    phone_c: "",
    company_c: "",
    position_c: "",
    status_c: "prospect"
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (contact) {
      setFormData(contact);
    }
  }, [contact]);
  
  const validateForm = () => {
    const newErrors = {};
    
if (!formData.first_name_c.trim()) {
      newErrors.first_name_c = "First name is required";
    }
    
if (!formData.last_name_c.trim()) {
      newErrors.last_name_c = "Last name is required";
    }
    
if (!formData.email_c.trim()) {
      newErrors.email_c = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = "Email is invalid";
    }
    
if (!formData.phone_c.trim()) {
      newErrors.phone_c = "Phone is required";
    }
    
if (!formData.company_c.trim()) {
      newErrors.company_c = "Company is required";
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
      await onSave(formData);
      toast.success(contact ? "Contact updated successfully" : "Contact created successfully");
    } catch (error) {
      toast.error("Failed to save contact");
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Input
          label="First Name"
          name="first_name_c"
          value={formData.first_name_c}
          onChange={handleChange}
          error={errors.first_name_c}
          placeholder="Enter first name"
        />
        
        <Input
label="Last Name"
          name="last_name_c"
          value={formData.last_name_c}
          onChange={handleChange}
          error={errors.last_name_c}
          placeholder="Enter last name"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Input
          label="Email"
          name="email_c"
          type="email"
          value={formData.email_c}
          onChange={handleChange}
          error={errors.email_c}
          placeholder="Enter email address"
        />
        
<Input
          label="Phone"
          name="phone_c"
          value={formData.phone_c}
          onChange={handleChange}
          error={errors.phone_c}
          placeholder="Enter phone number"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Input
          label="Company"
          name="company_c"
          value={formData.company_c}
          onChange={handleChange}
          error={errors.company_c}
          placeholder="Enter company name"
        />
        
<Input
          label="Position"
          name="position_c"
          value={formData.position_c}
          onChange={handleChange}
          placeholder="Enter job position"
        />
      </div>
      
<Select
        label="Status"
        name="status_c"
        value={formData.status_c}
        onChange={handleChange}
      >
        <option value="prospect">Prospect</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </Select>
      
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
              {contact ? "Update Contact" : "Create Contact"}
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

export default ContactForm;