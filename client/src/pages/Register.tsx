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
  ChevronLeft,
  ChevronRight,
  MapPin,
  ShieldCheck,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import ProfileUploadDialog from "@/components/ProfileUploadDialog";

const myanmarData = myanmarDataRaw as Record<string, Record<string, string[]>>;
const nrcData = nrcDataRaw as Record<string, string[]>;

function Register() {
  const [registerFarmerMutation, { isLoading: farmerLoading }] =
    useRegisterFarmerMutation();
  const [registerMerchantMutation, { isLoading: merchantLoading }] =
    useRegisterMerchantMutation();
  const [status, setStatus] = useState<"farmer" | "merchant">("farmer");
  const [dialogOpen, setDialogOpen] = useState(true);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // ← form step (1–4)

  const form = useForm<any>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    reValidateMode: "onBlur",
    shouldUnregister: false,
    defaultValues: {
      status: "farmer",
      name: "",
      email: "",
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

  // Step count depends on account type
  const totalSteps = status === "farmer" ? 2 : 4;

  const nextStep = async () => {
    let fields: string[] = [];
    if (step === 1) fields = ["name", "email", "password"];
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
      if (!valid) {
        fields.forEach((f) => {
          const v = form.getValues(f as any);
          const state = form.getFieldState(f as any);
          if (state.invalid) {
            form.setValue(f as any, v as any, { shouldTouch: true });
          }
        });
        return;
      }
    }

    setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = async (data: RegisterFormInputs) => {
    const basePayload = {
      name: data.name,
      email: data.email,
      password: data.password,
      homeAddress: data.homeAddress,
      division: data.division,
      district: data.district,
      township: data.township,
    };

    const formData = new FormData();

    // common fields
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("homeAddress", data.homeAddress);
    formData.append("division", data.division);
    formData.append("district", data.district);
    formData.append("township", data.township);

    if (data.status === "merchant") {
      formData.append("businessName", data.businessName);
      formData.append("phone", data.phone);

      // NRC fields (IMPORTANT FORMAT)
      formData.append("nrc[region]", data.nrcRegion);
      formData.append("nrc[township]", data.nrcTownship);
      formData.append("nrc[type]", data.nrcType);
      formData.append("nrc[number]", data.nrcNumber);

      // Images
      formData.append("nrcFront", data.nrcFrontImage?.file as File);
      formData.append("nrcBack", data.nrcBackImage?.file as File);
    }

    try {
      if (status === "farmer") {
        await registerFarmerMutation(basePayload).unwrap();
      } else if (status === "merchant") {
        await registerMerchantMutation(formData).unwrap();
      }
      toast.success("Register successful.");

      setProfileDialogOpen(true);

      // if (status === "farmer") {
      //   navigate("/login");
      // } else if (status === "merchant") {
      //   navigate("/verification-submitted");
      // }
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  const handleChoice = (choice: "farmer" | "merchant") => {
    setStatus(choice);
    form.setValue("status", choice);
    setDialogOpen(false);
    setStep(1);
  };

  const allFields = [
    "name",
    "email",
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

  const getCurrentStepFields = (): string[] => {
    if (step === 1) return ["name", "email", "password"];
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
    const toClear = allFields.filter((f) => !current.includes(f));
    form.clearErrors(toClear as any);
  }, [step, status]);

  const step4Fields = [
    "nrcRegion",
    "nrcTownship",
    "nrcType",
    "nrcNumber",
    "nrcFrontImage",
    "nrcBackImage",
  ] as const;

  const step4Values = useWatch({
    control: form.control,
    name: step4Fields as unknown as string[],
  });

  useEffect(() => {
    if (status === "merchant" && step === 4) {
      form.trigger(step4Fields as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, step, ...step4Values]);

  // Watch values for dynamic filtering
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

  // Generate NRC Township options based on the chosen Region number
  const nrcTownshipOptions = useMemo(() => {
    return selectedNrcRegion ? nrcData[selectedNrcRegion] || [] : [];
  }, [selectedNrcRegion]);

  // Filter options based on selection
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

  // Reset child fields when parent changes
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
  // Specific Reset for NRC fields
  useEffect(() => {
    form.setValue("nrcTownship", "");
  }, [selectedNrcRegion, form]);

  // UI Icons for steps
  const stepsConfig = [
    { label: "Account", icon: User },
    { label: "Location", icon: MapPin },
    { label: "Business", icon: Briefcase },
    { label: "Identity", icon: ShieldCheck },
  ];

  return (
    <div className="max-w-[500px] lg:mx-auto mx-6 mt-12 animate-in fade-in zoom-in duration-700">
      {/* ---------------------------------------
          AUTO-OPEN DIALOG (Farmer / Merchant)
         --------------------------------------- */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] max-w-[90%] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Welcome</DialogTitle>
            <DialogDescription>
              Choose what type of account you want to open.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Farmers only fill 2 steps. Merchants fill all 4 steps.
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <Button
              size="sm"
              variant={status === "farmer" ? "default" : "secondary"}
              onClick={() => handleChoice("farmer")}
            >
              Farmer
            </Button>

            <Button
              size="sm"
              variant={status === "merchant" ? "default" : "secondary"}
              onClick={() => handleChoice("merchant")}
            >
              Merchant
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {profileDialogOpen && <ProfileUploadDialog status={status} />}

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-extrabold text-primary italic">
            AgriBridge
          </CardTitle>
          <CardDescription>
            Step {step} of {totalSteps}: {stepsConfig[step - 1].label} info
          </CardDescription>
        </CardHeader>
        {/* <div className="flex items-center justify-around w-[200px] mx-auto">
          <Button
            className="cursor-pointer"
            size={"sm"}
            variant={status === "farmer" ? "default" : "secondary"}
            onClick={() => handleChoice("farmer")}
          >
            Farmer
          </Button>
          <Button
            className="cursor-pointer"
            size={"sm"}
            variant={status === "merchant" ? "default" : "secondary"}
            onClick={() => handleChoice("merchant")}
          >
            Merchant
          </Button>
        </div> */}

        <CardContent>
          {/* Visual Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {Array.from({ length: totalSteps }).map((_, i) => {
              const StepIcon = stepsConfig[i].icon;
              const isActive = step === i + 1;
              const isCompleted = step > i + 1;
              return (
                <div key={i} className="flex items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-colors border-2",
                      isActive
                        ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : isCompleted
                        ? "bg-primary/20 border-primary/20 text-primary"
                        : "bg-background border-muted text-muted-foreground"
                    )}
                  >
                    <StepIcon size={18} />
                  </div>
                  {i < totalSteps - 1 && (
                    <div
                      className={cn(
                        "w-6 h-0.5 mx-1",
                        step > i + 1 ? "bg-primary/30" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* ---------------------------------------
           FORM
         --------------------------------------- */}
          <Form {...(form as any)}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 mt-6"
            >
              {/* ----------------------------------------------------
              STEP 1 — BASIC ACCOUNT INFO
             ---------------------------------------------------- */}
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} />
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

              {/* ----------------------------------------------------
              STEP 2 — BASIC ACCOUNT INFO
             ---------------------------------------------------- */}
              {step === 2 && (
                <>
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

                  <FormField
                    name="division"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Division</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select division" />
                            </SelectTrigger>
                            <SelectContent>
                              {divisionOptions.map((d) => (
                                <SelectItem key={d} value={d}>
                                  {d}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select district" />
                            </SelectTrigger>
                            <SelectContent>
                              {districtOptions.map((d) => (
                                <SelectItem key={d} value={d}>
                                  {d}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="township"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Township</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select township" />
                            </SelectTrigger>
                            <SelectContent>
                              {townshipOptions.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* ----------------------------------------------------
              MERCHANT ONLY — STEP 3
             ---------------------------------------------------- */}
              {status === "merchant" && step === 3 && (
                <>
                  <FormField
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Company / Shop Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="09xxxxxxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* ----------------------------------------------------
              MERCHANT ONLY — STEP 4
             ---------------------------------------------------- */}
              {status === "merchant" && step === 4 && (
                <>
                  <FormLabel>NRC Information</FormLabel>
                  <div className="flex items-center gap-3 w-full mb-4">
                    {/* NRC Selects */}
                    <div className="flex-1">
                      <FormField
                        name="nrcRegion"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="1" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.keys(nrcData).map((num) => (
                                    <SelectItem key={num} value={num}>
                                      {num}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            {/* <FormMessage /> */}
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex-2">
                      <FormField
                        name="nrcTownship"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Township" />
                                </SelectTrigger>
                                <SelectContent>
                                  {nrcTownshipOptions.map((code) => (
                                    <SelectItem key={code} value={code}>
                                      {code}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            {/* <FormMessage /> */}
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex-1">
                      <FormField
                        name="nrcType"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="N" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="N">N</SelectItem>
                                  <SelectItem value="P">P</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            {/* <FormMessage /> */}
                          </FormItem>
                        )}
                      />
                    </div>
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
                  <div className="space-y-3">
                    <FormLabel>NRC Documents (Images)</FormLabel>

                    {/* Changed flex-around to flex-wrap and justify-center */}
                    <div className="flex flex-wrap items-start justify-center gap-4 mt-6">
                      <FormField
                        name="nrcFrontImage"
                        render={({ field }) => (
                          <FormItem className="flex-1 min-w-[140px]">
                            {/* Added flex-1 and min-width */}
                            <FormControl>
                              <ImageUpload
                                image={field.value}
                                onChange={(img) => field.onChange(img)}
                              />
                            </FormControl>
                            <p className="text-[10px] text-center text-muted-foreground mt-1">
                              Front Side
                            </p>
                            <FormMessage className="text-center" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="nrcBackImage"
                        render={({ field }) => (
                          <FormItem className="flex-1 min-w-[140px]">
                            {/* Added flex-1 and min-width */}
                            <FormControl>
                              <ImageUpload
                                image={field.value}
                                onChange={(img) => field.onChange(img)}
                              />
                            </FormControl>
                            <p className="text-[10px] text-center text-muted-foreground mt-1">
                              Back Side
                            </p>
                            <FormMessage className="text-center" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ----------------------------------------------------
              Navigation Buttons
             ---------------------------------------------------- */}
              <div
                className={`flex justify-between pt-4 ${step !== 1 && "gap-4"}`}
              >
                {step > 1 ? (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={prevStep}
                    className="flex-1"
                  >
                    <ChevronLeft />
                    Back
                  </Button>
                ) : (
                  <span />
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
        <p className="text-center text-xs text-muted-foreground">
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
