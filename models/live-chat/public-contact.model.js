// models/Contact.model.js
const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const Contact = sequelize.define(
  "Contact",
  {
    id: {
      type: dt.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Section Type: 'contact_info', 'office_locations'
    section: {
      type: dt.ENUM('contact_info', 'office_locations'),
      allowNull: false,
    },
    
    // General Information
    title: {
      type: dt.STRING,
      allowNull: false,
    },
    subtitle: {
      type: dt.STRING,
      allowNull: true,
    },
    description: {
      type: dt.TEXT,
      allowNull: true,
    },
    
    // Contact Details
    phone: {
      type: dt.STRING,
      allowNull: true,
    },
    email: {
      type: dt.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    address: {
      type: dt.TEXT,
      allowNull: true,
    },
    city: {
      type: dt.STRING,
      allowNull: true,
    },
    country: {
      type: dt.STRING,
      allowNull: true,
    },
    working_hours: {
      type: dt.STRING,
      allowNull: true,
    },
    
    // Social Media Links
    whatsapp: {
      type: dt.STRING,
      allowNull: true,
    },
    telegram: {
      type: dt.STRING,
      allowNull: true,
    },
    facebook: {
      type: dt.STRING,
      allowNull: true,
    },
    linkedin: {
      type: dt.STRING,
      allowNull: true,
    },
    instagram: {
      type: dt.STRING,
      allowNull: true,
    },
    imo: {
      type: dt.STRING,
      allowNull: true,
    },
    
    // Map Coordinates
    latitude: {
      type: dt.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: dt.DECIMAL(11, 8),
      allowNull: true,
    },
    
    // Display Properties
    icon: {
      type: dt.STRING,
      allowNull: true,
      defaultValue: "phone",
    },
    color: {
      type: dt.STRING,
      allowNull: true,
      defaultValue: "from-blue-500 to-cyan-400",
    },
    bg_color: {
      type: dt.STRING,
      allowNull: true,
      defaultValue: "bg-blue-500/10",
    },
    display_order: {
      type: dt.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    
    // Additional Details (JSON field for flexibility)
     additional_details: {
      type: dt.TEXT, // Change from dt.JSON to dt.TEXT for MySQL
      allowNull: true,
      defaultValue: '[]', // Default as JSON string
      get() {
        const rawValue = this.getDataValue('additional_details');
        try {
          return rawValue ? JSON.parse(rawValue) : [];
        } catch (error) {
          console.error('Error parsing additional_details:', error);
          return [];
        }
      },
      set(value) {
        if (value) {
          this.setDataValue('additional_details', 
            typeof value === 'string' ? value : JSON.stringify(value)
          );
        } else {
          this.setDataValue('additional_details', '[]');
        }
      }
    },
    
    // Status
    is_active: {
      type: dt.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    
    // Metadata
    created_by: {
      type: dt.STRING,
      allowNull: false,
      defaultValue: "admin",
    },
    updated_by: {
      type: dt.STRING,
      allowNull: true,
    },
  },
 {
    tableName: "contacts",
    timestamps: true,
    hooks: {
      beforeValidate: (contact) => {
        // Auto-format social links
        if (contact.whatsapp && !contact.whatsapp.startsWith('http')) {
          const phone = contact.whatsapp.replace(/\D/g, '');
          contact.whatsapp = `https://wa.me/${phone}`;
        }
        
        if (contact.telegram && !contact.telegram.startsWith('http')) {
          const username = contact.telegram.replace(/^@/, '');
          contact.telegram = `https://t.me/${username}`;
        }
        
        // Ensure additional_details is properly formatted
        if (contact.additional_details) {
          if (typeof contact.additional_details === 'string') {
            try {
              // Parse to validate it's valid JSON
              JSON.parse(contact.additional_details);
            } catch (error) {
              // If not valid JSON, wrap it as a single-item array
              contact.additional_details = JSON.stringify([
                { label: 'Detail', value: contact.additional_details }
              ]);
            }
          } else if (Array.isArray(contact.additional_details)) {
            // Already an array, stringify it
            contact.additional_details = JSON.stringify(contact.additional_details);
          }
        }
      }
    }
  }
  
);

module.exports = Contact;