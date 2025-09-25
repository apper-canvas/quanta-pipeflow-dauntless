import React from "react";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const ContactCard = ({ contact, onView, onEdit, onDelete }) => {
  const getStatusVariant = (status) => {
    const statusMap = {
      "active": "success",
      "prospect": "primary",
      "inactive": "default"
    };
    return statusMap[status] || "default";
  };
  
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary-500">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar 
              name={`${contact.firstName} ${contact.lastName}`} 
              size="lg"
            />
            <div>
              <h3 className="font-semibold text-gray-900">
                {contact.firstName} {contact.lastName}
              </h3>
              <p className="text-sm text-gray-600">{contact.position}</p>
            </div>
          </div>
          <Badge variant={getStatusVariant(contact.status)}>
            {contact.status}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Building" className="h-4 w-4 mr-2" />
            {contact.company}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
            {contact.email}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
            {contact.phone}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => onView(contact)}
            className="flex-1"
          >
            <ApperIcon name="Eye" className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(contact)}
          >
            <ApperIcon name="Edit" className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(contact)}
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default ContactCard;