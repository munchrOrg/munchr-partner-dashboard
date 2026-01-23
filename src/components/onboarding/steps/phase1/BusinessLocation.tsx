'use client';

import type { Coordinates, LocationFormData } from '@/types/onboarding';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { Search } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { toast } from 'sonner';
import { z } from 'zod';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { Input } from '@/components/ui/input';
import { useOnboardingUpdateProfile } from '@/hooks/useOnboardingUpdateProfile';
import { useOnboardingProfileStore } from '@/stores/onboarding-profile-store';
import { OnboardingStep } from '@/types/onboarding';

const libraries: 'places'[] = ['places'];

const locationSchema = z.object({
  buildingPlaceName: z.string().optional(),
  street: z.string().min(1, 'Street is required'),
  houseNumber: z.string().min(1, 'House number is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().optional(),
  area: z.string().optional(),
  postalCode: z.string().min(1, 'Postal code is required'),
  addCommentAboutLocation: z.string().optional(),
});

type LocationInput = z.infer<typeof locationSchema>;

type FieldConfig = {
  name: keyof LocationInput;
  placeholder: string;
  required?: boolean;
};

const fieldConfigs: FieldConfig[] = [
  { name: 'buildingPlaceName', placeholder: 'Building or Place Name' },
  { name: 'street', placeholder: 'Street ', required: true },
  { name: 'houseNumber', placeholder: 'House Number ', required: true },
  { name: 'state', placeholder: 'State ', required: true },
  { name: 'city', placeholder: 'City' },
  { name: 'area', placeholder: 'Area' },
  { name: 'postalCode', placeholder: 'Postal Code ', required: true },
  { name: 'addCommentAboutLocation', placeholder: 'Add comment about location' },
];

export function BusinessLocation() {
  const { profileData, formData, openMapDrawer, setStepFormData } = useOnboardingProfileStore();
  const { updateProfile } = useOnboardingUpdateProfile();

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<Coordinates | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const storedLocation = formData.location;
  const addressData = profileData?.location || {};

  const getDefault = (key: keyof LocationInput) => {
    if (storedLocation && storedLocation[key as keyof LocationFormData] !== undefined) {
      return storedLocation[key as keyof LocationFormData] as string;
    }
    return (addressData as any)[key] ?? '';
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LocationInput>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      buildingPlaceName: getDefault('buildingPlaceName'),
      street: getDefault('street'),
      houseNumber: getDefault('houseNumber'),
      state: getDefault('state'),
      city: getDefault('city'),
      area: getDefault('area'),
      postalCode: getDefault('postalCode'),
      addCommentAboutLocation: getDefault('addCommentAboutLocation'),
    },
    mode: 'all',
  });

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

    setValue('buildingPlaceName', buildingName, { shouldValidate: true });
    setValue('street', street, { shouldValidate: true });
    setValue('houseNumber', houseNumber, { shouldValidate: true });
    setValue('area', area, { shouldValidate: true });
    setValue('city', city, { shouldValidate: true });
    setValue('state', state, { shouldValidate: true });
    setValue('postalCode', postalCode, { shouldValidate: true });
  };

  const handleMapConfirm = useCallback(
    async (confirmedLocation: LocationFormData) => {
      try {
        setStepFormData('location', confirmedLocation);

        await updateProfile(
          {
            currentStep: OnboardingStep.BUSINESS_LOCATION,
            completeStep: OnboardingStep.BUSINESS_LOCATION,
            buildingPlaceName: confirmedLocation.buildingPlaceName,
            street: confirmedLocation.street,
            houseNumber: confirmedLocation.houseNumber,
            state: confirmedLocation.state,
            city: confirmedLocation.city,
            area: confirmedLocation.area,
            postalCode: confirmedLocation.postalCode,
            addCommentAboutLocation: confirmedLocation.addCommentAboutLocation,
            latitude: confirmedLocation.coordinates?.lat,
            longitude: confirmedLocation.coordinates?.lng,
          },
          { shouldAdvanceStep: true }
        );
      } catch {
        toast.error('Failed to save location');
      }
    },
    [updateProfile, setStepFormData]
  );

  const onSubmit = async (data: LocationInput) => {
    const locationData: LocationFormData = {
      buildingPlaceName: data.buildingPlaceName || '',
      street: data.street,
      houseNumber: data.houseNumber,
      state: data.state,
      city: data.city || '',
      area: data.area || '',
      postalCode: data.postalCode,
      addCommentAboutLocation: data.addCommentAboutLocation || '',
      coordinates: selectedCoordinates,
    };

    openMapDrawer(locationData, handleMapConfirm);
  };

  return (
    <div className="flex h-full w-full items-center justify-center px-4 sm:px-8">
      <div className="w-full max-w-xl">
        <StepHeader
          title="Where is your business located?"
          description="Customers and riders will use this information to find your store."
        />

        <form
          id="onboarding-step-form"
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-4"
        >
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
