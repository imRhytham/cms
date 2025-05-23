import { useEffect, useState } from "react";
import { Table } from "@mantine/core";

import { showNotification } from "@mantine/notifications";
import axiosInstance from "@/lib/axios";
import { isAxiosError } from "axios";

interface Contact {
	id: string;
	name: string;
	email: string;
	phone: string;
	pincode: string;
	message: string;
	status: "pending" | "in-progress" | "completed" | "rejected";
	createdAt: string;
}

const SubmissionList = () => {
	const [submissions, setSubmissions] = useState<Contact[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchSubmissions = async () => {
		try {
			const { data } = await axiosInstance.get("/contact");
			setSubmissions(data.contacts);
		} catch (err) {
			const message = isAxiosError(err)
				? err.response?.data?.message || "Failed to fetch submissions"
				: "Failed to fetch submissions";

			showNotification({
				title: "Error",
				message,
				color: "red",
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchSubmissions();
	}, []);

	if (isLoading) {
		return <div className="text-center py-8">Loading submissions...</div>;
	}

	if (submissions.length === 0) {
		return (
			<div className="bg-white p-8 rounded-lg shadow-sm border text-center">
				<p className="text-lg text-gray-500">No form submissions yet</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold">Contact Form Submissions</h2>

			<Table striped highlightOnHover>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Name</Table.Th>
						<Table.Th>Email</Table.Th>
						<Table.Th>Phone</Table.Th>
						<Table.Th>Pincode</Table.Th>
						<Table.Th>Message</Table.Th>
						<Table.Th>Date</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{submissions.map((submission) => (
						<Table.Tr key={submission.id}>
							<Table.Td>{submission.name}</Table.Td>
							<Table.Td>{submission.email}</Table.Td>
							<Table.Td>{submission.phone}</Table.Td>
							<Table.Td>{submission.pincode}</Table.Td>
							<Table.Td className="max-w-xs truncate">
								{submission.message}
							</Table.Td>

							<Table.Td>
								{new Date(submission.createdAt).toLocaleDateString()}
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</div>
	);
};

export default SubmissionList;
