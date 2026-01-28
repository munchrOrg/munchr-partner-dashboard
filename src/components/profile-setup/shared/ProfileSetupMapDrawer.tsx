'use client';

import type { Coordinates, LocationFormData } from '@/types/onboarding';
import { Autocomplete, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useProfileSetupStore } from '@/stores/profile-setup-store';

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

export function ProfileSetupMapDrawer() {
  const { isMapDrawerOpen, closeMapDrawer, mapLocation, mapLocationCallback, updateMapLocation } =
    useProfileSetupStore();

  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [searchAddress, setSearchAddress] = useState('');
  const [showInstruction, setShowInstruction] = useState(true);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const pendingPanRef = useRef<Coordinates | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const location = mapLocation;

  // Build display address from location parts
  const getDisplayAddress = useCallback((loc: LocationFormData | null): string => {
    if (!loc) {
      return '';
    }
    const parts = [
      loc.houseNumber,
      loc.street,
      loc.area,
      loc.city,
      loc.state,
      loc.postalCode,
    ].filter(Boolean);
    return parts.join(', ');
  }, []);

  const geocodeAddress = useCallback(async () => {
    if (!isLoaded || !window.google || !location) {
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    const address = getDisplayAddress(location);

    if (!address) {
      return;
    }

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
  }, [isLoaded, location, panTo, getDisplayAddress]);

  useEffect(() => {
    if (isMapDrawerOpen && isLoaded && location) {
      const timeoutId = setTimeout(() => {
        // Set search address from current location
        setSearchAddress(getDisplayAddress(location));
        setShowInstruction(true);

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
  }, [isMapDrawerOpen, isLoaded, location, geocodeAddress, panTo, getDisplayAddress]);

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

          const updatedLocation: LocationFormData = {
            buildingPlaceName: location.buildingPlaceName || '',
            street,
            houseNumber,
            area,
            city,
            state,
            postalCode,
            addCommentAboutLocation: location.addCommentAboutLocation,
            coordinates: position,
          };

          updateMapLocation(updatedLocation);

          // Update search address display
          if (result.results[0].formatted_address) {
            setSearchAddress(result.results[0].formatted_address);
          }
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error);
      }
    },
    [isLoaded, location, updateMapLocation]
  );

  const onPlaceChanged = useCallback(() => {
    if (!autocomplete || !location) {
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

    // Parse address components from selected place
    const addressComponents = place.address_components || [];
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

    const updatedLocation: LocationFormData = {
      buildingPlaceName: place.name || location.buildingPlaceName || '',
      street,
      houseNumber,
      area,
      city,
      state,
      postalCode,
      addCommentAboutLocation: location.addCommentAboutLocation,
      coordinates,
    };

    updateMapLocation(updatedLocation);

    if (place.formatted_address) {
      setSearchAddress(place.formatted_address);
    } else if (place.name) {
      setSearchAddress(place.name);
    }
  }, [autocomplete, location, panTo, updateMapLocation]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Autocomplete handles this automatically
  };

  const handleConfirm = () => {
    if (!location) {
      return;
    }

    const updatedLocation: LocationFormData = {
      ...location,
      coordinates: markerPosition,
    };

    if (mapLocationCallback) {
      mapLocationCallback(updatedLocation);
    }

    closeMapDrawer();
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
            This helps customers find you easily. Search for your address or drag the marker to your
            exact location.
          </p>
        </SheetHeader>

        <div className="mt-6 flex flex-1 flex-col">
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
                <div className="flex h-[350px] items-center justify-center bg-gray-100">
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
