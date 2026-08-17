import Link from "next/link";

import { Container, Section, SectionHeader } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Section ground="light" className="py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="404"
          title="That page is not here"
          lede="The link may be out of date. The material streams and their end uses are the most likely thing you were after."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg"><Link href="/materials">Materials</Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/">Home</Link></Button>
        </div>
      </Container>
    </Section>
  );
}
