"use client";
import {
  Group,
  Text,
  Num,
  Check,
  Pick,
  StringList,
  List,
  Media,
  MultiPhotos,
} from "./fields";
import StoragePanel from "./StoragePanel";
import AnalyticsPanel from "./AnalyticsPanel";

const TONES = [
  "caramel",
  "caramel/80",
  "caramel/70",
  "caramel/60",
  "cocoa",
  "gold",
  "cream/70",
  "cream/50",
];
const MEDIA_HINT = "Image or video. Videos: 720p and under 15MB is plenty.";

function General() {
  return (
    <>
      <Group
        title="Basic info"
        hint="Used for the browser tab, Google and social previews."
      >
        <Text path="site.name" label="Your name" />
        <Text
          path="site.title"
          label="Page title (SEO)"
          hint="Around 60 characters."
        />
        <Text
          path="site.description"
          label="Description (SEO)"
          multiline
          hint="Around 150 characters."
        />
        <StringList path="site.keywords" label="Keywords" max={20} />
        <Text path="site.jobTitle" label="Job title" />
        <Text
          path="site.url"
          label="Website address"
          placeholder="https://yourname.com"
        />
      </Group>
      <Group title="Contact & social links">
        <Text path="site.email" label="Email" />
        <Text path="site.phone" label="Phone number" />
        <Text
          path="site.wa"
          label="WhatsApp number"
          hint="Digits only, with country code. Example: 201201724499"
        />
        <Text
          path="site.instagram"
          label="Instagram link"
          placeholder="https://…"
        />
        <Text path="site.tiktok" label="TikTok link" placeholder="https://…" />
        <Text
          path="site.facebook"
          label="Facebook link"
          placeholder="https://…"
        />
        <Text
          path="site.drive"
          label="Google Drive link"
          placeholder="https://…"
        />
      </Group>
      <Group
        title="Share images"
        hint="What people see when the link is shared."
      >
        <Media
          path="seo.og"
          label="Social preview (1200×630)"
          maxW={1200}
          format="jpeg"
        />
        <Media
          path="seo.favicon"
          label="Favicon (square)"
          maxW={256}
          format="png"
          alpha
        />
        <Media
          path="seo.apple"
          label="Apple touch icon (180×180)"
          maxW={180}
          format="png"
        />
      </Group>
    </>
  );
}

function Header() {
  return (
    <>
      <Group title="Header">
        <Text path="header.tagline" label="Tagline under your name (mobile)" />
        <Text path="header.cta.label" label="Top-right button text (laptop)" />
        <Text
          path="header.cta.href"
          label="Top-right button link"
          hint="Example: #contact"
        />
      </Group>
      <Group
        title="Menu links"
        hint="The id must match a section on the page (about, content, reels, ugc, interviews, model, process, contact)."
      >
        <List
          path="nav"
          label="Links"
          max={12}
          make={() => ({ id: "", label: "" })}
          title={(it) => it.label || "New link"}
        >
          {(p) => (
            <>
              <Text path={`${p}.label`} label="Label" />
              <Text path={`${p}.id`} label="Section id" />
            </>
          )}
        </List>
      </Group>
    </>
  );
}

function Hero() {
  return (
    <>
      <Group title="Hero">
        <Media
          path="hero.image"
          label="Main photo"
          maxW={1600}
          hint="This is the first thing visitors see. Use a sharp portrait photo."
        />
        <Text
          path="hero.imageAlt"
          label="Photo description (for accessibility & SEO)"
        />
        <Text path="hero.title" label="Headline" multiline rows={2} />
        <Text path="hero.subtitle" label="Sub headline" multiline rows={2} />
        <Text path="hero.primaryCta.label" label="Main button text" />
        <Text
          path="hero.primaryCta.href"
          label="Main button link"
          hint="Example: #content"
        />
        <Text path="hero.secondaryCta.label" label="WhatsApp button text" />
      </Group>
      <Group
        title="Round icon buttons"
        hint="Each one scrolls to the section with the same id."
      >
        <List
          path="hero.tiles"
          label="Icons"
          max={8}
          make={() => ({ id: "", label: "", icon: "book" })}
          title={(it) => it.label || "New icon"}
        >
          {(p) => (
            <>
              <Text path={`${p}.label`} label="Label" />
              <Text path={`${p}.id`} label="Section id" />
              <Pick
                path={`${p}.icon`}
                label="Icon"
                options={["book", "scissors", "bag", "mic", "camera"]}
              />
            </>
          )}
        </List>
      </Group>
    </>
  );
}

