'use client';

import type { LocationFormData } from '@/types/onboarding';
import type { Step1Input } from '@/validations/profile-setup';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useProfile } from '@/react-query/auth/queries';
import { useUpdateBranch } from '@/react-query/branches/mutations';
import { branchesService } from '@/react-query/branches/service';
import { useCuisines } from '@/react-query/cuisine/queries';
import { useProfileSetupStore } from '@/stores/profile-setup-store';
import { step1Schema } from '@/validations/profile-setup';

const getLocationDisplayString = (location: LocationFormData | null): string => {
  if (!location) {
    return '';
  }
  const parts = [location.area, location.city].filter(Boolean);
  return parts.join(', ') || location.buildingPlaceName || '';
};

const emptyLocation: LocationFormData = {
  buildingPlaceName: '',
  street: '',
  houseNumber: '',
  state: '',
  city: '',
  area: '',
  postalCode: '',
  addCommentAboutLocation: '',
  coordinates: null,
};

export function Step1() {
  const { formData, setStepData, completeStep, nextStep, openMapDrawer } = useProfileSetupStore();

  const form = useForm<Step1Input>({
    resolver: zodResolver(step1Schema),
    defaultValues: formData.step1 || {
      businessName: '',
      businessDescription: '',
      cuisines: '',
      location: emptyLocation,
    },
  });

  const {
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = form;

  const currentLocation = watch('location');
  const locationDisplayString = getLocationDisplayString(currentLocation);

  useEffect(() => {
    if (formData.step1 && !form.formState.isDirty) {
      reset(formData.step1);
    }
  }, [formData.step1, reset, form.formState.isDirty]);

  const { mutate: updateBranch } = useUpdateBranch();
  const { data: profile }: any = useProfile();
  const { data: cuisinesList = [] } = useCuisines();
  const cuisineOptions = cuisinesList.map((c) => ({ label: c.name, value: c.id }));

  useEffect(() => {
    const id = profile?.onboarding?.branchId;
    if (!id) {
      return;
    }
    const fetchBranch = async () => {
      try {
        const data = await branchesService.getById(id);

        // Convert branch location to LocationFormData format
        const locationData: LocationFormData = {
          buildingPlaceName: data.location?.buildingPlaceName || '',
          street: data.location?.street || '',
          houseNumber: data.location?.houseNumber || '',
          state: data.location?.state || '',
          city: data.location?.city || '',
          area: data.location?.area || '',
          postalCode: data.location?.postalCode || '',
          addCommentAboutLocation: data.location?.addCommentAboutLocation || '',
          coordinates:
            data.location?.latitude && data.location?.longitude
              ? {
                  lat: Number.parseFloat(data.location.latitude),
                  lng: Number.parseFloat(data.location.longitude),
                }
              : null,
        };

        reset({
          businessName: data.branchName || '',
          businessDescription: data.description || '',
          cuisines: data.cuisineIds?.[0] || '',
          location: locationData,
        });
      } catch (err) {
        console.error('Error fetching branch:', err);
      }
    };
    fetchBranch();
  }, [profile, reset]);

  const handleLocationUpdate = useCallback(
    (updatedLocation: LocationFormData) => {
      setValue('location', updatedLocation, { shouldValidate: true });
    },
    [setValue]
  );

  const handleOpenMapDrawer = useCallback(() => {
    openMapDrawer(currentLocation || emptyLocation, handleLocationUpdate);
  }, [openMapDrawer, currentLocation, handleLocationUpdate]);

  const onSubmit = async (data: Step1Input) => {
    try {
      setStepData('step1', data);

      await updateBranch({
        businessName: data.businessName,
        description: data.businessDescription,
        cuisineIds: [data.cuisines],
        buildingPlaceName: data.location.buildingPlaceName,
        street: data.location.street,
        houseNumber: data.location.houseNumber,
        state: data.location.state,
        city: data.location.city,
        area: data.location.area,
        postalCode: data.location.postalCode,
        latitude: data.location.coordinates?.lat,
        longitude: data.location.coordinates?.lng,
      } as any);
      toast.success('Branch updated successfully');
      completeStep(1);
      nextStep();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="mx-auto mt-9 flex max-w-4xl flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
      <div className="flex-1">
        <Form {...form}>
          <form
            id="profile-setup-step1-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 md:w-[450px]"
          >
            <FormField
              control={control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between gap-2">
                    <FormLabel className="text-base font-medium">Business Name</FormLabel>
                    <Icon name="editIcon" className="size-4" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Kababjees Fried Chicken"
                      {...field}
                      className="h-11 rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Business description</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Kababjees Fried Chicken"
                      {...field}
                      rows={4}
                      className={cn(
                        'w-full rounded-2xl border border-gray-300 bg-transparent px-4 py-3 text-base',
                        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]',
                        'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
                        'placeholder:text-muted-foreground min-h-[100px] resize-none'
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel className="text-base font-medium">Cuisines</FormLabel>
              <FormControl>
                <Controller
                  name="cuisines"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="focus:border-ring focus:ring-ring h-11 w-full rounded-full border border-gray-300 px-4 focus:ring-1 focus:outline-none sm:h-12 sm:px-5"
                    >
                      <option value="">Select cuisine</option>
                      {cuisineOptions.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </FormControl>
              {errors.cuisines && (
                <p className="mt-1 ml-4 text-sm text-red-500">{errors.cuisines.message}</p>
              )}
            </FormItem>

            <FormItem>
              <FormLabel className="text-base font-medium">Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Location Here"
                  value={locationDisplayString}
                  readOnly
                  onClick={handleOpenMapDrawer}
                  className="h-11 cursor-pointer rounded-full border-gray-300 px-4 sm:h-12 sm:px-5"
                />
              </FormControl>
              <div className="flex w-full justify-end">
                <button
                  type="button"
                  onClick={handleOpenMapDrawer}
                  className="text-sm font-medium text-[#2C2F2E] hover:underline"
                >
                  Change Location
                </button>
              </div>
              {errors.location && (
                <p className="mt-1 ml-4 text-sm text-red-500">Location is required</p>
              )}
            </FormItem>
          </form>
        </Form>
      </div>

      <div className="hidden justify-center lg:flex lg:w-1/2 lg:justify-end">
        <div className="relative h-64 w-64 sm:h-80 sm:w-80">
          <Image
            src="/assets/images/First-step-image.png"
            alt="Profile setup illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
