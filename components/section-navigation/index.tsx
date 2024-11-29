import { auth } from "@/auth";
import { SitesLogged } from "./sites-logged";
import { SitesUnLogged } from "./sites-unlogged";

export default async function Navigation() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="h-full relative overflow-auto">
      {user ? <SitesLogged /> : <SitesUnLogged />}
    </div>
  );
}
