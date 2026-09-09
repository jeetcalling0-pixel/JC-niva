import { LegalContent } from "@/components/legal-content";
import { getLegalDocument } from "@/lib/legal";
export const metadata = { title: "Terms & Conditions | JC NIVA" };
export const dynamic = "force-dynamic";
export default async function TermsPage() { return <LegalContent {...await getLegalDocument("terms")} />; }
