import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ImageUpload from "@/components/ImageUpload";
import {
  registerSchema,
  type RegisterFormInputs,
} from "@/schema/register/register.combineSteps";
import {
  useRegisterFarmerMutation,
  useRegisterMerchantMutation,
} from "@/store/slices/userApi";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import myanmarDataRaw from "../utils/myanmarLocationData.json";
import nrcDataRaw from "../utils/nrcData.json";
import {
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ShieldCheck,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const myanmarData = myanmarDataRaw as Record<string, Record<string, string[]>>;
const nrcData = nrcDataRaw as Record<string, string[]>;

function Register() {
  const [registerFarmerMutation, { isLoading: farmerLoading }] =
    useRegisterFarmerMutation();
  const [registerMerchantMutation, { isLoading: merchantLoading }] =
    useRegisterMerchantMutation();
  const [status, setStatus] = useState<"farmer" | "merchant">("farmer");
  const [dialogOpen, setDialogOpen] = useState(true);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const form = useForm<any>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    reValidateMode: "onBlur",
    shouldUnregister: false,
    defaultValues: {
      status: "farmer",
      name: "",
      identifier: "",
      password: "",
      homeAddress: "",
      division: "",
      district: "",
      township: "",
      businessName: "",
      phone: "",
      nrcRegion: "",
      nrcTownship: "",
      nrcType: "",
      nrcNumber: "",
      nrcFrontImage: null,
      nrcBackImage: null,
    },
  });

  const totalSteps = status === "farmer" ? 2 : 4;

  const nextStep = async () => {
    let fields: string[] = [];
    if (step === 1) fields = ["name", "identifier", "password"];
    if (step === 2)
      fields = ["homeAddress", "division", "district", "township"];
    if (status === "merchant" && step === 3) fields = ["businessName", "phone"];
    if (status === "merchant" && step === 4)
      fields = [
        "nrcRegion",
        "nrcTownship",
        "nrcType",
        "nrcNumber",
        "nrcFrontImage",
        "nrcBackImage",
      ];

    if (fields.length) {
      const valid = await form.trigger(fields as any, { shouldFocus: true });
      if (!valid) return;
    }

    setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      if (data.status === "farmer") {
        // 1. Farmer Registration Logic (Plain JSON)
        await registerFarmerMutation({
          identifier: data.identifier,
          name: data.name,
          password: data.password,
          homeAddress: data.homeAddress,
          division: data.division,
          district: data.district,
          township: data.township,
        }).unwrap();
      } else {
        // 2. Merchant Registration Logic (Multi-part FormData for Images)
        const formData = new FormData();
        formData.append("identifier", data.identifier);
        formData.append("name", data.name);
        formData.append("password", data.password);
        formData.append("homeAddress", data.homeAddress);
        formData.append("division", data.division);
        formData.append("district", data.district);
        formData.append("township", data.township);
        formData.append("businessName", data.businessName);
        formData.append("businessPhone", data.phone);

        // Nested NRC Object handling
        formData.append("nrc[region]", data.nrcRegion);
        formData.append("nrc[township]", data.nrcTownship);
        formData.append("nrc[type]", data.nrcType);
        formData.append("nrc[number]", data.nrcNumber);

        // Image files from your ImageUpload component
        if (data.nrcFrontImage?.file) {
          formData.append("nrcFront", data.nrcFrontImage.file);
        }
        if (data.nrcBackImage?.file) {
          formData.append("nrcBack", data.nrcBackImage.file);
        }

        await registerMerchantMutation(formData).unwrap();
      }

      // 3. Success Feedback
      toast.success(
        "Registration initiated! Please check your email or phone for the OTP.",
      );

      // 4. Navigation to OTP Screen
      // We pass the 'identifier' (email/phone) in the navigation state
      // so the VerifyOtp page knows where to send the verification request.
      navigate("/verify-otp", {
        state: {
          identifier: data.identifier,
          role: data.status,
        },
      });
    } catch (error: any) {
      // 5. Error Handling
      console.error("Registration error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";

      toast.error(errorMessage);
    }
  };

  const handleChoice = (choice: "farmer" | "merchant") => {
    setStatus(choice);
    form.setValue("status", choice);
    setDialogOpen(false);
    setStep(1);
  };

  const getCurrentStepFields = (): string[] => {
    if (step === 1) return ["name", "identifier", "password"];
    if (step === 2) return ["homeAddress", "division", "district", "township"];
    if (status === "merchant" && step === 3) return ["businessName", "phone"];
    if (status === "merchant" && step === 4)
      return [
        "nrcRegion",
        "nrcTownship",
        "nrcType",
        "nrcNumber",
        "nrcFrontImage",
        "nrcBackImage",
      ];
    return [];
  };

  useEffect(() => {
    const current = getCurrentStepFields();
    const allPossibleFields = [
      "name",
      "identifier",
      "password",
      "homeAddress",
      "division",
      "district",
      "township",
      "businessName",
      "phone",
      "nrcRegion",
      "nrcTownship",
      "nrcType",
      "nrcNumber",
      "nrcFrontImage",
      "nrcBackImage",
    ];
    const toClear = allPossibleFields.filter((f) => !current.includes(f));
    form.clearErrors(toClear as any);
  }, [step, status]);

  const selectedDivision = useWatch({
    control: form.control,
    name: "division",
  });
  const selectedDistrict = useWatch({
    control: form.control,
    name: "district",
  });
  const selectedNrcRegion = useWatch({
    control: form.control,
    name: "nrcRegion",
  });

  const nrcTownshipOptions = useMemo(() => {
    return selectedNrcRegion ? nrcData[selectedNrcRegion] || [] : [];
  }, [selectedNrcRegion]);

  const divisionOptions = useMemo(() => Object.keys(myanmarData), []);
  const districtOptions = useMemo(() => {
    return selectedDivision
      ? Object.keys(myanmarData[selectedDivision] || {})
      : [];
  }, [selectedDivision]);
  const townshipOptions = useMemo(() => {
    return selectedDivision && selectedDistrict
      ? myanmarData[selectedDivision][selectedDistrict] || []
      : [];
  }, [selectedDivision, selectedDistrict]);

  useEffect(() => {
    form.setValue("district", "");
    form.setValue("township", "");
  }, [selectedDivision, form]);

  useEffect(() => {
    form.setValue("township", "");
  }, [selectedDistrict, form]);

  useEffect(() => {
    form.setValue("nrcTownship", "");
  }, [selectedNrcRegion, form]);

  const stepsConfig = [
    { label: "Account", icon: User },
    { label: "Location", icon: MapPin },
    { label: "Business", icon: Briefcase },
    { label: "Identity", icon: ShieldCheck },
  ];

  return (
    <div className="max-w-[500px] lg:mx-auto mx-6 mt-12 animate-in fade-in zoom-in duration-700">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl">
          <DialogHeader className="items-center text-center">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold">
              Welcome to AgriBridge
            </DialogTitle>
            <DialogDescription className="text-base">
              Choose what type of account you want to open.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={() => handleChoice("farmer")}
              className={cn(
                "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all hover:border-primary/50",
                status === "farmer"
                  ? "border-primary bg-primary/5"
                  : "border-muted bg-transparent",
              )}
            >
              <div
                className={cn(
                  "p-3 rounded-full",
                  status === "farmer"
                    ? "bg-primary text-white"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                <User size={24} />
              </div>
              <span className="font-semibold">Farmer</span>
            </button>
            <button
              onClick={() => handleChoice("merchant")}
              className={cn(
                "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all hover:border-primary/50",
                status === "merchant"
                  ? "border-primary bg-primary/5"
                  : "border-muted bg-transparent",
              )}
            >
              <div
                className={cn(
                  "p-3 rounded-full",
                  status === "merchant"
                    ? "bg-primary text-white"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                <Briefcase size={24} />
              </div>
              <span className="font-semibold">Merchant</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-extrabold text-primary italic">
            AgriBridge
          </CardTitle>
          <CardDescription>
            Step {step} of {totalSteps}: {stepsConfig[step - 1].label} info
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-center gap-2 mb-6">
            {Array.from({ length: totalSteps }).map((_, i) => {
              const StepIcon = stepsConfig[i].icon;
              const isActive = step === i + 1;
              const isCompleted = step > i + 1;
              return (
                <div key={i} className="flex items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground",
                    )}
                  >
                    <StepIcon size={18} />
                  </div>
                  {i < totalSteps - 1 && (
                    <div
                      className={cn(
                        "w-6 h-0.5 mx-1",
                        step > i + 1 ? "bg-primary/30" : "bg-muted",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 mt-6"
            >
              {step === 1 && (
                <>
                  <FormField
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email or Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Email or Phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="******"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <FormField
                    name="division"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Division</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select division" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {divisionOptions.map((d) => (
                              <SelectItem key={d} value={d}>
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select district" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {districtOptions.map((d) => (
                              <SelectItem key={d} value={d}>
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="township"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Township</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select township" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {townshipOptions.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="homeAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Your home address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {status === "merchant" && step === 3 && (
                <>
                  <FormField
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Company Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="09xxxxxxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {status === "merchant" && step === 4 && (
                <div className="space-y-4">
                  <FormLabel>NRC Information</FormLabel>
                  <div className="flex gap-2">
                    <FormField
                      name="nrcRegion"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[70px]">
                              <SelectValue placeholder="1" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.keys(nrcData).map((n) => (
                              <SelectItem key={n} value={n}>
                                {n}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormField
                      name="nrcTownship"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Township" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {nrcTownshipOptions.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormField
                      name="nrcType"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[70px]">
                              <SelectValue placeholder="N" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="N">N</SelectItem>
                            <SelectItem value="P">P</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <FormField
                    name="nrcNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormLabel>NRC Documents (Images)</FormLabel>
                  <div className="flex gap-4">
                    <FormField
                      name="nrcFrontImage"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <ImageUpload
                            image={field.value}
                            onChange={field.onChange}
                          />
                          <p className="text-[10px] text-center">Front</p>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="nrcBackImage"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <ImageUpload
                            image={field.value}
                            onChange={field.onChange}
                          />
                          <p className="text-[10px] text-center">Back</p>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "flex justify-between pt-4",
                  step !== 1 && "gap-4",
                )}
              >
                {step > 1 && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={prevStep}
                    className="flex-1"
                  >
                    <ChevronLeft /> Back
                  </Button>
                )}
                {step < totalSteps ? (
                  <Button type="button" onClick={nextStep} className="flex-1">
                    Next <ChevronRight />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={farmerLoading || merchantLoading}
                    className="flex-1"
                  >
                    {status === "farmer"
                      ? "Create Account"
                      : "Submit Verification"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
        <Separator />
        <p className="p-4 text-center text-xs text-muted-foreground">
          Already have an account?
          <button
            onClick={() => navigate("/login")}
            className="pl-2 text-primary font-semibold hover:underline cursor-pointer"
          >
            Login
          </button>
        </p>
      </Card>
    </div>
  );
}

export default Register;
