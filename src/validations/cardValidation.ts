import { checkSchema } from "express-validator";

export const CardValidation = () => {
  return checkSchema({
    cardTypeId: {
      notEmpty: {
        errorMessage: "Please enter the card type.",
      },
    },
    cardProviderId: {
      notEmpty: {
        errorMessage: "Please enter the card provider.",
      },
    },
  });
};
