import { checkSchema } from "express-validator";

export const CardProviderValidation = () => {
  return checkSchema({
    name: {
      notEmpty: {
        errorMessage: "Please enter the name for the card provider.",
      },
    },
  });
};
