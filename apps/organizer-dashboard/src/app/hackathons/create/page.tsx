"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Calendar,
  MapPin,
  Globe,
  DollarSign,
  Users,
  Image as ImageIcon,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
} from "lucide-react";
import { organizerApi, hackathonApi } from "@takathon/shared/api";
import { Breadcrumbs } from "@takathon/shared/ui";
import type { Skill } from "@takathon/shared/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const STEPS = ["Basic Info", "Logistics", "Skills & Review"];

export default function CreateHackathonPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    theme: "",
    prizesDescription: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    location: "",
    isVirtual: false,
    maxParticipants: "",
    maxTeamSize: "",
    minTeamSize: "",
    prizePool: "",
    bannerUrl: "",
    websiteUrl: "",
    requiredSkillIds: [] as string[],
  });

  useEffect(() => {
    hackathonApi
      .listSkills()
      .then((s) => setSkills(s))
      .catch(() => toast.error("Failed to load skills"))
      .finally(() => setSkillsLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const toggleSkill = (skillId: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkillIds: prev.requiredSkillIds.includes(skillId)
        ? prev.requiredSkillIds.filter((id) => id !== skillId)
        : [...prev.requiredSkillIds, skillId],
    }));
  };

  // ── Step validation ──────────────────────────────────────────────────────
  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {};

    if (s === 0) {
      if (!formData.title.trim() || formData.title.trim().length < 3)
        errs.title = "Title must be at least 3 characters";
      if (!formData.description.trim())
        errs.description = "Description is required";
      else if (formData.description.trim().length < 10)
        errs.description = "Description must be at least 10 characters";
    }

    if (s === 1) {
      if (!formData.startDate) errs.startDate = "Start date is required";
      if (!formData.endDate) errs.endDate = "End date is required";
      if (!formData.registrationDeadline)
        errs.registrationDeadline = "Registration deadline is required";

      if (formData.startDate && formData.endDate) {
        if (new Date(formData.endDate) <= new Date(formData.startDate))
          errs.endDate = "End date must be after start date";
      }
      if (formData.registrationDeadline && formData.startDate) {
        if (
          new Date(formData.registrationDeadline) >=
          new Date(formData.startDate)
        )
          errs.registrationDeadline =
            "Registration deadline must be before start date";
      }

      const min = formData.minTeamSize ? parseInt(formData.minTeamSize) : 0;
      const max = formData.maxTeamSize ? parseInt(formData.maxTeamSize) : 0;
      if (min && max && min > max)
        errs.minTeamSize = "Min team size cannot exceed max team size";

      if (formData.bannerUrl && !/^https?:\/\/.+/.test(formData.bannerUrl))
        errs.bannerUrl = "Must be a valid URL (https://...)";
      if (formData.websiteUrl && !/^https?:\/\/.+/.test(formData.websiteUrl))
        errs.websiteUrl = "Must be a valid URL (https://...)";
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0];
      document
        .querySelector(`[name="${firstKey}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 2));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        registrationDeadline: new Date(
          formData.registrationDeadline,
        ).toISOString(),
        location: formData.location || undefined,
        isVirtual: formData.isVirtual,
        maxParticipants: formData.maxParticipants
          ? parseInt(formData.maxParticipants)
          : undefined,
        maxTeamSize: formData.maxTeamSize
          ? parseInt(formData.maxTeamSize)
          : undefined,
        minTeamSize: formData.minTeamSize
          ? parseInt(formData.minTeamSize)
          : undefined,
        prizePool: formData.prizePool || undefined,
        bannerUrl: formData.bannerUrl || undefined,
        websiteUrl: formData.websiteUrl || undefined,
        requiredSkills: formData.requiredSkillIds.length
          ? formData.requiredSkillIds
          : undefined,
      };
      if (formData.theme) payload.theme = formData.theme;
      if (formData.prizesDescription)
        payload.prizesDescription = formData.prizesDescription;

      const hackathon = await organizerApi.createHackathon(payload as any);
      toast.success("Hackathon created as Draft!");
      router.push(`/hackathons/${(hackathon as any).id ?? ""}`);
    } catch (error: any) {
      // ResponseHandler nests the message under data.error.message
      const msg =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Failed to create hackathon";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const FieldError = ({ name }: { name: string }) =>
    errors[name] ? (
      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
        <AlertCircle size={14} />
        {errors[name]}
      </p>
    ) : null;

  const skillsByCategory = skills.reduce<Record<string, Skill[]>>(
    (acc, skill) => {
      const cat = skill.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    },
    {},
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumbs + Header */}
        <div>
          <div className="mb-3">
            <Breadcrumbs
              items={[
                { label: "My Hackathons", href: "/hackathons" },
                { label: "Create New Hackathon" },
              ]}
              showBack
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Create New Hackathon
          </h1>
          <p className="text-white/60">Follow the steps to launch your event</p>
        </div>

        {/* Step Progress */}
        <div className="flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <button
                type="button"
                onClick={() => {
                  if (i < step) setStep(i);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all w-full ${
                  i === step
                    ? "bg-primary text-white"
                    : i < step
                      ? "bg-green-500/20 text-green-400"
                      : "bg-white/5 text-white/40"
                }`}
              >
                {i < step ? (
                  <Check size={16} />
                ) : (
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs">
                    {i + 1}
                  </span>
                )}
                {label}
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight size={16} className="text-white/20 shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1: Basic Info ─────────────────────────────────────────── */}
        {step === 0 && (
          <div className="glass p-6 rounded-xl space-y-6">
            <h2 className="text-xl font-bold text-white">Basic Information</h2>

            <div className="space-y-2">
              <label className="text-sm text-white/60">
                Hackathon Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="e.g. AI Innovation Summit 2026"
              />
              <FieldError name="title" />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/60">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="input-field w-full resize-none"
                placeholder="Describe your hackathon..."
              />
              <p className="text-white/30 text-xs text-right">
                {formData.description.length} / 2000
              </p>
              <FieldError name="description" />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/60">Theme</label>
              <input
                type="text"
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="e.g. Sustainability, Health-Tech"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/60">
                Prizes Description
              </label>
              <textarea
                name="prizesDescription"
                rows={3}
                value={formData.prizesDescription}
                onChange={handleChange}
                className="input-field w-full resize-none"
                placeholder="Describe prizes and rewards..."
              />
              <p className="text-white/30 text-xs text-right">
                {formData.prizesDescription.length} / 1000
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/60">Prize Pool</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  name="prizePool"
                  value={formData.prizePool}
                  onChange={handleChange}
                  className="input-field w-full pl-11"
                  placeholder="e.g. $10,000"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Logistics ──────────────────────────────────────────── */}
        {step === 1 && (
          <div className="glass p-6 rounded-xl space-y-6">
            <h2 className="text-xl font-bold text-white">Logistics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-white/60">
                  Start Date <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="input-field w-full pl-11"
                  />
                </div>
                <FieldError name="startDate" />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/60">
                  End Date <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="input-field w-full pl-11"
                  />
                </div>
                <FieldError name="endDate" />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/60">
                  Registration Deadline <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="datetime-local"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleChange}
                    className="input-field w-full pl-11"
                  />
                </div>
                <FieldError name="registrationDeadline" />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/60">Event Type</label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isVirtual"
                      checked={formData.isVirtual}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/50"
                    />
                    <span className="text-white">Virtual Event</span>
                  </label>
                </div>
              </div>
            </div>

            {!formData.isVirtual && (
              <div className="space-y-2">
                <label className="text-sm text-white/60">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field w-full pl-11"
                    placeholder="Venue address or city"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-white/60">
                  Max Participants
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="number"
                    name="maxParticipants"
                    min="2"
                    max="10000"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    className="input-field w-full pl-11"
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/60">Min Team Size</label>
                <input
                  type="number"
                  name="minTeamSize"
                  min="1"
                  max="10"
                  value={formData.minTeamSize}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="1"
                />
                <FieldError name="minTeamSize" />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/60">Max Team Size</label>
                <input
                  type="number"
                  name="maxTeamSize"
                  min="1"
                  max="10"
                  value={formData.maxTeamSize}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-white/60">Banner URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="url"
                    name="bannerUrl"
                    value={formData.bannerUrl}
                    onChange={handleChange}
                    className="input-field w-full pl-11"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/60">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="url"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    className="input-field w-full pl-11"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Skills & Review ────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="glass p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-bold text-white">Required Skills</h2>
              <p className="text-white/50 text-sm">
                Select skills participants should have. This helps AI matching
                recommend the best teammates.
              </p>

              {skillsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin text-white/40" size={24} />
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(skillsByCategory).map(
                    ([category, catSkills]) => (
                      <div key={category}>
                        <h3 className="text-sm font-semibold text-white/70 mb-2">
                          {category}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {catSkills.map((skill) => {
                            const selected = formData.requiredSkillIds.includes(
                              skill.id,
                            );
                            return (
                              <button
                                key={skill.id}
                                type="button"
                                onClick={() => toggleSkill(skill.id)}
                                className={`px-3 py-1.5 rounded-full text-sm transition-all border ${
                                  selected
                                    ? "bg-primary/20 border-primary text-primary"
                                    : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                                }`}
                              >
                                {selected && (
                                  <Check size={12} className="inline mr-1" />
                                )}
                                {skill.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}

              {formData.requiredSkillIds.length > 0 && (
                <p className="text-white/40 text-sm">
                  {formData.requiredSkillIds.length} skill
                  {formData.requiredSkillIds.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            {/* Preview card */}
            <div className="glass p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-bold text-white">Review</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/50">Title</span>
                  <p className="text-white font-medium">
                    {formData.title || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-white/50">Theme</span>
                  <p className="text-white font-medium">
                    {formData.theme || "—"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-white/50">Description</span>
                  <p className="text-white/80 line-clamp-3">
                    {formData.description || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-white/50">Start Date</span>
                  <p className="text-white font-medium">
                    {formData.startDate
                      ? new Date(formData.startDate).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div>
                  <span className="text-white/50">End Date</span>
                  <p className="text-white font-medium">
                    {formData.endDate
                      ? new Date(formData.endDate).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div>
                  <span className="text-white/50">Registration Deadline</span>
                  <p className="text-white font-medium">
                    {formData.registrationDeadline
                      ? new Date(
                          formData.registrationDeadline,
                        ).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div>
                  <span className="text-white/50">Format</span>
                  <p className="text-white font-medium">
                    {formData.isVirtual
                      ? "Virtual"
                      : formData.location || "In-Person"}
                  </p>
                </div>
                <div>
                  <span className="text-white/50">Team Size</span>
                  <p className="text-white font-medium">
                    {formData.minTeamSize || "1"} –{" "}
                    {formData.maxTeamSize || "∞"}
                  </p>
                </div>
                <div>
                  <span className="text-white/50">Max Participants</span>
                  <p className="text-white font-medium">
                    {formData.maxParticipants || "Unlimited"}
                  </p>
                </div>
                {formData.requiredSkillIds.length > 0 && (
                  <div className="md:col-span-2">
                    <span className="text-white/50">Required Skills</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.requiredSkillIds.map((sid) => {
                        const sk = skills.find((s) => s.id === sid);
                        return (
                          <span
                            key={sid}
                            className="px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs"
                          >
                            {sk?.name || sid}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation Buttons ─────────────────────────────────────────── */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={step === 0 ? () => router.back() : prevStep}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition-all"
          >
            {step === 0 ? (
              "Cancel"
            ) : (
              <span className="flex items-center gap-2">
                <ChevronLeft size={16} /> Back
              </span>
            )}
          </button>

          {step < 2 ? (
            <button
              type="button"
              onClick={nextStep}
              className="btn-primary flex items-center gap-2"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Creating...
                </>
              ) : (
                "Create Hackathon"
              )}
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
