import { mediaService } from "@/services/media.service";
import { Button, FileButton } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import Image from "next/image";
import React, { useState, useEffect } from "react";

const BannerUpload: React.FC = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [currentBanner, setCurrentBanner] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	// Fetch current banner on component mount
	useEffect(() => {
		const fetchCurrentBanner = async () => {
			try {
				const banner = await mediaService.getBanner();
				if (banner) {
					setCurrentBanner(banner.url);
				}
			} catch (error) {
				console.error("Error fetching current banner:", error);
				showNotification({
					title: "Error",
					message: "Failed to fetch current banner",
					color: "red",
				});
			}
		};

		fetchCurrentBanner();
	}, []);

	const handleFileChange = (file: File | null) => {
		if (!file) {
			setSelectedFile(null);
			setPreviewUrl(null);
			return;
		}

		// Validate file type
		if (!file.type.startsWith("image/")) {
			showNotification({
				title: "Error",
				message: "Please select an image file",
				color: "red",
			});
			return;
		}

		// Validate file size (5MB)
		if (file.size > 5 * 1024 * 1024) {
			showNotification({
				title: "Error",
				message: "File size should be less than 5MB",
				color: "red",
			});
			return;
		}

		setSelectedFile(file);

		// Create a preview URL for the selected image
		const reader = new FileReader();
		reader.onloadend = () => {
			setPreviewUrl(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			showNotification({
				title: "Error",
				message: "Please select an image to upload",
				color: "red",
			});
			return;
		}

		setIsUploading(true);

		try {
			// First upload to Cloudinary
			const cloudinaryResponse = await mediaService.uploadToCloudinary(
				selectedFile
			);

			// Then update the backend with the Cloudinary URL
			await mediaService.updateMediaUrl({
				url: cloudinaryResponse.secure_url,
				filename: cloudinaryResponse.original_filename,
				mimeType: `image/${cloudinaryResponse.format}`,
				size: cloudinaryResponse.bytes,
			});

			showNotification({
				title: "Success",
				message: "Banner Image Updated",
				color: "green",
			});

			// Update the current banner display
			setCurrentBanner(cloudinaryResponse.secure_url);
			setSelectedFile(null);
			setPreviewUrl(null);
		} catch (error) {
			console.error("Error uploading banner:", error);
			showNotification({
				title: "Error",
				message: "Failed to upload banner",
				color: "red",
			});
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="space-y-8">
			<h2 className="text-xl font-semibold">Banner Management</h2>

			{currentBanner && (
				<div className="space-y-4">
					<h3 className="text-lg font-medium">Current Banner</h3>
					<div className="border rounded-md overflow-hidden">
						<Image
							width={1000}
							height={1000}
							src={currentBanner}
							alt="Current banner"
							className="w-full h-64 object-cover"
						/>
					</div>
				</div>
			)}

			<div className="bg-white p-6 rounded-lg shadow-sm border">
				<h3 className="text-lg font-medium mb-4">Upload New Banner</h3>
				<div className="space-y-4 space-x-4">
					<FileButton
						onChange={handleFileChange}
						accept="image/png,image/jpeg, image/webp"
					>
						{(props) => <Button {...props}>Upload image</Button>}
					</FileButton>

					{previewUrl && (
						<div className="mt-4">
							<h4 className="text-md font-medium mb-2">Preview</h4>
							<div className="border rounded-md overflow-hidden">
								<Image
									height={1000}
									width={1000}
									src={previewUrl}
									alt="Preview"
									className="w-full h-64 object-cover"
								/>
							</div>
						</div>
					)}

					<Button
						onClick={handleUpload}
						disabled={!selectedFile || isUploading}
						className="mt-4"
						loading={isUploading}
					>
						Save
					</Button>
				</div>
			</div>
		</div>
	);
};

export default BannerUpload;
