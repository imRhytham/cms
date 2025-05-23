import { ControlledTextarea } from "@/components/shared/Textarea/ControlledTextarea";
import { ControlledTextInput } from "@/components/shared/TextInput/ControlledTextInput";
import { contactUsService } from "@/services/contactus.service";
import { ContactUsRequest } from "@/types/contactUs";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

const contactSchema = yup.object({
	name: yup
		.string()
		.required("Name is required")
		.min(2, "Name must be at least 2 characters")
		.max(50, "Name must be less than 50 characters"),

	email: yup
		.string()
		.required("Email is required")
		.email("Please enter a valid email address"),

	phone: yup
		.string()
		.required("Phone number is required")
		.matches(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"),

	pincode: yup
		.string()
		.required("Pincode is required")
		.matches(/^[0-9]{6}$/, "Please enter a valid 6-digit pincode"),

	message: yup
		.string()
		.required("Message is required")
		.min(10, "Message must be at least 10 characters")
		.max(500, "Message must be less than 500 characters"),
});

const ContactForm: React.FC = () => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const form = useForm<ContactUsRequest>({
		resolver: yupResolver(contactSchema),
		mode: "onBlur",
	});

	const handleSubmit = form.handleSubmit(async (data) => {
		console.log(data);
		try {
			setIsSubmitting(true);

			await contactUsService.contactUs(data);
			showNotification({
				message: "Message Sent Successfully",
				title: "Success",
				color: "green",
			});
			form.reset();
		} catch (err) {
			showNotification({
				message:
					err instanceof Error ? err.message : "An error occurred during login",
				title: "Error",
				color: "red",
			});
		} finally {
			setIsSubmitting(false);
		}
	});

	return (
		<FormProvider {...form}>
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<ControlledTextInput name="name" label="Full Name" withAsterisk />
					<ControlledTextInput name="email" label="Email" withAsterisk />
					<ControlledTextInput name="phone" label="Phone Number" withAsterisk />
					<ControlledTextInput name="pincode" label="Pin Code" withAsterisk />
					<ControlledTextarea
						name="message"
						label="Message"
						withAsterisk
						className="md:col-span-2"
					/>
				</div>
				<Button
					type="submit"
					fullWidth
					className="w-full md:w-auto px-8"
					loading={isSubmitting}
				>
					Send Message
				</Button>
			</form>
		</FormProvider>
	);
};

export default ContactForm;
