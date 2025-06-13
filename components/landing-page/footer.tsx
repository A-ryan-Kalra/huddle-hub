import { Github, Keyboard, LucideGithub, Mouse } from "lucide-react";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className={`bg-white`}>
      <div className="flex relative justify-around items-center dark:border-white dark:text-white duration-300 py-5 border-t-2 border-black">
        <span className="md:text-xl text-[14px] flex items-center justify-center gap-x-1">
          {new Date().getFullYear()} &copy; All Rights Reserved
          <Link
            target="__blank"
            href={"https://github.com/A-ryan-Kalra/huddle-hub"}
            className="bg-slate-300 rounded-full p-1 hover:bg-slate-200 cursor-pointer transition"
          >
            <Github className="fill-white" />
          </Link>
        </span>
        <span className="md:text-xl text-[14px] spacex items-center flex justify-center">
          Made with{" "}
          <span className="flex items-center justify-center ml-1  gap-x-1">
            <Keyboard /> &
            <Mouse />
          </span>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
