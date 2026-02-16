import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormInputs } from "@/schema/login";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/store/slices/userApi";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { setCredentials } from "@/store/slices/auth";
import { useTranslation } from "react-i18next"; // Added i18n import

function Login() {
  const { t } = useTranslation(); // Initialize translation hook
  const [loginMutation, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const payload = {
        identifier: data.identifier,
        password: data.password,
      };

      const response = await loginMutation(payload).unwrap();
      dispatch(setCredentials(response));
      form.reset();
      toast.success(t("login.success_toast", "Login successful."));

      // Role-based redirection
      if (response.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (response.user.role === "merchant") {
        navigate("/merchant/dashboard");
      } else {
        navigate("/farmer/dashboard");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          t("login.error_toast", "Login failed. Please try again."),
      );
    }
  };

  return (
    <div className="max-w-[450px] lg:mx-auto mx-6 mt-32 animate-in fade-in zoom-in duration-700">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-extrabold text-primary italic">
            <Link to={"/"}>AgriBridge</Link>
          </CardTitle>
          <CardDescription className="mm:leading-loose">
            {t("login.description", "Enter your information to login")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mm:leading-loose">
                      {t("login.identifier_label", "Email or Phone Number")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "login.identifier_placeholder",
                          "example@gmail.com or 09...",
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mm:leading-loose">
                      {t("login.password_label", "Password")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("login.password_placeholder", "******")}
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isLoading}
              >
                {isLoading
                  ? t("login.submitting_button", "Logging in...")
                  : t("login.submit_button", "Login")}
              </Button>
            </form>
          </Form>
          <p className="text-xs text-center font-medium mt-4 mm:leading-loose">
            {t("login.no_account", "Don't have an account?")}
            <Link to={"/register"} className="underline ps-1 text-primary">
              {t("login.register_link", "Register")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