function Brands() {
  return (
    <Group title="Brands strip">
      <Text path="brands.title" label="Title" />
      <List
        path="brands.logos"
        label="Logos"
        max={40}
        make={() => ({ src: "", name: "" })}
        title={(it) => it.name || "New logo"}
      >
        {(p) => (
          <>
            <Media
              path={`${p}.src`}
              label="Logo"
              maxW={256}
              alpha
              hint="Square logo, PNG with transparent background works best."
            />
            <Text path={`${p}.name`} label="Brand name" />
          </>
        )}
      </List>
    </Group>
  );
}

function About() {
  return (
    <Group title="About">
      <Text path="about.title" label="Script title" />
      <Text path="about.heading" label="Heading" multiline rows={2} />
      <Text path="about.text" label="Paragraph" multiline rows={6} />
    </Group>
  );
}

function ContentCreator() {
  return (
    <>
      <Group title="Content creator">
        <Text path="contentCreator.title" label="Title" />
        <Text path="contentCreator.sub" label="Sub title" multiline rows={2} />
        <StringList path="contentCreator.skills" label="Skills list" max={20} />
      </Group>
      <Group title="Production draft card">
        <Text path="contentCreator.draft.label" label="Small label" />
        <Text path="contentCreator.draft.total" label="Total time" />
        <Text path="contentCreator.draft.title" label="Script title" />
        <List
          path="contentCreator.draft.rows"
          label="Rows"
          max={8}
          make={() => ({ time: "", label: "", text: "", highlight: false })}
          title={(it) => it.label || "New row"}
        >
          {(p) => (
            <>
              <Text path={`${p}.time`} label="Time" />
              <Text path={`${p}.label`} label="Label" />
              <Text path={`${p}.text`} label="Text" />
              <Check path={`${p}.highlight`} label="Highlight this row" />
            </>
          )}
        </List>
      </Group>
      <Group title="Calendar card">
        <Text path="contentCreator.calendar.caption" label="Caption" />
        <List
          path="contentCreator.calendar.days"
          label="Days"
          max={7}
          make={() => ({ day: "", type: "", tone: "caramel" })}
          title={(it) => it.day || "New day"}
        >
          {(p) => (
            <>
              <Text path={`${p}.day`} label="Day" />
              <Text path={`${p}.type`} label="Type" />
              <Pick
                path={`${p}.tone`}
                label="Dot colour"
                options={["caramel", "gold", "mocha"]}
              />
            </>
          )}
        </List>
      </Group>
    </>
  );
}

