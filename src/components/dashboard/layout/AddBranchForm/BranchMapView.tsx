'use client';

import type { Coordinates, LocationFormData } from '@/types/onboarding';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

const libraries: 'places'[] = ['places'];

const containerStyle = {
  width: '100%',
  height: '350px',
  borderRadius: '20px',
};

const defaultCenter = {
  lat: 24.8607,
  lng: 67.0011,
};

type BranchMapViewProps = {
  location: LocationFormData;
  onConfirm: (location: LocationFormData) => void;
  onCancel: () => void;
};

export function BranchMapView({ location, onConfirm, onCancel }: Readonly<BranchMapViewProps>) {
  const [markerPosition, setMarkerPosition] = useState<Coordinates>(
    location.coordinates || defaultCenter
  );
  const [updatedLocation, setUpdatedLocation] = useState<LocationFormData>(location);
  const mapRef = useRef<google.maps.Map | null>(null);
  const pendingPanRef = useRef<Coordinates | null>(null);

  const panTo = useCallback((position: Coordinates) => {
    if (mapRef.current) {
      mapRef.current.panTo(position);
      pendingPanRef.current = null;
    } else {
      pendingPanRef.current = position;
    }
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    if (pendingPanRef.current) {
      map.panTo(pendingPanRef.current);
      pendingPanRef.current = null;
    }
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const geocodeAddress = useCallback(async () => {
    if (!isLoaded || !globalThis.google || !location) {
      return;
    }

    const geocoder = new globalThis.google.maps.Geocoder();
    const addressParts = [
      location.houseNumber,
      location.street,
      location.area,
      location.city,
      location.state,
      location.postalCode,
    ].filter(Boolean);

    const address = addressParts.join(', ');

    try {
      const result = await geocoder.geocode({ address });
      if (result.results[0]) {
        const { lat, lng } = result.results[0].geometry.location;
        const newPosition = { lat: lat(), lng: lng() };
        setMarkerPosition(newPosition);
        panTo(newPosition);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  }, [isLoaded, location, panTo]);

  useEffect(() => {
    if (isLoaded && location) {
      const timeoutId = setTimeout(() => {
        if (location.coordinates) {
          setMarkerPosition(location.coordinates);
          panTo(location.coordinates);
        } else {
          geocodeAddress();
        }
      }, 0);
      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [isLoaded, location, geocodeAddress, panTo]);

  const reverseGeocode = useCallback(
    async (position: Coordinates) => {
      if (!isLoaded || !globalThis.google || !location) {
        return;
      }

      const geocoder = new globalThis.google.maps.Geocoder();

      try {
        const result = await geocoder.geocode({ location: position });
        if (result.results[0]) {
          const addressComponents = result.results[0].address_components;

          let street = location.street;
          let houseNumber = location.houseNumber;
          let area = location.area;
          let city = location.city;
          let state = location.state;
          let postalCode = location.postalCode;

          addressComponents.forEach((component) => {
            const types = component.types;

            if (types.includes('street_number')) {
              houseNumber = component.long_name;
            } else if (types.includes('route')) {
              street = component.long_name;
            } else if (types.includes('sublocality') || types.includes('neighborhood')) {
              area = component.long_name;
            } else if (types.includes('locality')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.long_name;
            } else if (types.includes('postal_code')) {
              postalCode = component.long_name;
            }
          });

          // Update location with new address data
          const newLocation: LocationFormData = {
            ...updatedLocation,
            street: street || updatedLocation.street,
            houseNumber: houseNumber || updatedLocation.houseNumber,
            area: area || updatedLocation.area,
            city: city || updatedLocation.city,
            state: state || updatedLocation.state,
            postalCode: postalCode || updatedLocation.postalCode,
            coordinates: position,
          };

          setUpdatedLocation(newLocation);
          setMarkerPosition(position);
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error);
      }
    },
    [isLoaded, location, updatedLocation]
  );

  const onMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setMarkerPosition(newPosition);
      reverseGeocode(newPosition);
    }
  };

  const handleConfirm = () => {
    const finalLocation: LocationFormData = {
      ...updatedLocation,
      coordinates: markerPosition,
    };
    onConfirm(finalLocation);
  };

  return (
    <div className="flex flex-col space-y-6">
      <p className="text-base text-gray-600">
        This helps customers find you easily. If it&apos;s not correct, search for your exact
        address or a nearby landmark.
      </p>

      <div className="relative">
        <div className="relative overflow-hidden rounded-2xl border">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={markerPosition}
              zoom={15}
              onLoad={onMapLoad}
            >
              <Marker position={markerPosition} draggable onDragEnd={onMarkerDragEnd} />
            </GoogleMap>
          ) : (
            <div className="flex h-[350px] items-center justify-center bg-gray-100">
              Loading map...
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex items-center gap-2 rounded-full border-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          onClick={handleConfirm}
          className="bg-gradient-yellow flex-1 rounded-full text-black hover:bg-amber-500"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
