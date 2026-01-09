'use client';

import type { Coordinates, LocationFormData } from '@/types/onboarding';
import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { z } from 'zod';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Input } from '@/components/ui/input';
import { useOnboardingStore } from '@/stores/onboarding-store';

const locationSchema = z.object({
  buildingName: z.string().optional(),
  street: z.string().min(1, 'Street is required'),
  houseNumber: z.string().min(1, 'House number is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().optional(),
  area: z.string().optional(),
  postalCode: z.string().min(1, 'Postal code is required'),
  comment: z.string().optional(),
});

type LocationInput = z.infer<typeof locationSchema>;

const containerStyle = {
  width: '100%',
  height: '250px',
};

const defaultCenter = {
  lat: 24.8607,
  lng: 67.0011,
};

export function BusinessLocation() {
  const { formData, setFormData, openMapDrawer } = useOnboardingStore();
  const [mapCenter, setMapCenter] = useState<Coordinates>(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState<Coordinates>(defaultCenter);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LocationInput>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      buildingName: formData.location?.buildingName || '',
      street: formData.location?.street || '',
      houseNumber: formData.location?.houseNumber || '',
      state: formData.location?.state || '',
      city: formData.location?.city || '',
      area: formData.location?.area || '',
      postalCode: formData.location?.postalCode || '',
      comment: formData.location?.comment || '',
    },
  });

  const houseNumber = watch('houseNumber');
  const street = watch('street');
  const area = watch('area');
  const city = watch('city');
  const state = watch('state');
  const postalCode = watch('postalCode');

  // Geocode address when fields change
  const geocodeAddress = useCallback(async () => {
    if (!isLoaded || !window.google) {
      return;
    }

    const addressParts = [houseNumber, street, area, city, state, postalCode].filter(Boolean);

    if (addressParts.length < 2) {
      return;
    }

    const address = addressParts.join(', ');
    const geocoder = new window.google.maps.Geocoder();

    try {
      const result = await geocoder.geocode({ address });
      if (result.results[0]) {
        const { lat, lng } = result.results[0].geometry.location;
        const newPosition = { lat: lat(), lng: lng() };
        setMapCenter(newPosition);
        setMarkerPosition(newPosition);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  }, [isLoaded, houseNumber, street, area, city, state, postalCode]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      geocodeAddress();
    }, 1000); // Debounce geocoding

    return () => clearTimeout(timeoutId);
  }, [geocodeAddress]);

  const onSubmit = (data: LocationInput) => {
    const locationData: LocationFormData = {
      buildingName: data.buildingName || '',
      street: data.street,
      houseNumber: data.houseNumber,
      state: data.state,
      city: data.city || '',
      area: data.area || '',
      postalCode: data.postalCode,
      comment: data.comment || '',
      coordinates: markerPosition,
    };

    setFormData('location', locationData);
    openMapDrawer();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form Section */}
        <div>
          <StepHeader
            title="Where is your business located?"
            description="Customers and riders will use this information to find your store."
          />

          <form id="location-form" onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <Input
                placeholder="Building or Place Name"
                {...register('buildingName')}
                className="h-12 rounded-full border-gray-300 px-4"
              />
            </div>

            <div>
              <Input
                placeholder="Street *"
                {...register('street')}
                className="h-12 rounded-full border-gray-300 px-4"
              />
              {errors.street && (
                <p className="mt-1 text-sm text-red-500">{errors.street.message}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="House Number *"
                {...register('houseNumber')}
                className="h-12 rounded-full border-gray-300 px-4"
              />
              {errors.houseNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.houseNumber.message}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="State *"
                {...register('state')}
                className="h-12 rounded-full border-gray-300 px-4"
              />
              {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>}
            </div>

            <div>
              <Input
                placeholder="City"
                {...register('city')}
                className="h-12 rounded-full border-gray-300 px-4"
              />
            </div>

            <div>
              <Input
                placeholder="Area"
                {...register('area')}
                className="h-12 rounded-full border-gray-300 px-4"
              />
            </div>

            <div>
              <Input
                placeholder="Postal Code *"
                {...register('postalCode')}
                className="h-12 rounded-full border-gray-300 px-4"
              />
              {errors.postalCode && (
                <p className="mt-1 text-sm text-red-500">{errors.postalCode.message}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="Add comment about location"
                {...register('comment')}
                className="h-12 rounded-full border-gray-300 px-4"
              />
            </div>
          </form>
        </div>

        {/* Map Section */}
        <div className="lg:pt-16">
          <div className="overflow-hidden rounded-lg border">
            {isLoaded ? (
              <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={15}>
                <Marker position={markerPosition} />
              </GoogleMap>
            ) : (
              <div className="flex h-[250px] items-center justify-center bg-gray-100">
                Loading map...
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">The marker updates as you enter your address</p>
        </div>
      </div>
    </div>
  );
}
