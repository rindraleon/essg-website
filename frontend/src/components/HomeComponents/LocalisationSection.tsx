import React from 'react';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import RoomRoundedIcon from '@mui/icons-material/RoomRounded';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LocalisationSectionProps } from '../../types/sectionone.types';

// Fix pour l'icône par défaut de Leaflet
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const LocalisationSection: React.FC<LocalisationSectionProps> = (
  props: Readonly<LocalisationSectionProps>
) => {
  const {
    title = 'Notre Campus',
    description = 'Situé à Andrainjato, Fianarantsoa, notre campus offre un cadre d’apprentissage favorable, au sein de l’Université de Fianarantsoa.',
    addressLabel = 'Adresse',
    address = 'ESSG e-atiala Andrainjato Université Fianarantsoa, Madagascar',
    contactLabel = 'Contact',
    phone = '+261 38 18 282 49',
    email = 'contact@essg.mg',
    latitude = -21.462997,
    longitude = 47.107401,
  } = props;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              {title}
            </h2>

            <p className="mb-7 text-lg leading-7 text-ink-500">{description}</p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <RoomRoundedIcon color="primary" sx={{ mt: 0.25 }} />

                <div>
                  <div className="font-semibold text-ink-900">{addressLabel}</div>
                  <div className="text-ink-500">{address}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <PublicRoundedIcon color="primary" sx={{ mt: 0.25 }} />

                <div>
                  <div className="font-semibold text-ink-900">{contactLabel}</div>
                  <div className="text-ink-500">
                    {phone} • {email}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button
                component={RouterLink}
                to="/contact"
                variant="contained"
                sx={{
                  borderRadius: '0.9rem',
                  px: 3.5,
                  py: 1.25,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 10px 24px -10px rgba(46, 106, 95, 0.5)',
                }}
              >
                Nous contacter
              </Button>
            </div>
          </div>

          <div className="aspect-video overflow-hidden rounded-2xl bg-ink-100 shadow-card ring-1 ring-ink-100 lg:h-96 lg:aspect-auto">
            <MapContainer
              center={[latitude, longitude]}
              zoom={15}
              scrollWheelZoom={false}
              className="h-full w-full z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[latitude, longitude]}>
                <Popup>
                  <div className="text-center">
                    <strong>ESSG</strong>
                    <br />
                    Université de Fianarantsoa
                    <br />
                    Andrainjato, Madagascar
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalisationSection;
