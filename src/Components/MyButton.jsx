// MyButton.tsx
import { extendVariants, Button } from "@nextui-org/react";

export const MyButton = extendVariants(Button, {
  variants: {
    // <- modify/add variants
    color: {
      midnightblue: "text-[#fff] bg-[#3F497F]",
      red: "text-[#fff] bg-[#f00]",
      grey:  "text-[#fff] bg-[#242424]",
      olive: "text-[#000] bg-[#84cc16]",
      orange: "bg-[#fba92c] text-[#fff]",
      orangeblack: "bg-[#fba92c] text-[#000]",
      violet: "bg-[#8b5cf6] text-[#fff]",
    },
    isDisabled: {
      true: "bg-[#eaeaea] text-[#000] opacity-50 cursor-not-allowed",
    },
    size: {
      xs: "px-unit-2 min-w-unit-12 h-unit-6 text-tiny gap-unit-1 rounded-small",
      md: "px-unit-4 min-w-unit-20 h-unit-10 text-small gap-unit-2 rounded-small",
      xl: "px-unit-8 min-w-unit-28 h-unit-150 text-large gap-unit-4 rounded-medium",
      xxl: "px-unit-32 min-w-unit-100 h-unit-500 text-large gap-unit-16 rounded-medium",
    },
    variant: {
      bordered: "border-medium border-solid border-[#000]", // Cambiar el color del borde a midnightblue en hexadecimal
      light: "bg-transparent",
      faded: "border-medium",
      ghost: "border-medium bg-transparent",
    },
  },
  defaultVariants: { // <- modify/add default variants
    color: "grey",
    size: "xl",
    variant: "solid" // Por defecto, el botón será de estilo de texto
  },
});
