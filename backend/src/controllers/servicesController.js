import Services from "../models/Services.js";

export const getServices = async (req, res) => {
  try {
    const services = await Services.find().sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { icon, title, description, features } = req.body;

    const service = await Services.create({
      icon,
      title,
      description,
      features,
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error creating service' });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { icon, title, description, features } = req.body;

    const updatedService = await Services.findByIdAndUpdate(
      id,
      {
        icon,
        title,
        description,
        features,
      },
      { new: true,
        runValidators: true
       },
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: 'Error updating service' });
  }
};


export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Services.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Service' });
  }
};
