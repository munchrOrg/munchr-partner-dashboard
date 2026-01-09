'use client';

import type { Coordinates } from '@/types/onboarding';
import { Autocomplete, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getNextStep } from '@/config/onboarding-steps';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { OnboardingStep } from '@/types/onboarding';

const libraries: 'places'[] = ['places'];

const containerStyle = {
  width: '100%',
  height: '400px',
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
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setCenter(newLocation);
        setMarkerPosition(newLocation);
      }
    }
  };

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

          // Update form data with new address
          setFormData('location', {
            ...location,
            street: street || location.street,
            houseNumber: houseNumber || location.houseNumber,
            area: area || location.area,
            city: city || location.city,
            state: state || location.state,
            postalCode: postalCode || location.postalCode,
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
      <SheetContent side="right" className="w-full max-w-lg overflow-y-auto sm:max-w-xl">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold">Is This the right location?</SheetTitle>
            <button
              onClick={closeMapDrawer}
              className="ring-offset-background rounded-sm opacity-70 transition-opacity hover:opacity-100"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <p className="pt-2 text-sm text-gray-600">
            This helps customers find you easily. If it&apos;s not correct, search for your exact
            address or a nearby landmark.
          </p>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Search Input */}
          <div className="relative">
            {isLoaded && (
              <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search address or landmark"
                    className="h-11 rounded-lg pr-4 pl-10"
                  />
                </div>
              </Autocomplete>
            )}
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-lg border">
            {isLoaded ? (
              <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
                <Marker position={markerPosition} draggable onDragEnd={onMarkerDragEnd} />
              </GoogleMap>
            ) : (
              <div className="flex h-[400px] items-center justify-center bg-gray-100">
                Loading map...
              </div>
            )}
          </div>

          {/* Instruction Text */}
          <p className="rounded-md bg-gray-50 p-3 text-center text-sm text-gray-600">
            Drag the marker to indicate the precise location of your venue if necessary.
          </p>

          {/* Current Address Display */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h4 className="mb-2 text-sm font-semibold text-gray-900">Current Address:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              {location.buildingName && <p>{location.buildingName}</p>}
              <p>
                {location.houseNumber} {location.street}
              </p>
              {location.area && <p>{location.area}</p>}
              <p>
                {location.city}
                {location.city && location.state && ', '}
                {location.state} {location.postalCode}
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleConfirm}
            className="bg-gradient-yellow w-full rounded-full py-6 text-base font-semibold text-black hover:opacity-90"
          >
            Continue
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
