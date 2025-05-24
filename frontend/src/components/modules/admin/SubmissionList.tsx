import { useEffect, useState, useCallback } from "react";
import { Table, Pagination } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { contactUsService } from "@/services/contactus.service";
import type { Contact } from "@/types/contactUs";
import type { PaginatedResponse } from "@/services/contactus.service";

const SubmissionList = () => {
	const [data, setData] = useState<PaginatedResponse<Contact> | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [page, setPage] = useState(1);
	const limit = 10;

	const fetchSubmissions = useCallback(async () => {
		try {
			const response = await contactUsService.getContacts({ page, limit });
			setData(response);
		} catch (err) {
			showNotification({
				title: "Error",
				message:
					err instanceof Error ? err.message : "Failed to fetch submissions",
				color: "red",
			});
		} finally {
			setIsLoading(false);
		}
	}, [page, limit]);

	useEffect(() => {
		fetchSubmissions();
	}, [fetchSubmissions]);

	if (isLoading) {
		return <div className="text-center py-8">Loading submissions...</div>;
	}

	if (!data || data.contacts.length === 0) {
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
					{data.contacts.map((submission) => (
						<Table.Tr key={submission._id}>
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

			<div className="flex justify-center mt-4">
				<Pagination
					total={data.pagination.totalPages}
					value={page}
					onChange={setPage}
					withEdges
				/>
			</div>
		</div>
	);
};

export default SubmissionList;
