'use client';

import type { Coordinates, LocationFormData } from '@/types/onboarding';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { z } from 'zod';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Input } from '@/components/ui/input';
import { useOnboardingStore } from '@/stores/onboarding-store';

const libraries: 'places'[] = ['places'];

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

type FieldConfig = {
  name: keyof LocationInput;
  placeholder: string;
  required?: boolean;
};

const fieldConfigs: FieldConfig[] = [
  { name: 'buildingName', placeholder: 'Building or Place Name' },
  { name: 'street', placeholder: 'Street ', required: true },
  { name: 'houseNumber', placeholder: 'House Number ', required: true },
  { name: 'state', placeholder: 'State ', required: true },
  { name: 'city', placeholder: 'City' },
  { name: 'area', placeholder: 'Area' },
  { name: 'postalCode', placeholder: 'Postal Code ', required: true },
  { name: 'comment', placeholder: 'Add comment about location' },
];

export function BusinessLocation() {
  const { formData, setFormData, openMapDrawer } = useOnboardingStore();
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<Coordinates | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
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
    mode: 'all',
  });

  const prevLocationRef = useRef(formData.location);
  useEffect(() => {
    const location = formData.location;
    if (location && location !== prevLocationRef.current) {
      const timeoutId = setTimeout(() => {
        reset({
          buildingName: location.buildingName || '',
          street: location.street || '',
          houseNumber: location.houseNumber || '',
          state: location.state || '',
          city: location.city || '',
          area: location.area || '',
          postalCode: location.postalCode || '',
          comment: location.comment || '',
        });
        if (location.coordinates) {
          setSelectedCoordinates(location.coordinates);
        }
        prevLocationRef.current = location;
      }, 0);
      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [formData.location, reset]);

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }, []);

  const onPlaceChanged = () => {
    if (!autocomplete) {
      return;
    }

    const place = autocomplete.getPlace();
    if (!place.geometry?.location || !place.address_components) {
      return;
    }

    const coordinates: Coordinates = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    setSelectedCoordinates(coordinates);

    let street = '';
    let houseNumber = '';
    let area = '';
    let city = '';
    let state = '';
    let postalCode = '';
    const buildingName = place.name || '';

    place.address_components.forEach((component) => {
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

    setValue('buildingName', buildingName, { shouldValidate: true });
    setValue('street', street, { shouldValidate: true });
    setValue('houseNumber', houseNumber, { shouldValidate: true });
    setValue('area', area, { shouldValidate: true });
    setValue('city', city, { shouldValidate: true });
    setValue('state', state, { shouldValidate: true });
    setValue('postalCode', postalCode, { shouldValidate: true });
  };

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
      coordinates: selectedCoordinates,
    };

    setFormData('location', locationData);
    openMapDrawer();
  };

  return (
    <div className="flex h-full w-full items-center justify-center px-4 sm:px-8">
      <div className="w-full max-w-xl">
        <StepHeader
          title="Where is your business located?"
          description="Customers and riders will use this information to find your store."
        />

        <form id="location-form" onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* Google Places Autocomplete Search */}
          {isLoaded && (
            <Autocomplete
              onLoad={setAutocomplete}
              onPlaceChanged={onPlaceChanged}
              options={{ types: ['establishment', 'geocode'] }}
            >
              <div className="relative">
                <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-gray-400" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for your address or place"
                  className="h-12 rounded-full border-gray-300 px-6 py-7 pl-12"
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
            </Autocomplete>
          )}

          {fieldConfigs.map((field) => (
            <div key={field.name} className="relative">
              <Input
                placeholder={`${field.placeholder} ${field.required ? '*' : ''}`}
                {...register(field.name)}
                className="h-12 rounded-full border-gray-300 px-6 py-7 group-data-[filled=true]:placeholder-transparent"
              />
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-500">{errors[field.name]?.message}</p>
              )}
            </div>
          ))}
        </form>
      </div>
    </div>
  );
}
