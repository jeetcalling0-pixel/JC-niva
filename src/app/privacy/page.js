import { LegalContent } from "@/components/legal-content";
import { getLegalDocument } from "@/lib/legal";
export const metadata = { title: "Privacy Policy | JC NIVA" };
export const dynamic = "force-dynamic";
export default async function PrivacyPage() { return <LegalContent {...await getLegalDocument("privacy")} />; }
