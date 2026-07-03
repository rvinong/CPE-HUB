import React from "react";
import { Link } from "react-router-dom";
import aboutImage from "../assets/images/1.jpg";

export default function AboutPage() {
  return (
    <div className="bg-[#f7f4ef]">
      <section className="border-b border-neutral-950 bg-white py-14">
        <div className="page-shell">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-neutral-500">About</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black uppercase leading-none sm:text-6xl">
            Merch for the CPE community, released by year and preserved by memory.
          </h1>
        </div>
      </section>

      <section className="page-shell grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <img src={aboutImage} alt="CPE HUB community" className="aspect-[4/5] w-full object-cover" />
        </div>
        <div>
          <h2 className="text-3xl font-black uppercase sm:text-5xl">CPE HUB</h2>
          <div className="mt-6 grid gap-5 text-base leading-7 text-neutral-600">
            <p>
              CPE HUB is the home for computer engineering merch drops. Every release is tied to a year, so the current
              drop stays easy to shop while older merch remains visible as part of the department record.
            </p>
            <p>
              The archive is intentionally simple: photo, merch name, and year. It shows what came before without
              making old items look like active inventory.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="bg-neutral-950 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-700"
            >
              Shop Current Drop
            </Link>
            <Link
              to="/products?view=archive"
              className="border border-neutral-950 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] transition hover:bg-neutral-950 hover:text-white"
            >
              View Archive
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-950 bg-neutral-950 py-12 text-white">
        <div className="page-shell grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/50">01</p>
            <h3 className="mt-3 text-xl font-black uppercase">Current Drop</h3>
            <p className="mt-3 text-sm leading-6 text-white/65">The merch available to order now.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/50">02</p>
            <h3 className="mt-3 text-xl font-black uppercase">Yearly Releases</h3>
            <p className="mt-3 text-sm leading-6 text-white/65">Each collection belongs to its release year.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/50">03</p>
            <h3 className="mt-3 text-xl font-black uppercase">Archive</h3>
            <p className="mt-3 text-sm leading-6 text-white/65">Old merch stays visible without checkout actions.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
