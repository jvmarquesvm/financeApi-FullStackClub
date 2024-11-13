import Image from "next/image";
import { Button } from "../_components/ui/button";
import { LogInIcon } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

const loginPage = async () => {
  const { userId } = await auth();
  if (userId) {
    redirect("/");
  }

  return (
    <div className="grid h-full grid-cols-2">
      <div className="max-w-{550px} mx-auto flex h-full flex-col justify-center p-8">
        <Image
          src="/logo.svg"
          width={173}
          height={39}
          alt="Finance Ai"
          className="mb-8"
        />
        <h1 className="mb-3 text-4xl font-bold">Bem-Vindo</h1>
        <p className="text-muted-foreground mb-8">
          A Finance AI é uma plataforma de gestão financeira que utiliza IA para
          monitorar suas movimentações, e oferecer insights personalizados,
          facilitando o controle do seu orçamento.
        </p>
        <SignInButton>
          <Button variant="outline">
            <LogInIcon className="mr-2" />
            Fazer Login ou Criar Conta
          </Button>
        </SignInButton>
      </div>
      <div className="relative h-full w-full">
        <Image
          src="/login.png"
          alt="Faça login"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default loginPage;
