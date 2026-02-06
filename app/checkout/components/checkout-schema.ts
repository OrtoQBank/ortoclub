import cardValidator from "card-validator";
import { z } from "zod";

// Utility functions
export const formatCPF = (value: string) => {
  const numbers = value.replaceAll(/\D/g, "");
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replaceAll(/\D/g, "");
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let checkDigit = 11 - (sum % 11);
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
  if (checkDigit !== Number.parseInt(cleanCPF.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  checkDigit = 11 - (sum % 11);
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
  if (checkDigit !== Number.parseInt(cleanCPF.charAt(10))) return false;

  return true;
};

// Form validation schema
export const checkoutSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    cpf: z
      .string()
      .min(11, "CPF deve ter 11 dígitos")
      .max(14, "CPF inválido")
      .refine(validateCPF, { message: "CPF inválido. Verifique os dígitos." }),
    phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
    postalCode: z.string().min(8, "CEP deve ter 8 dígitos"),
    address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
    addressNumber: z.string().optional(),
    paymentMethod: z.enum(["PIX", "CREDIT_CARD"]),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvv: z.string().optional(),
    installments: z.number().min(1).max(12).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "CREDIT_CARD") {
      const cardNumberValidation = cardValidator.number(data.cardNumber || "");
      if (!cardNumberValidation.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Número do cartão inválido",
          path: ["cardNumber"],
        });
      }

      const expiryValidation = cardValidator.expirationDate(
        data.cardExpiry || ""
      );
      if (!expiryValidation.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Data de validade inválida",
          path: ["cardExpiry"],
        });
      }

      const cvvValidation = cardValidator.cvv(data.cardCvv || "");
      if (!cvvValidation.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CVV deve ter 3 ou 4 dígitos",
          path: ["cardCvv"],
        });
      }
    }
  });

export type CheckoutForm = z.infer<typeof checkoutSchema>;
