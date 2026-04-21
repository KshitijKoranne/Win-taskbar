import * as si from "simple-icons";

export type LibraryIcon = {
  id: string;
  name: string;
  svgDataUri: string;
  color: string;
  category: "microsoft" | "browser" | "dev" | "creative" | "social" | "media" | "productivity" | "gaming";
};

function encode(svg: string): string {
  return `data:image/svg+xml;base64,${typeof window === "undefined" ? Buffer.from(svg).toString("base64") : btoa(unescape(encodeURIComponent(svg)))}`;
}

function siToUri(icon: { svg: string; hex: string }, forceWhite = false): string {
  const fill = forceWhite ? "ffffff" : icon.hex;
  return encode(icon.svg.replace("<svg ", `<svg fill="#${fill}" `));
}

// Microsoft Office — MIT (sempostma/office365-icons)
const MS_APPS: LibraryIcon[] = [
  { id: "ms-word",       name: "Word",       svgDataUri: "/ms-icons/word.svg",       color: "#2B579A", category: "microsoft" },
  { id: "ms-excel",      name: "Excel",      svgDataUri: "/ms-icons/excel.svg",      color: "#217346", category: "microsoft" },
  { id: "ms-powerpoint", name: "PowerPoint", svgDataUri: "/ms-icons/powerpoint.svg", color: "#B7472A", category: "microsoft" },
  { id: "ms-outlook",    name: "Outlook",    svgDataUri: "/ms-icons/outlook.svg",    color: "#0078D4", category: "microsoft" },
  { id: "ms-teams",      name: "Teams",      svgDataUri: "/ms-icons/teams.svg",      color: "#6264A7", category: "microsoft" },
  { id: "ms-onedrive",   name: "OneDrive",   svgDataUri: "/ms-icons/onedrive.svg",   color: "#0078D4", category: "microsoft" },
  { id: "ms-onenote",    name: "OneNote",    svgDataUri: "/ms-icons/onenote.svg",    color: "#7719AA", category: "microsoft" },
  { id: "ms-sharepoint", name: "SharePoint", svgDataUri: "/ms-icons/sharepoint.svg", color: "#036C70", category: "microsoft" },
];

// Browser icons — official colorful PNGs from cdnjs browser-logos (MIT)
const BROWSER_ICONS: LibraryIcon[] = [
  { id: "browser-chrome",  name: "Chrome",  svgDataUri: "/browser-icons/chrome.png",  color: "#4285F4", category: "browser" },
  { id: "browser-firefox", name: "Firefox", svgDataUri: "/browser-icons/firefox.png", color: "#FF7139", category: "browser" },
  { id: "browser-edge",    name: "Edge",    svgDataUri: "/browser-icons/edge.png",    color: "#0078D4", category: "browser" },
  { id: "browser-brave",   name: "Brave",   svgDataUri: "/browser-icons/brave.png",   color: "#FB542B", category: "browser" },
  { id: "browser-opera",   name: "Opera",   svgDataUri: "/browser-icons/opera.png",   color: "#FF1B2D", category: "browser" },
];

type SiEntry = { slug: string; name: string; whiteOnly?: boolean; category: LibraryIcon["category"] };