function ReelEditor() {
  return (
    <>
      <Group title="Reel editor">
        <Text path="reelEditor.title" label="Title" />
        <Text path="reelEditor.sub" label="Sub title" multiline rows={2} />
      </Group>
      <Group title="Reels" hint="Upload a video or an image for each reel.">
        <List
          path="reelEditor.items"
          label="Reels"
          max={12}
          make={() => ({ src: "", poster: "", title: "", views: "" })}
          title={(it) => it.title || "New reel"}
        >
          {(p) => (
            <>
              <Media
                path={`${p}.src`}
                posterPath={`${p}.poster`}
                allow="any"
                maxW={900}
                hint={MEDIA_HINT}
              />
              <Text path={`${p}.title`} label="Text on the video" />
              <Text path={`${p}.views`} label="Views" hint="Example: 162k" />
            </>
          )}
        </List>
      </Group>
      <Group
        title="Timeline card"
        hint="Decorative editing timeline. Width is relative; colours come from a fixed palette."
      >
        <Text path="reelEditor.timeline.label" label="Left label" />
        <Text path="reelEditor.timeline.marker" label="Right label" />
        <Text path="reelEditor.timeline.playheadLabel" label="Playhead label" />
        <List
          path="reelEditor.timeline.tracks"
          label="Tracks"
          max={5}
          make={() => ({
            segments: [{ flex: 30, tone: "caramel", label: "" }],
          })}
          title={(_, i) => `Track ${i + 1}`}
        >
          {(tp) => (
            <List
              path={`${tp}.segments`}
              label="Segments"
              max={8}
              make={() => ({ flex: 20, tone: "caramel", label: "" })}
              title={(it, i) => it.label || `Segment ${i + 1}`}
            >
              {(p) => (
                <>
                  <Num
                    path={`${p}.flex`}
                    label="Width (1-100)"
                    min={1}
                    max={100}
                  />
                  <Pick path={`${p}.tone`} label="Colour" options={TONES} />
                  <Text path={`${p}.label`} label="Text (optional)" />
                </>
              )}
            </List>
          )}
        </List>
      </Group>
      <Group title="Feature rows">
        <List
          path="reelEditor.features"
          label="Rows"
          max={8}
          make={() => ({ title: "", note: "" })}
          title={(it) => it.title || "New row"}
        >
          {(p) => (
            <>
              <Text path={`${p}.title`} label="Title" />
              <Text path={`${p}.note`} label="Right-side note" />
            </>
          )}
        </List>
      </Group>
    </>
  );
}

function Ugc() {
  return (
    <>
      <Group title="UGC creator">
        <Text path="ugc.title" label="Title" />
        <Text path="ugc.sub" label="Sub title" multiline rows={2} />
      </Group>
      <Group
        title="Videos"
        hint="The middle one plays automatically (muted) when the section is visible."
      >
        <List
          path="ugc.items"
          label="Videos"
          max={12}
          make={() => ({ src: "", poster: "", views: "" })}
          title={(it, i) =>
            `Video ${i + 1}${it.views ? ` · ${it.views} views` : ""}`
          }
        >
          {(p) => (
            <>
              <Media
                path={`${p}.src`}
                posterPath={`${p}.poster`}
                allow="any"
                maxW={900}
                hint={MEDIA_HINT}
              />
              <Text path={`${p}.views`} label="Views" hint="Example: 120k" />
            </>
          )}
        </List>
      </Group>
      <Group title="Categories">
        <List
          path="ugc.categories"
          label="Categories"
          max={4}
          make={() => ({ title: "", text: "" })}
          title={(it) => it.title || "New category"}
        >
          {(p) => (
            <>
              <Text path={`${p}.title`} label="Title" />
              <Text path={`${p}.text`} label="Description" />
            </>
          )}
        </List>
      </Group>
    </>
  );
}

