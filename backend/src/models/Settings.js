import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  // contact info
  email: {
    type: String
  },

  phone: {
    type: String
  },

  whatsapp: {
    type: String
  },

  // social links
  socials: [
    {
      label: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],

  // showreel
  showreel: {
    url: {
      type: String
    },
    public_id: {
      type: String
    }
  },

  
});

const Settings = mongoose.model('Settings', settingSchema)

export default Settings