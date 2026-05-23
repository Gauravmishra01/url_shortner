import React from "react";
import { Badge, Card, SectionHeading } from "../components/ui-kit.jsx";
import { usePageMeta } from "../utils/pageMeta.js";

const AboutPage = () => {
  usePageMeta({
    title: "About Us | url_shortner",
    description:
      "Learn what url_shortner does, how it works, and why the experience is designed to stay simple, fast, and reliable.",
  });

  return (
    <div className="page-shell space-y-8 py-8 sm:space-y-10 sm:py-12">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 subtle-grid opacity-25" />
        <div className="relative z-10 space-y-5 sm:space-y-6">
          <Badge tone="accent">About us</Badge>
          <div className="space-y-3">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[color:var(--text)] sm:text-5xl">
              A simple link workspace built to stay fast, clear, and easy to
              use.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[color:var(--muted)]">
              url_shortner focuses on one job: making short links feel clean and
              dependable. The main pages stay minimal, while this page holds the
              fuller story about the product, the workflow, and the design
              choices behind the interface.
            </p>
          </div>
        </div>
      </Card>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionHeading
            eyebrow="What we do"
            title="Short links, saved links, and a lightweight dashboard."
            description="The app is designed to keep the essential actions close together so users can shorten, save, and revisit links without extra noise."
          />
          <div className="space-y-4 text-sm leading-7 text-[color:var(--muted)]">
            <p>
              The homepage introduces the product in a single glance. The
              dashboard keeps the working parts visible without unnecessary
              storytelling. Authentication stays focused on one task: getting
              users in quickly and safely.
            </p>
            <p>
              This structure keeps the experience lightweight on mobile, avoids
              overwhelming the screen with text, and helps users move straight
              to the action they came for.
            </p>
          </div>
        </Card>

        <Card>
          <SectionHeading
            eyebrow="Design approach"
            title="Minimal by default, readable by design."
            description="Spacing, type scale, and contrast are used to create clarity instead of decoration."
          />
          <div className="space-y-4 text-sm leading-7 text-[color:var(--muted)]">
            <p>
              Surfaces are kept calm and consistent so the interface feels
              stable on both phone and desktop. Buttons are large enough to tap
              comfortably, content blocks are compact, and the hierarchy makes
              the primary action obvious.
            </p>
            <p>
              Motion is intentionally subtle. It helps the interface feel alive
              without turning the product into a heavy visual experience.
            </p>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <p className="eyebrow">01</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[color:var(--text)]">
            Fast workflow
          </h2>
          <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
            The product is optimized so the most common tasks happen in only a
            few taps, especially on smaller screens.
          </p>
        </Card>
        <Card>
          <p className="eyebrow">02</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[color:var(--text)]">
            Clear structure
          </h2>
          <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
            Main pages stay short and focused, while explanatory content lives
            here so the rest of the app stays uncluttered.
          </p>
        </Card>
        <Card>
          <p className="eyebrow">03</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[color:var(--text)]">
            Reliable feel
          </h2>
          <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
            The interface keeps feedback visible and interactions predictable so
            users feel confident using it on mobile or desktop.
          </p>
        </Card>
      </section>
    </div>
  );
};

export default AboutPage;
