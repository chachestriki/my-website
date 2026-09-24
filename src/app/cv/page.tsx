import type { Metadata } from "next";
import CvDocument from "@/components/CvDocument";
import { profile } from "@/data/cv";

export const metadata: Metadata = {
  title: `CV — ${profile.name}`,
  description: profile.summary,
};

export default function CvPage() {
  return <CvDocument />;
}
