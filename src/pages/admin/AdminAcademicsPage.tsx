import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Clock,
  GraduationCap,
  Info,
  Landmark,
  Layers,
  MapPin,
  Pencil,
  ShieldCheck,
} from "lucide-react";
import PageContainer from "../../components/layout/PageContainer";
import { PageHeader, Badge, SectionHeader, EmptyState } from "../../components/shared";
import {
  CAMPUSES,
  STUDY_MODES,
  DEPARTMENTS,
  getProgrammesForDepartment,
  parseStudentId,
} from "../../data/departments";

const EXAMPLE_ID = "BIT/23/BT/NE/004";

const AdminAcademicsPage = () => {
  const [inputId, setInputId] = useState(EXAMPLE_ID);
  const parsed = parseStudentId(inputId);

  const totalProgrammes = DEPARTMENTS.reduce(
    (acc, d) => acc + getProgrammesForDepartment(d._id).length,
    0,
  );

  return (
    <PageContainer title="Academic Structure">
      <div className="space-y-6">
        <PageHeader
          icon={Landmark}
          title="Academic Structure"
          subtitle="Departments, programmes and the student ID scheme used across campuses."
          count={DEPARTMENTS.length}
          actions={
            <Link
              to="/admin/departments"
              className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent"
            >
              <Pencil className="h-4 w-4" /> Manage Departments
            </Link>
          }
        />

        {/* Summary strip */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Departments", value: DEPARTMENTS.length, icon: Building2, accent: "brand" },
            { label: "Programmes", value: totalProgrammes, icon: BookOpen, accent: "indigo" },
            { label: "Campuses", value: CAMPUSES.length, icon: MapPin, accent: "red" },
            { label: "Study Modes", value: STUDY_MODES.length, icon: Layers, accent: "green" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white ${
                      s.accent === "brand"
                        ? "bg-brand-primary"
                        : s.accent === "indigo"
                          ? "bg-indigo-500"
                          : s.accent === "red"
                            ? "bg-brand-red"
                            : "bg-emerald-500"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Student ID decoder */}
        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <SectionHeader
            icon={Info}
            title="Student ID Reference"
            action={
              <Badge variant="outline" className="font-mono">
                PROGRAMME/YEAR/CAMPUS/MODE/SEQ
              </Badge>
            }
          />
          <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Try a student ID
              </label>
              <input
                value={inputId}
                onChange={(e) => setInputId(e.target.value.toUpperCase())}
                placeholder="e.g. BIT/23/BT/NE/004"
                className="h-10 w-full rounded-md border border-input bg-background px-3 font-mono text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              {parsed ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Programme
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {parsed.programmeName}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Entry year
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {parsed.entryYear}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Campus
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {parsed.campusName}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Study mode
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {parsed.modeName}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-destructive">
                  Format: PROGRAMME/ENTRYYEAR/CAMPUS/MODE/SEQ (e.g. BCS/24/HN/PE/001)
                </p>
              )}
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Campuses & study modes</p>
              <div className="space-y-2">
                {CAMPUSES.map((c) => (
                  <div
                    key={c.code}
                    className="flex items-center gap-3 rounded-lg border p-2.5 text-sm"
                  >
                    <span className="flex h-7 w-9 items-center justify-center rounded-md bg-brand-primary/10 font-mono text-xs font-bold text-brand-primary">
                      {c.code}
                    </span>
                    <span className="text-foreground">{c.name}</span>
                  </div>
                ))}
                {STUDY_MODES.map((m) => (
                  <div
                    key={m.code}
                    className="flex items-center gap-3 rounded-lg border p-2.5 text-sm"
                  >
                    <span className="flex h-7 w-9 items-center justify-center rounded-md bg-brand-red/10 font-mono text-xs font-bold text-brand-red">
                      {m.code}
                    </span>
                    <span className="text-foreground">{m.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Departments grid */}
        {DEPARTMENTS.length === 0 ? (
          <EmptyState
            icon={Landmark}
            title="No departments configured"
            description="Add departments to begin structuring your academic programmes."
            action={
              <Link
                to="/admin/departments"
                className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-primaryLight"
              >
                Create Department
              </Link>
            }
          />
        ) : (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {DEPARTMENTS.map((dept) => {
              const programmes = getProgrammesForDepartment(dept._id);
              return (
                <div
                  key={dept._id}
                  className="flex flex-col rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="border-b p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary text-sm font-bold text-white">
                        {dept.code}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground">{dept.name}</h3>
                        <Badge variant="success" className="mt-0.5">
                          {programmes.length} programme{programmes.length === 1 ? "" : "s"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-5">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {dept.description}
                    </p>
                    <div className="mt-4 space-y-2">
                      {programmes.map((p) => (
                        <div
                          key={p.code}
                          className="flex items-center justify-between rounded-lg border px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="font-mono text-xs font-bold text-brand-primary">
                              {p.code}
                            </p>
                            <p className="truncate text-sm text-foreground">{p.name}</p>
                          </div>
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                            <Clock className="h-3 w-3" /> {p.duration} yrs
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link
                    to="/admin/departments"
                    className="flex items-center justify-center gap-1.5 border-t p-3 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary/5"
                  >
                    <GraduationCap className="h-4 w-4" /> Edit department
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </section>
        )}

        {/* Data integrity note */}
        <section className="flex items-start gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-5 text-sm text-brand-primaryDark">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" />
          <p>
            Registration validates student IDs against this scheme before creating an
            account. Students provide their official ID during signup; programme,
            campus and entry mode are decoded automatically.
          </p>
        </section>
      </div>
    </PageContainer>
  );
};

export default AdminAcademicsPage;