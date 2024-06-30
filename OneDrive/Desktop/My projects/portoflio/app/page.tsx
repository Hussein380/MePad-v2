
import Image from "next/image";
import { FloatingNav } from "c:/Users/user/OneDrive/Desktop/My projects/portoflio/component/ui/floating-navbar";
import { FaHome } from "react-icons/fa";
import Hero from "@/component/Hero";



export default function Home() {
  return (
    <main className="relative bg-black flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav
          navItems={[
            { name: 'Home', link: '/', icon: <FaHome /> }
          ]}
        />
        <Hero />
        {/* Add other components as needed */}
      </div>
    </main>
  );
}
