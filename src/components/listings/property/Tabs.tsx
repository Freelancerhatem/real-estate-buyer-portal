import Map from "@/components/ui/map/Map";
import React, { useState } from "react";

type NearbyLocation = {
  name: string;
  description: string;
  mapLink: string;
  distance: number;
};

export interface TLocation {
  country: string;
  city: string;
  address: string;
  longitude: number;
  latitude: number;
}

type NearbyLocationsProps = {
  locationInMap: TLocation;
  schools: NearbyLocation[];
  shops: NearbyLocation[];
  commute: NearbyLocation[];
};

const Tabs: React.FC<NearbyLocationsProps> = ({
  locationInMap,
  schools,
  shops,
  commute,
}) => {
  const [activeTab, setActiveTab] = useState<
    "Map" | "School" | "Shop" | "Commute"
  >("Map");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Map":
        return (
          <div className="h-[400px]">
            <Map locationInMap={locationInMap} />
          </div>
        );
      case "School":
        return (
          <div className="space-y-4">
            {schools.length === 0 ? (
              <p>No schools found nearby.</p>
            ) : (
              schools.map((school, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg shadow hover:shadow-lg"
                >
                  <h3 className="font-bold text-lg">{school.name}</h3>
                  <p>{school.description}</p>
                  <p className="text-sm text-gray-600">
                    Distance: {school.distance} km
                  </p>
                  <a
                    href={school.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View on Map
                  </a>
                </div>
              ))
            )}
          </div>
        );
      case "Shop":
        return (
          <div className="space-y-4">
            {shops.length === 0 ? (
              <p>No shops found nearby.</p>
            ) : (
              shops.map((shop, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg shadow hover:shadow-lg"
                >
                  <h3 className="font-bold text-lg">{shop.name}</h3>
                  <p>{shop.description}</p>
                  <p className="text-sm text-gray-600">
                    Distance: {shop.distance} km
                  </p>
                  <a
                    href={shop.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View on Map
                  </a>
                </div>
              ))
            )}
          </div>
        );
      case "Commute":
        return (
          <div className="space-y-4">
            {commute.length === 0 ? (
              <p>No commute info available.</p>
            ) : (
              commute.map((point, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg shadow hover:shadow-lg"
                >
                  <h3 className="font-bold text-lg">{point.name}</h3>
                  <p>{point.description}</p>
                  <p className="text-sm text-gray-600">
                    Distance: {point.distance} km
                  </p>
                  <a
                    href={point.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View on Map
                  </a>
                </div>
              ))
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      {/* Scrollable Tab Bar */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex w-max space-x-4 border-b pb-2 mb-4 whitespace-nowrap">
          {(["Map", "School", "Shop", "Commute"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-md transition-all duration-200 ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Render Active Tab Content */}
      <div className="">{renderTabContent()}</div>
    </div>
  );
};

export default Tabs;
