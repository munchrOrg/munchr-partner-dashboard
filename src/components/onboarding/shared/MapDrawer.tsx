'use client';

import type { Coordinates } from '@/types/onboarding';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { OnboardingStep } from '@/types/onboarding';

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

export function MapDrawer() {
  const { isMapDrawerOpen, closeMapDrawer, formData, setFormData, triggerNavigation } =
    useOnboardingStore();

  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
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

  const location = formData.location;

  const geocodeAddress = useCallback(async () => {
    if (!isLoaded || !window.google || !location) {
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
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
    if (isMapDrawerOpen && isLoaded && location) {
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
  }, [isMapDrawerOpen, isLoaded, location, geocodeAddress, panTo]);

  const reverseGeocode = useCallback(
    async (position: Coordinates) => {
      if (!isLoaded || !window.google || !location) {
        return;
      }

      const geocoder = new window.google.maps.Geocoder();

      try {
        const result = await geocoder.geocode({ location: position });
        if (result.results[0]) {
          const addressComponents = result.results[0].address_components;

          // Parse address components
          let street = '';
          let houseNumber = '';
          let area = '';
          let city = '';
          let state = '';
          let postalCode = '';

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

          setFormData('location', {
            buildingName: '',
            street,
            houseNumber,
            area,
            city,
            state,
            postalCode,
            comment: location.comment,
            coordinates: position,
          });
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error);
      }
    },
    [isLoaded, location, setFormData]
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
    if (!location) {
      return;
    }

    // Update location with coordinates
    setFormData('location', {
      ...location,
      coordinates: markerPosition,
    });

    // Close drawer
    closeMapDrawer();

    // Trigger navigation (Footer will handle it)
    triggerNavigation(OnboardingStep.BUSINESS_LOCATION);
  };

  if (!location) {
    return null;
  }

  return (
    <Sheet open={isMapDrawerOpen} onOpenChange={closeMapDrawer}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-y-auto rounded-l-2xl px-6 pt-6 pb-10 sm:max-w-xl"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-3xl font-bold">Is This the right location?</SheetTitle>

          <p className="pt-2 text-lg">
            This helps customers find you easily. If it&apos;s not correct, drag the marker to your
            exact location.
          </p>
        </SheetHeader>

        <div className="mt-6 flex flex-1 flex-col">
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border">
              {/* Map */}
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={defaultCenter}
                  zoom={15}
                  onLoad={onMapLoad}
                >
                  <Marker position={markerPosition} draggable onDragEnd={onMarkerDragEnd} />
                </GoogleMap>
              ) : (
                <div className="flex h-[400px] items-center justify-center bg-gray-100">
                  Loading map...
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={handleConfirm}
            className="bg-gradient-yellow mt-auto w-full rounded-full py-6 text-base font-semibold text-black hover:opacity-90"
          >
            Continue
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
