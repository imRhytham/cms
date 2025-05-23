import { TextInput, TextInputProps } from "@mantine/core";
import { useFormContext, get } from "react-hook-form";

export interface ControlledTextInputProps extends TextInputProps {
	name: string;
}

export const ControlledTextInput: React.FC<ControlledTextInputProps> = ({
	name,
	readOnly,
	...props
}) => {
	const {
		register,
		formState: { errors, isLoading, isSubmitting },
	} = useFormContext();

	return (
		<TextInput
			{...props}
			{...register(name)}
			error={get(errors, name)?.message}
			aria-invalid={!!errors?.[name]?.message}
			readOnly={readOnly || isLoading || isSubmitting}
		/>
	);
};
