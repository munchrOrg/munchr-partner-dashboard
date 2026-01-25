'use client';

import type { LocationFormData } from '@/types/onboarding';
import type { BranchStep1Input, BranchStep2Input } from '@/validations/branch';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { useCreateBranch } from '@/react-query/branches/mutations';
import { useBranches } from '@/react-query/branches/queries';
import { BranchMapView } from './AddBranchForm/BranchMapView';
import { Step1 } from './AddBranchForm/Step1';
import { Step2 } from './AddBranchForm/Step2';

type Store = {
  id: string;
  name: string;
  address: string;
  isEnabled: boolean;
};

type StoresDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function StoresDrawer({ isOpen, onClose }: Readonly<StoresDrawerProps>) {
  const [showAddBranchForm, setShowAddBranchForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showMapView, setShowMapView] = useState(false);
  const [step2FormData, setStep2FormData] = useState<Partial<BranchStep2Input>>({});
  const [step1FormData, setStep1FormData] = useState<BranchStep1Input | null>(null);
  const { data: branchesData } = useBranches();
  const { mutate: createBranch } = useCreateBranch();
  const branches = branchesData?.branches || [];

  const [stores, setStores] = useState<Store[]>(
    () =>
      branches.map((branch) => ({
        id: branch.id,
        name: branch.branchName || 'Unnamed Branch',
        address: `${branch.location?.buildingPlaceName || ''}, ${branch.location?.street || ''}, ${branch.location?.city || ''}`,
        isEnabled: branch.isActive,
      })) || []
  );
  if (branches.length !== stores.length) {
    const mappedStores: Store[] = branches.map((branch) => ({
      id: branch.id,
      name: branch.branchName || 'Unnamed Branch',
      address: `${branch.location?.buildingPlaceName || ''}, ${branch.location?.street || ''}, ${branch.location?.city || ''}`,
      isEnabled: branch.isActive,
    }));
    setStores(mappedStores);
  }

  const handleToggleStore = (storeId: string, enabled: boolean) => {
    setStores((prevStores) =>
      prevStores.map((store) => (store.id === storeId ? { ...store, isEnabled: enabled } : store))
    );
  };

  const handleAddNewBranch = () => {
    setShowAddBranchForm(true);
    setCurrentStep(1);
  };

  const handleStep1Submit = (_data: BranchStep1Input) => {
    setStep1FormData(_data);
    setCurrentStep(2);
  };

  const handleStep2Submit = (data: BranchStep2Input) => {
    if (!step1FormData) {
      return;
    }

    const payload: any = {
      businessName: step1FormData.businessName,
      description: step1FormData.description,
      email: step1FormData.businessEmail,
      password: step1FormData.password,
      cuisineIds: step1FormData.cuisines,
      buildingPlaceName: data.buildingPlaceName,
      street: data.street,
      houseNumber: data.houseNumber,
      state: data.state,
      city: data.city,
      area: data.area,
      postalCode: data.postalCode,
      addCommentAboutLocation: data.addCommentAboutLocation,
      coordinates: data.coordinates,
    };

    createBranch(payload, {
      onSuccess: (res) => {
        console.log('Branch created:', res);
        setShowAddBranchForm(false);
        setCurrentStep(1);
        setStep1FormData(null);
        setStep2FormData({});
        setShowMapView(false);
      },
      onError: (err) => {
        console.error('Create branch failed', err);
      },
    });
  };

  const handleMapClick = () => {
    setShowMapView(true);
  };

  const handleMapConfirm = (location: LocationFormData) => {
    const updatedData: BranchStep2Input = {
      buildingPlaceName: location.buildingPlaceName,
      street: location.street,
      houseNumber: location.houseNumber,
      state: location.state,
      city: location.city,
      area: location.area,
      postalCode: location.postalCode,
      addCommentAboutLocation: location.addCommentAboutLocation,
      coordinates: location.coordinates,
    };
    setStep2FormData(updatedData);
    setShowMapView(false);
  };

  const handleMapCancel = () => {
    setShowMapView(false);
  };

  const handleDrawerClose = (open: boolean) => {
    if (!open) {
      setShowAddBranchForm(false);
      setCurrentStep(1);
      setShowMapView(false);
      setStep2FormData({});
      onClose();
    }
  };

  const getTitle = () => {
    if (showAddBranchForm) {
      if (showMapView) {
        return 'Is This the right location?';
      }
      return `Add a New Branch (Step ${currentStep})`;
    }
    return 'Stores';
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleDrawerClose}>
      <SheetContent side="right" className="w-full overflow-y-auto rounded-l-2xl p-0 sm:max-w-lg">
        <SheetHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
          <div className="flex flex-col">
            <SheetTitle className="mt-4 text-[30px] font-bold">{getTitle()}</SheetTitle>
            {showMapView && (
              <p className="mt-2 text-base text-gray-600">
                This helps customers find you easily. If it&apos;s not correct, search for your
                exact address or a nearby landmark.
              </p>
            )}
          </div>
        </SheetHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {showAddBranchForm ? (
              <>
                {currentStep === 1 && <Step1 onSubmit={handleStep1Submit} />}
                {currentStep === 2 && !showMapView && (
                  <Step2
                    initialData={step2FormData}
                    onSubmit={handleStep2Submit}
                    onMapClick={handleMapClick}
                  />
                )}
                {currentStep === 2 && showMapView && (
                  <BranchMapView
                    location={{
                      buildingPlaceName: step2FormData.buildingPlaceName ?? '',
                      street: step2FormData.street ?? '',
                      houseNumber: step2FormData.houseNumber ?? '',
                      state: step2FormData.state ?? '',
                      city: step2FormData.city ?? '',
                      area: step2FormData.area ?? '',
                      postalCode: step2FormData.postalCode ?? '',
                      addCommentAboutLocation: step2FormData.addCommentAboutLocation ?? '',
                      coordinates: step2FormData.coordinates ?? null,
                    }}
                    onConfirm={handleMapConfirm}
                    onCancel={handleMapCancel}
                  />
                )}
              </>
            ) : (
              <>
                <div className="rounded-2xl border px-6 py-4">
                  {stores.map((store, index) => (
                    <div key={store.id}>
                      <div className="flex items-center gap-4 py-4">
                        <Checkbox className="shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base leading-tight font-semibold text-[#0C0017]">
                            {store.name}
                          </h3>
                          <p className="mt-1 text-sm leading-tight text-[#918D8C]">
                            {store.address}
                          </p>
                        </div>
                        <div className="shrink-0">
                          <Switch
                            checked={store.isEnabled}
                            onCheckedChange={(checked) => handleToggleStore(store.id, checked)}
                            aria-label={`Toggle ${store.name}`}
                          />
                        </div>
                      </div>
                      {index < stores.length - 1 && <Separator className="bg-gray-200" />}
                    </div>
                  ))}
                </div>

                <div className="mt-7">
                  <Button
                    variant="outline"
                    className="w-full rounded-full border border-gray-300 bg-white py-6 text-base font-normal hover:bg-gray-50"
                    onClick={handleAddNewBranch}
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Add a New Branch
                  </Button>
                </div>
              </>
            )}
          </div>

          {showAddBranchForm && !showMapView && (
            <div className="flex h-[127px] items-center border-t bg-white px-6 shadow-[0px_-4px_20px_0px_#0000001A]">
              <Button
                type="submit"
                form={currentStep === 1 ? 'add-branch-step1-form' : 'add-branch-step2-form'}
                className="bg-gradient-yellow h-[54px] w-full rounded-full px-5 py-[23px] text-base font-medium text-black hover:bg-amber-500"
              >
                {currentStep === 1 ? 'Next' : 'Submit'}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
