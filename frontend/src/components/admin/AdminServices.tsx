import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Film,
  Sparkles,
  Clapperboard,
  Palette,
  Music,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Service } from "@/types/models";
import { useToast } from "@/hooks/use-toast";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "@/lib/api/services";

const iconOptions = [
  { value: "Film", label: "Film", icon: Film },
  { value: "Sparkles", label: "Sparkles", icon: Sparkles },
  { value: "Clapperboard", label: "Clapperboard", icon: Clapperboard },
  { value: "Palette", label: "Palette", icon: Palette },
  { value: "Music", label: "Music", icon: Music },
];

const getIconComponent = (iconName: string) => {
  const iconOption = iconOptions.find((opt) => opt.value === iconName);
  return iconOption?.icon || Film;
};

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    icon: "Film",
    title: "",
    description: "",
    features: "",
  });

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      toast({
        title: "Error fetching services",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        icon: service.icon,
        title: service.title,
        description: service.description,
        features: service.features.join(", "),
      });
    } else {
      setEditingService(null);
      setFormData({
        icon: "Film",
        title: "",
        description: "",
        features: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const serviceData = {
      icon: formData.icon,
      title: formData.title,
      description: formData.description,
      features: formData.features.split(",").map((f) => f.trim()),
    };

    try {
      if (editingService) {
        await updateService(editingService._id, serviceData);
        toast({ title: "Service updated successfully!" });
      } else {
        await createService(serviceData);
        toast({ title: "Service added successfully!" });
      }
      await fetchServices();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error saving service",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await deleteService(id);
      setServices(services.filter((s) => s._id !== id));
      toast({ title: "Service deleted successfully!", variant: "destructive" });
    } catch (error) {
      toast({
        title: "Error deleting service",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Services</h1>
          <p className="text-muted-foreground mt-1">
            Manage your service offerings
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) =>
                      setFormData({ ...formData, icon: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <opt.icon className="w-4 h-4" />
                            {opt.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Service title"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the service"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Input
                  id="features"
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  placeholder="Color Grading, Sound Design, Transitions"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingService ? "Save Changes" : "Add Service"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services Grid */}
      {isLoading && services.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = getIconComponent(service.icon);
            return (
              <Card key={service._id} className="border-border/50 group relative">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleOpenDialog(service)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(service._id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-muted rounded-md text-xs text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!isLoading && services.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No services added yet.</p>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
