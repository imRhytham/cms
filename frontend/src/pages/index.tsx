import { NextPageWithLayout } from "@/types/common";
import LandingLayout from "@/components/layout/LandingLayout";
import ContactForm from "@/components/modules/ContactUs/ContactForm";

const Home: NextPageWithLayout = () => {
	return (
		<main className="w-screen">
			<section className="bg-gradient-to-b from-blue-50 to-white py-12 md:py-20">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto text-center">
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
							Get in Touch with Us
						</h1>
						<p className="text-lg text-gray-600">
							We&apos;d love to hear from you. Please fill out the form below or
							contact us directly.
						</p>
					</div>
				</div>
			</section>
			<section className="py-12 md:py-16">
				<div className="container mx-auto px-4">
					<div className="flex justify-center items-center">
						<div className="bg-white rounded-lg shadow-md  p-6 md:p-8">
							<h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
							<ContactForm />
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

Home.getLayout = function getLayout(page: React.ReactElement) {
	return <LandingLayout>{page}</LandingLayout>;
};

export default Home;
