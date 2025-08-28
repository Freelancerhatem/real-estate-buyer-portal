import React from "react";

export interface TLocation {
  country: string;
  city: string;
  address: string;
  longitude: number;
  latitude: number;
}

export interface MapProps {
  locationInMap: TLocation;
}

const Map = ({ locationInMap }: MapProps) => {
  const { latitude, longitude, address } = locationInMap;

  return (
    <div className="w-full h-96">
      {/* Embedded Google Map */}
      {latitude && longitude ? (
        <iframe
          title="Google Map"
          src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      ) : (
        <p className="text-center text-gray-700">Map cannot be loaded</p>
      )}

      {/* Address Display */}
      <p className="mt-2 text-center text-sm text-gray-700">
        {address || `Latitude: ${latitude}, Longitude: ${longitude}`}
      </p>
    </div>
  );
};

export default Map;
