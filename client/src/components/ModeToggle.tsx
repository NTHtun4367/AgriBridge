import { useDispatch } from "react-redux";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { toggleTheme } from "@/store/slices/theme";

export function ModeToggle() {
  const dispatch = useDispatch();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => dispatch(toggleTheme())}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
