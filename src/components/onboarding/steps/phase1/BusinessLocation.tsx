'use client';

import type { LocationFormData } from '@/types/onboarding';
import { zodResolver } from '@hookform/resolvers/zod';
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

  const {
    register,
    handleSubmit,
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
      coordinates: null,
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
