import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { Plus, X } from "lucide-react";

export const Route = createFileRoute("/_app/guides/new")({
  head: () => ({ meta: [{ title: "Create guide · LocalLens" }] }),
  component: NewGuide,
});

function NewGuide() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [bestTimings, setBestTimings] = useState("");
  const [lists, setLists] = useState({
    mustVisit: [""],
    hiddenSpots: [""],
    dos: [""],
    donts: [""],
    tips: [""],
  });

  function update(key: keyof typeof lists, i: number, val: string) {
    const arr = [...lists[key]];
    arr[i] = val;
    setLists({ ...lists, [key]: arr });
  }
  function add(key: keyof typeof lists) {
    setLists({ ...lists, [key]: [...lists[key], ""] });
  }
  function remove(key: keyof typeof lists, i: number) {
    setLists({ ...lists, [key]: lists[key].filter((_, idx) => idx !== i) });
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    // UI-only — wire to backend later
    navigate({ to: "/guides" });
  }

  return (
    <>
      <PageHeader title="Write a guide" subtitle="Share what you'd tell a friend visiting your city." />
      <form onSubmit={save} className="px-6 md:px-10 py-8 max-w-3xl space-y-6">
        <div className="grid md:grid-cols-[1fr_220px] gap-4">
          <Field label="Title">
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My honest guide to ..."
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm"
            />
          </Field>
          <Field label="City">
            <input
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Lisbon"
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm"
            />
          </Field>
        </div>

        <Field label="Best timings">
          <input
            value={bestTimings}
            onChange={(e) => setBestTimings(e.target.value)}
            placeholder="March–May or September. Avoid August heat."
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm"
          />
        </Field>

        <ListEditor
          label="Must visit"
          values={lists.mustVisit}
          onChange={(i, v) => update("mustVisit", i, v)}
          onAdd={() => add("mustVisit")}
          onRemove={(i) => remove("mustVisit", i)}
        />
        <ListEditor
          label="Hidden spots"
          values={lists.hiddenSpots}
          onChange={(i, v) => update("hiddenSpots", i, v)}
          onAdd={() => add("hiddenSpots")}
          onRemove={(i) => remove("hiddenSpots", i)}
        />
        <div className="grid md:grid-cols-2 gap-6">
          <ListEditor
            label="Do's"
            values={lists.dos}
            onChange={(i, v) => update("dos", i, v)}
            onAdd={() => add("dos")}
            onRemove={(i) => remove("dos", i)}
          />
          <ListEditor
            label="Don'ts"
            values={lists.donts}
            onChange={(i, v) => update("donts", i, v)}
            onAdd={() => add("donts")}
            onRemove={(i) => remove("donts", i)}
          />
        </div>
        <ListEditor
          label="Tips"
          values={lists.tips}
          onChange={(i, v) => update("tips", i, v)}
          onAdd={() => add("tips")}
          onRemove={(i) => remove("tips", i)}
        />

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => navigate({ to: "/guides" })}
            className="px-4 py-2 text-sm rounded-md border border-border hover:bg-muted"
          >
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 text-sm rounded-md gradient-ocean text-white">
            Publish guide
          </button>
        </div>
      </form>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-foreground/80 mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function ListEditor({
  label,
  values,
  onChange,
  onAdd,
  onRemove,
}: {
  label: string;
  values: string[];
  onChange: (i: number, v: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-foreground/80 mb-2">{label}</p>
      <div className="space-y-2">
        {values.map((val, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={val}
              onChange={(e) => onChange(i, e.target.value)}
              placeholder={`${label} #${i + 1}`}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {values.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="px-2 rounded-md border border-border text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-2 inline-flex items-center gap-1 text-xs text-teal hover:underline"
      >
        <Plus className="h-3.5 w-3.5" /> Add item
      </button>
    </div>
  );
}
