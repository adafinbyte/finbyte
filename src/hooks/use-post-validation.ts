import { useEffect, useState } from "react";

type ValidationStatus = "check-pending" | "check-passed" | "check-fail";

interface FormData {
  title: string;
  post: string;
}

interface ValidationResult {
  status: ValidationStatus;
  errors: Partial<Record<keyof FormData, string>>;
}

const BOUNDARIES = {
  title: [8, 50],
  post: [30, 1500],
};

export const usePostValidation = (
  formData: FormData,
  fieldsToValidate: (keyof FormData)[]
): {
  status: ValidationStatus;
  errors: Partial<Record<keyof FormData, string>>;
  valid: Partial<Record<keyof FormData, boolean>>;
} => {
  const errors: Partial<Record<keyof FormData, string>> = {};
  const valid: Partial<Record<keyof FormData, boolean>> = {};

  for (const field of fieldsToValidate) {
    const value = formData[field];

    switch (field) {
      case "title":
        if (value.trim().length < BOUNDARIES.title[0]) {
          errors.title = "Title is too short.";
          valid.title = false;
        } else if (value.trim().length > BOUNDARIES.title[1]) {
          errors.title = "Title is too long.";
          valid.title = false;
        } else {
          valid.title = true;
        }
        break;

      case "post":
        if (value.trim().length < BOUNDARIES.post[0]) {
          errors.post = "Post is too short.";
          valid.post = false;
        } else if (value.trim().length > BOUNDARIES.post[1]) {
          errors.post = "Post is too long.";
          valid.post = false;
        } else {
          valid.post = true;
        }
        break;
    }
  }

  const status = Object.keys(errors).length === 0 ? "check-passed" : "check-fail";

  return { status, errors, valid };
};

