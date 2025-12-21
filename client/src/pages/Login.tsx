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

function Login() {
  const [loginMutation, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await loginMutation(data).unwrap();
      dispatch(setCredentials(response));
      form.reset();
      toast.success("Login successful.");

      // Redirect by role
      if (response.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (response.user.role === "merchant") {
        navigate("/merchant");
      } else {
        navigate("/farmer/dashboard");
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className="max-w-[450px] lg:mx-auto mx-6 mt-32 animate-in fade-in zoom-in duration-700">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-extrabold text-primary italic">
            AgriBridge
          </CardTitle>
          <CardDescription>Enter your information to login</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="allison@gmail.com" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="******" {...field} type="password" />
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
                Login
              </Button>
            </form>
          </Form>
          <p className="text-xs text-center font-medium mt-4">
            Don't have an account?
            <Link to={"/register"} className="underline ps-1">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
