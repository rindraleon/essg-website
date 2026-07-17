import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import RoomRoundedIcon from "@mui/icons-material/RoomRounded";
import { GREEN } from "../../constants/colors";
import type { ProjetLocation } from "../../types/projets.types";

// Fix pour les icônes Leaflet par défaut
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Corriger l'icône de marqueur par défaut
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface ProjetMapProps {
    location?: ProjetLocation;
    latitude?: number;
    longitude?: number;
    label?: string;
    height?: string;
}

const ProjetMap: React.FC<ProjetMapProps> = ({
    location,
    latitude,
    longitude,
    label,
    height = "400px",
}) => {
    // Support both formats: location object or separate lat/lng
    const lat = location?.lat ?? latitude;
    const lng = location?.lng ?? longitude;
    const ville = location?.ville;
    const pays = location?.pays;
    const adresse = location?.adresse;

    // Default to Paris if no coordinates provided
    const mapCenter: [number, number] = lat && lng ? [lat, lng] : [48.8566, 2.3522];

    if (!lat || !lng) {
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-inner">
                <div style={{ height, width: "100%" }} className="flex items-center justify-center bg-gray-100">
                    <p className="text-sm text-gray-500">Localisation non disponible</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-inner">
            <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height, width: "100%" }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]}>
                    <Popup>
                        <div className="text-sm">
                            <p className="font-semibold text-gray-900">
                                {label || `${ville}, ${pays}`}
                            </p>
                            {adresse && (
                                <p className="mt-1 text-xs text-gray-600">
                                    {adresse}
                                </p>
                            )}
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>

            {/* Info bar */}
            <div className="flex items-center gap-2 border-t border-gray-200 bg-gray-50 px-3 py-2">
                <RoomRoundedIcon sx={{ fontSize: 16, color: GREEN[600] }} />
                <span className="truncate text-xs font-medium text-gray-700">
                    {label || `${ville}, ${pays}`}
                </span>
                {adresse && (
                    <>
                        <span className="text-gray-400">•</span>
                        <span className="truncate text-xs text-gray-500">
                            {adresse}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProjetMap;