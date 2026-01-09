'use client';

import { useState } from 'react';
import { EmailLoginForm } from '@/components/pages/sign-in/EmailLoginForm';
import { PhoneLoginForm } from '@/components/pages/sign-in/PhoneLoginForm';

type LoginMethod = 'email' | 'phone';

export default function SignInPage() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');

  const switchToPhone = () => setLoginMethod('phone');
  const switchToEmail = () => setLoginMethod('email');

  return loginMethod === 'email' ? (
    <EmailLoginForm onSwitchToPhone={switchToPhone} />
  ) : (
    <PhoneLoginForm onSwitchToEmail={switchToEmail} />
  );
}
