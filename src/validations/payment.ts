import validator from 'validator';
import { z } from 'zod';
import { PaymentMethod } from '@/types/onboarding';

export const paymentFormSchema = z
  .object({
    selectedMethod: z.nativeEnum(PaymentMethod).nullable(),
    accountNumber: z.string().optional(),
    accountTitle: z.string().optional(),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvv: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.selectedMethod) {
      return;
    }

    if (data.selectedMethod === PaymentMethod.CARD) {
      // Validate card holder name
      if (!data.accountTitle || data.accountTitle.trim().length === 0) {
        ctx.addIssue({
          path: ['accountTitle'],
          message: 'Card holder name is required',
          code: 'custom',
        });
      } else if (data.accountTitle.trim().length < 2) {
        ctx.addIssue({
          path: ['accountTitle'],
          message: 'Card holder name must be at least 2 characters',
          code: 'custom',
        });
      } else if (!/^[a-z\s]+$/i.test(data.accountTitle.trim())) {
        ctx.addIssue({
          path: ['accountTitle'],
          message: 'Card holder name must contain only letters and spaces',
          code: 'custom',
        });
      }

      // Validate card number
      if (!data.cardNumber || data.cardNumber.trim().length === 0) {
        ctx.addIssue({
          path: ['cardNumber'],
          message: 'Card number is required',
          code: 'custom',
        });
      } else {
        const cardNumber = data.cardNumber.replace(/\s+/g, '');
        if (cardNumber && !validator.isCreditCard(cardNumber)) {
          ctx.addIssue({
            path: ['cardNumber'],
            message: 'Please enter a valid card number',
            code: 'custom',
          });
        }
      }

      // Validate card expiry
      if (!data.cardExpiry || data.cardExpiry.trim().length === 0) {
        ctx.addIssue({
          path: ['cardExpiry'],
          message: 'Card expiry is required',
          code: 'custom',
        });
      } else {
        const expiryRegex = /^(?:0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryRegex.test(data.cardExpiry.trim())) {
          ctx.addIssue({
            path: ['cardExpiry'],
            message: 'Card expiry must be in MM/YY format',
            code: 'custom',
          });
        } else {
          // Validate expiry date is not in the past
          const expiryParts = data.cardExpiry.trim().split('/');
          const month = expiryParts[0];
          const year = expiryParts[1];
          if (month && year) {
            const expiryDate = new Date(
              2000 + Number.parseInt(year, 10),
              Number.parseInt(month, 10) - 1
            );
            const now = new Date();
            if (expiryDate < now) {
              ctx.addIssue({
                path: ['cardExpiry'],
                message: 'Card expiry date must be in the future',
                code: 'custom',
              });
            }
          }
        }
      }

      // Validate CVV
      if (!data.cardCvv || data.cardCvv.trim().length === 0) {
        ctx.addIssue({
          path: ['cardCvv'],
          message: 'CVV is required',
          code: 'custom',
        });
      } else if (!/^\d{3,4}$/.test(data.cardCvv.trim())) {
        ctx.addIssue({
          path: ['cardCvv'],
          message: 'CVV must be 3 or 4 digits',
          code: 'custom',
        });
      }
    } else {
      // Validate account number for non-card methods
      if (!data.accountNumber || data.accountNumber.trim().length === 0) {
        ctx.addIssue({
          path: ['accountNumber'],
          message: 'Account number is required',
          code: 'custom',
        });
      } else {
        const accountNumber = data.accountNumber.replace(/\s+/g, '');
        if (accountNumber && !validator.isNumeric(accountNumber)) {
          ctx.addIssue({
            path: ['accountNumber'],
            message: 'Account number must contain only numbers',
            code: 'custom',
          });
        } else if (accountNumber && accountNumber.length < 4) {
          ctx.addIssue({
            path: ['accountNumber'],
            message: 'Account number must be at least 4 digits',
            code: 'custom',
          });
        } else if (accountNumber && accountNumber.length > 20) {
          ctx.addIssue({
            path: ['accountNumber'],
            message: 'Account number must not exceed 20 digits',
            code: 'custom',
          });
        }
      }
    }
  });

export type PaymentFormInput = z.infer<typeof paymentFormSchema>;
