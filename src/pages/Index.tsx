import React from "react";
import { Header } from "@/components/registration/Header";
import { RegistrationForm } from "@/components/registration/RegistrationForm";

const Index = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div className="w-full min-h-screen bg-white">
        <Header />
        <main className="flex gap-10 p-10 max-md:flex-col max-sm:p-5">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d97566b8e41e611efc9a79b1045534a0da51d5be"
            className="w-[984px] h-[518px] shadow-[10px_8px_5.6px_rgba(0,0,0,0.60)] rounded-[11px] max-sm:w-full max-sm:h-auto"
            alt="Main"
          />
          <RegistrationForm />
        </main>
      </div>
    </>
  );
};

export default Index;
