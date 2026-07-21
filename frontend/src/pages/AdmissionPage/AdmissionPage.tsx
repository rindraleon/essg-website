import React from "react";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";


import { GREEN } from "../../constants/colors";
import type { AdmissionPageProps } from "../../types/admission.types";
import { AdmissionForm, AdmissionTimeline, ContactCard, CtaSection, PageHero } from "../../components";

const HERO_IMAGE =
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920";

const AdmissionPage: React.FC<AdmissionPageProps> = (
    props: Readonly<AdmissionPageProps>,
) => {
    const {
        pageTitle = "Admission",
        pageSubtitle = "ESSG — Candidature",
        pageDescription = "Rejoignez l'ESSG et commencez votre parcours vers l'excellence en sciences géomatiques.",
    } = props;

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHero
                image={HERO_IMAGE}
                imageAlt="Admission ESSG"
                badgeIcon={<SchoolRoundedIcon />}
                badgeLabel={pageSubtitle}
                title={pageTitle}
                description={pageDescription}
                stats={[
                    { value: "Jan-Mai", label: "Candidatures" },
                    { value: "Juin", label: "Examens" },
                    { value: "Sept", label: "Rentrée" },
                ]}
            />

            {/* <AdmissionTimeline /> */}

            <section className="py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <AdmissionForm />

                    <div className="mt-8">
                        <ContactCard
                            icon={
                                <HelpOutlineRoundedIcon
                                    sx={{
                                        fontSize: 28,
                                        color: GREEN[900],
                                    }}
                                />
                            }
                            title="Besoin d'aide ?"
                            description="Si vous rencontrez des difficultés ou avez des questions sur le processus d'admission, notre équipe est là pour vous aider."
                            primaryLabel="admission@essg.mg"
                            primaryLink="admission@essg.mg"
                            secondaryLabel="+261 34 28 085 30"
                            secondaryLink="/contact"
                        />
                    </div>
                </div>
            </section>

            <CtaSection
                icon={
                    <SchoolRoundedIcon
                        sx={{ fontSize: 48, color: GREEN[900] }}
                    />
                }
                title="Découvrez nos formations"
                description="Explorez nos programmes d'excellence en sciences géomatiques avant de soumettre votre candidature."
                primaryLabel="Voir les formations"
                primaryLink="/formations"
                secondaryLabel="Questions fréquentes"
                secondaryLink="/faq"
            />
        </div>
    );
};

export default AdmissionPage;