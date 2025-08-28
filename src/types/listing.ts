import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

export interface listing {
    _id: string;
    location: {
        country: string;
        city: string;
        address: string;
        postalCode: string;
        longitude: number;
        latitude: number;
    };
    nearbyLocations: {
        locationInMap: string;
        schools: NearbyLocation[];
        shops: NearbyLocation[];
        commute: NearbyLocation[];
    };
    owner: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    title: string;
    propertyType: string;
    purpose: "sale" | "rent";
    price: number;
    totalArea: number;
    totalUnits: number;
    totalBedrooms: number;
    totalBathrooms: number;
    totalGarages: number;
    totalKitchens: number;
    description: string;
    youtubeVideoId: string;
    videoDescription: string;
    thumbnail: string;
    sliderImages: string[];
    galleryImages: string[];
    amenities: string[];
    status: "approved" | "rejected" | "pending" | "rented" | "sold" | "deleted"

    featured: boolean;
    isFavorite: boolean;
    floorPlans: string[];
    virtualTourLink: string;
    financingAvailable: boolean;
    mortgageEstimates: MortgageEstimate[];
    reviews: Review[];
    createdAt: string; // ISO string date
    updatedAt: string; // ISO string date
    __v: number;
}

export interface NearbyLocation {
    _id: string;
    name: string;
    description: string;
    mapLink: string;
    distance: number;
}

export interface MortgageEstimate {
    downPayment: number;
    interestRate: number;
    termYears: number;
    monthlyPayment: number;
}

export interface Review {
    userId: string;
    rating: number;
    comment: string;
    date: string;
}


export interface FormValues {
    ownerType: string;
    userId: string;
    title: string;
    propertyType: string;
    purpose: string;
    price: number;
    totalArea: number;
    totalUnit: number;
    totalBedroom: number;
    totalBathroom: number;
    totalGarage: number;
    totalKitchen: number;
    description: string;
    country: string;
    city: string;
    position: [number, number] | null;
    addressDetails: string;
    longitude: number;
    latitude: number;
    youtubeVideoId: string;
    videoDescription: string;
    thumbnail: File | null;
    sliderImages: File[];
    galleryImages: File[];
    amenities: string[];
    nearbyLocations: { name: string; description: string; mapLink: string; distance: number; }[]
}

export interface StepProps {
    register: UseFormRegister<FormValues>;
    errors: FieldErrors<FormValues>;
    formData?: FormValues;
    setFormData?: (data: Partial<FormValues>) => void;
    setValue: UseFormSetValue<FormValues>;
    watch: UseFormWatch<FormValues>;
}

export type FiltersType = {
    priceMin: number;
    priceMax: number;
    bedrooms: number | null;
    bathrooms: number | null;
    propertyType: string;
    amenities: string[];
    searchTerm: string;
};
