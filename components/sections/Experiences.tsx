import { siteData } from "@/content/siteData";
import { Section } from "@/components/ui/Section";

function getFaviconUrl(companyUrl: string): string | null {
  try {
    const domain = new URL(companyUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return null;
  }
}

const MONTHS: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

/** Parse "Jul 2025 – Present" or "Aug 2024 – Jul 2025" into sortable keys and display parts. */
function parseTimeframe(tf: string): { startKey: number; endKey: number; startDisplay: string; endDisplay: string } | null {
  const match = tf.match(/^(\w{3})\s+(\d{4})\s*[–-]\s*(\w{3}\s+\d{4}|Present)$/);
  if (!match) return null;
  const [, startMonth, startYear, endPart] = match;
  const startM = MONTHS[startMonth as keyof typeof MONTHS];
  const startY = parseInt(startYear, 10);
  const startKey = startY * 100 + (startM ?? 0);
  const startDisplay = `${startMonth} ${startYear}`;
  let endKey: number;
  let endDisplay: string;
  if (endPart === "Present") {
    endKey = 999912;
    endDisplay = "Present";
  } else {
    const [endMonth, endYear] = endPart.trim().split(/\s+/);
    const endM = MONTHS[endMonth as keyof typeof MONTHS];
    const endY = parseInt(endYear, 10);
    endKey = endY * 100 + (endM ?? 0);
    endDisplay = `${endMonth} ${endYear}`;
  }
  return { startKey, endKey, startDisplay, endDisplay };
}

/** Return one timeframe string spanning earliest start to latest end across all roles. */
function getEarliestLatestTimeframe(roles: { timeframe: string }[]): string {
  let earliestStart = 999912;
  let latestEnd = 0;
  let earliestDisplay = "";
  let latestDisplay = "";
  for (const r of roles) {
    const p = parseTimeframe(r.timeframe);
    if (!p) continue;
    if (p.startKey < earliestStart) {
      earliestStart = p.startKey;
      earliestDisplay = p.startDisplay;
    }
    if (p.endKey > latestEnd) {
      latestEnd = p.endKey;
      latestDisplay = p.endDisplay;
    }
  }
  if (earliestDisplay === "" && latestDisplay === "") {
    return roles[0]?.timeframe ?? "";
  }
  return `${earliestDisplay} – ${latestDisplay}`;
}

/** Group experiences by company (and timelineGroup when set); order by first occurrence in list. */
function groupByCompany(
  experiences: typeof siteData.experiences
): { company: string; companyUrl?: string; companyLogo?: string; roles: typeof siteData.experiences }[] {
  const map = new Map<
    string,
    { company: string; companyUrl?: string; companyLogo?: string; roles: typeof siteData.experiences }
  >();
  const order: string[] = [];

  for (const exp of experiences) {
    const groupKey = exp.timelineGroup != null ? `${exp.company}|${exp.timelineGroup}` : exp.company;
    if (!map.has(groupKey)) {
      order.push(groupKey);
      map.set(groupKey, {
        company: exp.company,
        companyUrl: exp.companyUrl,
        companyLogo: exp.companyLogo,
        roles: [],
      });
    }
    map.get(groupKey)!.roles.push(exp);
  }

  return order.map((key) => map.get(key)!);
}

function TimelineNode() {
  return (
    <div className="flex flex-col items-center justify-center shrink-0">
      <span
        className="h-3 w-3 rounded-full border-2 border-accent bg-surface"
        aria-hidden
      />
    </div>
  );
}

function CompanyCard({
  company,
  companyUrl,
  companyLogo,
  roles,
  isFeatured,
}: {
  company: string;
  companyUrl?: string;
  companyLogo?: string;
  roles: (typeof siteData.experiences)[0][];
  isFeatured: boolean;
}) {
  const logoUrl =
    companyLogo ?? (companyUrl ? getFaviconUrl(companyUrl) : null);

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 text-body font-semibold text-text">{company}</h3>
        {logoUrl && (
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-white p-0.5"
            aria-hidden
          >
            <img
              src={logoUrl}
              alt=""
              width={20}
              height={20}
              className="h-full w-full object-contain"
            />
          </span>
        )}
      </div>
      <ul className="mt-2 space-y-1.5" role="list">
        {roles.map((role, i) => (
          <li
            key={i}
            className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0 text-body-sm"
          >
            <span className="text-text-muted">{role.title}</span>
            <span className="shrink-0 text-caption text-text-subtle">
              {role.timeframe}
            </span>
          </li>
        ))}
      </ul>
    </>
  );

  if (isFeatured) {
    return (
      <div className="exp-featured-outer h-full min-h-[120px]">
        <div className="exp-gradient-border h-full min-h-[120px]">
          <article className="exp-gradient-border-inner flex h-full flex-col p-4 transition hover:bg-surface-hover">
            {content}
          </article>
        </div>
      </div>
    );
  }

  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-surface p-4 shadow-sm transition hover:border-border hover:bg-surface-hover">
      {content}
    </article>
  );
}

export function Experiences() {
  const groups = groupByCompany(siteData.experiences);

  return (
    <Section
      id="experience"
      title="Experience timeline"
      headerClassName="md:text-center"
      titleClassName="text-2xl md:text-3xl font-bold text-text dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
    >
      <div className="relative md:mx-auto md:max-w-4xl">
        {/* Vertical line – through node center on mobile, page center on desktop */}
        <div
          className="absolute left-[1.125rem] top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px"
          aria-hidden
        />

        <ul className="relative space-y-8 md:space-y-12" role="list">
          {groups.map((group, i) => {
            const isLeft = i % 2 === 0;
            const nodeTimeframe =
              group.roles.length > 0 ? getEarliestLatestTimeframe(group.roles) : "";

            return (
              <li
                key={group.company}
                className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] grid-rows-[auto_auto] gap-x-4 gap-y-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-x-6 md:gap-y-4"
              >
                {/* Row 1: DateTime pill – timeline line goes through the left of the pill */}
                <div className="col-span-2 col-start-1 row-start-1 flex md:col-span-1 md:col-start-2 md:col-end-3">
                  <span className="whitespace-nowrap rounded-md border border-border bg-surface px-2 py-0.5 text-caption font-medium text-text-muted">
                    {nodeTimeframe}
                  </span>
                </div>

                {/* Row 2: Node | Employment card – dot top aligned with card content (h3) via same padding as card */}
                <div
                  className={`col-start-1 row-start-2 flex justify-center md:col-start-2 md:px-2 ${
                    i === 0 ? "pt-[calc(1rem+2px)] md:pt-[calc(1rem+2px)]" : "pt-4 md:pt-4"
                  }`}
                >
                  <TimelineNode />
                </div>

                <div
                  className={`col-start-2 row-start-2 flex min-w-0 items-start pl-0 md:pl-0 ${
                    isLeft
                      ? "md:col-start-1 md:pr-6"
                      : "md:col-start-3 md:pl-6"
                  } ${i > 0 ? "pl-4 md:pl-6 md:ml-[1.25rem]" : ""}`}
                >
                  <div className={`max-w-sm ${i > 0 ? "w-[21rem]" : ""} ${isLeft ? "md:ml-auto" : ""}`}>
                    <CompanyCard
                      company={group.company}
                      companyUrl={group.companyUrl}
                      companyLogo={group.companyLogo}
                      roles={group.roles}
                      isFeatured={i === 0}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
