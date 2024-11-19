import { SignIn } from "./signin-button";
import { ThemeSwitch } from "@/components/global/theme-switch";

export default function Landing() {
  return (
    <div>
      <div>
        <SignIn />
        <ThemeSwitch />
      </div>
    </div>
  );
}
