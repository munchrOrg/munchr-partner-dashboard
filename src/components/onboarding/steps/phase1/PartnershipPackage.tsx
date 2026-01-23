'use client';

import type { PackageFormData } from '@/types/onboarding';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { useOnboardingProfileStore } from '@/stores/onboarding-profile-store';

const PACKAGES = [
  {
    id: 'tablet-plan',
    name: 'Homechefs Phone Tablet',
    icon: 'vase',
    benefits: ['Delivery by munchr'],
    details: [
      {
        label: 'Commission Rate',
        value: '28%',
        desc: 'This rate will be collected from every successful customer order. ',
      },
      {
        label: 'Onboarding Fee',
        value: '16000 PKS',
        desc: 'This fee will go towards covering the cost of operation for delivery of tablet and SIM card, training, and account setup. The amount is a one-time fee that is non-refundable.',
      },
      {
        label: 'Subscription Fee',
        value: '800 PK',
        desc: 'Monthly charge for using our platform and services.',
      },
      {
        label: 'Online Payment Fee (%)',
        value: '1.60%',
        desc: 'Online Payment Fee will be collected each time a customer payment is processed electronically.',
      },
      {
        label: 'Wastage',
        value: '50%',
        desc: 'It is the cost of the failed customer order that is being shared between munchr and the vendor.',
      },
      {
        label: 'Tablet + GoDroid App',
        value: 'Include',
        desc: 'The Tablet will be used to receive orders from customers.',
      },
      {
        label: 'Sim Card',
        value: 'Include',
        desc: 'Sim Card is required to enable the usage of a Tablet.',
      },
    ],
  },
  {
    id: 'phone-plan',
    name: 'Homechefs Phone Tablet',
    icon: 'vase',
    benefits: ['Delivery by munchr'],
    details: [
      {
        label: 'Commission Rate',
        value: '28%',
        desc: 'This rate will be collected from every successful customer order. ',
      },
      {
        label: 'Onboarding Fee',
        value: '16000 PKS',
        desc: 'This fee will go towards covering the cost of operation for delivery of tablet and SIM card, training, and account setup. The amount is a one-time fee that is non-refundable.',
      },
      {
        label: 'Subscription Fee',
        value: '800 PK',
        desc: 'Monthly charge for using our platform and services.',
      },
      {
        label: 'Online Payment Fee (%)',
        value: '1.60%',
        desc: 'Online Payment Fee will be collected each time a customer payment is processed electronically.',
      },
      {
        label: 'Wastage',
        value: '50%',
        desc: 'It is the cost of the failed customer order that is being shared between munchr and the vendor.',
      },
      {
        label: 'Tablet + GoDroid App',
        value: 'Include',
        desc: 'The Tablet will be used to receive orders from customers.',
      },
      { label: 'Godroid App', value: 'Include' },
    ],
  },
];

export function PartnershipPackage() {
  const { formData, setStepFormData, setPendingFormSubmit } = useOnboardingProfileStore();

  const [selectedPackage, setSelectedPackage] = useState<PackageFormData>(() => {
    if (formData.package) {
      return formData.package;
    }
    return { selectedPackageId: '' };
  });

  const handleSelect = (packageId: string) => {
    setSelectedPackage({ selectedPackageId: packageId });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPackage.selectedPackageId) {
      toast.error('Please select a partnership package before continuing.');
      return;
    }

    setStepFormData('package', selectedPackage);
    setPendingFormSubmit(true);
  };

  return (
    <form
      id="onboarding-step-form"
      onSubmit={handleSubmit}
      className="mx-auto max-w-6xl px-4 py-8 sm:px-8"
    >
      <StepHeader
        title="Partnership Package"
        description="Our plans helps increase your customer base, boost your revenue and grow your business. Choose the one works best for you!"
      />

      <div className="mt-8 grid items-start gap-6 md:grid-cols-2">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={cn(
              'rounded-2xl border bg-white p-6 transition-all',
              selectedPackage.selectedPackageId === pkg.id
                ? 'border-purple-dark'
                : 'border-gray-200'
            )}
          >
            {/* Icon and Title */}
            <div className="mb-6 flex flex-col items-center">
              <Icon name={pkg.icon as any} className="mb-4 h-20 w-20" />
              <h3 className="text-center text-lg font-bold">{pkg.name}</h3>
            </div>

            {/* Benefits */}
            <div className="mb-4">
              <h4 className="mb-3 text-base font-bold">Benefits</h4>
              {pkg.benefits.map((benefit) => (
                <div key={`${pkg.id}-${pkg.name}`} className="flex items-center gap-2 text-sm">
                  <Check className="text-purple-dark h-4 w-4" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* Details */}
            <Accordion type="single" collapsible className="space-y-3">
              {pkg.details.map((detail, idx) => (
                <AccordionItem
                  key={`${pkg.id}-${detail.label}`}
                  value={`${pkg.id}-item-${idx}`}
                  className="border-b border-gray-200"
                >
                  <AccordionTrigger>{detail.label}</AccordionTrigger>
                  <AccordionContent>{detail.desc}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Select Button */}
            <Button
              type="button"
              onClick={() => handleSelect(pkg.id)}
              className={cn(
                'mt-6 h-12 w-full rounded-full text-base font-medium',
                selectedPackage.selectedPackageId === pkg.id
                  ? 'bg-gradient-yellow hover:bg-gradient-yellow/80 text-black'
                  : 'border-2 border-gray-300 bg-white text-black hover:bg-gray-50'
              )}
            >
              Select
            </Button>
          </div>
        ))}
      </div>
    </form>
  );
}
