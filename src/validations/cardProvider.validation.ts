import { checkSchema } from "express-validator";
import { capitalizeFirstLetter } from "../utils/function";

export const CardProviderValidation = () => {
  return checkSchema({
    name: {
      notEmpty: {
        errorMessage: "Please enter the name for the card provider.",
      },
      customSanitizer: {
        options: capitalizeFirstLetter,
      },
    },
  });
};
