import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme, type ThemeMode } from "@/store/slices/theme";
import { type RootState } from "@/store";
import {
  useCurrentUserQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  // Ensure your userApi has this mutation
  // useUpdateMerchantDocsMutation,
} from "@/store/slices/userApi";
import { toast } from "sonner";

import {
  User,
  Bell,
  Paintbrush,
  Lock,
  Trash2,
  CheckCircle2,
  Key,
  ChevronRight,
  Camera,
  Loader2,
  ShieldCheck,
  FileUp,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme.mode);

  // RTK Query Logic
  const { data: user, isLoading: isUserLoading } = useCurrentUserQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [updateAvatar, { isLoading: isUploadingAvatar }] =
    useUpdateAvatarMutation();

  const [formData, setFormData] = useState({ name: "", bio: "", email: "" });
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        email: user.email || user.phone || "",
      });
    }
  }, [user]);

  // Apply theme to the document head
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (currentTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(currentTheme);
    }
  }, [currentTheme]);

  const handleSave = async () => {
    try {
      await updateProfile({ name: formData.name, bio: formData.bio }).unwrap();
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append("avatar", file);
    try {
      await updateAvatar(body).unwrap();
      toast.success("Photo updated");
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  if (isUserLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-20">
      <div className="container mx-auto py-10 max-w-6xl px-4 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Settings
            </h2>
            <p className="text-muted-foreground mt-1 text-lg">
              Manage your digital identity and preferences.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="shadow-sm">
              Discard
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="shadow-md shadow-primary/20"
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="account"
          className="flex flex-col lg:flex-row gap-12"
        >
          {/* Sidebar Navigation */}
          <aside className="lg:w-64">
            <TabsList className="flex lg:flex-col h-auto bg-transparent gap-2 p-0 justify-start overflow-x-auto lg:overflow-visible no-scrollbar">
              <NavTrigger
                value="account"
                icon={<User size={18} />}
                label="Account"
              />
              {/* --- NEW MERCHANT TAB TRIGGER --- */}
              {user?.role === "merchant" && (
                <NavTrigger
                  value="verification"
                  icon={<ShieldCheck size={18} />}
                  label="Verification"
                />
              )}
              <NavTrigger
                value="security"
                icon={<Lock size={18} />}
                label="Security"
              />
              <NavTrigger
                value="notifications"
                icon={<Bell size={18} />}
                label="Notifications"
              />
              <NavTrigger
                value="appearance"
                icon={<Paintbrush size={18} />}
                label="Appearance"
              />
            </TabsList>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 max-w-3xl">
            {/* Account Tab */}
            <TabsContent
              value="account"
              className="mt-0 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <section className="space-y-6">
                <div className="flex items-center gap-6 p-6 rounded-2xl bg-white dark:bg-slate-900 border shadow-sm">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-4 border-primary/10">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="text-white" size={20} />
                    </button>
                    <input
                      type="file"
                      ref={avatarInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-xl">Your Photo</h3>
                    <p className="text-sm text-muted-foreground">
                      This will be displayed on your profile.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        Change
                      </Button>
                      {isUploadingAvatar && (
                        <Loader2 className="h-4 w-4 animate-spin mt-2" />
                      )}
                    </div>
                  </div>
                </div>

                <Card className="border-none shadow-lg ring-1 ring-slate-200 dark:ring-slate-800">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <Field
                        label="Full Name"
                        id="name"
                        value={formData.name}
                        onChange={(val: string) =>
                          setFormData({ ...formData, name: val })
                        }
                      />
                    </div>
                    <Field
                      label="Identifier (Email/Phone)"
                      id="email"
                      type="text"
                      value={formData.email}
                      disabled
                    />
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Brief description..."
                        className="resize-none h-32"
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </section>
            </TabsContent>

            {/* --- NEW MERCHANT VERIFICATION TAB CONTENT --- */}
            {user?.role === "merchant" && (
              <TabsContent
                value="verification"
                className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
              >
                <Card className="border-none shadow-lg ring-1 ring-slate-200 dark:ring-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="text-primary" /> Merchant
                      Verification
                    </CardTitle>
                    <CardDescription>
                      Upload your identity documents to verify your merchant
                      account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label>NRC Front Side</Label>
                        <div className="group relative border-2 border-dashed rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer">
                          <FileUp className="mx-auto h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG up to 5MB
                          </p>
                          <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label>NRC Back Side</Label>
                        <div className="group relative border-2 border-dashed rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer">
                          <FileUp className="mx-auto h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG up to 5MB
                          </p>
                          <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        <strong>Note:</strong> Verification usually takes 24-48
                        hours. Your documents are stored securely and encrypted.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Security Tab */}
            <TabsContent
              value="security"
              className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <Card className="border-none shadow-lg ring-1 ring-slate-200 dark:ring-slate-800">
                <CardHeader>
                  <CardTitle>Security Keys</CardTitle>
                  <CardDescription>
                    Add hardware security keys for secure login.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Key size={20} />
                      </div>
                      <div>
                        <p className="font-medium">Yubikey 5C</p>
                        <p className="text-xs text-muted-foreground">
                          Added on Oct 12, 2025
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-muted-foreground group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                  <Button variant="outline" className="w-full border-dashed">
                    Add new key
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent
              value="appearance"
              className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <Card className="border-none shadow-lg ring-1 ring-slate-200 dark:ring-slate-800">
                <CardHeader>
                  <CardTitle>Theme Preference</CardTitle>
                  <CardDescription>
                    Choose how the interface looks to you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <ThemeOption
                      theme="light"
                      active={currentTheme === "light"}
                      onClick={() => dispatch(setTheme("light"))}
                    />
                    <ThemeOption
                      theme="dark"
                      active={currentTheme === "dark"}
                      onClick={() => dispatch(setTheme("dark"))}
                    />
                    <ThemeOption
                      theme="system"
                      active={currentTheme === "system"}
                      onClick={() => dispatch(setTheme("system"))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-100 dark:border-red-950 bg-red-50/30 dark:bg-red-950/10">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <Trash2 size={20} /> Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Actions here cannot be undone.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Delete Account</p>
                    <p className="text-xs text-muted-foreground">
                      Your data will be wiped from our servers.
                    </p>
                  </div>
                  <Button variant="destructive">Deactivate</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

// --- Helper Components ---

const NavTrigger = ({
  value,
  icon,
  label,
}: {
  value: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <TabsTrigger
    value={value}
    className="w-full justify-start gap-3 px-4 py-3 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-slate-200 dark:data-[state=active]:ring-slate-800 transition-all hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </TabsTrigger>
);

const Field = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  disabled,
}: any) => (
  <div className="space-y-2">
    <Label
      htmlFor={id}
      className="text-sm font-semibold text-slate-700 dark:text-slate-300"
    >
      {label}
    </Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="bg-slate-50/50 dark:bg-slate-950/50"
    />
  </div>
);

const ThemeOption = ({
  theme,
  active,
  onClick,
}: {
  theme: ThemeMode;
  active: boolean;
  onClick: () => void;
}) => (
  <div className="space-y-3 cursor-pointer group" onClick={onClick}>
    <div
      className={`
      relative h-28 w-full rounded-xl border-2 p-2 transition-all
      ${active ? "border-primary ring-2 ring-primary/10" : "border-transparent bg-slate-100 dark:bg-slate-800 group-hover:border-slate-300 dark:group-hover:border-slate-600"}
    `}
    >
      <div
        className={`h-full w-full rounded-lg ${theme === "dark" ? "bg-slate-950" : theme === "light" ? "bg-white" : "bg-linear-to-r from-white to-slate-950"}`}
      >
        <div className="p-2 space-y-1.5">
          <div
            className={`h-1.5 w-full rounded ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`}
          />
          <div
            className={`h-1.5 w-3/4 rounded ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`}
          />
        </div>
      </div>
      {active && (
        <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-primary fill-white dark:fill-slate-950" />
      )}
    </div>
    <p
      className={`text-center text-xs capitalize ${active ? "font-bold" : "font-medium"}`}
    >
      {theme}
    </p>
  </div>
);

export default Settings;
