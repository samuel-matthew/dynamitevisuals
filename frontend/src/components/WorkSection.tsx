import { useState, useEffect } from "react";
import { Play, ExternalLink, X } from "lucide-react";
import { Project } from "@/types/models";
import { getProjects } from "@/lib/api/projects";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const categories = ["All", "Video Editing", "Motion Graphics", "Animation"];

const WorkSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="work" className="py-24 bg-background relative">
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            Portfolio
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Selected <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A curated collection of projects that showcase my expertise in video
            editing, motion graphics, and animation.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="group relative rounded-xl overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredProject(project._id)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => setSelectedProject(project)}
            >
              {/* Thumbnail */}
              <div className="aspect-[4/3] overflow-hidden">
                {project.thumbnail?.url && (
                  <img
                    src={project.thumbnail.url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                {!project.thumbnail?.url && (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                    No Thumbnail
                  </div>
                )}
              </div>

              {/* Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent transition-opacity duration-300 ${hoveredProject === project._id ? "opacity-100" : "opacity-0"
                  }`}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <span className="text-primary text-xs font-medium uppercase tracking-widest mb-2">
                    {project.category}
                  </span>
                  <h3 className="font-display text-xl font-bold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex gap-3">
                    {project.video?.url && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                        }}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        <Play size={16} />
                        Watch
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      className="flex items-center gap-2 bg-muted text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
                    >
                      <ExternalLink size={16} />
                      Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Default visible info */}
              <div
                className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background to-transparent transition-opacity duration-300 ${hoveredProject === project._id ? "opacity-0" : "opacity-100"
                  }`}
              >
                <span className="text-primary/80 text-xs font-medium uppercase tracking-widest">
                  {project.category}
                </span>
                <h3 className="font-display text-lg font-semibold mt-1">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Project Modal */}
        <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-0 bg-background text-foreground">
            <div className="relative">
              {/* Video Player or Thumbnail Header */}
              <div className="aspect-video w-full bg-black relative">
                {selectedProject?.video?.url ? (
                  <video
                    src={selectedProject.video.url}
                    controls
                    autoPlay
                    className="w-full h-full"
                  />
                ) : (
                  selectedProject?.thumbnail?.url ? (
                    <img
                      src={selectedProject.thumbnail.url}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Video or Image
                    </div>
                  )
                )}
                {/* <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <X size={20} />
                </button> */}
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <Badge variant="outline" className="mb-2 text-primary border-primary/30">
                      {selectedProject?.category}
                    </Badge>
                    <DialogTitle className="font-display text-3xl font-bold mb-2">
                      {selectedProject?.title}
                    </DialogTitle>
                    <DialogDescription className="text-lg text-muted-foreground">
                      {selectedProject?.role}
                    </DialogDescription>
                  </div>
                </div>

                <div className="grid md:grid-cols-[2fr,1fr] gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">About the Project</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedProject?.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {selectedProject?.tools && selectedProject.tools.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                          Tools Used
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.tools.map((tool, index) => (
                            <Badge key={index} variant="secondary" className="bg-muted hover:bg-muted/80">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default WorkSection;
