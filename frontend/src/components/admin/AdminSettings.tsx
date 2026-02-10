import { useState, useEffect } from "react";
import { Save, Plus, X, Loader2, Play, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getSettings, updateSettings } from "@/lib/api/settings";
import { api } from "@/lib/axios";
import { Settings } from "@/types/models";

const AdminSettings = () => {
  const [settings, setSettings] = useState<Partial<Settings>>({
    email: "",
    phone: "",
    whatsapp: "",
    socials: [],
  });
  const [showreelFile, setShowreelFile] = useState<File | null>(null);
  const [showreelPreview, setShowreelPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error("Settings fetch error:", error);
        toast({
          title: "Error fetching settings",
          description: "Please check your connection.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [toast]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (showreelPreview) {
        URL.revokeObjectURL(showreelPreview);
      }
    };
  }, [showreelPreview]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();

      // Append text fields
      formData.append("email", settings.email || "");
      formData.append("phone", settings.phone || "");
      formData.append("whatsapp", settings.whatsapp || "");
      formData.append("socials", JSON.stringify(settings.socials || []));

      // Append showreel file if selected
      if (showreelFile) {
        formData.append("showreel", showreelFile);
      }

      const updatedSettings = await updateSettings(formData);
      setSettings(updatedSettings);
      setShowreelFile(null);
      toast({ title: "Settings saved successfully!" });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSocialLink = () => {
    setSettings({
      ...settings,
      socials: [...(settings.socials || []), { label: "", value: "" }],
    });
  };

  const handleRemoveSocialLink = (index: number) => {
    const updatedSocials = [...(settings.socials || [])];
    updatedSocials.splice(index, 1);
    setSettings({
      ...settings,
      socials: updatedSocials,
    });
  };

  const handleUpdateSocialLink = (
    index: number,
    field: "label" | "value",
    value: string,
  ) => {
    const updatedSocials = [...(settings.socials || [])];
    updatedSocials[index] = { ...updatedSocials[index], [field]: value };
    setSettings({ ...settings, socials: updatedSocials });
  };

  const handleChangePassword = async () => {
    // Validate inputs
    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Weak password",
        description: "New password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.post("/auth/change-password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast({
        title: "Password changed successfully!",
        description: "Your password has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error changing password",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleShowreelFile = (file: File | null) => {
    setShowreelFile(file);

    // Create preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setShowreelPreview(previewUrl);
    } else {
      if (showreelPreview) {
        URL.revokeObjectURL(showreelPreview);
      }
      setShowreelPreview(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith("video/")) {
      handleShowreelFile(files[0]);
    } else {
      toast({
        title: "Invalid file",
        description: "Please drop a video file",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your portfolio settings
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2" disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Your contact details displayed on the site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={settings.whatsapp}
                onChange={(e) =>
                  setSettings({ ...settings, whatsapp: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Showreel */}
        <Card>
          <CardHeader>
            <CardTitle>Showreel</CardTitle>
            <CardDescription>
              Upload your showreel video file (MP4, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current showreel or preview */}
            {(showreelPreview || settings.showreel?.url) && (
              <div className="space-y-2">
                <Label>
                  {showreelPreview ? "Preview" : "Current Showreel"}
                </Label>
                <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden bg-muted">
                  <video
                    src={showreelPreview || settings.showreel?.url}
                    controls
                    className="w-full h-full"
                  />
                </div>
                {showreelPreview && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShowreelFile(null)}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
            )}

            {/* Drag and drop zone */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                id="showreel"
                type="file"
                accept="video/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleShowreelFile(file);
                  }
                }}
              />
              <div className="flex flex-col items-center gap-2 pointer-events-none">
                <Play className="w-8 h-8 text-muted-foreground" />
                <p className="font-medium">
                  {showreelFile
                    ? showreelFile.name
                    : "Drop your showreel here or click to browse"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports MP4, MOV, WebM files
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>
                Links to your social media profiles
              </CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={handleAddSocialLink}>
              <Plus className="w-4 h-4 mr-1" />
              Add Link
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.socials?.map((link, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Platform (e.g. LinkedIn)"
                    value={link.label}
                    onChange={(e) =>
                      handleUpdateSocialLink(index, "label", e.target.value)
                    }
                  />
                  <Input
                    placeholder="URL"
                    value={link.value}
                    onChange={(e) =>
                      handleUpdateSocialLink(index, "value", e.target.value)
                    }
                  />
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemoveSocialLink(index)}
                  className="shrink-0"
                >
                  <X className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
            {(!settings.socials || settings.socials.length === 0) && (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No social links added yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Old Password</Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showPasswords.oldPassword ? "text" : "password"}
                  placeholder="Enter your old password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  disabled={isChangingPassword}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      oldPassword: !showPasswords.oldPassword,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.oldPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.newPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  disabled={isChangingPassword}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      newPassword: !showPasswords.newPassword,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.newPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  disabled={isChangingPassword}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      confirmPassword: !showPasswords.confirmPassword,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.confirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              onClick={handleChangePassword}
              className="w-full"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
