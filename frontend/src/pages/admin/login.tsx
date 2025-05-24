import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authService } from "@/services/auth.service";
import type { LoginCredentials } from "@/types/auth";
import { Button } from "@mantine/core";
import { ControlledTextInput } from "@/components/shared/TextInput/ControlledTextInput";
import { ControlledPasswordInput } from "@/components/shared/PasswordInput/ControlledPasswordInput";
import { showNotification } from "@mantine/notifications";
import "@/utils/yup";
import { ACCESS_TOKEN } from "@/utils/constant";
import { GetServerSideProps } from "next";
import { getCookie } from "cookies-next";

// Validation schema
const loginSchema = yup.object().shape({
	email: yup
		.string()
		.email("Please enter a valid email")
		.required("Email is required"),
	password: yup.string().required("Password is required").password(),
});

const LoginPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const form = useForm<LoginCredentials>({
		resolver: yupResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		if (authService.isAuthenticated()) {
			router.replace("/admin");
		}
	}, [router]);

	const handleLogin = form.handleSubmit(async (data) => {
		try {
			setIsLoading(true);

			await authService.login(data);
			showNotification({
				message: "Login Successful",
				title: "Success",
				color: "green",
			});

			router.push("/admin");
		} catch (err) {
			showNotification({
				message:
					err instanceof Error ? err.message : "An error occurred during login",
				title: "Error",
				color: "red",
			});
		} finally {
			setIsLoading(false);
		}
	});

	return (
		<div className="container mx-auto py-16 px-4">
			<div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
				<h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
				<FormProvider {...form}>
					<form onSubmit={handleLogin} className="space-y-6">
						<ControlledTextInput
							name="email"
							label="Email"
							placeholder="Email"
							withAsterisk
						/>
						<ControlledPasswordInput
							name="password"
							label="Password"
							withAsterisk
						/>
						<Button loading={isLoading} type="submit" fullWidth>
							Login
						</Button>
					</form>
				</FormProvider>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const token = getCookie(ACCESS_TOKEN, { req: context.req, res: context.res });

	if (token) {
		return {
			redirect: {
				destination: "/admin",
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
};

export default LoginPage;
