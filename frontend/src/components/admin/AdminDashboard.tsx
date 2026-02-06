import { useEffect, useState } from "react";
import { FolderOpen, MessageSquare, Eye, TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjects } from "@/lib/api/projects";
import { getTestimonials } from "@/lib/api/testimonials";
import { Project, Testimonial } from "@/types/models";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    {
      title: "Total Projects",
      value: "0",
      icon: FolderOpen,
      change: "+0 this month",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      link: "/admin/projects",
    },
    {
      title: "Testimonials",
      value: "0",
      icon: MessageSquare,
      change: "+0 this week",
      color: "text-green-500",
      bg: "bg-green-500/10",
      link: "/admin/testimonials",
    },
    {
      title: "Portfolio Views",
      value: "0",
      icon: Eye,
      change: " Coming soon",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      link: "/",
    },
    {
      title: "Inquiries",
      value: "0",
      icon: TrendingUp,
      change: "Coming soon",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      link: "/admin/settings",
    },
  ]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, testimonialsData] = await Promise.all([
          getProjects(),
          getTestimonials(),
        ]);

        setStats([
          {
            title: "Total Projects",
            value: projectsData.length.toString(),
            icon: FolderOpen,
            change: `Updated today`,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            link: "/admin/projects",
          },
          {
            title: "Testimonials",
            value: testimonialsData.length.toString(),
            icon: MessageSquare,
            change: `Updated today`,
            color: "text-green-500",
            bg: "bg-green-500/10",
            link: "/admin/testimonials",
          },
          {
            title: "Portfolio Views",
            value: "2,847",
            icon: Eye,
            change: "+12% from last month",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            link: "/",
          },
          {
            title: "Inquiries",
            value: "24",
            icon: TrendingUp,
            change: "+8 this month",
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            link: "/admin/settings",
          },
        ]);

        setRecentProjects(projectsData.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your portfolio overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="border-border/50 hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Projects */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProjects.length === 0 ? (
              <p className="text-muted-foreground text-sm">No specific projects found.</p>
            ) : (
              recentProjects.map((project) => (
                <div
                  key={project._id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  {project.thumbnail?.url ? (
                    <img
                      src={project.thumbnail.url}
                      alt={project.title}
                      className="w-16 h-12 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                      <FolderOpen className="w-6 h-6 text-gray-400" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{project.title}</h4>
                    <p className="text-sm text-muted-foreground">{project.category}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.featured
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                    }`}>
                    {project.featured ? "Featured" : "Standard"}
                  </span>
                </div>
              ))
            )}

          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/projects" className="p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-center block">
              <FolderOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Add Project</span>
            </Link>
            <Link to="/admin/testimonials" className="p-4 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors text-center block">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <span className="text-sm font-medium">Add Testimonial</span>
            </Link>
            <Link to="/" className="p-4 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors text-center block">
              <Eye className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <span className="text-sm font-medium">View Site</span>
            </Link>
            <Link to="/admin/settings" className="p-4 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 transition-colors text-center block">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-orange-500" />
              <span className="text-sm font-medium">Analytics</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
