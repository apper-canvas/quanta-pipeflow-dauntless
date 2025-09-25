import React, { useState, useEffect } from "react";
import ContactCard from "@/components/molecules/ContactCard";
import SearchBar from "@/components/molecules/SearchBar";
import StatusFilter from "@/components/molecules/StatusFilter";
import ContactForm from "@/components/organisms/ContactForm";
import Modal from "@/components/organisms/Modal";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "prospect", label: "Prospect" },
    { value: "inactive", label: "Inactive" }
  ];
  
  const loadContacts = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await contactService.getAll();
      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      setError("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadContacts();
  }, []);
  
  useEffect(() => {
    let filtered = contacts;
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(contact => 
contact.first_name_c.toLowerCase().includes(searchLower) ||
        contact.last_name_c.toLowerCase().includes(searchLower) ||
        contact.email_c.toLowerCase().includes(searchLower) ||
        contact.company_c.toLowerCase().includes(searchLower) ||
        contact.position_c.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
if (statusFilter) {
      filtered = filtered.filter(contact => contact.status_c === statusFilter);
    }
    
    setFilteredContacts(filtered);
  }, [contacts, searchTerm, statusFilter]);
  
  const handleCreateContact = () => {
    setSelectedContact(null);
    setShowForm(true);
  };
  
  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setShowForm(true);
  };
  
  const handleViewContact = (contact) => {
    // For now, just edit - could implement a view-only modal later
    handleEditContact(contact);
  };
  
  const handleDeleteContact = async (contact) => {
    if (window.confirm(`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`)) {
      try {
        await contactService.delete(contact.Id);
        toast.success("Contact deleted successfully");
        loadContacts();
      } catch (err) {
        toast.error("Failed to delete contact");
      }
    }
  };
  
  const handleSaveContact = async (contactData) => {
    try {
      if (selectedContact) {
        await contactService.update(selectedContact.Id, contactData);
      } else {
        await contactService.create(contactData);
      }
      setShowForm(false);
      setSelectedContact(null);
      loadContacts();
    } catch (err) {
      throw new Error("Failed to save contact");
    }
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedContact(null);
  };
  
  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadContacts} />;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600">Manage your customer relationships</p>
        </div>
        <Button onClick={handleCreateContact} className="flex items-center">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contacts..."
          />
        </div>
        <div className="w-full sm:w-48">
          <StatusFilter
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
            placeholder="All Status"
          />
        </div>
      </div>
      
      {/* Contacts Grid */}
      {filteredContacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredContacts.map((contact, index) => (
            <motion.div
              key={contact.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ContactCard
                contact={contact}
                onView={handleViewContact}
                onEdit={handleEditContact}
                onDelete={handleDeleteContact}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <Empty
          title="No contacts found"
          description={searchTerm || statusFilter 
            ? "Try adjusting your search or filter criteria" 
            : "Start building your customer relationships by adding your first contact"
          }
          icon="Users"
          actionLabel={!searchTerm && !statusFilter ? "Add Your First Contact" : null}
          onAction={!searchTerm && !statusFilter ? handleCreateContact : null}
        />
      )}
      
      {/* Contact Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCancelForm}
        title={selectedContact ? "Edit Contact" : "Add New Contact"}
        size="lg"
      >
        <ContactForm
          contact={selectedContact}
          onSave={handleSaveContact}
          onCancel={handleCancelForm}
        />
      </Modal>
    </div>
  );
};

export default Contacts;