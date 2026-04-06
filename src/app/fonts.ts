import {
	Bonheur_Royale,
	Cinzel,
	Clicker_Script,
	Great_Vibes,
	Hedvig_Letters_Serif,
	Inter,
	Montserrat,
	Pinyon_Script,
	Playfair_Display,
	Poppins,
} from "next/font/google";

export const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-sans",
});

export const playfair = Playfair_Display({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-display",
});

export const greatVibes = Great_Vibes({
	weight: "400",
	subsets: ["latin"],
	display: "swap",
	variable: "--font-script",
});

// Premium royal invite fonts (scoped per-template via `.variable`)
export const royalSans = Montserrat({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600"],
	display: "swap",
	variable: "--font-sans",
});

export const royalDisplay = Cinzel({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	display: "swap",
	variable: "--font-display",
});

export const royalScript = Pinyon_Script({
	subsets: ["latin"],
	weight: "400",
	display: "swap",
	variable: "--font-script",
});

// Reference-style wedding fonts (scoped per-template via `.variable`)
export const amantrranSans = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	display: "swap",
	variable: "--font-sans",
});

export const amantrranDisplay = Hedvig_Letters_Serif({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-display",
});

export const amantrranScript = Bonheur_Royale({
	subsets: ["latin"],
	weight: "400",
	display: "swap",
	variable: "--font-script",
});

export const amantrranAccent = Clicker_Script({
	subsets: ["latin"],
	weight: "400",
	display: "swap",
});