import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  GraduationCap,
  Mail,
  PlayCircle,
  Star,
  User,
  Award,
  ListOrdered,
} from 'lucide-react';
import React, { useState } from 'react';
import { getImageUrl } from '../../utils/image.utils';
import type { FormationDetailContentProps } from '../../types/formations.types';

const FormationDetailContent: React.FC<FormationDetailContentProps> = (
  props: Readonly<FormationDetailContentProps>
) => {
  const { formation } = props;
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [showAllModules, setShowAllModules] = useState(false);

  const toggleModule = (index: number) => {
    setExpandedModule(expandedModule === index ? null : index);
  };

  const visibleModules =
    formation.modules && !showAllModules
      ? formation.modules.slice(0, 3)
      : formation.modules;

  const remainingModulesCount =
    formation.modules && formation.modules.length > 3
      ? formation.modules.length - 3
      : 0;

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] antialiased">
      {/* ──────────────────── Hero Section ──────────────────── */}
      <header className="relative overflow-hidden bg-[#eff4ff]">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 px-4 py-8 md:flex-row md:px-8">
          {/* Left column — text */}
          <div className="z-10 w-full space-y-4 md:w-1/2">
            

            {/* Title */}
            <h1 className="font-['Manrope'] text-[32px] font-extrabold leading-[40px] tracking-tight text-[#0b1c30] md:text-[48px] md:leading-[56px] md:tracking-[-0.02em]">
              {formation.titre}
            </h1>

            {/* Description */}
            <p className="max-w-2xl font-['Inter'] text-lg leading-7 text-[#45464d]">
              {formation.description}
            </p>

            {/* Meta info row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#45464d]">
              {formation.duree && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formation.duree}
                </span>
              )}
              {formation.niveau && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {formation.niveau}
                </span>
              )}
              {formation.credits && (
                <span className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  {formation.credits} crédits ECTS
                </span>
              )}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              {formation.email && (
                <a
                  href={`mailto:${formation.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0b1c30] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#213145]"
                >
                  <Mail className="h-4 w-4" />
                  Contacter la formation
                </a>
              )}
              <a
                href="#programme"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#0b1c30] bg-transparent px-8 py-3 text-sm font-semibold text-[#0b1c30] transition-colors hover:bg-[#d3e4fe]"
              >
                <ListOrdered className="h-4 w-4" />
                Voir le programme
              </a>
            </div>
          </div>

          {/* Right column — cover image */}
          <div className="relative w-full md:w-1/2">
            {formation.image && (
              <div className="aspect-video overflow-hidden rounded-xl border-4 border-white shadow-[0px_12px_32px_rgba(15,23,42,0.12)]">
                <img
                  src={getImageUrl(formation.image)}
                  alt={formation.titre}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Decorative background */}
        <div className="pointer-events-none absolute right-0 top-0 -z-10 h-full w-1/3 rounded-l-full bg-gradient-to-l from-[#d3e4fe] to-transparent opacity-50 blur-3xl" />
      </header>

      {/* ──────────────────── Main Content Grid ──────────────────── */}
      <section className="mx-auto grid max-w-[1280px] grid-cols-4 gap-6 px-4 py-16 md:grid-cols-12 md:px-8">
        {/* ════════ Left / Main column ════════ */}
        <div className="col-span-4 space-y-8 md:col-span-8">
          {/* ── About / Présentation ── */}
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 md:p-8">
            <h2 className="mb-4 font-['Manrope'] text-2xl font-bold leading-8 text-[#0b1c30]">
              À propos de cette formation
            </h2>
            <div className="space-y-4 font-['Inter'] text-base leading-6 text-[#45464d]">
              <p>{formation.description}</p>
            </div>

            {/* Objectifs — "Ce que vous apprendrez" */}
            {formation.objectifs && formation.objectifs.length > 0 && (
              <>
                <h3 className="mt-6 font-['Manrope'] text-xl font-semibold leading-7 text-[#0b1c30]">
                  Ce que vous apprendrez
                </h3>
                <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {formation.objectifs.map((obj) => (
                    <li key={obj} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#006a61]" />
                      <span className="text-sm leading-5 text-[#45464d]">{obj}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* ── Compétences acquises ── */}
          {formation.competences && formation.competences.length > 0 && (
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 md:p-8">
              <h2 className="mb-4 font-['Manrope'] text-2xl font-bold leading-8 text-[#0b1c30]">
                Compétences acquises
              </h2>
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {formation.competences.map((competence) => (
                  <li key={competence} className="flex items-start gap-3">
                    <Star className="mt-0.5 h-5 w-5 shrink-0 text-[#006a61]" />
                    <span className="text-sm leading-5 text-[#45464d]">{competence}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Programme / Modules ── */}
          {formation.modules && formation.modules.length > 0 && (
            <div id="programme" className="rounded-xl border border-[#e2e8f0] bg-white p-6 md:p-8">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
                <h2 className="font-['Manrope'] text-2xl font-bold leading-8 text-[#0b1c30]">
                  Programme de la formation
                </h2>
                <span className="rounded-full bg-[#e5eeff] px-3 py-1 text-xs font-semibold tracking-wide text-[#45464d]">
                  {formation.modules.length} Module{formation.modules.length > 1 ? 's' : ''}
                  {formation.modules.reduce(
                    (acc, m) => acc + (m.cours?.length ?? 0),
                    0
                  ) > 0 &&
                    ` • ${formation.modules.reduce(
                      (acc, m) => acc + (m.cours?.length ?? 0),
                      0
                    )} Leçons`}
                </span>
              </div>

              <div className="space-y-4">
                {visibleModules?.map((module, index) => {
                  const isExpanded = expandedModule === index;
                  return (
                    <div
                      key={module.semestre}
                      className={`group overflow-hidden rounded-lg border transition-colors ${
                        isExpanded
                          ? 'border-[#006a61]'
                          : 'border-[#c6c6cd] hover:border-[#006a61]'
                      }`}
                    >
                      {/* Module header */}
                      <button
                        type="button"
                        onClick={() => toggleModule(index)}
                        className={`flex w-full items-center justify-between bg-[#f8f9ff] p-4 text-left ${
                          isExpanded ? 'border-l-4 border-l-[#006a61]' : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-['Manrope'] text-xl font-semibold ${
                              isExpanded
                                ? 'bg-[#86f2e4] text-[#006f66]'
                                : 'bg-[#dce9ff] text-[#0b1c30]'
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-['Manrope'] text-lg font-semibold leading-7 text-[#0b1c30]">
                              {module.semestre}
                            </h4>
                            {module.cours && (
                              <p className="text-sm text-[#45464d]">
                                {module.cours.length} leçon{module.cours.length > 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-[#006a61]" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-[#45464d] transition-colors group-hover:text-[#006a61]" />
                        )}
                      </button>

                      {/* Module content — lessons */}
                      {isExpanded && module.cours && module.cours.length > 0 && (
                        <div className="space-y-1 border-t border-[#c6c6cd] bg-white p-4">
                          {module.cours.map((cours: string) => (
                            <div
                              key={cours}
                              className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-[#eff4ff]"
                            >
                              <div className="flex items-center gap-3">
                                <PlayCircle className="h-4 w-4 text-[#006a61]" />
                                <span className="text-sm text-[#0b1c30]">{cours}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Show more modules button */}
              {remainingModulesCount > 0 && !showAllModules && (
                <button
                  type="button"
                  onClick={() => setShowAllModules(true)}
                  className="mt-4 w-full rounded-lg border border-transparent py-3 text-sm font-semibold text-[#006a61] transition-colors hover:border-[#c6c6cd] hover:bg-[#e5eeff]"
                >
                  Voir les {remainingModulesCount} autre{remainingModulesCount > 1 ? 's' : ''}{' '}
                  module{remainingModulesCount > 1 ? 's' : ''}
                </button>
              )}
            </div>
          )}

          {/* ── Débouchés ── */}
          {formation.debouches && formation.debouches.length > 0 && (
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 md:p-8">
              <h2 className="mb-4 font-['Manrope'] text-2xl font-bold leading-8 text-[#0b1c30]">
                Débouchés professionnels
              </h2>
              <ul className="space-y-3">
                {formation.debouches.map((debouche) => (
                  <li key={debouche} className="flex items-start gap-3">
                    <ArrowRight className="mt-0.5 h-5 w-5 shrink-0 text-[#006a61]" />
                    <span className="text-sm leading-5 text-[#45464d]">{debouche}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Points forts ── */}
          {formation.objectifs && formation.objectifs.length > 0 && (
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 md:p-8">
              <h2 className="mb-4 font-['Manrope'] text-2xl font-bold leading-8 text-[#0b1c30]">
                Points forts de la formation
              </h2>
              <ul className="space-y-4">
                {formation.objectifs.slice(0, 4).map((objectif, index) => (
                  <li key={objectif} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#006a61] font-['Manrope'] text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <span className="pt-1 text-sm leading-5 text-[#45464d]">{objectif}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ════════ Right / Sidebar ════════ */}
        <div className="col-span-4 space-y-4">
          {/* ── Key Info / Purchase-style card ── */}
          <div className="sticky top-24 rounded-xl border border-[#e2e8f0] bg-white p-6">
            {/* Heading */}
            <h3 className="mb-4 font-['Manrope'] text-xl font-semibold leading-7 text-[#0b1c30]">
              Informations clés
            </h3>

            {/* Info list */}
            <ul className="mb-6 space-y-4">
              {/* Niveau */}
              <li className="flex items-center gap-3 text-sm text-[#45464d]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eff4ff]">
                  <GraduationCap className="h-5 w-5 text-[#006a61]" />
                </div>
                <div>
                  <div className="text-xs font-semibold tracking-wide text-[#0b1c30]">Niveau</div>
                  <div className="font-semibold text-[#0b1c30]">{formation.niveau}</div>
                </div>
              </li>

              {/* Durée */}
              <li className="flex items-center gap-3 text-sm text-[#45464d]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eff4ff]">
                  <Clock className="h-5 w-5 text-[#006a61]" />
                </div>
                <div>
                  <div className="text-xs font-semibold tracking-wide text-[#0b1c30]">Durée</div>
                  <div className="font-semibold text-[#0b1c30]">{formation.duree}</div>
                </div>
              </li>

              {/* Domaine */}
              <li className="flex items-center gap-3 text-sm text-[#45464d]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eff4ff]">
                  <BookOpen className="h-5 w-5 text-[#006a61]" />
                </div>
                <div>
                  <div className="text-xs font-semibold tracking-wide text-[#0b1c30]">Domaine</div>
                  <div className="font-semibold text-[#0b1c30]">
                    {Array.isArray(formation.domaine)
                      ? formation.domaine.join(', ')
                      : formation.domaine}
                  </div>
                </div>
              </li>

              {/* Crédits ECTS */}
              {formation.credits && (
                <li className="flex items-center gap-3 text-sm text-[#45464d]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eff4ff]">
                    <BadgeCheck className="h-5 w-5 text-[#006a61]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold tracking-wide text-[#0b1c30]">
                      Crédits ECTS
                    </div>
                    <div className="font-semibold text-[#0b1c30]">{formation.credits} crédits</div>
                  </div>
                </li>
              )}

              {/* Responsable */}
              {formation.responsable && (
                <li className="flex items-center gap-3 text-sm text-[#45464d]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eff4ff]">
                    <User className="h-5 w-5 text-[#006a61]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold tracking-wide text-[#0b1c30]">
                      Responsable
                    </div>
                    <div className="font-semibold text-[#0b1c30]">{formation.responsable}</div>
                  </div>
                </li>
              )}

              {/* Contact email */}
              {formation.email && (
                <li className="flex items-center gap-3 text-sm text-[#45464d]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eff4ff]">
                    <Mail className="h-5 w-5 text-[#006a61]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold tracking-wide text-[#0b1c30]">
                      Contact
                    </div>
                    <a
                      href={`mailto:${formation.email}`}
                      className="text-sm font-medium text-[#006a61] transition-colors hover:underline"
                    >
                      {formation.email}
                    </a>
                  </div>
                </li>
              )}
            </ul>

            {/* CTA */}
            {formation.email && (
              <a
                href={`mailto:${formation.email}`}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0b1c30] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#213145]"
              >
                <Mail className="h-4 w-4" />
                Contacter la formation
              </a>
            )}

            {/* Conditions d'admission */}
            {formation.conditions && formation.conditions.length > 0 && (
              <div className="mt-6 border-t border-[#c6c6cd] pt-6">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0b1c30]">
                  <BadgeCheck className="h-4 w-4 text-[#006a61]" />
                  Conditions d'admission
                </h4>
                <ul className="space-y-2">
                  {formation.conditions.map((condition) => (
                    <li key={condition} className="flex items-start gap-2 text-sm text-[#45464d]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#006a61]" />
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── Responsable / Instructor card ── */}
          {formation.responsable && (
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-6">
              <h3 className="mb-4 font-['Manrope'] text-xl font-semibold leading-7 text-[#0b1c30]">
                Responsable de la formation
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#e5eeff] bg-[#dce9ff]">
                  <User className="h-8 w-8 text-[#0b1c30]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0b1c30]">{formation.responsable}</h4>
                  {formation.email && (
                    <a
                      href={`mailto:${formation.email}`}
                      className="text-sm text-[#006a61] hover:underline"
                    >
                      {formation.email}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FormationDetailContent;