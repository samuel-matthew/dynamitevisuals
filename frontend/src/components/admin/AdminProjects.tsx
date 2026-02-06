import { useState, useRef, useEffect } from "react";
import { Plus, Pencil, Trash2, Star, Search, Filter, Upload, X, ImageIcon, Loader2 } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { projectCategories } from "@/data/mockData";
import { Project } from "@/types/models";
import { useToast } from "@/hooks/use-toast";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/api/projects";

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    role: "",
    tools: "",
    featured: false,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      toast({
        title: "Error fetching projects",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || project.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        category: project.category,
        description: project.description,
        role: project.role,
        tools: project.tools.join(", "),
        featured: project.featured,
      });
      setThumbnailPreview(project.thumbnail?.url || null);
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        category: "",
        description: "",
        role: "",
        tools: "",
        featured: false,
      });
      setThumbnailPreview(null);
    }
    setVideoFile(null);
    setThumbnailFile(null);
    setIsDialogOpen(true);
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  const removeThumbnailFile = () => {
    setThumbnailFile(null);
    if (thumbnailPreview && !editingProject?.thumbnail?.url) { // only revoke if local blob
      URL.revokeObjectURL(thumbnailPreview);
    }
    if (editingProject?.thumbnail?.url && !thumbnailFile) {
      // If we are editing and user clears the *existing* image, we might want to handle that differently
      // For now, if they click remove, we can clear the preview.
    }
    setThumbnailPreview(null);

    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const removeVideoFile = () => {
    setVideoFile(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("role", formData.role);
    data.append("tools", formData.tools); // Backend parses comma separated string
    data.append("featured", String(formData.featured));

    if (thumbnailFile) {
      data.append("thumbnail", thumbnailFile);
    }
    if (videoFile) {
      data.append("video", videoFile);
    }

    try {
      if (editingProject) {
        await updateProject(editingProject._id, data);
        toast({ title: "Project updated successfully!" });
      } else {
        await createProject(data);
        toast({ title: "Project added successfully!" });
      }
      await fetchProjects();
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error saving project",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p._id !== id));
      toast({ title: "Project deleted successfully!", variant: "destructive" });
    } catch (error) {
      toast({
        title: "Error deleting project",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleFeatured = async (project: Project) => {
    // Optimistic update
    const updatedProjects = projects.map((p) =>
      p._id === project._id ? { ...p, featured: !p.featured } : p
    );
    setProjects(updatedProjects);

    const data = new FormData();
    data.append("featured", String(!project.featured));

    try {
      await updateProject(project._id, data);
    } catch (error) {
      // Revert on error
      setProjects(projects);
      toast({
        title: "Error updating featured status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Edit Project" : "Add New Project"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Project title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Project description"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Your Role</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Lead Editor"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tools">Tools (comma-separated)</Label>
                  <Input
                    id="tools"
                    value={formData.tools}
                    onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                    placeholder="Premiere Pro, After Effects"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Upload Thumbnail</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 transition-colors hover:border-primary/50">
                  {thumbnailFile || thumbnailPreview ? (
                    <div className="flex items-center justify-between gap-3 bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {thumbnailPreview ? (
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            className="w-16 h-10 object-cover rounded-lg flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <ImageIcon className="w-5 h-5 text-primary" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium truncate">{thumbnailFile?.name || "Current Thumbnail"}</p>
                          {thumbnailFile && <p className="text-sm text-muted-foreground">
                            {(thumbnailFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={removeThumbnailFile}
                        className="flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer py-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Click to upload thumbnail</p>
                        <p className="text-sm text-muted-foreground">PNG, JPG, WebP up to 10MB</p>
                      </div>
                      <input
                        ref={thumbnailInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Upload Video (optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 transition-colors hover:border-primary/50">
                  {videoFile ? (
                    <div className="flex items-center justify-between gap-3 bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Upload className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{videoFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={removeVideoFile}
                        className="flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer py-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Click to upload video</p>
                        <p className="text-sm text-muted-foreground">MP4, MOV, AVI up to 500MB</p>
                      </div>
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {editingProject?.video?.url && !videoFile && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Current video: <a href={editingProject.video.url} target="_blank" rel="noreferrer" className="underline">View</a>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured">Featured Project</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingProject ? "Save Changes" : "Add Project"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {projectCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      {isLoading && projects.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project._id} className="overflow-hidden border-border/50 group">
              <div className="relative aspect-video">
                {project.thumbnail?.url ? (
                  <img
                    src={project.thumbnail.url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <ImageIcon className="text-muted-foreground w-10 h-10" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4 gap-2">
                  <Button size="sm" variant="secondary" onClick={() => handleOpenDialog(project)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(project._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {project.featured && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Featured
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold truncate">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.category}</p>
                  </div>
                  <button
                    onClick={() => toggleFeatured(project)}
                    className={`p-2 rounded-lg transition-colors ${project.featured
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <Star className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {project.tools.slice(0, 2).map((tool) => (
                    <span key={tool} className="px-2 py-0.5 bg-muted rounded text-xs">
                      {tool}
                    </span>
                  ))}
                  {project.tools.length > 2 && (
                    <span className="px-2 py-0.5 bg-muted rounded text-xs">
                      +{project.tools.length - 2}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
