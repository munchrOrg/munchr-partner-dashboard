'use client';

import { Check } from 'lucide-react';
import { StepHeader } from '@/components/onboarding/shared/StepHeader';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/stores/onboarding-store';

const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic',
    price: 'Rs. 5,000',
    period: '/month',
    features: ['Up to 100 orders/month', 'Basic support', 'Standard commission rate'],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 'Rs. 10,000',
    period: '/month',
    features: [
      'Up to 500 orders/month',
      'Priority support',
      'Reduced commission rate',
      'Marketing boost',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'Rs. 20,000',
    period: '/month',
    features: [
      'Unlimited orders',
      '24/7 dedicated support',
      'Lowest commission rate',
      'Premium marketing',
      'Analytics dashboard',
    ],
  },
];

export function PartnershipPackage() {
  const { formData, setFormData } = useOnboardingStore();

  const selectedPackageId = formData.package?.selectedPackageId || '';

  const handleSelect = (packageId: string) => {
    setFormData('package', { selectedPackageId: packageId });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
      <StepHeader
        title="Choose the best plan for your business"
        description="Select a partnership package that suits your business needs."
      />

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            role="button"
            tabIndex={0}
            onClick={() => handleSelect(pkg.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect(pkg.id);
              }
            }}
            className={cn(
              'relative cursor-pointer rounded-2xl border-2 p-6 transition-all hover:border-purple-300 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none',
              selectedPackageId === pkg.id ? 'border-purple-700 bg-purple-50' : 'border-gray-200',
              pkg.popular && 'ring-2 ring-purple-200'
            )}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-purple-700 px-3 py-1 text-xs font-medium text-white">
                Most Popular
              </span>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-semibold">{pkg.name}</h3>
              <div className="mt-2">
                <span className="text-2xl font-bold">{pkg.price}</span>
                <span className="text-gray-500">{pkg.period}</span>
              </div>
            </div>

            <ul className="space-y-2">
              {pkg.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {selectedPackageId === pkg.id && (
              <div className="absolute top-4 right-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-700">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
