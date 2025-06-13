import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initialProfile";
import Link from "next/link";
import { redirect } from "next/navigation";

async function NotFound() {
  return (
    <div className="w-full h-full flex gap-y-5 items-center justify-center flex-col">
      <h1 className="text-8xl text-zinc-700">404</h1>
      <p className="text-lg text-zinc-400">
        Oops! the page you are looking for doesn't exist.
      </p>
      <Link href={"/"}>
        <Button variant={"ghost"} className="border-[1px]">
          Go Back
        </Button>
      </Link>
    </div>
  );
}

export default NotFound;
