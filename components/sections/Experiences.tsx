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

function TimelineNode({ timeframe }: { timeframe: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0">
      <span className="rounded-md border border-border bg-surface px-2 py-0.5 text-caption font-medium text-text-muted">
        {timeframe}
      </span>
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
    <Section id="experience" title="Experience">
      <div className="relative">
        {/* Vertical line – through node center on mobile, page center on desktop */}
        <div
          className="absolute left-[1.125rem] top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px"
          aria-hidden
        />

        <ul className="relative space-y-8 md:space-y-12" role="list">
          {groups.map((group, i) => {
            const isLeft = i % 2 === 0;
            const nodeTimeframe =
              group.roles.length > 0 ? group.roles[0].timeframe : "";

            return (
              <li
                key={group.company}
                className="relative grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-x-6"
              >
                <div className="col-start-1 row-start-1 flex justify-center pt-1 md:col-start-2 md:px-2">
                  <TimelineNode timeframe={nodeTimeframe} />
                </div>

                <div
                  className={`col-start-2 row-start-1 min-w-0 pl-0 md:pl-0 ${
                    isLeft
                      ? "md:col-start-1 md:pr-6"
                      : "md:col-start-3 md:pl-6"
                  }`}
                >
                  <div className={`max-w-sm ${isLeft ? "md:ml-auto" : ""}`}>
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
