import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Star, Loader2 } from "lucide-react";
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
import { Testimonial } from "@/types/models";
import { useToast } from "@/hooks/use-toast";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/api/testimonials";

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const fetchTestimonials = async () => {
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      toast({
        title: "Error fetching testimonials",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        role: testimonial.role,
        content: testimonial.content,
        rating: testimonial.rating,
      });
      setAvatarFile(null); // Reset file input
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: "",
        role: "",
        content: "",
        rating: 5,
      });
      setAvatarFile(null);
    }
    setIsDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("role", formData.role);
      data.append("content", formData.content);
      data.append("rating", formData.rating.toString());
      if (avatarFile) {
        data.append("avatar", avatarFile);
      }

      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial._id, data);
        toast({ title: "Testimonial updated successfully!" });
      } else {
        await createTestimonial(data);
        toast({ title: "Testimonial added successfully!" });
      }

      await fetchTestimonials();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error saving testimonial",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      await deleteTestimonial(id);
      setTestimonials(testimonials.filter((t) => t._id !== id));
      toast({
        title: "Testimonial deleted successfully!",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error deleting testimonial",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Testimonials</h1>
          <p className="text-muted-foreground mt-1">
            Manage client testimonials
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial
                  ? "Edit Testimonial"
                  : "Add New Testimonial"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Client Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role / Company</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    placeholder="CEO, TechCorp"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar Image</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {editingTestimonial?.avatar?.url && !avatarFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Current: <a href={editingTestimonial.avatar.url} target="_blank" rel="noreferrer" className="underline">View Image</a>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Testimonial</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="What did the client say?"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating })}
                      className={`p-2 rounded-lg transition-colors ${formData.rating >= rating
                          ? "text-yellow-500"
                          : "text-muted-foreground"
                        }`}
                    >
                      <Star
                        className="w-6 h-6"
                        fill={
                          formData.rating >= rating ? "currentColor" : "none"
                        }
                      />
                    </button>
                  ))}
                </div>
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
                    editingTestimonial ? "Save Changes" : "Add Testimonial"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Testimonials Grid */}
      {isLoading && testimonials.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial._id} className="border-border/50 group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {testimonial.avatar?.url ? (
                      <img
                        src={testimonial.avatar.url}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleOpenDialog(testimonial)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(testimonial._id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < testimonial.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted"
                        }`}
                    />
                  ))}
                </div>

                <p className="text-muted-foreground text-sm italic">
                  "{testimonial.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && testimonials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No testimonials added yet.</p>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
