import { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { listing } from "@/types/listing";

const usePropertyById = (id: string | undefined) => {
    const [property, setProperty] = useState<listing | null>(null);
    const [similarProperties, setSimilarProperties] = useState<listing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperty = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch property details
                const propertyResponse = await axiosInstance.get(`/properties/${id}`);
                const propertyData = propertyResponse.data.data;

                setProperty(propertyData);

                // Fetch similar properties after property is successfully fetched
                const similarResponse = await axiosInstance.get(`/properties/similar-prop/${id}`);
                setSimilarProperties(similarResponse.data.data);

            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProperty();
        }
    }, [id]);

    return { property, similarProperties, loading, error };
};

export default usePropertyById;
