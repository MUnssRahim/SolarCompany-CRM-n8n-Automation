import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { IconTile } from "@/components/ui/IconTile";
import { ContactForm } from "@/components/site/ContactForm";
import {
  BoltIcon,
  BuildingIcon,
  CalendarIcon,
  GaugeIcon,
  HomeIcon,
  UsersIcon,
  WrenchIcon,
} from "@/components/ui/icons";

const SERVICES = [
  {
    icon: HomeIcon,
    title: "Residential",
    description:
      "Custom-designed rooftop systems optimized for your home's unique energy profile and roof layout.",
  },
  {
    icon: BuildingIcon,
    title: "Commercial",
    description:
      "High-capacity installations designed to significantly reduce operational costs for businesses.",
  },
  {
    icon: WrenchIcon,
    title: "Maintenance",
    description:
      "Proactive monitoring and technical support to keep your system running at peak efficiency year-round.",
  },
  {
    icon: UsersIcon,
    title: "Consultation",
    description:
      "Expert energy audits and site assessments to determine the optimal technical approach for your needs.",
  },
];

const TESTIMONIALS = [
  {
    name: "Ayesha Raza",
    role: "Homeowner, Lahore",
    quote:
      "Our electricity bill dropped by more than 80% within the first month. The team handled everything from design to installation.",
  },
  {
    name: "Bilal Ahmed",
    role: "Factory Owner, Faisalabad",
    quote:
      "The commercial install paid for itself faster than projected. Monitoring and support have been excellent ever since.",
  },
  {
    name: "Sana Malik",
    role: "Homeowner, Islamabad",
    quote:
      "Booking a consultation was effortless and the calculator gave us a realistic estimate before we even spoke to anyone.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <Container className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Power Your Home With Sunshine
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
              Transform your roof into a{" "}
              <span className="font-semibold text-brand-600">clean energy plant</span>.
              Reliable, high-efficiency solar solutions engineered for{" "}
              <span className="font-semibold text-brand-600">maximum savings</span> and a
              sustainable future.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <LinkButton href="/calculator" size="lg">
                Calculate Your Savings
                <BoltIcon className="h-4.5 w-4.5" />
              </LinkButton>
              <LinkButton href="/book" size="lg" variant="outline">
                Book a Free Consultation
                <CalendarIcon className="h-4.5 w-4.5" />
              </LinkButton>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/residential-install.jpg"
                alt="Solar installer securing panels on a residential rooftop"
                width={800}
                height={600}
                priority
                className="h-[380px] w-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
              <IconTile tone="brand" size="sm">
                <BoltIcon />
              </IconTile>
              <div>
                <p className="text-xs text-slate-500">System Efficiency</p>
                <p className="text-sm font-bold text-slate-900">98.4% Peak</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="bg-white py-20">
        <Container>
          <SectionHeading
            center
            title="Comprehensive Solar Solutions"
            description="Engineered precision for every scale of energy requirement."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service) => (
              <Card key={service.title} className="border-slate-200 bg-slate-50 p-6">
                <IconTile tone="navy">
                  <service.icon />
                </IconTile>
                <h3 className="mt-5 text-base font-semibold text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {service.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="Testimonials"
            title="Trusted by homeowners and businesses"
            description="A few words from clients who switched to solar with us."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="flex flex-col justify-between p-6">
                <p className="text-sm leading-relaxed text-slate-700">“{t.quote}”</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact */}
      <section className="bg-white py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Get In Touch"
              title="Let's talk about your energy goals"
              description="Whether you're exploring options or ready to install, our team responds within one business day."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <IconTile tone="navy" size="sm">
                  <GaugeIcon />
                </IconTile>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Free Assessment</p>
                  <p className="text-sm text-slate-600">No-obligation site & bill review.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <IconTile tone="navy" size="sm">
                  <WrenchIcon />
                </IconTile>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Certified Install</p>
                  <p className="text-sm text-slate-600">Licensed technicians, full warranty.</p>
                </div>
              </div>
            </div>
          </div>
          <Card className="border-slate-200 bg-slate-50 p-6 sm:p-8">
            <ContactForm />
          </Card>
        </Container>
      </section>
    </>
  );
}
