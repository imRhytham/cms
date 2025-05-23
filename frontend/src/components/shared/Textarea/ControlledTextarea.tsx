import { get, useFormContext } from "react-hook-form";
import { Textarea, TextareaProps } from "@mantine/core";

export interface ControlledTextareaProps extends TextareaProps {
	name: string;
}

export const ControlledTextarea: React.FC<ControlledTextareaProps> = ({
	name,
	readOnly,
	...props
}) => {
	const {
		register,
		formState: { errors, isLoading, isSubmitting },
	} = useFormContext();

	return (
		<Textarea
			{...props}
			{...register(name)}
			error={get(errors, name)?.message}
			aria-invalid={!!get(errors, name)}
			readOnly={readOnly || isLoading || isSubmitting}
		/>
	);
};
