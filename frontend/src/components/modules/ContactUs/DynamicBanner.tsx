import React, { useState, useEffect } from "react";
import Image from "next/image";
import { mediaService } from "@/services/media.service";

interface DynamicBannerProps {
	fallbackImage?: string;
	alt?: string;
	className?: string;
}

const DynamicBanner: React.FC<DynamicBannerProps> = ({
	fallbackImage = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
	alt = "Contact us banner",
	className = "",
}) => {
	const [bannerImage, setBannerImage] = useState<string | null>(null);

	useEffect(() => {
		const fetchCurrentBanner = async () => {
			try {
				const banner = await mediaService.getBanner();
				if (banner) {
					setBannerImage(banner.url);
				}
			} catch (error) {
				console.error("Error fetching current banner:", error);
			}
		};

		fetchCurrentBanner();
	}, []);

	const imageToUse = bannerImage || fallbackImage;

	return (
		<div className={`w-full h-48 md:h-96 overflow-hidden ${className}`}>
			<Image
				height={1000}
				width={1000}
				src={imageToUse}
				alt={alt}
				className="w-full h-full object-cover"
			/>
		</div>
	);
};

export default DynamicBanner;
