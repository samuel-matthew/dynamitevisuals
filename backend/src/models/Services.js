import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
    icon: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    features: [String]
},
{timestamps: true}
)

const Services = mongoose.model("Services", ServiceSchema)

export default Services