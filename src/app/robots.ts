import type { MetadataRoute } from "next";
import { profile } from "@/data/cv";

/** every crawler is welcome — the AI ones just get sent to the wing built for them */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    host: profile.site,
  };
}
