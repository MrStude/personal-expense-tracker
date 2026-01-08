import React from "react";
import { FormProvider, Controller } from "react-hook-form";

const Form = FormProvider;

const FormField = ({ name, control, render }) => {
  return <Controller name={name} control={control} render={render} />;
};

export { Form, FormField };