function Interviewer() {
  return (
    <>
      <Group title="Interviewer">
        <Text path="interviewer.title" label="Title" />
        <Text path="interviewer.sub" label="Sub title" multiline rows={2} />
        <Text path="interviewer.quote" label="Script quote" />
        <Num
          path="interviewer.pageSize"
          label="Items shown at first (and per click)"
          min={1}
          max={20}
        />
        <Text path="interviewer.moreLabel" label="Button text" />
      </Group>
      <Group title="Interviews">
        <List
          path="interviewer.items"
          label="Items"
          max={40}
          make={() => ({ src: "", poster: "", title: "", meta: "", tag: "" })}
          title={(it) => it.title || "New interview"}
        >
          {(p) => (
            <>
              <Media
                path={`${p}.src`}
                posterPath={`${p}.poster`}
                allow="any"
                maxW={1000}
                hint={MEDIA_HINT}
              />
              <Text path={`${p}.title`} label="Title" />
              <Text path={`${p}.meta`} label="Small text" />
              <Text path={`${p}.tag`} label="Badge on the video" />
            </>
          )}
        </List>
      </Group>
      <Group title="Details">
        <List
          path="interviewer.points"
          label="Two columns"
          max={4}
          make={() => ({ label: "", text: "" })}
          title={(it) => it.label || "New"}
        >
          {(p) => (
            <>
              <Text path={`${p}.label`} label="Label" />
              <Text path={`${p}.text`} label="Text" multiline rows={2} />
            </>
          )}
        </List>
        <Text path="interviewer.clientsTitle" label="Clients title" />
        <StringList path="interviewer.clients" label="Clients" max={20} />
      </Group>
    </>
  );
}

function Model() {
  return (
    <>
      <Group title="Model">
        <Text path="model.title" label="Title" />
        <Text path="model.sub" label="Sub title" multiline rows={2} />
        <Num
          path="model.pageSize"
          label="Photos shown at first (and per click)"
          min={1}
          max={20}
          hint="The 'Show more' button appears when there are more photos than this."
        />
        <Text path="model.moreLabel" label="Button text" />
      </Group>
      <Group title="Photos" hint="The first photo is the big one.">
        <MultiPhotos
          path="model.photos"
          max={100}
          altPrefix="Eyad Zayed model portfolio photo"
        />
        <List
          path="model.photos"
          label="All photos"
          max={100}
          make={() => ({ src: "", alt: "" })}
          title={(_, i) => `Photo ${i + 1}`}
        >
          {(p) => (
            <>
              <Media path={`${p}.src`} maxW={1600} />
              <Text path={`${p}.alt`} label="Description (for accessibility)" />
            </>
          )}
        </List>
      </Group>
    </>
  );
}

function Process() {
  return (
    <Group title="How we'll work together">
      <Text path="process.title" label="Title" />
      <List
        path="process.steps"
        label="Steps"
        max={8}
        make={() => ({ title: "", text: "" })}
        title={(it, i) => `${i + 1}. ${it.title}`}
      >
        {(p) => (
          <>
            <Text path={`${p}.title`} label="Title" />
            <Text path={`${p}.text`} label="Text" multiline rows={2} />
          </>
        )}
      </List>
    </Group>
  );
}

function Footer() {
  return (
    <Group title="Footer / contact">
      <Text path="footer.title" label="Heading" />
      <Text path="footer.titleScript" label="Heading (script part)" />
      <Text path="footer.sub" label="Sub text" multiline rows={2} />
      <Text path="footer.whatsappLabel" label="WhatsApp button" />
      <Text path="footer.emailLabel" label="Email button prefix" />
      <Text path="footer.callLabel" label="Call button prefix" />
      <Text path="footer.driveLabel" label="Drive link text" />
    </Group>
  );
}

export const SECTIONS = [
  { id: "general", label: "General & SEO", Comp: General },
  { id: "header", label: "Header", Comp: Header },
  { id: "hero", label: "Hero", Comp: Hero },
  { id: "brands", label: "Brands", Comp: Brands },
  { id: "about", label: "About", Comp: About },
  { id: "content", label: "Content creator", Comp: ContentCreator },
  { id: "reels", label: "Reel editor", Comp: ReelEditor },
  { id: "ugc", label: "UGC creator", Comp: Ugc },
  { id: "interviews", label: "Interviewer", Comp: Interviewer },
  { id: "model", label: "Model", Comp: Model },
  { id: "process", label: "Process", Comp: Process },
  { id: "footer", label: "Footer", Comp: Footer },
  { id: "analytics", label: "Analytics", Comp: AnalyticsPanel },
  { id: "storage", label: "Media storage", Comp: StoragePanel },
];
