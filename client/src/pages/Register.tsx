import { useState } from "react";
import { useForm } from "react-hook-form";
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

import { registerSchema, type RegisterFormInputs } from "@/schema/register";
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

function Register() {
  const [status, setStatus] = useState<"farmer" | "merchant">("farmer");
  const [dialogOpen, setDialogOpen] = useState(true);

  const [step, setStep] = useState(1); // ← form step (1–4)

  const form = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      status, // ← must include
      name: "",
      email: "",
      password: "",
      homeAddress: "",
      division: "",
      district: "",
      township: "",
    },
  });

  // Step count depends on account type
  const totalSteps = status === "farmer" ? 2 : 4;

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = (data: RegisterFormInputs) => {
    console.log("Final Form Submitted:", data);
  };

  const handleChoice = (choice: "farmer" | "merchant") => {
    setStatus(choice);
    form.setValue("status", choice);
    setDialogOpen(false);
    setStep(1); // reset to first step
  };

  return (
    <div className="max-w-[450px] lg:mx-auto mx-6 mt-12">
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

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-extrabold text-primary italic">
            AgriBridge
          </CardTitle>
          <CardDescription>
            Enter your information to create account
          </CardDescription>
        </CardHeader>
        <div className="flex items-center justify-around w-[200px] mx-auto">
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
        </div>
        <CardContent>
          {/* ---------------------------------------
          PROGRESS BAR
         --------------------------------------- */}
          <div className="mt-2">
            <div className="w-full bg-secondary h-2 rounded-full">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-center mt-1">
              Step {step} / {totalSteps}
            </p>
          </div>

          {/* ---------------------------------------
           FORM
         --------------------------------------- */}
          <Form {...form}>
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
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select division" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
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
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select district" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="B">B</SelectItem>
                              <SelectItem value="C">C</SelectItem>
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
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select township" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="N">N</SelectItem>
                              <SelectItem value="P">P</SelectItem>
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
                              <Select onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="1" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                  <SelectItem value="3">3</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
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
                              <Select onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Township" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="A">A</SelectItem>
                                  <SelectItem value="B">B</SelectItem>
                                  <SelectItem value="C">C</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
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
                              <Select onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="N" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="N">N</SelectItem>
                                  <SelectItem value="P">P</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
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

                  <FormLabel>NRC Images (Front & Back)</FormLabel>
                  <div className="flex gap-4">
                    <FormField
                      name="nrcFrontImage"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <ImageUpload
                              images={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="nrcBackImage"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <ImageUpload
                              images={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {/* ----------------------------------------------------
              Navigation Buttons
             ---------------------------------------------------- */}
              <div className="flex justify-between pt-4">
                {step > 1 ? (
                  <Button variant="outline" type="button" onClick={prevStep}>
                    Back
                  </Button>
                ) : (
                  <span />
                )}

                {step < totalSteps ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit">
                    {status === "farmer"
                      ? "Create Account"
                      : "Submit for Verification"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
