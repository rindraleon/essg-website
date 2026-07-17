import React from "react";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import { GREEN } from "../../constants/colors";
import type { FormationDetailContentProps } from "../../types/formations.types";

const FormationDetailContent: React.FC<FormationDetailContentProps> = (
    props: Readonly<FormationDetailContentProps>,
) => {
    const { formation } = props;

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Colonne principale - 2/3 de la largeur */}
                <div className="lg:col-span-2">
                    <Card
                        sx={{
                            borderRadius: "1rem",
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        <CardContent className="p-6 sm:p-8">
                            {/* Description */}
                            <section className="mb-8">
                                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <MenuBookRoundedIcon
                                        sx={{ color: GREEN[800] }}
                                    />
                                    Présentation
                                </h2>
                                <p className="leading-relaxed text-gray-700">
                                    {formation.description}
                                </p>
                            </section>

                            <Divider className="my-6" />

                            {/* Objectifs */}
                            {formation.objectifs && formation.objectifs.length > 0 && (
                                <section className="mb-8">
                                    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                                        <SchoolRoundedIcon
                                            sx={{ color: GREEN[800] }}
                                        />
                                        Objectifs de la formation
                                    </h2>
                                    <ul className="space-y-3">
                                        {formation.objectifs.map((obj) => (
                                            <li
                                                key={obj}
                                                className="flex items-start gap-3 text-gray-700"
                                            >
                                                <CheckCircleRoundedIcon
                                                    sx={{
                                                        fontSize: 20,
                                                        color: GREEN[900],
                                                        mt: 0.25,
                                                        flexShrink: 0,
                                                    }}
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
                                        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                                                <StarRoundedIcon
                                                    sx={{ color: GREEN[800] }}
                                                />
                                                Compétences acquises
                                            </h2>
                                            <ul className="space-y-2">
                                                {formation.competences?.map(
                                                    (competence) => (
                                                        <li
                                                            key={competence}
                                                            className="flex items-start gap-2 text-gray-700"
                                                        >
                                                            <span
                                                                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-800"
                                                            />
                                                            <span>{competence}</span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </section>
                                    </>
                                )}

                            {/* Programme / Modules */}
                            {formation.modules && formation.modules.length > 0 && (
                                <>
                                    <Divider className="my-6" />
                                    <section className="mb-8">
                                        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                                            <MenuBookRoundedIcon
                                                sx={{ color: GREEN[800] }}
                                            />
                                            Programme de formation
                                        </h2>

                                        <div className="space-y-4">
                                            {formation.modules?.map((module) => (
                                                <div key={module.semestre}>
                                                    <h3 className="mb-2 font-semibold text-gray-900">
                                                        {module.semestre}
                                                    </h3>
                                                    <ul className="space-y-2">
                                                        {module.cours?.map(
                                                                (cours: string) => (
                                                                    <li
                                                                        key={cours}
                                                                        className="flex items-start gap-2 text-sm text-gray-700"
                                                                    >
                                                                        <span
                                                                            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                                                            style={{
                                                                                backgroundColor:
                                                                                    GREEN[900],
                                                                            }}
                                                                        >
                                                                            ✓
                                                                        </span>
                                                                        <span>
                                                                            {cours}
                                                                        </span>
                                                                    </li>
                                                                ),
                                                            )}
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
                                        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                                            <WorkRoundedIcon sx={{ color: GREEN[800] }} />
                                            Débouchés professionnels
                                        </h2>
                                        <ul className="space-y-2">
                                            {formation.debouches?.map((debouche) => (
                                                <li
                                                    key={debouche}
                                                    className="flex items-start gap-2 text-gray-700"
                                                >
                                                    <ArrowForwardRoundedIcon
                                                        sx={{
                                                            fontSize: 18,
                                                            color: GREEN[900],
                                                            mt: 0.25,
                                                            flexShrink: 0,
                                                        }}
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
                                        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                                            <StarRoundedIcon sx={{ color: GREEN[800] }} />
                                            Points forts de la formation
                                        </h2>
                                        <ul className="space-y-3">
                                            {formation.objectifs?.slice(0, 4).map((objectif, index) => (
                                                        <li  key={objectif}
                                                            className="flex items-start gap-3 text-gray-700"
                                                        >
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
                        sx={{
                            borderRadius: "1rem",
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        <CardContent className="p-6">
                            <section>
                                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <VerifiedRoundedIcon sx={{ color: GREEN[800] }} />
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
                                            <SchoolRoundedIcon
                                                sx={{
                                                    fontSize: 20,
                                                    color: GREEN[800],
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-900">
                                                Niveau
                                            </div>
                                            <div className="font-semibold text-gray-900">
                                                {formation.niveau}
                                            </div>
                                        </div>
                                    </li>

                                    <li className="flex items-start gap-3">
                                        <div
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                                            style={{
                                                backgroundColor: GREEN[50],
                                            }}
                                        >
                                            <AccessTimeRoundedIcon
                                                sx={{
                                                    fontSize: 20,
                                                    color: GREEN[800],
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-900">
                                                Durée
                                            </div>
                                            <div className="font-semibold text-gray-900">
                                                {formation.duree}
                                            </div>
                                        </div>
                                    </li>

                                    <li className="flex items-start gap-3">
                                        <div
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                                            style={{
                                                backgroundColor: GREEN[50],
                                            }}
                                        >
                                            <MenuBookRoundedIcon
                                                sx={{
                                                    fontSize: 20,
                                                    color: GREEN[800],
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-900">
                                                Domaine
                                            </div>
                                            <div className="font-semibold text-gray-900">
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
                                                <VerifiedRoundedIcon
                                                    sx={{
                                                        fontSize: 20,
                                                        color: GREEN[800],
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-900">
                                                    Crédits ECTS
                                                </div>
                                                <div className="font-semibold text-gray-900">
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
                                                <PersonRoundedIcon
                                                    sx={{
                                                        fontSize: 20,
                                                        color: GREEN[800],
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-900">
                                                    Responsable
                                                </div>
                                                <div className="font-semibold text-gray-900">
                                                    {formation.responsable}
                                                </div>
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
                                                <EmailRoundedIcon
                                                    sx={{
                                                        fontSize: 20,
                                                        color: GREEN[800],
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-900">
                                                    Contact
                                                </div>
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
                                {formation.conditions &&
                                    formation.conditions.length > 0 && (
                                        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                                            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                                                <VerifiedRoundedIcon sx={{ fontSize: 20, color: GREEN[800] }} />
                                                Conditions d'admission
                                            </h4>
                                            <ul className="space-y-2">
                                                {formation.conditions.map(
                                                    (condition) => (
                                                        <li
                                                            key={condition}
                                                            className="flex items-start gap-2 text-sm text-gray-700"
                                                        >
                                                            <span
                                                                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-800"
                                                            />
                                                            {condition}
                                                        </li>
                                                    ),
                                                )}
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