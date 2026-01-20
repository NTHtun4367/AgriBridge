import React from "react";
import {
  User,
  Bell,
  Paintbrush,
  Lock,
  Trash2,
  CheckCircle2,
  Laptop,
  Smartphone,
  Key,
  // CreditCard,
  ChevronRight,
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
            <Button className="shadow-md shadow-primary/20">
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="account"
          className="flex flex-col lg:flex-row gap-12"
        >
          {/* Sidebar Navigation - Glassmorphism Style */}
          <aside className="lg:w-64">
            <TabsList className="flex lg:flex-col h-auto bg-transparent gap-2 p-0 justify-start overflow-x-auto lg:overflow-visible no-scrollbar">
              <NavTrigger
                value="account"
                icon={<User size={18} />}
                label="Account"
              />
              <NavTrigger
                value="security"
                icon={<Lock size={18} />}
                label="Security"
              />
              {/* <NavTrigger
                value="billing"
                icon={<CreditCard size={18} />}
                label="Billing"
              /> */}
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
                  <Avatar className="h-24 w-24 border-4 border-primary/10">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-xl">Your Photo</h3>
                    <p className="text-sm text-muted-foreground">
                      This will be displayed on your profile.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8">
                        Change
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <Card className="border-none shadow-lg ring-1 ring-slate-200 dark:ring-slate-800">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        label="First Name"
                        id="f-name"
                        defaultValue="John"
                      />
                      <Field label="Last Name" id="l-name" defaultValue="Doe" />
                    </div>
                    <Field
                      label="Email Address"
                      id="email"
                      type="email"
                      defaultValue="john@example.com"
                    />
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Brief description for your profile..."
                        className="resize-none h-32"
                      />
                    </div>
                  </CardContent>
                </Card>
              </section>
            </TabsContent>

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

              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>
                    Devices currently logged into your account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SessionItem
                    icon={<Laptop />}
                    device="MacBook Pro"
                    location="London, UK"
                    status="Current Session"
                  />
                  <SessionItem
                    icon={<Smartphone />}
                    device="iPhone 15 Pro"
                    location="London, UK"
                    status="2 hours ago"
                  />
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
                    <ThemeOption theme="light" active={false} />
                    <ThemeOption theme="dark" active={true} />
                    <ThemeOption theme="system" active={false} />
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

// --- Helper Components for the "Beautiful" Design ---

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

const Field = ({ label, id, type = "text", defaultValue = "" }: any) => (
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
      defaultValue={defaultValue}
      className="bg-slate-50/50 dark:bg-slate-950/50"
    />
  </div>
);

const SessionItem = ({ icon, device, location, status }: any) => (
  <div className="flex items-center justify-between p-2">
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold">{device}</p>
        <p className="text-xs text-muted-foreground">
          {location} • {status}
        </p>
      </div>
    </div>
    {status !== "Current Session" && (
      <Button variant="ghost" size="sm" className="text-xs h-8">
        Sign out
      </Button>
    )}
  </div>
);

const ThemeOption = ({
  theme,
  active,
}: {
  theme: "light" | "dark" | "system";
  active: boolean;
}) => (
  <div className="space-y-3 cursor-pointer group">
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
    <p className="text-center text-xs font-bold capitalize">{theme}</p>
  </div>
);

export default Settings;
