import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    // basic info

    title: {
      type: String,
      //   required: true,
    },

    profileImage: {
      url: String,
      public_id: String,
      //   required: true,
    },

    // bio
    bio: {
      type: String,
      // required: true,
    },

    philosophy: {
      type: String,
      //   required: true,
    },

    // statistics
    stats: [
      {
        label: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],

    tools: [
      {
        name: {
            type: String,
        },
      },
    ],
  },
  { timestamps: true },
);

const About = mongoose.model("About", aboutSchema);

export default About;
