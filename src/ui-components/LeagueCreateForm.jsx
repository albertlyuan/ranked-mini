/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createLeague } from "../graphql/mutations";
const client = generateClient();
export default function LeagueCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    leagueName: "",
    adminUID: "",
  };
  const [leagueName, setLeagueName] = React.useState(initialValues.leagueName);
  const [adminUID, setAdminUID] = React.useState(initialValues.adminUID);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setLeagueName(initialValues.leagueName);
    setAdminUID(initialValues.adminUID);
    setErrors({});
  };
  const validations = {
    leagueName: [],
    adminUID: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          leagueName,
          adminUID,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: createLeague.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "LeagueCreateForm")}
      {...rest}
    >
      <TextField
        label="League name"
        isRequired={false}
        isReadOnly={false}
        value={leagueName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              leagueName: value,
              adminUID,
            };
            const result = onChange(modelFields);
            value = result?.leagueName ?? value;
          }
          if (errors.leagueName?.hasError) {
            runValidationTasks("leagueName", value);
          }
          setLeagueName(value);
        }}
        onBlur={() => runValidationTasks("leagueName", leagueName)}
        errorMessage={errors.leagueName?.errorMessage}
        hasError={errors.leagueName?.hasError}
        {...getOverrideProps(overrides, "leagueName")}
      ></TextField>
      <TextField
        label="Admin uid"
        isRequired={false}
        isReadOnly={false}
        value={adminUID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              leagueName,
              adminUID: value,
            };
            const result = onChange(modelFields);
            value = result?.adminUID ?? value;
          }
          if (errors.adminUID?.hasError) {
            runValidationTasks("adminUID", value);
          }
          setAdminUID(value);
        }}
        onBlur={() => runValidationTasks("adminUID", adminUID)}
        errorMessage={errors.adminUID?.errorMessage}
        hasError={errors.adminUID?.hasError}
        {...getOverrideProps(overrides, "adminUID")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
