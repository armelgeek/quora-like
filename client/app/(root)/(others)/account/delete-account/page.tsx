import { Metadata } from "next";
import DeleteAccountClient from "./delete-account-client";

export const metadata: Metadata = { 
    title: "Supprimer le compte",
    description: "Supprimer définitivement votre compte et toutes vos données"
};

export default function Page() {
    return <DeleteAccountClient />;
}