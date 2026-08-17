import { Container, Section, SectionHeader } from "@/components/layout/section";
import { LogoGrid } from "@/components/ui/logo-grid";
import { clients } from "@/content/services";

/**
 * Client proof, in the homepage's second slot.
 *
 * Centred rather than ranged left, which is the one place this site departs
 * from its own default: a symmetrical wall wants a symmetrical heading over it.
 *
 * The heading states the fact and stops. An earlier version editorialised about
 * sites "that have to evidence what they claim", which asserted something about
 * the customers rather than saying who they are.
 *
 * The line under it describes the engagement rather than characterising the
 * companies. That is the difference that matters: it adds information a reader
 * does not already have from the logos, instead of adding sentiment.
 */
export function ClientProof() {
  return (
    <Section ground="tint" id="clients">
      <Container>
        <SectionHeader
          align="center"
          eyebrow="Clients"
          title="Customers we have served"
          lede="Every consignment is weighed at both ends, routed to a named end use, and closed with a certificate from the party that did the work."
        />

        <LogoGrid clients={clients} className="mt-12 lg:mt-16" />
      </Container>
    </Section>
  );
}
