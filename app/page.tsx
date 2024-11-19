import { auth } from "@/auth";
import { SlideContainer } from "@/components/global/slide-container";
import Landing from "@/components/section-landing/index";
import Navigation from "@/components/section-navigation/index";
export default async function Home() {
  let session = await auth();
  let user = session?.user?.email;

  return <SlideContainer sections={[Landing, Navigation]} />;
}
