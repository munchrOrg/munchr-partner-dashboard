'use client';

import type { Coordinates } from '@/types/onboarding';
import { Autocomplete, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Search } from 'lucide-react';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
            This helps customers find you easily. If it&apos;s not correct, search for your exact
            address or a nearby landmark.
          </p>
        </SheetHeader>

        <div className="mt-6 flex flex-1 flex-col">
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border">
              {isLoaded && (
                <div className="pointer-events-none absolute top-4 left-1/2 z-50 w-full -translate-x-1/2 px-4">
                  <div className="pointer-events-auto mx-auto w-full max-w-full">
                    <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
                      <div className="relative rounded-full bg-white shadow-md">
                        <Search className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-400" />
                        <Input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search address or landmark"
                          className="h-11 rounded-full bg-transparent pr-4 pl-10 placeholder:text-gray-400"
                        />
                      </div>
                    </Autocomplete>
                  </div>
                </div>
              )}
              {/* Map */}
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
