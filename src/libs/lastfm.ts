export interface LastFmImage {
	size: string;
	"#text": string;
}

export interface LastFmTrack {
	name: string;
	url: string;
	artist: { "#text": string };
	image: LastFmImage[];
	date?: { uts: string; "#text": string };
	"@attr"?: { nowplaying?: "true" | "false" };
}

interface LastFmRecentTracksResponse {
	recenttracks?: { track: LastFmTrack | LastFmTrack[] };
	error?: number;
	message?: string;
}

export const LASTFM_USERNAME = "vampwh0re";
const LASTFM_API_KEY = "d992d2ae7800a2196cc74be0df16d23c";
const LASTFM_ENDPOINT = "https://ws.audioscrobbler.com/2.0/";
const IMAGE_SIZE_PRIORITY = ["extralarge", "large", "medium", "small"];

export function getImageUrl(track: LastFmTrack): string {
	if (!track.image) return "";
	for (const size of IMAGE_SIZE_PRIORITY) {
		const source = track.image.find((image) => image.size === size)?.["#text"];
		if (source) return source;
	}
	return "";
}

export function formatTime(uts: string): string {
	const date = new Date(Number(uts) * 1000);
	const isToday = date.toDateString() === new Date().toDateString();
	return isToday
		? date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
		: date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function isNowPlaying(track: LastFmTrack): boolean {
	return track["@attr"]?.nowplaying === "true";
}

export async function fetchRecentTracks(limit = 5): Promise<LastFmTrack[]> {
	const url = new URL(LASTFM_ENDPOINT);
	url.search = new URLSearchParams({
		method: "user.getrecenttracks",
		user: LASTFM_USERNAME,
		api_key: LASTFM_API_KEY,
		limit: String(limit),
		format: "json",
	}).toString();

	const res = await fetch(url);
	if (!res.ok) throw new Error(`Last.fm responded with ${res.status}`);

	const data: LastFmRecentTracksResponse = await res.json();
	if (data.error) throw new Error(data.message ?? "Last.fm API error");

	const track = data.recenttracks?.track ?? [];
	let tracks = Array.isArray(track) ? track : [track];

	if (tracks.length > 1 && isNowPlaying(tracks[0])) {
		const currentTrack = tracks[0];
		const nextTrack = tracks[1];
		const isSameName =
			currentTrack.name.toLowerCase() === nextTrack.name.toLowerCase();
		const isSameArtist =
			(currentTrack.artist?.["#text"] ?? "").toLowerCase() ===
			(nextTrack.artist?.["#text"] ?? "").toLowerCase();

		if (isSameName && isSameArtist) {
			tracks = [currentTrack, ...tracks.slice(2)];
		}
	}

	return tracks;
}
