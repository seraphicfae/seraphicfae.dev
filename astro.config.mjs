// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	site: "https://seraphicfae.dev",
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [icon(), mdx(), sitemap()],
	image: {
		remotePatterns: [
			{ protocol: "https", hostname: "avatars.githubusercontent.com" },
			{
				protocol: "https",
				hostname: "omegasunkey.pages.dev",
			},
			{
				protocol: "https",
				hostname: "cdn.discordapp.com",
			},
			{
				protocol: "https",
				hostname: "lastfm.freetls.fastly.net",
			},
		],
	},
});
