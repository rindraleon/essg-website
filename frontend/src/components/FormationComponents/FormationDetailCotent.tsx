import { Card, CardContent, Divider } from '@/components/compat/mui';
import { ArrowRight, BadgeCheck, BookOpen, Briefcase, CircleCheck, Clock, GraduationCap, Mail, Star, User } from 'lucide-react';
import React from 'react';
import { GREEN } from '../../constants/colors';
import { getImageUrl } from '../../utils/image.utils';
import type { FormationDetailContentProps } from '../../types/formations.types';

const FormationDetailContent: React.FC<FormationDetailContentProps> = (
  props: Readonly<FormationDetailContentProps>
) => {
  const { formation } = props;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Colonne principale - 2/3 de la largeur */}
        <div className="lg:col-span-2">
          <Card
          >
            <CardContent className="p-6 sm:p-8">
              {/* Image de couverture — ratio fixe 16:9, object-fit cover */}
              {formation.image && (
                <div className="mb-7 overflow-hidden rounded-2xl border border-ink-100 shadow-card">
                  <div className="relative aspect-[16/9] w-full bg-ink-100">
                    <img
                      src={getImageUrl(formation.image)}
                      alt={formation.titre}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    {/* Voile dégradé élégant en bas de l'image */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-950/30 to-transparent"
                    />
                  </div>
                </div>
              )}

              <Divider className="mb-7" />

              {/* Description */}
              <section className="mb-8">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink-900">
                  <BookOpen />
                  Présentation
                </h2>
                <p className="leading-relaxed text-ink-700">{formation.description}</p>
              </section>

              <Divider className="my-6" />

              {/* Objectifs */}
              {formation.objectifs && formation.objectifs.length > 0 && (
                <section className="mb-8">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink-900">
                    <GraduationCap />
                    Objectifs de la formation
                  </h2>
                  <ul className="space-y-3">
                    {formation.objectifs.map((obj) => (
                      <li key={obj} className="flex items-start gap-3 text-ink-700">
                        <CircleCheck
                        />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Compétences */}
              {formation.competences && formation.competences.length > 0 && (
                <>
                  <Divider className="my-6" />
                  <section className="mb-8">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink-900">
                      <Star />
                      Compétences acquises
                    </h2>
                    <ul className="space-y-2">
                      {formation.competences?.map((competence) => (
                        <li key={competence} className="flex items-start gap-2 text-ink-700">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-700" />
                          <span>{competence}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </>
              )}

              {/* Programme / Modules */}
              {formation.modules && formation.modules.length > 0 && (
                <>
                  <Divider className="my-6" />
                  <section className="mb-8">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink-900">
                      <BookOpen />
                      Programme de formation
                    </h2>

                    <div className="space-y-4">
                      {formation.modules?.map((module) => (
                        <div key={module.semestre}>
                          <h3 className="mb-2 font-semibold text-ink-900">{module.semestre}</h3>
                          <ul className="space-y-2">
                            {module.cours?.map((cours: string) => (
                              <li
                                key={cours}
                                className="flex items-start gap-2 text-sm text-ink-700"
                              >
                                <span
                                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                  style={{
                                    backgroundColor: GREEN[900],
                                  }}
                                >
                                  ✓
                                </span>
                                <span>{cours}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {/* Débouchés */}
              {formation.debouches && formation.debouches.length > 0 && (
                <>
                  <Divider className="my-6" />
                  <section className="mb-8">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink-900">
                      <Briefcase />
                      Débouchés professionnels
                    </h2>
                    <ul className="space-y-2">
                      {formation.debouches?.map((debouche) => (
                        <li key={debouche} className="flex items-start gap-2 text-ink-700">
                          <ArrowRight
                          />
                          <span>{debouche}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </>
              )}

              {/* Points forts de la formation */}
              {formation.objectifs && formation.objectifs.length > 0 && (
                <>
                  <Divider className="my-6" />
                  <section>
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink-900">
                      <Star />
                      Points forts de la formation
                    </h2>
                    <ul className="space-y-3">
                      {formation.objectifs?.slice(0, 4).map((objectif, index) => (
                        <li key={objectif} className="flex items-start gap-3 text-ink-700">
                          <div
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: GREEN[800] }}
                          >
                            {index + 1}
                          </div>
                          <span>{objectif}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne latérale - 1/3 de la largeur */}
        <div className="lg:col-span-1">
          <Card
          >
            <CardContent className="p-6">
              <section>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink-900">
                  <BadgeCheck />
                  Informations clés
                </h3>

                <ul className="mb-6 space-y-4">
                  <li className="flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: GREEN[50],
                      }}
                    >
                      <GraduationCap
                      />
                    </div>
                    <div>
                      <div className="text-xs text-ink-900">Niveau</div>
                      <div className="font-semibold text-ink-900">{formation.niveau}</div>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: GREEN[50],
                      }}
                    >
                      <Clock
                      />
                    </div>
                    <div>
                      <div className="text-xs text-ink-900">Durée</div>
                      <div className="font-semibold text-ink-900">{formation.duree}</div>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: GREEN[50],
                      }}
                    >
                      <BookOpen
                      />
                    </div>
                    <div>
                      <div className="text-xs text-ink-900">Domaine</div>
                      <div className="font-semibold text-ink-900">
                        {Array.isArray(formation.domaine)
                          ? formation.domaine.join(', ')
                          : formation.domaine}
                      </div>
                    </div>
                  </li>

                  {formation.credits && (
                    <li className="flex items-start gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: GREEN[50],
                        }}
                      >
                        <BadgeCheck
                        />
                      </div>
                      <div>
                        <div className="text-xs text-ink-900">Crédits ECTS</div>
                        <div className="font-semibold text-ink-900">
                          {formation.credits} crédits
                        </div>
                      </div>
                    </li>
                  )}

                  {formation.responsable && (
                    <li className="flex items-start gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: GREEN[50],
                        }}
                      >
                        <User
                        />
                      </div>
                      <div>
                        <div className="text-xs text-ink-900">Responsable</div>
                        <div className="font-semibold text-ink-900">{formation.responsable}</div>
                      </div>
                    </li>
                  )}

                  {formation.email && (
                    <li className="flex items-start gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: GREEN[50],
                        }}
                      >
                        <Mail
                        />
                      </div>
                      <div>
                        <div className="text-xs text-ink-900">Contact</div>
                        <a
                          href={`mailto:${formation.email}`}
                          className="text-sm font-medium transition-colors hover:underline"
                          style={{
                            color: GREEN[800],
                          }}
                        >
                          {formation.email}
                        </a>
                      </div>
                    </li>
                  )}
                </ul>

                <Divider className="my-6" />

                {/* Conditions d'admission */}
                {formation.conditions && formation.conditions.length > 0 && (
                  <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-900">
                      <BadgeCheck />
                      Conditions d'admission
                    </h4>
                    <ul className="space-y-2">
                      {formation.conditions.map((condition) => (
                        <li key={condition} className="flex items-start gap-2 text-sm text-ink-700">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-700" />
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FormationDetailContent;
