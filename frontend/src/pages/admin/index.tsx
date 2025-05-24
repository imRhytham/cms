import { NextPageWithLayout } from "@/types/common";
import { Tabs } from "@mantine/core";
import SubmissionList from "@/components/modules/admin/SubmissionList";
import BannerUpload from "@/components/modules/admin/BannerManagement";

const Page: NextPageWithLayout = () => {
	return (
		<div className="container mx-auto p-4 md:p-6 lg:p-8">
			<h1 className="text-4xl font-bold">Admin Dashboard</h1>
			<Tabs variant="outline" className="mt-5" defaultValue="Queries">
				<Tabs.List grow>
					<Tabs.Tab value="Queries">Queries</Tabs.Tab>
					<Tabs.Tab value="Banner">Upload Banner</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel value="Queries" className="mt-5">
					<SubmissionList />
				</Tabs.Panel>
				<Tabs.Panel value="Banner" className="mt-5">
					<BannerUpload />
				</Tabs.Panel>
			</Tabs>
		</div>
	);
};

export default Page;
