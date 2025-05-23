import { cn } from "@/utils/helper";
import { AppShell, AppShellProps, Burger, Button } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const navigation = [
	{ name: "Home", href: "#" },
	{ name: "About", href: "#about" },
	{ name: "Services", href: "#services" },
	{ name: "Contact", href: "#contact" },
];

const LandingLayout: React.FC<AppShellProps> = ({ children, ...props }) => {
	const [sidebar, setSidebar] = useState(false);
	const router = useRouter();

	const closeMenu = () => setSidebar(false);

	return (
		<AppShell
			{...props}
			header={{ height: 70, collapsed: false }}
			navbar={{
				width: 10,
				breakpoint: "md",
				collapsed: { desktop: true, mobile: !sidebar },
			}}
		>
			<AppShell.Header className="bg-white shadow-sm">
				<nav className="container mx-auto px-4 md:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">Logo</div>

						<div className="hidden md:flex md:space-x-8">
							{navigation.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									data-active={router.pathname === item.href}
									className={cn(
										"text-base text-gray-800 font-medium transition-colors hover:text-primary data-[active=true]:text-primary"
									)}
								>
									{item.name}
								</Link>
							))}
						</div>

						<div className="hidden md:block">
							<Button size="sm">Get Started</Button>
						</div>

						<div className="flex md:hidden">
							<Burger
								opened={sidebar}
								aria-label="Open main menu"
								className="text-gray-700"
								onClick={() => setSidebar(!sidebar)}
							/>
						</div>
					</div>
				</nav>
			</AppShell.Header>
			<AppShell.Navbar>
				<div className="md:hidden">
					<div className="space-y-1 px-4 py-3 bg-white border-t flex flex-col">
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								data-active={router.pathname === item.href}
								className={cn(
									"text-base text-gray-800 font-medium transition-colors hover:text-primary data-[active=true]:text-primary"
								)}
								onClick={closeMenu}
							>
								{item.name}
							</Link>
						))}
						<div className="pt-2">
							<Button size="sm" className="w-full">
								Get Started
							</Button>
						</div>
					</div>
				</div>
			</AppShell.Navbar>
			<AppShell.Main>{children}</AppShell.Main>
		</AppShell>
	);
};

export default LandingLayout;
