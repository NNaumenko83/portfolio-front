import Experience from "@/components/experience/experience";
import Grid from "@/components/grid/Grid";
import Hero from "@/components/hero/Hero";
import RecentProjects from "@/components/recent-porjects/recent-porjects";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { navItems } from "@/data";




export default function Home() {

  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        <Hero />
        <Grid />
        <RecentProjects />
        <Experience />
      </div>
    </main>
  );
}
