import { useState, useRef, useEffect } from "react";
import { Save, Plus, X, Upload, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AboutInfo } from "@/types/models";
import { getAboutInfo, updateAboutInfo } from "@/data/dbData";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/axios";

const AdminAbout = () => {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newTool, setNewTool] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // 🔹 FETCH FROM BACKEND
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await getAboutInfo();
        setAboutInfo(data);
      } catch (err) {
        toast({
          title: "Failed to load About info",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, [toast]);

  if (loading) return <p>Loading...</p>;
  if (!aboutInfo) return <p>No about data found</p>;

  // 🔹 IMAGE HANDLING
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  const removeProfileImage = () => {
    if (profileImagePreview) URL.revokeObjectURL(profileImagePreview);
    setProfileImageFile(null);
    setProfileImagePreview(null);
    setAboutInfo({ ...aboutInfo, profileImage: "" }); // Clear existing image in state

    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = "";
    }
  };

  // 🔹 SAVE TO BACKEND
  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();

      formData.append("name", aboutInfo.name);
      formData.append("title", aboutInfo.title);
      formData.append("bio", aboutInfo.bio);
      formData.append("philosophy", aboutInfo.philosophy);
      formData.append("stats", JSON.stringify(aboutInfo.stats));
      formData.append("tools", JSON.stringify(aboutInfo.tools));

      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      } else if (aboutInfo.profileImage === "") {
        // Explicitly remove if empty string
        formData.append("profileImage", "");
      }

      await updateAboutInfo(formData);

      toast({ title: "About info saved successfully!" });
    } catch (err) {
      toast({
        title: "Failed to save About info",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // 🔹 STATS
  const handleAddStat = () => {
    setAboutInfo({
      ...aboutInfo,
      stats: [...aboutInfo.stats, { label: "", value: "" }],
    });
  };

  const handleRemoveStat = (index: number) => {
    setAboutInfo({
      ...aboutInfo,
      stats: aboutInfo.stats.filter((_, i) => i !== index),
    });
  };

  const handleUpdateStat = (
    index: number,
    field: "label" | "value",
    value: string
  ) => {
    const stats = [...aboutInfo.stats];
    stats[index] = { ...stats[index], [field]: value };
    setAboutInfo({ ...aboutInfo, stats });
  };

  // 🔹 TOOLS
  const handleAddTool = () => {
    if (!newTool.trim()) return;

    setAboutInfo({
      ...aboutInfo,
      tools: [...aboutInfo.tools, { name: newTool.trim() }],
    });
    setNewTool("");
  };

  const handleRemoveTool = (index: number) => {
    setAboutInfo({
      ...aboutInfo,
      tools: aboutInfo.tools.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">About Me</h1>
          <p className="text-muted-foreground">Manage personal info</p>
        </div>
        <Button onClick={handleSave} className="gap-2" disabled={saving}>
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BASIC INFO */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Name"
              value={aboutInfo.name}
              onChange={(e) =>
                setAboutInfo({ ...aboutInfo, name: e.target.value })
              }
            />
            <Input
              placeholder="Title"
              value={aboutInfo.title}
              onChange={(e) =>
                setAboutInfo({ ...aboutInfo, title: e.target.value })
              }
            />

            <input
              type="file"
              ref={profileImageInputRef}
              onChange={handleProfileImageChange}
              accept="image/*"
              className="hidden"
            />

            {!profileImageFile && !aboutInfo.profileImage ? (
              <div
                onClick={() => profileImageInputRef.current?.click()}
                className="border-dashed border-2 p-6 text-center cursor-pointer"
              >
                <Upload className="mx-auto mb-2" />
                <p>Upload profile image</p>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <img
                  src={
                    profileImagePreview ||
                    (typeof aboutInfo.profileImage === 'string' ? aboutInfo.profileImage : aboutInfo.profileImage?.url)
                  }
                  className="w-24 h-24 rounded object-cover"
                />
                <Button variant="ghost" onClick={removeProfileImage}>
                  <X />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* BIO */}
        <Card>
          <CardHeader>
            <CardTitle>Bio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={aboutInfo.bio}
              onChange={(e) =>
                setAboutInfo({ ...aboutInfo, bio: e.target.value })
              }
            />
            <Textarea
              value={aboutInfo.philosophy}
              onChange={(e) =>
                setAboutInfo({ ...aboutInfo, philosophy: e.target.value })
              }
            />
          </CardContent>
        </Card>

        {/* STATS */}
        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Stats</CardTitle>
            <Button size="sm" onClick={handleAddStat}>
              <Plus />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {aboutInfo.stats.map((stat, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={stat.label}
                  onChange={(e) =>
                    handleUpdateStat(i, "label", e.target.value)
                  }
                />
                <Input
                  value={stat.value}
                  onChange={(e) =>
                    handleUpdateStat(i, "value", e.target.value)
                  }
                />
                <Button size="icon" variant="ghost" onClick={() => handleRemoveStat(i)}>
                  <X />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* TOOLS */}
        <Card>
          <CardHeader>
            <CardTitle>Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-3">
              <Input
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                placeholder="Add tool"
              />
              <Button onClick={handleAddTool}>
                <Plus />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {aboutInfo.tools.map((tool, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-muted rounded-full flex items-center gap-1"
                >
                  {tool.name}
                  <button onClick={() => handleRemoveTool(i)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAbout;
