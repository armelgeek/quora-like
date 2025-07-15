import { Metadata } from "next";
import UserProfileHome from "@/shared/components/user/user-profile-home";

export const metadata: Metadata = { title: "Settings" };

export default function Page() {
  return <UserProfileHome />;
}
