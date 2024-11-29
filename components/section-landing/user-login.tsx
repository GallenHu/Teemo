import { auth, signIn, signOut } from "@/auth";
import { LogInIcon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export async function UserLogin() {
  const session = await auth();

  const user = session?.user;
  const userImg = user?.image || "";
  const userName = user?.name || "";
  const handleClickSignOut = async () => {
    "use server";
    await signOut();
  };

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="h-8 w-8">
        <Button variant="ghost" className=" h-8 w-8 px-0">
          <Avatar className="h-4 w-4">
            <AvatarImage src={userImg} alt={userName} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleClickSignOut}>
          <LogInIcon />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <form
      className="flex h-8 items-center"
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <Button type="submit" variant="ghost" className=" h-8 w-8 px-0">
        <LogInIcon />
      </Button>
    </form>
  );
}
