import "@/styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import type { AppProps } from "next/app";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import theme from "@/styles/theme";

import type { NextPageWithLayout } from "@/types/common";

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

const App = ({
	Component,
	pageProps: { ...pageProps },
}: AppPropsWithLayout) => {
	const getLayout = Component.getLayout ?? ((page) => page);

	return (
		<>
			<ColorSchemeScript defaultColorScheme="dark" />
			<MantineProvider theme={theme} defaultColorScheme="dark">
				<Notifications />
				{getLayout(<Component {...pageProps} />)}
			</MantineProvider>
		</>
	);
};

export default App;
