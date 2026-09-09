import { LegalContent } from "@/components/legal-content";
import { getLegalDocument } from "@/lib/legal";
export const metadata = { title: "Disclaimer | JC NIVA" };
export const dynamic = "force-dynamic";
export default async function DisclaimerPage() { return <LegalContent {...await getLegalDocument("disclaimer")} />; }
