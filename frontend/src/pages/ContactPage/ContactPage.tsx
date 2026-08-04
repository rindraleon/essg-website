import React from 'react';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import RoomRoundedIcon from '@mui/icons-material/RoomRounded';
import ContactIcon from '@mui/icons-material/ContactMailRounded';

import { Toaster } from 'react-hot-toast';

import PageHero from '../../components/common/PageHero';
import { GREEN } from '../../constants/colors';
import type { ContactPageProps } from '../../types/contact.types';
import { ContactForm, ContactInfoCards, MapEmbed } from '../../components';
import { useScrollToTop } from '../../hooks';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920';

const UNIV_FIANAR = {
  lat: -21.4413,
  lng: 47.0879,
  label: 'Université de Fianarantsoa — Campus Andrainjato',
  adresse: 'Andrainjato, BP 1264, Fianarantsoa 301, Madagascar',
};

const ContactPage: React.FC<ContactPageProps> = (props: Readonly<ContactPageProps>) => {
  useScrollToTop();

  const {
    pageTitle = 'Contactez-nous',
    pageSubtitle = 'ESSG — Support & Échanges',
    pageDescription = 'Notre équipe est à votre disposition pour répondre à toutes vos questions sur les formations, les admissions ou les partenariats.',
    mapLat = UNIV_FIANAR.lat,
    mapLng = UNIV_FIANAR.lng,
    mapLabel = UNIV_FIANAR.label,
    mapAdresse = UNIV_FIANAR.adresse,
  } = props;

  const contactItems = [
    {
      id: 'adresse',
      icon: <RoomRoundedIcon sx={{ fontSize: 20, color: GREEN[600] }} />,
      title: 'Adresse',
      lines: [
        'Université de Fianarantsoa',
        'Campus Andrainjato',
        'BP 1264, Fianarantsoa 301',
        'Madagascar',
      ],
    },
    {
      id: 'telephone',
      icon: <PhoneRoundedIcon sx={{ fontSize: 20, color: GREEN[600] }} />,
      title: 'Téléphone',
      lines: ['+261 34 28 085 30', '+261 33 12 345 67'],
    },
    {
      id: 'email',
      icon: <EmailRoundedIcon sx={{ fontSize: 20, color: GREEN[600] }} />,
      title: 'Email',
      lines: ['contact@essg.mg', 'admission@essg.mg'],
    },
    {
      id: 'horaires',
      icon: <AccessTimeRoundedIcon sx={{ fontSize: 20, color: GREEN[600] }} />,
      title: 'Horaires',
      lines: ['Lundi - Vendredi : 8h - 17h', 'Samedi : 9h - 13h', 'Dimanche : Fermé'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '0.75rem',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: GREEN[600],
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <PageHero
        image={HERO_IMAGE}
        imageAlt="Contact ESSG"
        badgeIcon={<ContactIcon />}
        badgeLabel={pageSubtitle}
        title={pageTitle}
        description={pageDescription}
        stats={[
          { value: '< 24h', label: 'Temps de réponse' },
          { value: '5j/7', label: 'Disponibilité' },
          { value: '100%', label: 'Écoute' },
        ]}
      />

      {/* Formulaire et Infos */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <ContactInfoCards items={contactItems} />
            </div>

            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Carte */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Localisation</h2>
          <MapEmbed lat={mapLat} lng={mapLng} label={mapLabel} adresse={mapAdresse} zoom="city" />
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
