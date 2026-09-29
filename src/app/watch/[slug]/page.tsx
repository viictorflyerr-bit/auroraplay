import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PremiumModal from "@/components/PremiumModal";
import PlayerClient from "@/components/PlayerClient";
import { getSeries, SERIES } from "@/lib/data";

export function generateStaticParams() {
  return SERIES.map((s) => ({ slug: s.slug }));
}

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ep?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const series = getSeries(slug);
  if (!series) notFound();

  const ep = Math.max(1, Math.min(30, Number(sp.ep) || 1));

  return (
    <div className="bg-[#050505] pb-0">
      <Header />
      <PlayerClient series={series} initialEp={ep} />
      <Footer />
      <PremiumModal />
    </div>
  );
}
