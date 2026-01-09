'use client';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getNextStep } from '@/config/onboarding-steps';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { OnboardingStep } from '@/types/onboarding';

const containerStyle = {
  width: '100%',
  height: '300px',
};

const defaultCenter = {
  lat: 24.8607,
  lng: 67.0011,
};

export function MapDrawer() {
  const router = useRouter();
  const { isMapDrawerOpen, closeMapDrawer, formData, setFormData, completeStep } =
    useOnboardingStore();

  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
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
        const newCenter = { lat: lat(), lng: lng() };
        setCenter(newCenter);
        setMarkerPosition(newCenter);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  }, [isLoaded, location]);

  useEffect(() => {
    if (isMapDrawerOpen && isLoaded && location) {
      // Defer geocoding to avoid synchronous setState in effect
      const timeoutId = setTimeout(() => {
        geocodeAddress();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [isMapDrawerOpen, isLoaded, location, geocodeAddress]);

  const handleConfirm = () => {
    if (!location) {
      return;
    }

    // Update location with coordinates
    setFormData('location', {
      ...location,
      coordinates: markerPosition,
    });

    // Complete the step and navigate
    completeStep(OnboardingStep.BUSINESS_LOCATION);
    closeMapDrawer();

    const nextStep = getNextStep(OnboardingStep.BUSINESS_LOCATION);
    if (nextStep) {
      router.push(`/onboarding/${nextStep}`);
    }
  };

  if (!location) {
    return null;
  }

  return (
    <Sheet open={isMapDrawerOpen} onOpenChange={closeMapDrawer}>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>Confirm Your Location</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-600">
            Please confirm that the marker is placed at your business location.
          </p>

          <div className="overflow-hidden rounded-lg border">
            {isLoaded ? (
              <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
                <Marker position={markerPosition} />
              </GoogleMap>
            ) : (
              <div className="flex h-[300px] items-center justify-center bg-gray-100">
                Loading map...
              </div>
            )}
          </div>

          <div className="rounded-lg bg-gray-50 p-3 text-sm">
            <p className="font-medium">Address:</p>
            <p className="text-gray-600">
              {location.houseNumber} {location.street}
              {location.area && `, ${location.area}`}
              {location.city && `, ${location.city}`}
              <br />
              {location.state},{location.postalCode}
            </p>
          </div>

          <Button
            onClick={handleConfirm}
            className="bg-gradient-yellow w-full rounded-full text-black"
          >
            Confirm Location
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