const SI_APPS: SiEntry[] = [
  // Browser
  { slug: "siArc",               name: "Arc",          whiteOnly: true, category: "browser" },
  { slug: "siSafari",            name: "Safari",                        category: "browser" },
  // Dev
  { slug: "siVscodium",          name: "VS Code",                       category: "dev" },
  { slug: "siGithub",            name: "GitHub",       whiteOnly: true, category: "dev" },
  { slug: "siGit",               name: "Git",                           category: "dev" },
  { slug: "siDocker",            name: "Docker",                        category: "dev" },
  { slug: "siPostman",           name: "Postman",                       category: "dev" },
  { slug: "siIntellijidea",      name: "IntelliJ",     whiteOnly: true, category: "dev" },
  // Creative
  { slug: "siFigma",             name: "Figma",                         category: "creative" },
  { slug: "siAdobephotoshop",    name: "Photoshop",                     category: "creative" },
  { slug: "siAdobeillustrator",  name: "Illustrator",                   category: "creative" },
  { slug: "siAdobepremierepro",  name: "Premiere",                      category: "creative" },
  { slug: "siAdobelightroom",    name: "Lightroom",                     category: "creative" },
  { slug: "siAdobeaftereffects", name: "After Effects",                 category: "creative" },
  { slug: "siBlender",           name: "Blender",                       category: "creative" },
  { slug: "siCanva",             name: "Canva",                         category: "creative" },
  // Social
  { slug: "siDiscord",           name: "Discord",                       category: "social" },
  { slug: "siSlack",             name: "Slack",                         category: "social" },
  { slug: "siWhatsapp",          name: "WhatsApp",                      category: "social" },
  { slug: "siTelegram",          name: "Telegram",                      category: "social" },
  { slug: "siX",                 name: "X",            whiteOnly: true, category: "social" },
  { slug: "siInstagram",         name: "Instagram",                     category: "social" },
  { slug: "siFacebook",          name: "Facebook",                      category: "social" },
  { slug: "siLinkedin",          name: "LinkedIn",                      category: "social" },
  { slug: "siReddit",            name: "Reddit",                        category: "social" },
  { slug: "siSignal",            name: "Signal",                        category: "social" },
  { slug: "siZoom",              name: "Zoom",                          category: "social" },
  // Media
  { slug: "siSpotify",           name: "Spotify",                       category: "media" },
  { slug: "siYoutube",           name: "YouTube",                       category: "media" },
  { slug: "siNetflix",           name: "Netflix",                       category: "media" },
  { slug: "siVlcmediaplayer",    name: "VLC",                           category: "media" },
  { slug: "siObsstudio",         name: "OBS",                           category: "media" },
  { slug: "siPrimevideo",        name: "Prime Video",                   category: "media" },
  { slug: "siAppletv",           name: "Apple TV",     whiteOnly: true, category: "media" },
  // Productivity
  { slug: "siGmail",             name: "Gmail",                         category: "productivity" },
  { slug: "siGoogledrive",       name: "Drive",                         category: "productivity" },
  { slug: "siDropbox",           name: "Dropbox",                       category: "productivity" },
  { slug: "siGooglecalendar",    name: "Calendar",                      category: "productivity" },
  { slug: "siNotion",            name: "Notion",       whiteOnly: true, category: "productivity" },
  { slug: "siObsidian",          name: "Obsidian",                      category: "productivity" },
  { slug: "siTodoist",           name: "Todoist",                       category: "productivity" },
  { slug: "siTrello",            name: "Trello",                        category: "productivity" },
  { slug: "siEvernote",          name: "Evernote",                      category: "productivity" },
  // Gaming
  { slug: "siSteam",             name: "Steam",        whiteOnly: true, category: "gaming" },
  { slug: "siEpicgames",         name: "Epic",         whiteOnly: true, category: "gaming" },
  { slug: "siGogdotcom",         name: "GOG",          whiteOnly: true, category: "gaming" },
  { slug: "siRiotgames",         name: "Riot",                          category: "gaming" },
  { slug: "siTwitch",            name: "Twitch",                        category: "gaming" },
];

const SI_ICONS: LibraryIcon[] = SI_APPS
  .map(({ slug, name, whiteOnly, category }) => {
    // @ts-expect-error - dynamic access
    const icon = si[slug];
    if (!icon) return null;
    return { id: slug, name, color: `#${icon.hex}`, svgDataUri: siToUri(icon, whiteOnly), category } as LibraryIcon;
  })
  .filter(Boolean) as LibraryIcon[];

export const ICON_LIBRARY: LibraryIcon[] = [...MS_APPS, ...BROWSER_ICONS, ...SI_ICONS];

export const CATEGORIES: { key: LibraryIcon["category"]; label: string }[] = [
  { key: "microsoft",   label: "Microsoft" },
  { key: "browser",     label: "Browsers" },
  { key: "productivity",label: "Productivity" },
  { key: "dev",         label: "Dev" },
  { key: "creative",    label: "Creative" },
  { key: "social",      label: "Social" },
  { key: "media",       label: "Media" },
  { key: "gaming",      label: "Gaming" },
];
