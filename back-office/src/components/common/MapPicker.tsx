import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { IconButton, TextField, Box, Typography, Paper } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import EditIcon from '@mui/icons-material/Edit';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour le marker par défaut de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
  label?: string;
}

const MapClickHandler: React.FC<{
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapPicker: React.FC<MapPickerProps> = ({
  latitude,
  longitude,
  onLocationChange,
  label = 'Sélectionner un emplacement sur la carte',
}) => {
  // Convertir les coordonnées en nombres (au cas où elles seraient des chaînes)
  const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
  const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;

  const [position, setPosition] = useState<[number, number]>(
    lat && lng ? [lat, lng] : [48.8566, 2.3522] // Paris par défaut
  );
  const [manualLat, setManualLat] = useState<string>('');
  const [manualLng, setManualLng] = useState<string>('');
  const [isManualEdit, setIsManualEdit] = useState(false);

  useEffect(() => {
    if (lat && lng) {
      setPosition([lat, lng]);
      setManualLat(lat.toString());
      setManualLng(lng.toString());
    }
  }, [lat, lng]);

  const handleManualLatChange = (value: string) => {
    setManualLat(value);
    const lat = parseFloat(value);
    if (!isNaN(lat) && lat >= -90 && lat <= 90) {
      const lng = position[1];
      setPosition([lat, lng]);
      onLocationChange(lat, lng);
      setIsManualEdit(true);
    }
  };

  const handleManualLngChange = (value: string) => {
    setManualLng(value);
    const lng = parseFloat(value);
    if (!isNaN(lng) && lng >= -180 && lng <= 180) {
      const lat = position[0];
      setPosition([lat, lng]);
      onLocationChange(lat, lng);
      setIsManualEdit(true);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    setManualLat(lat.toFixed(7));
    setManualLng(lng.toFixed(7));
    setIsManualEdit(false);
    onLocationChange(lat, lng);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          onLocationChange(latitude, longitude);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
        }
      );
    }
  };

  return (
    <Box className="w-full">
      {label && (
        <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
          {label}
        </Typography>
      )}
      
      {/* Map */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
        }}
      >
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '300px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          <Marker position={position}>
            <Popup>
              <Box>
                <Typography variant="body2" className="font-semibold">
                  Emplacement sélectionné
                </Typography>
                <Typography variant="caption" className="text-gray-600">
                  {position[0].toFixed(5)}, {position[1].toFixed(5)}
                </Typography>
              </Box>
            </Popup>
          </Marker>
        </MapContainer>
      </Paper>

      {/* Manual Coordinate Input */}
       <Box className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
         <Box className="flex items-center gap-2 mb-2">
           <EditIcon fontSize="small" className="text-gray-600" />
           <Typography variant="subtitle2" className="font-semibold text-gray-700">
             Saisie manuelle des coordonnées
           </Typography>
         </Box>
         <Box className="grid grid-cols-2 gap-3">
           <TextField
             label="Latitude"
             size="small"
             type="number"
             value={manualLat}
             onChange={(e) => handleManualLatChange(e.target.value)}
             onBlur={() => {
               if (!isManualEdit) {
                 setManualLat(position[0].toFixed(7));
               }
             }}
             inputProps={{
               min: -90,
               max: 90,
               step: 0.0000001,
             }}
             helperText="Entre -90 et 90"
             sx={{ fontSize: '0.875rem' }}
           />
           <TextField
             label="Longitude"
             size="small"
             type="number"
             value={manualLng}
             onChange={(e) => handleManualLngChange(e.target.value)}
             onBlur={() => {
               if (!isManualEdit) {
                 setManualLng(position[1].toFixed(7));
               }
             }}
             inputProps={{
               min: -180,
               max: 180,
               step: 0.0000001,
             }}
             helperText="Entre -180 et 180"
           />
         </Box>
       </Box>

       {/* Coordinates Display */}
       <Box className="mt-2 flex items-center gap-3 text-sm">
         <Box className="flex items-center gap-1">
           <LocationOnIcon fontSize="small" className="text-gray-500" />
           <Typography variant="body2" className="text-gray-600">
             <span className="font-semibold">Lat:</span> {position[0].toFixed(5)}
           </Typography>
         </Box>
         <Box className="flex items-center gap-1">
           <LocationOnIcon fontSize="small" className="text-gray-500" />
           <Typography variant="body2" className="text-gray-600">
             <span className="font-semibold">Lng:</span> {position[1].toFixed(5)}
           </Typography>
         </Box>
         <IconButton
           size="small"
           onClick={handleGetCurrentLocation}
           title="Utiliser ma position actuelle"
           sx={{ padding: '2px' }}
         >
           <MyLocationIcon fontSize="small" className="text-blue-600" />
         </IconButton>
       </Box>
    </Box>
  );
};

export default MapPicker;