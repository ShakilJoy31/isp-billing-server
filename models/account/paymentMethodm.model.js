const { DataTypes: dt } = require("sequelize");
const sequelize = require("../../database/connection");

const PaymentMethod = sequelize.define(
  "payment-method",
  {
    id: {
      type: dt.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    methodId: {
      type: dt.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isIn: [['bkash', 'nagad', 'rocket', 'upay']]
      }
    },
    name: {
      type: dt.STRING,
      allowNull: false,
    },
    iconUrl: {
      type: dt.STRING,
      allowNull: true,
    },
    isActive: {
      type: dt.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    merchantNumber: {
      type: dt.STRING,
      allowNull: false,
    },
    merchantName: {
      type: dt.STRING,
      allowNull: false,
    },
    paymentType: {
      type: dt.STRING,
      allowNull: false,
    },
    hasQRCode: {
      type: dt.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    qrCodeUrl: {
      type: dt.STRING,
      allowNull: true,
    },
    colors: {
      type: dt.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('colors');
        if (!rawValue) return {
          primary: '#000000',
          secondary: '#ffffff',
          gradient: 'linear-gradient(135deg, #000000 0%, #ffffff 100%)'
        };
        try {
          return JSON.parse(rawValue);
        } catch {
          return {
            primary: '#000000',
            secondary: '#ffffff',
            gradient: 'linear-gradient(135deg, #000000 0%, #ffffff 100%)'
          };
        }
      },
      set(value) {
        if (typeof value === 'object') {
          this.setDataValue('colors', JSON.stringify(value));
        } else {
          this.setDataValue('colors', value);
        }
      }
    },
    // App Instructions (Mobile App)
    appInstructions: {
      type: dt.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('appInstructions');
        if (!rawValue) return [];
        try {
          return JSON.parse(rawValue);
        } catch {
          return [];
        }
      },
      set(value) {
        if (Array.isArray(value)) {
          this.setDataValue('appInstructions', JSON.stringify(value));
        } else {
          this.setDataValue('appInstructions', value);
        }
      }
    },
    // Manual Instructions (USSD)
    manualInstructions: {
      type: dt.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('manualInstructions');
        if (!rawValue) return [];
        try {
          return JSON.parse(rawValue);
        } catch {
          return [];
        }
      },
      set(value) {
        if (Array.isArray(value)) {
          this.setDataValue('manualInstructions', JSON.stringify(value));
        } else {
          this.setDataValue('manualInstructions', value);
        }
      }
    },
    // QR Code specific instructions (if applicable)
    qrInstructions: {
      type: dt.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('qrInstructions');
        if (!rawValue) return {
          title: "",
          scanInstruction: "",
          steps: [],
          importantNote: ""
        };
        try {
          return JSON.parse(rawValue);
        } catch {
          return {
            title: "",
            scanInstruction: "",
            steps: [],
            importantNote: ""
          };
        }
      },
      set(value) {
        if (typeof value === 'object') {
          this.setDataValue('qrInstructions', JSON.stringify(value));
        } else {
          this.setDataValue('qrInstructions', value);
        }
      }
    },
    // Important notes that appear for all payment methods
    importantNotes: {
      type: dt.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('importantNotes');
        if (!rawValue) return [];
        try {
          return JSON.parse(rawValue);
        } catch {
          return [];
        }
      },
      set(value) {
        if (Array.isArray(value)) {
          this.setDataValue('importantNotes', JSON.stringify(value));
        } else {
          this.setDataValue('importantNotes', value);
        }
      }
    },
    // Status
    status: {
      type: dt.STRING,
      allowNull: false,
      defaultValue: "active",
      validate: {
        isIn: [['active', 'inactive', 'coming_soon']]
      }
    },
    createdBy: {
      type: dt.STRING,
      allowNull: true,
    },
    updatedBy: {
      type: dt.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "payment-methods",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['methodId']
      },
      {
        fields: ['status']
      }
    ]
  }
);

module.exports = PaymentMethod;