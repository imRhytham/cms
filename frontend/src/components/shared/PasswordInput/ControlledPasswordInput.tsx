import { get, useFormContext } from "react-hook-form";
import { PasswordInput, PasswordInputProps } from "@mantine/core";

export interface ControlledPasswordInputProps extends PasswordInputProps {
	name: string;
}

export const ControlledPasswordInput: React.FC<
	ControlledPasswordInputProps
> = ({ name, readOnly, ...props }) => {
	const {
		register,
		formState: { errors, isLoading, isSubmitting },
	} = useFormContext();

	return (
		<PasswordInput
			{...props}
			{...register(name)}
			error={get(errors, name)?.message}
			aria-invalid={!!errors?.[name]?.message}
			readOnly={readOnly || isLoading || isSubmitting}
		/>
	);
};
