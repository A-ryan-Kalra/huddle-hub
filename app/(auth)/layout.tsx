import React from "react";

interface AuthPageProps {
  children: React.ReactNode;
}

function AuthPage({ children }: AuthPageProps) {
  return (
    <div className=" h-screen flex justify-center items-center">{children}</div>
  );
}

export default AuthPage;
