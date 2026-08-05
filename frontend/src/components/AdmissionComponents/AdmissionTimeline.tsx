import React from 'react';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { GREEN } from '../../constants/colors';
import type { AdmissionTimelineProps } from '../../types/admission.types';

const DEFAULT_STEPS = [
  {
    date: 'Janvier - Mai',
    titre: 'Candidatures en ligne',
    icon: <DescriptionRoundedIcon sx={{ fontSize: 24, color: GREEN[600] }} />,
  },
  {
    date: 'Juin',
    titre: "Examens d'entrée",
    icon: <CalendarTodayRoundedIcon sx={{ fontSize: 24, color: GREEN[600] }} />,
  },
  {
    date: 'Juillet',
    titre: 'Résultats et entretiens',
    icon: <CheckCircleRoundedIcon sx={{ fontSize: 24, color: GREEN[600] }} />,
  },
  {
    date: 'Septembre',
    titre: 'Rentrée académique',
    icon: <CheckCircleRoundedIcon sx={{ fontSize: 24, color: GREEN[600] }} />,
  },
];

const AdmissionTimeline: React.FC<AdmissionTimelineProps> = (
  props: Readonly<AdmissionTimelineProps>
) => {
  const { title = 'Calendrier des admissions 2026', steps = DEFAULT_STEPS } = props;

  return (
    <section className="border-b border-ink-100 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          {title}
        </h2>

        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((etape) => (
            <Card
              key={etape.titre}
              sx={{
                borderRadius: '1.25rem',
                border: '1px solid',
                borderColor: 'divider',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow:
                    '0 2px 4px rgba(15, 33, 30, 0.05), 0 16px 40px -12px rgba(15, 33, 30, 0.16)',
                  transform: 'translateY(-4px)',
                  borderColor: GREEN[200],
                },
              }}
            >
              <CardContent className="p-6">
                <div
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: GREEN[50] }}
                >
                  {etape.icon}
                </div>

                <div className="mb-1 text-sm font-semibold" style={{ color: GREEN[600] }}>
                  {etape.date}
                </div>

                <div className="font-semibold text-ink-900">{etape.titre}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdmissionTimeline;
