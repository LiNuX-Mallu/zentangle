import { useEffect, useState } from "react";

interface GeoLocation {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
}

const useGeoLocation = (): GeoLocation => {
    const [location, setLocation] = useState<GeoLocation>({
        latitude: null,
        longitude: null,
        error: null,
    });
    useEffect(() => {
        const getUserLocation = () => {
            navigator.geolocation.getCurrentPosition(position => {
                const {latitude, longitude} = position.coords;
                setLocation({latitude, longitude, error: null});
            }, (error) => {
                setLocation({latitude: null, longitude: null, error: error.message});
            });
        };
        if ('geolocation' in navigator) {
            getUserLocation();
        } else {
            setLocation({latitude: null, longitude: null, error: "Geolocation is not supported by your browser"});
        }
    }, [location]);
    return location;
}

export default useGeoLocation;

