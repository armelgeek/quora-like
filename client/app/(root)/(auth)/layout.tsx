import { FadeIn } from "@/shared/components/atoms/animated-elements";
import AppClientMenu from "@/shared/components/molecules/layout/app-client-menu";

interface AuthLayoutProps {
  readonly children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <AppClientMenu />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <FadeIn>
            {children}
          </FadeIn>
        </div>
      </div>

    </>
  );
}
