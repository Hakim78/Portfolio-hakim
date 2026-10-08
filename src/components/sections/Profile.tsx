import { Reveal } from '@/components/ui/Reveal'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { TechIcon } from '@/components/ui/TechIcon'
import { domains, experiences, facts, statement } from '@/data/profile'
import { toolbox } from '@/data/tech'

/** Profil : position, terrains, outils (logos), expériences, repères. */
export function Profile() {
  return (
    <section id="profil" className="gutter scroll-mt-[var(--header-h)] py-[18vh] md:py-[22vh]">
      {/* Position */}
      <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        <div className="col-span-12 pt-2 md:col-span-2">
          <SectionLabel>Profil</SectionLabel>
        </div>
        <div className="col-span-12 md:col-span-10 lg:col-span-9">
          <Reveal as="h2" className="statement" text={statement} />
          <p className="mt-8 max-w-measure text-base leading-relaxed text-fg/60 md:text-lg">
            Je cherche un poste d&apos;AI Engineer, en CDI ou en mission : un endroit où le modèle n&apos;est
            qu&apos;une partie du travail, et où il faut aussi livrer l&apos;API, l&apos;interface et
            l&apos;infrastructure.
          </p>
        </div>
      </div>

      {/* Terrains */}
      <div className="mt-28 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-36">
        <div className="col-span-12 pt-2 md:col-span-2">
          <SectionLabel>Terrains</SectionLabel>
        </div>
        <dl className="col-span-12 grid border-t border-line md:col-span-10 md:grid-cols-2 md:gap-x-12">
          {domains.map((d) => (
            <div key={d.title} className="border-b border-line py-7">
              <dt className="font-display text-xl tracking-tight md:text-2xl">{d.title}</dt>
              <dd className="mt-2 max-w-[42ch] text-sm leading-relaxed text-fg/60 md:text-base">{d.detail}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Outils : logos officiels, couleur de marque au survol */}
      <div className="mt-28 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-36">
        <div className="col-span-12 pt-2 md:col-span-2">
          <SectionLabel>Outils</SectionLabel>
        </div>
        <ul className="col-span-12 grid grid-cols-3 border-l border-t border-line sm:grid-cols-4 md:col-span-10 lg:grid-cols-5">
          {toolbox.map((t) => (
            <li
              key={t.label}
              style={{ '--brand': `#${t.icon.hex}` } as React.CSSProperties}
              className="group flex flex-col items-start gap-5 border-b border-r border-line p-5 text-fg/70 transition-colors duration-300 hover:text-[color:var(--brand)] md:p-6"
            >
              <TechIcon icon={t.icon} size={26} />
              <span className="text-xs text-fg/60 transition-colors duration-300 group-hover:text-fg">{t.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Expériences */}
      <div className="mt-28 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-36">
        <div className="col-span-12 pt-2 md:col-span-2">
          <SectionLabel>Expériences</SectionLabel>
        </div>
        <ol className="col-span-12 border-t border-line md:col-span-10">
          {experiences.map((x) => (
            <li
              key={x.company}
              className="grid gap-x-8 gap-y-2 border-b border-line py-7 md:grid-cols-[11rem_1fr] lg:grid-cols-[12rem_1fr_1fr]"
            >
              <p className="font-mono text-xs text-fg/50 md:pt-1">{x.period}</p>
              <div>
                <p className="font-display text-lg tracking-tight md:text-xl">{x.company}</p>
                <p className="mt-1 text-sm text-fg/60">{x.role}</p>
              </div>
              <p className="text-sm leading-relaxed text-fg/60 lg:pt-1">{x.detail}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Repères */}
      <div className="mt-28 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-36">
        <div className="col-span-12 pt-2 md:col-span-2">
          <SectionLabel>Repères</SectionLabel>
        </div>
        <dl className="col-span-12 grid gap-8 sm:grid-cols-2 md:col-span-10 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="label text-fg/50">{f.label}</dt>
              <dd className="mt-3 text-base">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
