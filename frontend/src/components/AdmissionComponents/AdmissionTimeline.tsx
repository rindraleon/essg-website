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
    <section className="border-b border-gray-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">{title}</h2>

        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((etape) => (
            <Card
              key={etape.titre}
              sx={{
                borderRadius: '1rem',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
                  transform: 'translateY(-2px)',
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

                <div className="font-semibold text-gray-900">{etape.titre}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdmissionTimeline;
