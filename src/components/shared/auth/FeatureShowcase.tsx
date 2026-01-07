import { Icon } from '@/lib/icon';
import { FeatureItem } from './FeatureItem';

export function FeatureShowcase() {
  return (
    <div className="m-3 hidden flex-col items-center justify-center rounded-3xl bg-gray-100 p-8 lg:flex lg:w-1/2 xl:p-12">
      <div className="mb-6 xl:mb-8">
        <Icon name="shopIllustration" className="h-48 w-48 xl:h-full xl:w-full" />
      </div>

      <h2 className="mb-6 text-center text-xl font-semibold text-gray-800 xl:mb-8 xl:text-2xl">
        Transform your business
        <br />
        with munchr Partner
      </h2>

      <div className="max-w-sm space-y-4">
        <FeatureItem
          icon={<Icon name="buildings" className="h-10 w-10 xl:h-12 xl:w-12" />}
          title="Track performance and get"
          description="invaluable insights to improve customer loyalty and sales."
        />
        <FeatureItem
          icon={<Icon name="paparPlane" className="h-10 w-10 xl:h-12 xl:w-12" />}
          title="Offer discounts and launch ad"
          description="campaigns to attract new customers."
        />
        <FeatureItem
          icon={<Icon name="settings" className="h-10 w-10 xl:h-12 xl:w-12" />}
          title="Manage your menu and opening"
          description="times more easily, so they're always up to date."
        />
      </div>
    </div>
  );
}
