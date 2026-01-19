'use client';

import type { Coordinates } from '@/types/onboarding';
import { Autocomplete, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Search, X } from 'lucide-react';
import { startTransition, useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useProfileSetupStore } from '@/stores/profile-setup-store';

const libraries: 'places'[] = ['places'];

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '20px',
};

const defaultCenter = {
  lat: 24.8607,
  lng: 67.0011,
};

export function ProfileSetupMapDrawer() {
  const { isMapDrawerOpen, closeMapDrawer, formData, setStepData } = useProfileSetupStore();

  const currentLocation = formData.step1?.location || '';
  const currentCoordinates = formData.step1?.coordinates;

  // Initialize state with current values
  const [markerPosition, setMarkerPosition] = useState<Coordinates>(
    currentCoordinates || defaultCenter
  );
  const [searchAddress, setSearchAddress] = useState(currentLocation);
  const [showInstruction, setShowInstruction] = useState(true);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const pendingPanRef = useRef<Coordinates | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

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
    id: 'google-map-script-profile-setup',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const geocodeAddress = useCallback(
    async (address: string) => {
      if (!isLoaded || !globalThis.google || !address) {
        return;
      }

      const geocoder = new globalThis.google.maps.Geocoder();

      try {
        const result = await geocoder.geocode({ address });
        const firstResult = result?.results?.[0];
        if (firstResult?.geometry?.location) {
          const { lat, lng } = firstResult.geometry.location;
          const newPosition = { lat: lat(), lng: lng() };
          setMarkerPosition(newPosition);
          panTo(newPosition);
          // Update search address with formatted address
          if (firstResult.formatted_address) {
            setSearchAddress(firstResult.formatted_address);
          }
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    },
    [isLoaded, panTo]
  );

  // Initialize with current location when drawer opens
  useEffect(() => {
    if (isMapDrawerOpen && isLoaded && !initializedRef.current) {
      initializedRef.current = true;

      startTransition(() => {
        if (currentCoordinates) {
          setMarkerPosition(currentCoordinates);
          if (currentLocation) {
            setSearchAddress(currentLocation);
          }
          panTo(currentCoordinates);
        } else if (currentLocation) {
          setSearchAddress(currentLocation);
          geocodeAddress(currentLocation);
        } else {
          setMarkerPosition(defaultCenter);
          panTo(defaultCenter);
        }
      });
    }

    // Reset initialization flag when drawer closes
    if (!isMapDrawerOpen) {
      initializedRef.current = false;
    }
  }, [isMapDrawerOpen, isLoaded, currentLocation, currentCoordinates, panTo, geocodeAddress]);

  const reverseGeocode = useCallback(
    async (position: Coordinates) => {
      if (!isLoaded || !globalThis.google) {
        return;
      }

      const geocoder = new globalThis.google.maps.Geocoder();

      try {
        const result = await geocoder.geocode({ location: position });
        const firstResult = result?.results?.[0];
        if (firstResult?.formatted_address) {
          setSearchAddress(firstResult.formatted_address);
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error);
      }
    },
    [isLoaded]
  );

  const onPlaceChanged = useCallback(() => {
    if (!autocomplete) {
      return;
    }

    const place = autocomplete.getPlace();
    if (!place.geometry?.location) {
      return;
    }

    const coordinates: Coordinates = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    setMarkerPosition(coordinates);
    panTo(coordinates);

    if (place.formatted_address) {
      setSearchAddress(place.formatted_address);
    } else if (place.name) {
      setSearchAddress(place.name);
    }
  }, [autocomplete, panTo]);

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

  const handleSubmit = () => {
    if (!formData.step1) {
      return;
    }

    // Update Step1 form data with new location and coordinates
    setStepData('step1', {
      ...formData.step1,
      location: searchAddress || formData.step1.location,
      coordinates: markerPosition,
    });

    // Close drawer
    closeMapDrawer();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchAddress.trim()) {
      geocodeAddress(searchAddress);
    }
  };

  if (!isMapDrawerOpen) {
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
            {/* Search Bar */}
            {isLoaded && (
              <div className="mb-4">
                <Autocomplete
                  onLoad={setAutocomplete}
                  onPlaceChanged={onPlaceChanged}
                  options={{ types: ['establishment', 'geocode'] }}
                >
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search address or landmark"
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
                      className="h-12 rounded-full border-gray-300 px-6 py-7 pl-12"
                    />
                  </form>
                </Autocomplete>
              </div>
            )}

            <div className="relative overflow-hidden rounded-2xl border">
              {/* Map */}
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
                <div className="flex h-[400px] items-center justify-center bg-gray-100">
                  Loading map...
                </div>
              )}

              {/* Instruction Bubble */}
              {showInstruction && isLoaded && (
                <div className="absolute top-4 right-4 left-4 z-10 rounded-lg bg-gray-100 p-3 shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-700">
                      Drag the marker to indicate the precise location of your venue if necessary.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowInstruction(false)}
                      className="shrink-0 text-gray-500 hover:text-gray-700"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="bg-gradient-yellow mt-auto w-full rounded-full py-6 text-base font-semibold text-black hover:opacity-90"
          >
            Submit
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
