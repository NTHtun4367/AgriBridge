import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme, type ThemeMode } from "@/store/slices/theme";
import { type RootState } from "@/store";
import {
  useCurrentUserQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  useUpdateMerchantDocsMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} from "@/store/slices/userApi";
import { toast } from "sonner";
import { useTranslation } from "react-i18next"; // Added for i18n

import {
  User,
  Bell,
  Paintbrush,
  Lock,
  Trash2,
  CheckCircle2,
  Camera,
  Loader2,
  ShieldCheck,
  FileUp,
  Mail,
  Smartphone,
  Info,
  AlertTriangle,
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
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router";
import ConfirmModal from "@/common/ConfirmModel";

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme.mode);

  // Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  // RTK Query Hooks
  const { data: user, isLoading: isUserLoading } = useCurrentUserQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [updateAvatar, { isLoading: isUploadingAvatar }] =
    useUpdateAvatarMutation();
  const [updateMerchantDocs, { isLoading: isUpdatingDocs }] =
    useUpdateMerchantDocsMutation();
  const [changePassword, { isLoading: isUpdatingPassword }] =
    useChangePasswordMutation();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

  const handlePasswordUpdate = async () => {
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      return toast.error(t("settings.security.errors.all_fields"));
    }
    if (passwords.next !== passwords.confirm) {
      return toast.error(t("settings.security.errors.mismatch"));
    }
    try {
      await changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.next,
      }).unwrap();
      toast.success(t("settings.security.success_password"));
      setPasswords({ current: "", next: "", confirm: "" });
    } catch (err: any) {
      toast.error(err?.data?.message || t("settings.errors.generic_fail"));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount().unwrap();
      toast.success(t("settings.appearance.account_deleted"));
      setShowDeleteModal(false);
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.data?.message || t("settings.errors.generic_fail"));
    }
  };

  // Form States
  const [formData, setFormData] = useState({ name: "", bio: "", email: "" });
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  });
  const [nrcFiles, setNrcFiles] = useState<{
    front: File | null;
    back: File | null;
    frontPreview?: string;
    backPreview?: string;
  }>({ front: null, back: null });

  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Sync user data to form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        email: user.email || user.phone || "",
      });
      if (user.merchantId) {
        setNrcFiles((prev) => ({
          ...prev,
          frontPreview: user.merchantId?.nrcFrontImage?.url,
          backPreview: user.merchantId?.nrcBackImage?.url,
        }));
      }
    }
  }, [user]);

  const isDirty = useMemo(() => {
    return (
      formData.name !== (user?.name || "") || formData.bio !== (user?.bio || "")
    );
  }, [formData, user]);

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
      toast.success(t("settings.account.profile_updated"));
    } catch (err: any) {
      toast.error(err?.data?.message || t("settings.errors.generic_fail"));
    }
  };

  const handleDiscard = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        email: user.email || user.phone || "",
      });
      toast.info(t("settings.common.discarded"));
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024)
      return toast.error(t("settings.account.errors.image_size"));

    const body = new FormData();
    body.append("avatar", file);
    try {
      await updateAvatar(body).unwrap();
      toast.success(t("settings.account.photo_updated"));
    } catch (err) {
      toast.error(t("settings.account.errors.upload_failed"));
    }
  };

  const handleNrcUpload = (
    side: "front" | "back",
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setNrcFiles((prev) => ({
        ...prev,
        [side]: file,
        [`${side}Preview`]: previewUrl,
      }));
      toast.success(t(`settings.verification.attached_${side}`));
    }
  };

  const handleSubmitDocs = async () => {
    if (!nrcFiles.front && !nrcFiles.back) {
      return toast.error(t("settings.verification.errors.select_doc"));
    }

    const formData = new FormData();
    if (nrcFiles.front) formData.append("nrcFront", nrcFiles.front);
    if (nrcFiles.back) formData.append("nrcBack", nrcFiles.back);

    try {
      await updateMerchantDocs(formData).unwrap();
      toast.success(t("settings.verification.submitted"));
      setNrcFiles((prev) => ({ ...prev, front: null, back: null }));
    } catch (err: any) {
      toast.error(err?.data?.message || t("settings.errors.generic_fail"));
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
            <h2 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent mm:leading-loose">
              {t("settings.title")}
            </h2>
            <p className="text-muted-foreground mt-1 text-lg">
              {t("settings.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="shadow-sm"
              onClick={handleDiscard}
              disabled={!isDirty}
            >
              {t("settings.common.discard")}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUpdating || !isDirty}
              className="shadow-md shadow-primary/20"
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("settings.common.save")}
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
                label={t("settings.tabs.account")}
              />
              {user?.role === "merchant" && (
                <NavTrigger
                  value="verification"
                  icon={<ShieldCheck size={18} />}
                  label={t("settings.tabs.verification")}
                />
              )}
              <NavTrigger
                value="security"
                icon={<Lock size={18} />}
                label={t("settings.tabs.security")}
              />
              <NavTrigger
                value="notifications"
                icon={<Bell size={18} />}
                label={t("settings.tabs.notifications")}
              />
              <NavTrigger
                value="appearance"
                icon={<Paintbrush size={18} />}
                label={t("settings.tabs.appearance")}
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
                      <AvatarFallback className="text-2xl">
                        {user?.name?.[0]}
                      </AvatarFallback>
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
                    <h3 className="font-semibold text-xl">
                      {t("settings.account.photo_title")}
                    </h3>
                    <p className="text-sm text-muted-foreground mm:leading-loose">
                      {t("settings.account.photo_desc")}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        {t("settings.common.change")}
                      </Button>
                      {isUploadingAvatar && (
                        <Loader2 className="h-4 w-4 animate-spin mt-2" />
                      )}
                    </div>
                  </div>
                </div>

                <Card className="border-none shadow-lg ring-1 ring-slate-200 dark:ring-slate-800">
                  <CardHeader>
                    <CardTitle>{t("settings.account.personal_info")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Field
                      label={t("settings.account.full_name")}
                      id="name"
                      value={formData.name}
                      onChange={(val: string) =>
                        setFormData({ ...formData, name: val })
                      }
                    />
                    <Field
                      label={t("settings.account.identifier")}
                      id="email"
                      value={formData.email}
                      disabled
                    />
                    <div className="space-y-2">
                      <Label htmlFor="bio">{t("settings.account.bio")}</Label>
                      <Textarea
                        id="bio"
                        placeholder={t("settings.account.bio_placeholder")}
                        className="resize-none h-32 focus-visible:ring-primary"
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

            {/* Merchant Verification Tab */}
            {user?.role === "merchant" && (
              <TabsContent
                value="verification"
                className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
              >
                <Card className="border-none shadow-lg ring-1 ring-slate-200 dark:ring-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="text-primary" />{" "}
                      {t("settings.verification.title")}
                    </CardTitle>
                    <CardDescription>
                      {t("settings.verification.desc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label>{t("settings.verification.nrc_front")}</Label>
                        <div
                          className={`group relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${nrcFiles.front ? "border-primary bg-primary/5" : "hover:bg-slate-50 dark:hover:bg-slate-900"}`}
                        >
                          {nrcFiles.frontPreview ? (
                            <div className="relative">
                              <img
                                src={nrcFiles.frontPreview}
                                alt="NRC Front"
                                className="mx-auto h-28 object-cover rounded-md"
                              />
                              {nrcFiles.front && (
                                <CheckCircle2 className="absolute -top-2 -right-2 h-6 w-6 text-primary bg-white rounded-full" />
                              )}
                            </div>
                          ) : (
                            <>
                              <FileUp className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-xs font-medium">
                                {t("settings.verification.file_limit")}
                              </p>
                            </>
                          )}
                          <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={(e) => handleNrcUpload("front", e)}
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label>{t("settings.verification.nrc_back")}</Label>
                        <div
                          className={`group relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${nrcFiles.back ? "border-primary bg-primary/5" : "hover:bg-slate-50 dark:hover:bg-slate-900"}`}
                        >
                          {nrcFiles.backPreview ? (
                            <div className="relative">
                              <img
                                src={nrcFiles.backPreview}
                                alt="NRC Back"
                                className="mx-auto h-28 object-cover rounded-md"
                              />
                              {nrcFiles.back && (
                                <CheckCircle2 className="absolute -top-2 -right-2 h-6 w-6 text-primary bg-white rounded-full" />
                              )}
                            </div>
                          ) : (
                            <>
                              <FileUp className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-xs font-medium">
                                {t("settings.verification.file_limit")}
                              </p>
                            </>
                          )}
                          <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={(e) => handleNrcUpload("back", e)}
                          />
                        </div>
                      </div>
                    </div>
                    {user.verificationStatus === "verified" && (
                      <Button
                        className="w-full"
                        disabled={
                          (!nrcFiles.front && !nrcFiles.frontPreview) ||
                          (!nrcFiles.back && !nrcFiles.backPreview) ||
                          isUpdatingDocs
                        }
                        onClick={handleSubmitDocs}
                      >
                        {isUpdatingDocs && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {t("settings.verification.submit_docs")}
                      </Button>
                    )}
                    <div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900 flex gap-3">
                      <Info className="h-5 w-5 text-blue-600 shrink-0" />
                      <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                        <strong>{t("settings.verification.note_label")}</strong>{" "}
                        {t("settings.verification.note_text")}
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
                  <CardTitle>
                    {t("settings.security.change_password")}
                  </CardTitle>
                  <CardDescription className="mm:leading-loose">
                    {t("settings.security.password_desc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field
                    label={t("settings.security.current_password")}
                    id="curr_pass"
                    type="password"
                    value={passwords.current}
                    onChange={(val: string) =>
                      setPasswords({ ...passwords, current: val })
                    }
                  />
                  <Field
                    label={t("settings.security.new_password")}
                    id="new_pass"
                    type="password"
                    value={passwords.next}
                    onChange={(val: string) =>
                      setPasswords({ ...passwords, next: val })
                    }
                  />
                  <Field
                    label={t("settings.security.confirm_password")}
                    id="confirm_pass"
                    type="password"
                    value={passwords.confirm}
                    onChange={(val: string) =>
                      setPasswords({ ...passwords, confirm: val })
                    }
                  />
                  <Button
                    size="sm"
                    onClick={handlePasswordUpdate}
                    disabled={isUpdatingPassword}
                  >
                    {isUpdatingPassword && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("settings.security.update_btn")}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent
              value="notifications"
              className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <Card className="border-none shadow-lg ring-1 ring-slate-200 dark:ring-slate-800">
                <CardHeader>
                  <CardTitle>{t("settings.notifications.channels")}</CardTitle>
                  <CardDescription className="mm:leading-loose">
                    {t("settings.notifications.desc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="text-muted-foreground" size={20} />
                      <div>
                        <p className="text-sm font-medium mm:mb-2">
                          {t("settings.notifications.email")}
                        </p>
                        <p className="text-xs text-muted-foreground mm:mb-1">
                          {t("settings.notifications.email_desc")}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(val) =>
                        setNotifications({ ...notifications, email: val })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="text-muted-foreground" size={20} />
                      <div>
                        <p className="text-sm font-medium mm:mb-2">
                          {t("settings.notifications.push")}
                        </p>
                        <p className="text-xs text-muted-foreground mm:mb-1s">
                          {t("settings.notifications.push_desc")}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(val) =>
                        setNotifications({ ...notifications, push: val })
                      }
                    />
                  </div>
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
                  <CardTitle>{t("settings.appearance.theme_pref")}</CardTitle>
                  <CardDescription className="mm:leading-loose">
                    {t("settings.appearance.theme_desc")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <ThemeOption
                      theme="light"
                      active={currentTheme === "light"}
                      onClick={() => dispatch(setTheme("light"))}
                      label={t("settings.appearance.light")}
                    />
                    <ThemeOption
                      theme="dark"
                      active={currentTheme === "dark"}
                      onClick={() => dispatch(setTheme("dark"))}
                      label={t("settings.appearance.dark")}
                    />
                    <ThemeOption
                      theme="system"
                      active={currentTheme === "system"}
                      onClick={() => dispatch(setTheme("system"))}
                      label={t("settings.appearance.system")}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* DANGER ZONE */}
              <Card className="border-red-100 dark:border-red-950 bg-red-50/30 dark:bg-red-950/10">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <Trash2 size={20} /> {t("settings.appearance.danger_zone")}
                  </CardTitle>
                  <CardDescription className="mm:leading-loose">
                    {t("settings.appearance.danger_desc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {t("settings.appearance.delete_title")}
                    </p>
                    <p className="text-xs text-muted-foreground mm:leading-loose">
                      {t("settings.appearance.delete_desc")}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteModal(true)}
                    disabled={isDeleting}
                  >
                    {t("settings.appearance.delete_btn")}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeleting}
        title={t("settings.modals.delete_title")}
        description={t("settings.modals.delete_desc")}
        confirmText={t("settings.modals.delete_confirm")}
        icon={<AlertTriangle className="text-red-500" size={24} />}
      />
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
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
}) => (
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
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
    />
  </div>
);

const ThemeOption = ({
  theme,
  active,
  onClick,
  label,
}: {
  theme: ThemeMode;
  active: boolean;
  onClick: () => void;
  label: string;
}) => (
  <div className="space-y-3 cursor-pointer group" onClick={onClick}>
    <div
      className={`relative h-28 w-full rounded-xl border-2 p-2 transition-all ${active ? "border-primary ring-2 ring-primary/10" : "border-transparent bg-slate-100 dark:bg-slate-800 group-hover:border-slate-300 dark:group-hover:border-slate-600"}`}
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
      {label}
    </p>
  </div>
);

export default Settings;
