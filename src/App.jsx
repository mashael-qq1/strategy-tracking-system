import React, { useState, useMemo, useCallback } from "react";
import {
  LayoutDashboard, GitBranch, Target, ListChecks, Gauge as GaugeIcon,
  CalendarRange, AlertTriangle, CheckSquare, Lightbulb, X, ChevronRight,
  ChevronDown, Search, RotateCcw, Bell, Clock, Users, TrendingUp, TrendingDown,
  Minus, Link2, MessageSquare, Paperclip, History, Sliders, Check, ArrowRight,
  Filter, ExternalLink, Settings as SettingsIcon, Download, Upload, AlertCircle,
  Pencil, Trash2, Plus
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from "recharts";

/* ============================================================================
   DESIGN TOKENS
   AZM-inspired: deep navy + a single plum/magenta signature accent (from the
   AZM mark), light gray surfaces, restrained data-forward type system.
============================================================================ */
const FONT_IMPORT_ID = "ba-scc-fonts";
if (typeof document !== "undefined" && !document.getElementById(FONT_IMPORT_ID)) {
  const link = document.createElement("link");
  link.id = FONT_IMPORT_ID;
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600;700&display=swap";
  document.head.appendChild(link);
}

const T = {
  navy: "#0E2A47",
  navyDeep: "#081A2E",
  blue: "#1E4E8C",
  blueSoft: "#EAF1FA",
  plum: "#8E2A63",
  plumSoft: "#F7E9F1",
  bg: "#FFFFFF",
  surface: "#F6F7F9",
  surface2: "#F1F3F6",
  border: "#E3E6EC",
  borderStrong: "#CDD3DC",
  ink: "#10151C",
  inkMuted: "#5B6472",
  inkFaint: "#8B93A1",
  green: "#1D8A55",
  greenSoft: "#E7F5EE",
  amber: "#B7791F",
  amberSoft: "#FBF1DF",
  red: "#C0362C",
  redSoft: "#FBEAE8",
  gray: "#8B93A1",
  graySoft: "#EEF0F3",
};

const FONT = `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`;
const MONO = `'IBM Plex Mono', 'SFMono-Regular', monospace`;

/* ============================================================================
   JSON DATA MODEL  (kept separate from presentation logic)
============================================================================ */
const TODAY = new Date("2026-08-17");
const TODAY_STR = "2026-08-17";
const d = (s) => new Date(s);
const daysBetween = (a, b) => Math.round((b - a) / 86400000);

const OWNERS = ["Yasser", "Leen", "Baghdady", "Randa", "Sara", "Omar", "Fahad", "Noura"];

const RAW = {
  strategy: {
    id: "strat-2026",
    name: "From Depth to Value",
    subtitle: "BA Department Strategy 2026",
    period: "Jul 2026 – Dec 2026",
  },
  settings: {
    // KPI-driven strategy health weighting (see strategyHealth()).
    healthWeights: { kpiAch: 0.40, subMetricAch: 0.25, kpisOnTarget: 0.20, measured: 0.15 },
    objectiveWeighting: "equal", // configurable
    streamWeighting: "equal",
  },
  streams: [
    { id: "s1", name: "Drive the Value", tagline: "Go beyond requirements — what the client needs", color: T.blue, objectiveIds: ["o1","o2","o3","o4","o5"] },
    { id: "s2", name: "Build the Engine", tagline: "Built once, stronger every day", color: T.plum, objectiveIds: ["o6","o7","o8","o9"] },
  ],
  reportingCycles: [
    { id: "rc-jul", label: "Jul 2026", overall: 41 },
    { id: "rc-aug", label: "Aug 2026", overall: 52 },
    { id: "rc-sep", label: "Sep 2026 (proj.)", overall: 63, projected: true },
    { id: "rc-oct", label: "Oct 2026 (proj.)", overall: 74, projected: true },
    { id: "rc-nov", label: "Nov 2026 (proj.)", overall: 84, projected: true },
    { id: "rc-dec", label: "Dec 2026 (proj.)", overall: 92, projected: true },
  ],
  // Illustrative archived summary for the prior strategy year. Real years will
  // populate this automatically as each year's approved KPI checkpoints close out —
  // note the KPI set itself differs from 2026, since targets and metrics are
  // redefined each year.
  archive2025: {
    year: "2025",
    label: "BA Department Strategy 2025 — Requirements Foundations",
    overallProgress: 88,
    health: 81,
    closedOut: "2025-12-20",
    streams: [
      { name: "Requirements Discipline", progress: 91, color: T.blue },
      { name: "Team Enablement", progress: 84, color: T.plum },
    ],
    kpis: [
      { objective: "Requirements Sign-off Timeliness", current: 89, target: 90, unit: "%" },
      { objective: "Documentation Completeness", current: 94, target: 90, unit: "%" },
      { objective: "Stakeholder Satisfaction (survey)", current: 4.3, target: 4.2, unit: "/5" },
      { objective: "Analyst Onboarding Time", current: 18, target: 21, unit: " days" },
    ],
    note: "2025 was the department's first tracked strategy cycle, run on a lighter KPI set focused on requirements discipline. 2026 introduced the full 9-objective structure and quarterly checkpoint governance shown elsewhere in this app.",
  },
};

// ---- Objective 1 -----------------------------------------------------------
const O1 = {
  id: "o1", number: 1, streamId: "s1", owner: "Yasser", assignedOwner: null,
  title: "Master the business problem at the start",
  subtitle: "Define the value before we design the solution.",
  meaning: "Get the start right and the engagement stops fighting you three months later.",
  start: "2026-08-01", end: "2026-12-31",
  lastUpdate: "2026-08-12",
  kpi: { id: "k1", name: "Discovery Quality Score", current: 74, target: 90, previous: 66, unit: "%", lowerBetter: false },
  subMetrics: [
    { id: "sm1-1", name: "Discovery Output Coverage", current: 71, target: 90, previous: 60, unit: "%", trend: "up", lastUpdated: "2026-08-10", dataOwner: "Yasser" },
    { id: "sm1-2", name: "Discovery Section Depth Distribution", current: 68, target: 85, previous: 65, unit: "%", trend: "up", lastUpdated: "2026-08-05", dataOwner: "Sara" },
  ],
  initiatives: [
    { id:"i1-1", name:"Discovery Output Standard", owner:"Yasser", start:"2026-08-01", due:"2026-08-31", progress:100, priority:"High", phase:"Closed", nextMilestone:"—", deps:[], risks:"None", comments:"Standard signed off by BA Lead.", evidence:"repo://standards/discovery-v2", updatedBy:"Yasser",
      history:[
        {date:"2026-08-05", prev:80, next:100, summary:"Final review incorporated; standard published.", blockers:"None", next2:"Roll into training workshop.", by:"Yasser"},
        {date:"2026-07-22", prev:40, next:80, summary:"Draft circulated for stakeholder review.", blockers:"Waiting on Leen's traceability alignment.", next2:"Close review loop.", by:"Yasser"},
      ],
      activities: [
        { id:"act-1-1-1", name:"Review existing discovery templates", phase:"As-Is Scan", date:"2026-07-10", quarter:"Q1", plannedStart:"2026-07-10", plannedEnd:"2026-07-24", subActivities:[
          { id:"sub-1-1-1-1", name:"Collect last 5 discovery docs", done:true },
          { id:"sub-1-1-1-2", name:"Identify gaps vs current standard", done:true },
        ]},
        { id:"act-1-1-2", name:"Draft the discovery output standard", phase:"Standard", date:"2026-07-20", quarter:"Q1", plannedStart:"2026-07-20", plannedEnd:"2026-08-03", subActivities:[
          { id:"sub-1-1-2-1", name:"Write structure & required sections", done:true },
          { id:"sub-1-1-2-2", name:"Circulate for review", done:true },
        ]},
        { id:"act-1-1-3", name:"Publish & socialize standard", phase:"Scale", date:"2026-08-05", quarter:"Q1", plannedStart:"2026-08-05", plannedEnd:"2026-08-19", subActivities:[
          { id:"sub-1-1-3-1", name:"Announce in team meeting", done:true },
        ]},
      ]},
    { id:"i1-2", name:"Pre-Sales Discovery with BD", owner:"Sara", start:"2026-08-01", due:"2026-09-15", progress:55, priority:"High", phase:"Pilot", nextMilestone:"First joint discovery call", deps:["BD calendar alignment"], risks:"BD availability limited in Q3.", comments:"Piloting with one active opportunity.", evidence:"drive://pre-sales-pilot", updatedBy:"Sara",
      history:[
        {date:"2026-08-11", prev:35, next:55, summary:"Pilot kicked off with BD team on Acme opportunity.", blockers:"BD calendar constraints.", next2:"Run second pilot call.", by:"Sara"},
      ],
      activities: [
        { id:"act-1-2-1", name:"Map current pre-sales discovery gaps", phase:"As-Is Scan", date:"2026-07-15", quarter:"Q1", plannedStart:"2026-07-15", plannedEnd:"2026-07-29", subActivities:[
          { id:"sub-1-2-1-1", name:"Interview BD lead", done:true },
        ]},
        { id:"act-1-2-2", name:"Define standard pre-sales discovery flow", phase:"Standard", date:"2026-08-01", quarter:"Q1", plannedStart:"2026-08-01", plannedEnd:"2026-08-15", subActivities:[
          { id:"sub-1-2-2-1", name:"Draft flow doc", done:true },
          { id:"sub-1-2-2-2", name:"Get BD sign-off", plannedStart:"2026-08-05", plannedEnd:"2026-08-19", done:false },
        ]},
        { id:"act-1-2-3", name:"Run pilot on Acme opportunity", phase:"Pilot", date:"2026-10-10", quarter:"Q2", plannedStart:"2026-10-10", plannedEnd:"2026-10-24", subActivities:[
          { id:"sub-1-2-3-1", name:"Schedule joint discovery call", done:true },
          { id:"sub-1-2-3-2", name:"Debrief & capture learnings", plannedStart:"2026-10-12", plannedEnd:"2026-10-19", done:false },
        ]},
      ]},
    { id:"i1-3", name:"Discovery Sign-off SLA", owner:"Yasser", start:"2026-08-15", due:"2026-09-30", progress:30, priority:"Medium", phase:"Design", nextMilestone:"SLA draft to leadership", deps:["Discovery Output Standard"], risks:"None", comments:"Drafting turnaround targets per engagement size.", evidence:"—", updatedBy:"Yasser",
      history:[
        {date:"2026-08-01", prev:10, next:30, summary:"SLA tiers drafted for small/medium/large engagements.", blockers:"None", next2:"Circulate for feedback.", by:"Yasser"},
      ],
      activities: [
        { id:"act-1-3-1", name:"Baseline current sign-off turnaround", phase:"As-Is Scan", date:"2026-07-25", quarter:"Q1", plannedStart:"2026-07-25", plannedEnd:"2026-08-08", subActivities:[
          { id:"sub-1-3-1-1", name:"Pull last 10 engagement sign-off dates", done:true },
        ]},
        { id:"act-1-3-2", name:"Draft SLA tiers", phase:"Standard", date:"2026-08-10", quarter:"Q1", plannedStart:"2026-08-10", plannedEnd:"2026-08-24", subActivities:[
          { id:"sub-1-3-2-1", name:"Define small/medium/large tiers", done:true },
          { id:"sub-1-3-2-2", name:"Circulate to leadership", plannedStart:"2026-08-11", plannedEnd:"2026-08-25", done:false },
        ]},
      ]},
    { id:"i1-4", name:"Discovery Repository", owner:"Fahad", start:"2026-08-01", due:"2026-08-20", progress:100, priority:"Medium", phase:"Closed", nextMilestone:"—", deps:[], risks:"None", comments:"Central repository live on SharePoint.", evidence:"sp://ba/discovery-repo", updatedBy:"Fahad", history:[
        {date:"2026-08-08", prev:70, next:100, summary:"Repository launched with folder taxonomy.", blockers:"None", next2:"Backfill historical discoveries.", by:"Fahad"},
      ],
      activities: [
        { id:"act-1-4-1", name:"Assess current document sprawl", phase:"As-Is Scan", date:"2026-07-12", quarter:"Q1", plannedStart:"2026-07-12", plannedEnd:"2026-07-26", subActivities:[
          { id:"sub-1-4-1-1", name:"Inventory existing folders", done:true },
        ]},
        { id:"act-1-4-2", name:"Build repository structure", phase:"Standard", date:"2026-07-28", quarter:"Q1", plannedStart:"2026-07-28", plannedEnd:"2026-08-11", subActivities:[
          { id:"sub-1-4-2-1", name:"Design taxonomy", done:true },
        ]},
        { id:"act-1-4-3", name:"Roll out & measure usage", phase:"Scale", date:"2026-10-05", quarter:"Q2", plannedStart:"2026-10-05", plannedEnd:"2026-10-19", subActivities:[
          { id:"sub-1-4-3-1", name:"Track monthly repo visits", done:true },
        ]},
      ]},
    { id:"i1-5", name:"Discovery Training Workshop", owner:"Noura", start:"2026-10-01", due:"2026-11-15", progress:0, priority:"Low", phase:"Not Started", nextMilestone:"Workshop agenda", deps:["Discovery Output Standard"], risks:"None", comments:"Scheduled for Q4 once standard is stable.", evidence:"—", updatedBy:"Noura", history:[], activities: [] },
  ],
  milestones: [
    { id:"ms1", date:"2026-08-20", name:"Discovery Repository live", status:"Completed" },
    { id:"ms2", date:"2026-09-30", name:"Sign-off SLA approved", status:"Upcoming" },
    { id:"ms3", date:"2026-11-15", name:"Training workshop delivered", status:"Upcoming" },
    { id:"kpichk-o1-q1", date:"2026-09-30", name:"Q1 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q1", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o1-q2", date:"2026-12-31", name:"Q2 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q2", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o1-q3", date:"2027-03-31", name:"Q3 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q3", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o1-q4", date:"2027-06-30", name:"Q4 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q4", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
  ],
};

// ---- Objective 2 -----------------------------------------------------------
const O2 = {
  id:"o2", number:2, streamId:"s1", owner:"Leen", assignedOwner: null,
  title:"Keep scope alive and visible",
  subtitle:"Every change is a conscious decision, never a surprise.",
  meaning:'When a client says "this isn\'t what we agreed," the matrix defends you.',
  start:"2026-07-01", end:"2026-12-31", lastUpdate:"2026-08-14",
  kpi: { id:"k2", name:"Requirements Traceability Coverage", current:58, target:85, previous:44, unit:"%", lowerBetter:false },
  subMetrics: [
    { id:"sm2-1", name:"Traceability Coverage", current:58, target:85, previous:44, unit:"%", trend:"up", lastUpdated:"2026-08-12", dataOwner:"Leen" },
    { id:"sm2-2", name:"Matrix Reflects Reality Score", current:62, target:90, previous:58, unit:"%", trend:"up", lastUpdated:"2026-08-10", dataOwner:"Leen" },
    { id:"sm2-3", name:"Real-time Automated Reporting Capability", current:20, target:100, previous:0, unit:"%", trend:"up", lastUpdated:"2026-08-01", dataOwner:"Omar" },
    { id:"sm2-4", name:"Stakeholder Matrix Engagement", current:47, target:80, previous:40, unit:"%", trend:"up", lastUpdated:"2026-08-09", dataOwner:"Leen" },
  ],
  initiatives: [
    { id:"i2-1", name:"Build the Traceability Matrix mechanism", owner:"Leen", start:"2026-07-01", due:"2026-08-10", progress:100, priority:"High", phase:"Closed", nextMilestone:"—", deps:[], risks:"None", comments:"Matrix template and linkage logic finalized.", evidence:"sp://ba/traceability-matrix", updatedBy:"Leen", history:[
        {date:"2026-08-03", prev:75, next:100, summary:"Matrix mechanism finalized and tested on 2 engagements.", blockers:"None", next2:"Establish baseline routine.", by:"Leen"},
      ]},
    { id:"i2-2", name:"Establish baselines + routine", owner:"Leen", start:"2026-08-05", due:"2026-08-31", progress:80, priority:"High", phase:"Rollout", nextMilestone:"Baseline sign-off, all active engagements", deps:["Build the Traceability Matrix mechanism"], risks:"None", comments:"6 of 8 engagements baselined.", evidence:"—", updatedBy:"Leen", history:[
        {date:"2026-08-14", prev:55, next:80, summary:"Baselined 6 of 8 active engagements.", blockers:"2 engagements pending client sign-off.", next2:"Close remaining baselines.", by:"Leen"},
      ]},
    { id:"i2-3", name:"Real-time automated reporting", owner:"Omar", start:"2026-08-15", due:"2026-10-15", progress:20, priority:"High", phase:"Design", nextMilestone:"Automation spec approved", deps:[], risks:"Requires IT/dev support that is not yet allocated.", comments:"Scoping automation approach with IT.", evidence:"—", updatedBy:"Omar", history:[
        {date:"2026-08-02", prev:5, next:20, summary:"Initial scoping session held with IT.", blockers:"No dedicated dev resource confirmed yet.", next2:"Escalate resourcing request.", by:"Omar"},
      ]},
    { id:"i2-4", name:"Stakeholder onboarding & adoption", owner:"Leen", start:"2026-09-01", due:"2026-10-31", progress:10, priority:"Medium", phase:"Not Started", nextMilestone:"Onboarding session #1", deps:["Establish baselines + routine"], risks:"None", comments:"Waiting on baseline completion.", evidence:"—", updatedBy:"Leen", history:[]},
    { id:"i2-5", name:"Change enablement & phased rollout", owner:"Noura", start:"2026-10-01", due:"2026-12-15", progress:0, priority:"Medium", phase:"Not Started", nextMilestone:"Rollout plan", deps:["Stakeholder onboarding & adoption"], risks:"None", comments:"Not yet started.", evidence:"—", updatedBy:"Noura", history:[]},
  ],
  milestones: [
    { id:"ms4", date:"2026-08-31", name:"All engagements baselined", status:"Upcoming" },
    { id:"ms5", date:"2026-10-15", name:"Automated reporting live", status:"Upcoming" },
    { id:"kpichk-o2-q1", date:"2026-09-30", name:"Q1 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q1", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o2-q2", date:"2026-12-31", name:"Q2 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q2", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o2-q3", date:"2027-03-31", name:"Q3 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q3", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o2-q4", date:"2027-06-30", name:"Q4 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q4", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
  ],
};

// ---- Objective 3 -----------------------------------------------------------
const O3 = {
  id:"o3", number:3, streamId:"s1", owner:"Baghdady", assignedOwner: null,
  title:"Own the value, not just the delivery",
  subtitle:"", meaning:"Your work is measured by outcomes, not output — you become a value partner.",
  start:"2026-08-01", end:"2026-12-31", lastUpdate:"2026-08-09",
  kpi: { id:"k3", name:"Solution Value Realization Rate", current:81, target:88, previous:75, unit:"%", lowerBetter:false },
  subMetrics: [
    { id:"sm3-1", name:"End-User Adoption Indicator", current:84, target:90, previous:78, unit:"%", trend:"up", lastUpdated:"2026-08-08", dataOwner:"Baghdady" },
    { id:"sm3-2", name:"End-User Satisfaction Rating", current:79, target:88, previous:74, unit:"%", trend:"up", lastUpdated:"2026-08-07", dataOwner:"Sara" },
    { id:"sm3-3", name:"Business Owner Value Confirmation", current:80, target:85, previous:73, unit:"%", trend:"up", lastUpdated:"2026-08-06", dataOwner:"Baghdady" },
  ],
  initiatives: [
    { id:"i3-1", name:"Value Realization Framework", owner:"Baghdady", start:"2026-08-01", due:"2026-08-25", progress:100, priority:"High", phase:"Closed", nextMilestone:"—", deps:[], risks:"None", comments:"Framework approved by department leadership.", evidence:"sp://ba/value-framework", updatedBy:"Baghdady", history:[
        {date:"2026-08-10", prev:85, next:100, summary:"Framework finalized and approved.", blockers:"None", next2:"Build check instruments.", by:"Baghdady"},
      ]},
    { id:"i3-2", name:"Satisfaction & Value Check Instruments", owner:"Sara", start:"2026-08-10", due:"2026-09-10", progress:70, priority:"High", phase:"Build", nextMilestone:"Instrument pilot with 2 clients", deps:["Value Realization Framework"], risks:"None", comments:"Survey + interview guide drafted.", evidence:"—", updatedBy:"Sara", history:[
        {date:"2026-08-09", prev:45, next:70, summary:"Draft instruments built; internal review complete.", blockers:"None", next2:"Pilot externally.", by:"Sara"},
      ]},
    { id:"i3-3", name:"Adoption Signal Playbook", owner:"Baghdady", start:"2026-08-15", due:"2026-09-30", progress:60, priority:"Medium", phase:"Build", nextMilestone:"Playbook v1 review", deps:[], risks:"None", comments:"Cataloguing adoption signals from 3 past engagements.", evidence:"—", updatedBy:"Baghdady", history:[
        {date:"2026-08-05", prev:30, next:60, summary:"Signal catalogue drafted from 3 engagements.", blockers:"None", next2:"Validate with client teams.", by:"Baghdady"},
      ]},
    { id:"i3-4", name:"Value Realization Pilot", owner:"Omar", start:"2026-09-01", due:"2026-10-31", progress:15, priority:"High", phase:"Pilot", nextMilestone:"Pilot engagement selected", deps:["Adoption Signal Playbook"], risks:"None", comments:"Pilot engagement identified, kickoff pending.", evidence:"—", updatedBy:"Omar", history:[
        {date:"2026-08-12", prev:0, next:15, summary:"Pilot engagement selected with Business Owner sign-off.", blockers:"None", next2:"Kick off pilot measurement.", by:"Omar"},
      ]},
    { id:"i3-5", name:"Value Signals into the Dashboard", owner:"Baghdady", start:"2026-10-15", due:"2026-12-15", progress:0, priority:"Low", phase:"Not Started", nextMilestone:"Integration spec", deps:["Value Realization Pilot"], risks:"None", comments:"Not yet started.", evidence:"—", updatedBy:"Baghdady", history:[]},
  ],
  milestones: [
    { id:"ms6", date:"2026-09-10", name:"Check instruments piloted", status:"Upcoming" },
    { id:"ms7", date:"2026-10-31", name:"Value realization pilot complete", status:"Upcoming" },
    { id:"kpichk-o3-q1", date:"2026-09-30", name:"Q1 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q1", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o3-q2", date:"2026-12-31", name:"Q2 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q2", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o3-q3", date:"2027-03-31", name:"Q3 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q3", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o3-q4", date:"2027-06-30", name:"Q4 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q4", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
  ],
};

// ---- Objective 4 -----------------------------------------------------------
const O4 = {
  id:"o4", number:4, streamId:"s1", owner:"Yasser", assignedOwner: null,
  title:"Turn analytical depth into new opportunities",
  subtitle:"", meaning:"The opportunities you already notice become real business AZM grows on.",
  start:"2026-08-01", end:"2026-12-31", lastUpdate:"2026-07-30",
  kpi: { id:"k4", name:"Opportunity Contribution Rate", current:22, target:40, previous:14, unit:"%", lowerBetter:false },
  subMetrics: [
    { id:"sm4-1", name:"Opportunity Identification Rate", current:35, target:50, previous:20, unit:"%", trend:"up", lastUpdated:"2026-07-29", dataOwner:"Yasser" },
    { id:"sm4-2", name:"Opportunity Conversion Rate", current:12, target:30, previous:8, unit:"%", trend:"up", lastUpdated:"2026-07-28", dataOwner:"Fahad" },
    { id:"sm4-3", name:"Engagement Coverage", current:50, target:100, previous:30, unit:"%", trend:"up", lastUpdated:"2026-07-25", dataOwner:"Yasser" },
  ],
  initiatives: [
    { id:"i4-1", name:"Opportunity Definition Standard", owner:"Yasser", start:"2026-08-01", due:"2026-08-20", progress:100, priority:"Medium", phase:"Closed", nextMilestone:"—", deps:[], risks:"None", comments:"Definition and qualification criteria approved.", evidence:"sp://ba/opp-standard", updatedBy:"Yasser", history:[
        {date:"2026-08-06", prev:70, next:100, summary:"Standard approved by BD + BA leadership.", blockers:"None", next2:"Stand up the opportunity log.", by:"Yasser"},
      ]},
    { id:"i4-2", name:"Opportunity Log", owner:"Fahad", start:"2026-08-05", due:"2026-08-31", progress:65, priority:"Medium", phase:"Build", nextMilestone:"Log live for all engagements", deps:["Opportunity Definition Standard"], risks:"None", comments:"Log structure built, backfilling entries.", evidence:"—", updatedBy:"Fahad", history:[
        {date:"2026-07-30", prev:30, next:65, summary:"Log structure built in shared tracker.", blockers:"None", next2:"Backfill Q3 opportunities.", by:"Fahad"},
      ]},
    { id:"i4-3", name:"Opportunity Capture Process", owner:"Yasser", start:"2026-08-15", due:"2026-09-30", progress:25, priority:"Medium", phase:"Design", nextMilestone:"Process walkthrough with analysts", deps:[], risks:"Analysts not yet trained on capture triggers.", comments:"Process draft in review.", evidence:"—", updatedBy:"Yasser", history:[
        {date:"2026-07-28", prev:10, next:25, summary:"First draft of capture process circulated.", blockers:"Analyst training not scheduled.", next2:"Schedule training.", by:"Yasser"},
      ]},
    { id:"i4-4", name:"BD + Product Collaboration Agreement", owner:"Randa", start:"2026-09-01", due:"2026-10-15", progress:10, priority:"High", phase:"Design", nextMilestone:"Agreement draft to BD lead", deps:[], risks:"BD counterpart availability.", comments:"Early conversations underway.", evidence:"—", updatedBy:"Randa", history:[
        {date:"2026-08-01", prev:0, next:10, summary:"Initial alignment conversation with BD.", blockers:"BD counterpart availability.", next2:"Draft joint agreement.", by:"Randa"},
      ]},
    { id:"i4-5", name:"Opportunity Mindset Training", owner:"Noura", start:"2026-11-01", due:"2026-12-15", progress:0, priority:"Low", phase:"Not Started", nextMilestone:"Training curriculum", deps:["Opportunity Capture Process"], risks:"None", comments:"Not yet started.", evidence:"—", updatedBy:"Noura", history:[]},
  ],
  milestones: [
    { id:"ms8", date:"2026-08-31", name:"Opportunity Log live", status:"Upcoming" },
    { id:"ms9", date:"2026-10-15", name:"BD collaboration agreement signed", status:"Upcoming" },
    { id:"kpichk-o4-q1", date:"2026-09-30", name:"Q1 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q1", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o4-q2", date:"2026-12-31", name:"Q2 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q2", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o4-q3", date:"2027-03-31", name:"Q3 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q3", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o4-q4", date:"2027-06-30", name:"Q4 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q4", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
  ],
};

// ---- Objective 5 -----------------------------------------------------------
const O5 = {
  id:"o5", number:5, streamId:"s1", owner:"Leen", assignedOwner: null,
  title:"Deliver on time and on client expectation, every time",
  subtitle:"", meaning:"Predictable delivery means less firefighting and more trust.",
  start:"2026-07-01", end:"2026-12-31", lastUpdate:"2026-08-15",
  kpi: { id:"k5", name:"Delivery Excellence Index", current:84, target:90, previous:79, unit:"%", lowerBetter:false },
  subMetrics: [
    { id:"sm5-1", name:"On-Time Delivery Rate", current:87, target:92, previous:80, unit:"%", trend:"up", lastUpdated:"2026-08-14", dataOwner:"Leen" },
    { id:"sm5-2", name:"First-Review Acceptance Rate", current:80, target:88, previous:76, unit:"%", trend:"up", lastUpdated:"2026-08-13", dataOwner:"Leen" },
  ],
  initiatives: [
    { id:"i5-1", name:"Delivery Baseline & Definitions", owner:"Leen", start:"2026-07-01", due:"2026-07-31", progress:100, priority:"High", phase:"Closed", nextMilestone:"—", deps:[], risks:"None", comments:"Baseline definitions locked for all delivery types.", evidence:"sp://ba/delivery-baseline", updatedBy:"Leen", history:[
        {date:"2026-07-28", prev:80, next:100, summary:"Baseline definitions signed off.", blockers:"None", next2:"Enforce discipline in active engagements.", by:"Leen"},
      ]},
    { id:"i5-2", name:"On-Time Delivery Discipline", owner:"Leen", start:"2026-08-01", due:"2026-09-15", progress:75, priority:"High", phase:"Rollout", nextMilestone:"Weekly delivery review cadence live", deps:["Delivery Baseline & Definitions"], risks:"None", comments:"Weekly review cadence established for 7 of 8 engagements.", evidence:"—", updatedBy:"Leen", history:[
        {date:"2026-08-11", prev:50, next:75, summary:"Weekly review cadence live on 7 of 8 engagements.", blockers:"One engagement lacks a clear delivery owner.", next2:"Close remaining engagement.", by:"Leen"},
      ]},
    { id:"i5-3", name:"First-Review Acceptance Quality", owner:"Baghdady", start:"2026-08-01", due:"2026-10-01", progress:55, priority:"Medium", phase:"Build", nextMilestone:"Review checklist adopted department-wide", deps:[], risks:"None", comments:"Checklist piloted on 4 deliverables.", evidence:"—", updatedBy:"Baghdady", history:[
        {date:"2026-08-04", prev:30, next:55, summary:"Checklist piloted on 4 deliverables with good results.", blockers:"None", next2:"Roll out department-wide.", by:"Baghdady"},
      ]},
    { id:"i5-4", name:"Continuous Delivery Monitoring", owner:"Omar", start:"2026-08-20", due:"2026-11-30", progress:20, priority:"Medium", phase:"Build", nextMilestone:"Monitoring view in dashboard", deps:["On-Time Delivery Discipline"], risks:"None", comments:"Early design of monitoring view underway.", evidence:"—", updatedBy:"Omar", history:[
        {date:"2026-08-10", prev:5, next:20, summary:"Monitoring view wireframed.", blockers:"None", next2:"Build data pipeline.", by:"Omar"},
      ]},
  ],
  milestones: [
    { id:"ms10", date:"2026-09-15", name:"Delivery discipline fully rolled out", status:"Upcoming" },
    { id:"ms11", date:"2026-11-30", name:"Continuous monitoring live", status:"Upcoming" },
    { id:"kpichk-o5-q1", date:"2026-09-30", name:"Q1 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q1", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o5-q2", date:"2026-12-31", name:"Q2 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q2", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o5-q3", date:"2027-03-31", name:"Q3 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q3", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o5-q4", date:"2027-06-30", name:"Q4 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q4", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
  ],
};

// ---- Objective 6 -----------------------------------------------------------
const O6 = {
  id:"o6", number:6, streamId:"s2", owner:"Baghdady", assignedOwner: null,
  title:"Bring AZM consistency to every output",
  subtitle:"One quality standard, one tracking spine, many ways to think.",
  meaning:"Stop starting from zero every project; your knowledge is kept, not lost.",
  start:"2026-08-01", end:"2026-12-31", lastUpdate:"2026-08-11",
  kpi: { id:"k6", name:"AZM Standards Health Index", current:63, target:85, previous:48, unit:"%", lowerBetter:false },
  subMetrics: [
    { id:"sm6-1", name:"Standards Coverage", current:60, target:90, previous:42, unit:"%", trend:"up", lastUpdated:"2026-08-10", dataOwner:"Baghdady" },
    { id:"sm6-2", name:"Standards Adoption Rate", current:55, target:85, previous:40, unit:"%", trend:"up", lastUpdated:"2026-08-09", dataOwner:"Sara" },
    { id:"sm6-3", name:"Standards Recency", current:74, target:90, previous:60, unit:"%", trend:"up", lastUpdated:"2026-08-08", dataOwner:"Baghdady" },
  ],
  initiatives: [
    { id:"i6-1", name:"Standards Repository + Core Set", owner:"Baghdady", start:"2026-08-01", due:"2026-08-25", progress:90, priority:"High", phase:"Rollout", nextMilestone:"Core set sign-off", deps:[], risks:"None", comments:"12 of 14 core standards published.", evidence:"sp://ba/standards-repo", updatedBy:"Baghdady", history:[
        {date:"2026-08-09", prev:60, next:90, summary:"12 of 14 core standards published to repository.", blockers:"2 standards pending SME review.", next2:"Close remaining 2 standards.", by:"Baghdady"},
      ]},
    { id:"i6-2", name:"Governance & Refresh Cycle", owner:"Baghdady", start:"2026-08-15", due:"2026-09-30", progress:40, priority:"Medium", phase:"Design", nextMilestone:"Refresh cadence approved", deps:["Standards Repository + Core Set"], risks:"None", comments:"Quarterly refresh cadence proposed.", evidence:"—", updatedBy:"Baghdady", history:[
        {date:"2026-08-02", prev:15, next:40, summary:"Governance model drafted with quarterly refresh cadence.", blockers:"None", next2:"Get leadership sign-off.", by:"Baghdady"},
      ]},
    { id:"i6-3", name:"Author the Gap Standards", owner:"Sara", start:"2026-08-01", due:"2026-09-15", progress:35, priority:"Medium", phase:"Build", nextMilestone:"2 remaining standards drafted", deps:[], risks:"SME time is limited.", comments:"2 of 4 gap standards drafted.", evidence:"—", updatedBy:"Sara", history:[
        {date:"2026-07-31", prev:10, next:35, summary:"2 of 4 gap standards drafted.", blockers:"SME availability limited.", next2:"Secure SME time for remaining 2.", by:"Sara"},
      ]},
    { id:"i6-4", name:"Standards Adoption Mechanism", owner:"Omar", start:"2026-09-01", due:"2026-10-31", progress:5, priority:"Medium", phase:"Not Started", nextMilestone:"Adoption tracking mechanism spec", deps:["Standards Repository + Core Set"], risks:"None", comments:"Not yet started meaningfully.", evidence:"—", updatedBy:"Omar", history:[]},
    { id:"i6-5", name:"Health Baseline + First Cycle", owner:"Baghdady", start:"2026-10-01", due:"2026-11-15", progress:0, priority:"Low", phase:"Not Started", nextMilestone:"Baseline measurement", deps:["Governance & Refresh Cycle"], risks:"None", comments:"Not yet started.", evidence:"—", updatedBy:"Baghdady", history:[]},
  ],
  milestones: [
    { id:"ms12", date:"2026-08-25", name:"Core standard set published", status:"Upcoming" },
    { id:"ms13", date:"2026-09-30", name:"Governance cadence approved", status:"Upcoming" },
    { id:"kpichk-o6-q1", date:"2026-09-30", name:"Q1 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q1", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o6-q2", date:"2026-12-31", name:"Q2 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q2", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o6-q3", date:"2027-03-31", name:"Q3 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q3", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o6-q4", date:"2027-06-30", name:"Q4 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q4", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
  ],
};

// ---- Objective 7 (weakest performer — flagged in insights) ----------------
const O7 = {
  id:"o7", number:7, streamId:"s2", owner:"Randa", assignedOwner: null,
  title:"Make AI a department capability, not a personal habit",
  subtitle:"", meaning:"AI takes the repetitive work so you do the deep thinking — with the time measured back.",
  start:"2026-09-01", end:"2026-12-31", lastUpdate:"2026-07-20",
  kpi: { id:"k7", name:"AI Capability Maturity Index", current:28, target:70, previous:26, unit:"%", lowerBetter:false },
  subMetrics: [
    { id:"sm7-1", name:"Institutional AI Use Case Coverage", current:22, target:70, previous:20, unit:"%", trend:"flat", lastUpdated:"2026-07-18", dataOwner:"Randa" },
    { id:"sm7-2", name:"Active AI Adoption Across Team", current:35, target:75, previous:32, unit:"%", trend:"up", lastUpdated:"2026-07-19", dataOwner:"Randa" },
    { id:"sm7-3", name:"AI Productivity Lift", current:12, target:40, previous:10, unit:"%", trend:"flat", lastUpdated:"2026-07-15", dataOwner:"Fahad" },
  ],
  initiatives: [
    { id:"i7-1", name:"AI Baseline Discovery", owner:"Randa", start:"2026-09-01", due:"2026-07-31", progress:60, priority:"High", phase:"Build", nextMilestone:"Baseline report to leadership", deps:[], risks:"Overdue against original plan; scope grew mid-way.", comments:"Baseline survey run late; report delayed.", evidence:"—", updatedBy:"Randa", history:[
        {date:"2026-07-20", prev:35, next:60, summary:"Baseline survey completed across the department.", blockers:"Report drafting delayed by resourcing.", next2:"Finalize baseline report.", by:"Randa"},
      ]},
    { id:"i7-2", name:"Institutional Use-Case Repository", owner:"Randa", start:"2026-09-01", due:"2026-08-15", progress:20, priority:"High", phase:"Design", nextMilestone:"Repository structure agreed", deps:["AI Baseline Discovery"], risks:"Blocked pending baseline report; now overdue.", comments:"On hold pending baseline completion.", evidence:"—", updatedBy:"Randa", history:[
        {date:"2026-07-10", prev:5, next:20, summary:"Initial repository structure sketched.", blockers:"Waiting on baseline findings.", next2:"Resume once baseline report lands.", by:"Randa"},
      ]},
    { id:"i7-3", name:"Enablement & Adoption", owner:"Fahad", start:"2026-09-15", due:"2026-11-15", progress:10, priority:"Medium", phase:"Not Started", nextMilestone:"Enablement plan drafted", deps:["Institutional Use-Case Repository"], risks:"Dependent on repository, currently stalled.", comments:"Not meaningfully started.", evidence:"—", updatedBy:"Fahad", history:[]},
    { id:"i7-4", name:"Productivity Lift Measurement", owner:"Randa", start:"2026-10-01", due:"2026-12-01", progress:0, priority:"Medium", phase:"Not Started", nextMilestone:"Measurement framework", deps:[], risks:"None", comments:"Not started.", evidence:"—", updatedBy:"Randa", history:[]},
    { id:"i7-5", name:"Continuous AI Research", owner:"Randa", start:"2026-09-01", due:"2026-12-31", progress:25, priority:"Low", phase:"Ongoing", nextMilestone:"Monthly research digest", deps:[], risks:"None", comments:"Informal research ongoing, not yet institutionalized.", evidence:"—", updatedBy:"Randa", history:[
        {date:"2026-07-15", prev:15, next:25, summary:"First informal research digest shared with team.", blockers:"None", next2:"Formalize monthly cadence.", by:"Randa"},
      ]},
  ],
  milestones: [
    { id:"ms14", date:"2026-08-15", name:"Use-case repository structure agreed", status:"Overdue" },
    { id:"ms15", date:"2026-09-30", name:"Baseline report to leadership", status:"Overdue" },
    { id:"kpichk-o7-q1", date:"2026-09-30", name:"Q1 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q1", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o7-q2", date:"2026-12-31", name:"Q2 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q2", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o7-q3", date:"2027-03-31", name:"Q3 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q3", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o7-q4", date:"2027-06-30", name:"Q4 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q4", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
  ],
};

// ---- Objective 8 -----------------------------------------------------------
const O8 = {
  id:"o8", number:8, streamId:"s2", owner:"Leen", assignedOwner: null,
  title:"Give leaders real-time visibility into the work",
  subtitle:"Without depending on 1:1s.", meaning:"Your contribution is seen without chasing your lead in a 1:1.",
  start:"2026-07-01", end:"2026-12-31", lastUpdate:"2026-08-13",
  kpi: { id:"k8", name:"Leadership Visibility Index", current:69, target:88, previous:52, unit:"%", lowerBetter:false },
  subMetrics: [
    { id:"sm8-1", name:"Engagement Health Visibility", current:72, target:90, previous:55, unit:"%", trend:"up", lastUpdated:"2026-08-12", dataOwner:"Leen" },
    { id:"sm8-2", name:"Analyst Performance & Workload Visibility", current:65, target:85, previous:48, unit:"%", trend:"up", lastUpdated:"2026-08-11", dataOwner:"Leen" },
  ],
  initiatives: [
    { id:"i8-1", name:"Leadership Question Set + Dashboard Spec", owner:"Leen", start:"2026-07-01", due:"2026-07-31", progress:100, priority:"High", phase:"Closed", nextMilestone:"—", deps:[], risks:"None", comments:"Question set validated with BA Lead.", evidence:"sp://ba/leadership-qset", updatedBy:"Leen", history:[
        {date:"2026-07-28", prev:70, next:100, summary:"Question set finalized with BA Lead sign-off.", blockers:"None", next2:"Build engagement-health view.", by:"Leen"},
      ]},
    { id:"i8-2", name:"Engagement-Health View", owner:"Omar", start:"2026-08-01", due:"2026-09-15", progress:70, priority:"High", phase:"Build", nextMilestone:"View live for pilot group", deps:["Leadership Question Set + Dashboard Spec"], risks:"None", comments:"View built for 5 of 8 engagements.", evidence:"—", updatedBy:"Omar", history:[
        {date:"2026-08-10", prev:45, next:70, summary:"Engagement-health view built for 5 of 8 engagements.", blockers:"None", next2:"Extend to remaining engagements.", by:"Omar"},
      ]},
    { id:"i8-3", name:"Analyst Performance & Workload View", owner:"Leen", start:"2026-08-15", due:"2026-10-15", progress:35, priority:"Medium", phase:"Build", nextMilestone:"Workload model validated", deps:[], risks:"Sensitive data handling needs sign-off.", comments:"Model under review with department heads.", evidence:"—", updatedBy:"Leen", history:[
        {date:"2026-08-05", prev:15, next:35, summary:"Workload model drafted and shared for review.", blockers:"Awaiting sign-off on data sensitivity handling.", next2:"Finalize sign-off.", by:"Leen"},
      ]},
    { id:"i8-4", name:"Leadership Rollout & Adoption", owner:"Leen", start:"2026-10-01", due:"2026-11-30", progress:0, priority:"Medium", phase:"Not Started", nextMilestone:"Rollout plan", deps:["Analyst Performance & Workload View"], risks:"None", comments:"Not yet started.", evidence:"—", updatedBy:"Leen", history:[]},
  ],
  milestones: [
    { id:"ms16", date:"2026-09-15", name:"Engagement-health view fully live", status:"Upcoming" },
    { id:"ms17", date:"2026-11-30", name:"Leadership rollout complete", status:"Upcoming" },
    { id:"kpichk-o8-q1", date:"2026-09-30", name:"Q1 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q1", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o8-q2", date:"2026-12-31", name:"Q2 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q2", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o8-q3", date:"2027-03-31", name:"Q3 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q3", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o8-q4", date:"2027-06-30", name:"Q4 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q4", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
  ],
};

// ---- Objective 9 -----------------------------------------------------------
const O9 = {
  id:"o9", number:9, streamId:"s2", owner:"Yasser", assignedOwner: null,
  title:"Grow and onboard analysts with intent",
  subtitle:"Clear paths, fair assessment, fast activation.", meaning:"A career path you can see, and a fair read based on evidence, not memory.",
  start:"2026-09-01", end:"2026-12-31", lastUpdate:"2026-08-06",
  kpi: { id:"k9", name:"Analyst Growth & Readiness Index", current:47, target:80, previous:33, unit:"%", lowerBetter:false },
  subMetrics: [
    { id:"sm9-1", name:"Career Path Clarity", current:55, target:85, previous:38, unit:"%", trend:"up", lastUpdated:"2026-08-04", dataOwner:"Yasser" },
    { id:"sm9-2", name:"Continuous Performance Visibility", current:40, target:80, previous:28, unit:"%", trend:"up", lastUpdated:"2026-08-05", dataOwner:"Leen" },
    { id:"sm9-3", name:"New Analyst Time-to-Productivity", current:50, target:80, previous:35, unit:"%", trend:"up", lastUpdated:"2026-08-03", dataOwner:"Noura" },
    { id:"sm9-4", name:"Talent Pipeline Readiness", current:42, target:75, previous:30, unit:"%", trend:"up", lastUpdated:"2026-08-02", dataOwner:"Yasser" },
  ],
  initiatives: [
    { id:"i9-1", name:"Career Framework & Conversations", owner:"Yasser", start:"2026-09-01", due:"2026-08-31", progress:65, priority:"High", phase:"Rollout", nextMilestone:"Framework conversations complete, all analysts", deps:[], risks:"None", comments:"Framework conversations held with 9 of 14 analysts.", evidence:"—", updatedBy:"Yasser", history:[
        {date:"2026-08-01", prev:40, next:65, summary:"Career conversations held with 9 of 14 analysts.", blockers:"None", next2:"Complete remaining conversations.", by:"Yasser"},
      ]},
    { id:"i9-2", name:"Performance Signals & Dashboard View", owner:"Leen", start:"2026-09-15", due:"2026-11-15", progress:25, priority:"Medium", phase:"Design", nextMilestone:"Signal set agreed", deps:["Analyst Performance & Workload View"], risks:"None", comments:"Signal set drafted, pending workload view.", evidence:"—", updatedBy:"Leen", history:[
        {date:"2026-08-02", prev:10, next:25, summary:"Draft performance signal set circulated.", blockers:"None", next2:"Align with workload view build.", by:"Leen"},
      ]},
    { id:"i9-3", name:"Onboarding Playbook & Tracker", owner:"Noura", start:"2026-09-01", due:"2026-10-15", progress:45, priority:"High", phase:"Build", nextMilestone:"Playbook v1 complete", deps:[], risks:"None", comments:"Playbook draft covers first 30 days; extending to 90.", evidence:"—", updatedBy:"Noura", history:[
        {date:"2026-08-06", prev:20, next:45, summary:"30-day onboarding playbook drafted.", blockers:"None", next2:"Extend to 60/90-day milestones.", by:"Noura"},
      ]},
    { id:"i9-4", name:"Talent Pipeline & Quarterly Reviews", owner:"Yasser", start:"2026-10-01", due:"2026-12-15", progress:5, priority:"Medium", phase:"Not Started", nextMilestone:"Pipeline review cadence set", deps:["Career Framework & Conversations"], risks:"None", comments:"Not meaningfully started.", evidence:"—", updatedBy:"Yasser", history:[]},
  ],
  milestones: [
    { id:"ms18", date:"2026-10-15", name:"Onboarding playbook complete", status:"Upcoming" },
    { id:"ms19", date:"2026-12-15", name:"First quarterly talent review", status:"Upcoming" },
    { id:"kpichk-o9-q1", date:"2026-09-30", name:"Q1 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q1", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o9-q2", date:"2026-12-31", name:"Q2 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q2", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o9-q3", date:"2027-03-31", name:"Q3 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q3", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
    { id:"kpichk-o9-q4", date:"2027-06-30", name:"Q4 KPI Update", status:"Upcoming", kind:"kpi_checkpoint", quarter:"Q4", reviewStatus:"Not Submitted", kpiRecords:{}, reviewedBy:null, reviewNote:"" },
  ],
};

RAW.objectives = [O1, O2, O3, O4, O5, O6, O7, O8, O9];

RAW.risks = [
  { id:"r1", severity:"Critical", objective:"o7", initiative:"i7-2", owner:"Randa", issue:"Use-case repository overdue by 2 days and blocked on baseline report.", action:"Escalate resourcing; unblock baseline report this week.", due:"2026-08-20" },
  { id:"r2", severity:"Critical", objective:"o7", initiative:"i7-1", owner:"Randa", issue:"AI baseline report is the department's furthest-behind deliverable.", action:"BA Lead to review scope with Randa and reset the plan.", due:"2026-08-22" },
  { id:"r3", severity:"High", objective:"o2", initiative:"i2-3", owner:"Omar", issue:"Real-time automated reporting has no confirmed dev resource.", action:"Request dedicated IT/dev allocation for Q4.", due:"2026-08-28" },
  { id:"r4", severity:"Medium", objective:"o1", initiative:"i1-2", owner:"Sara", issue:"BD calendar availability is constraining the pre-sales discovery pilot.", action:"Agree a fixed weekly slot with BD lead.", due:"2026-09-01" },
  { id:"r5", severity:"Medium", objective:"o8", initiative:"i8-3", owner:"Leen", issue:"Analyst workload view needs sign-off on sensitive-data handling.", action:"Get data governance sign-off from department heads.", due:"2026-08-25" },
  { id:"r6", severity:"Low", objective:"o4", initiative:"i4-3", owner:"Yasser", issue:"Analysts not yet trained on opportunity capture triggers.", action:"Schedule a 30-min capture-process walkthrough.", due:"2026-09-05" },
];

/* ============================================================================
   CALCULATION LAYER — nothing below is hard-coded; all derived from RAW.
============================================================================ */
function timelineStatus(startStr, endStr, progress) {
  const start = d(startStr), end = d(endStr);
  const total = Math.max(1, daysBetween(start, end));
  const elapsed = Math.min(Math.max(daysBetween(start, TODAY), 0), total);
  const expectedPct = (elapsed / total) * 100;
  if (progress >= 100) return "Completed";
  if (TODAY < start) return "Not Started";
  const gap = expectedPct - progress;
  if (elapsed >= total && progress < 100) return "Delayed";
  if (gap > 20) return "Delayed";
  if (gap > 8) return "At Risk";
  return "On Track";
}
function isOverdue(dueStr, progress) {
  return d(dueStr) < TODAY && progress < 100;
}
function initiativeStatus(init) {
  const activities = init.activities || [];
  if (activities.length) {
    const statuses = activities.map(a => activityStatus(a));
    if (statuses.every(s => s === "Completed")) return "Completed";
    if (statuses.some(s => s === "Delayed")) return "Delayed";
    if (statuses.some(s => s === "At Risk")) return "At Risk";
    if (statuses.every(s => s === "Not Started")) return "Not Started";
    return "On Track";
  }
  if (init.progress >= 100) return "Completed";
  if (init.phase === "Not Started" && init.progress === 0) return isOverdue(init.due, init.progress) ? "Delayed" : "Not Started";
  return timelineStatus(init.start, init.due, init.progress);
}
function achievementPct(kpi) {
  if (kpi.lowerBetter) return Math.min(150, (kpi.target / Math.max(kpi.current, 0.0001)) * 100);
  return Math.min(150, (kpi.current / kpi.target) * 100);
}
function kpiStatus(kpi) {
  const a = achievementPct(kpi);
  if (a >= 100) return "Meeting Target";
  if (a >= 80) return "On Track";
  if (a >= 55) return "Below Target";
  return "Below Target";
}
/* ============================================================================
   STRATEGIC MEASUREMENT — KPI-DRIVEN
   At the strategy / stream / objective level, "progress" and "status" mean
   KPI achievement against target, NOT how many activities got ticked off.
   Activity completion still drives the *initiative* layer (see
   initiativeStatus / enrichObjectives), but it never rolls up into the
   strategic numbers the BA Lead reviews.
============================================================================ */

/* Objective progress = how far its KPI has come toward target (0–100). */
function objectiveProgress(obj, forecastOverrides) {
  const ov = forecastOverrides?.[obj.id];
  if (ov != null) return ov;
  return Math.round(Math.min(100, achievementPct(obj.kpi)));
}

/* Objective health blends KPI achievement with its sub-metrics, so a KPI
   that looks fine but is propped up by one strong sub-metric still shows
   the strain. Weighted 70% headline KPI / 30% average of sub-metrics. */
function objectiveHealth(obj, weights, forecastOverrides) {
  const kpiAch = Math.min(100, achievementPct(obj.kpi));
  const subs = obj.subMetrics || [];
  if (!subs.length) return Math.round(kpiAch);
  const subAvg = subs.reduce((a, sm) => {
    const ach = sm.lowerBetter
      ? (sm.target / Math.max(sm.current, 0.0001)) * 100
      : (sm.current / Math.max(sm.target, 0.0001)) * 100;
    return a + Math.min(100, ach);
  }, 0) / subs.length;
  return Math.round(kpiAch * 0.7 + subAvg * 0.3);
}

/* Objective status is derived from KPI achievement, not from dates or
   activity ticks: at/over target = On Track, close = At Risk, far = Delayed. */
function objectiveStatus(obj, forecastOverrides) {
  const ov = forecastOverrides?.[obj.id];
  const ach = ov != null ? ov : Math.min(150, achievementPct(obj.kpi));
  if (ach >= 100) return "Completed";
  if (ach >= 85) return "On Track";
  if (ach >= 60) return "At Risk";
  return "Delayed";
}
function streamProgress(stream, objectives, forecastOverrides) {
  const objs = objectives.filter(o => o.streamId === stream.id);
  if (!objs.length) return 0;
  return Math.round(objs.reduce((a, o) => a + objectiveProgress(o, forecastOverrides), 0) / objs.length);
}
function strategyProgress(streams, objectives, forecastOverrides) {
  if (!streams.length) return 0;
  return Math.round(streams.reduce((a, s) => a + streamProgress(s, objectives, forecastOverrides), 0) / streams.length);
}
/* ============================================================================
   ACTIVITY & SUB-ACTIVITY → INITIATIVE → OBJECTIVE KPI ROLL-UP
   Both Activities and Sub-Activities can record a measured value against the
   objective's KPI and/or any of its Sub-Metrics (kpiRecords: { kpi: 82,
   "sm1-1": 70, ... }). Whenever activities exist, the initiative's progress
   and the objective's live KPI/sub-metric current values are derived
   automatically from all of these recorded values — this is what makes the
   Activity/Sub-Activity forms "reflect on the dashboard".
============================================================================ */
function subProgress(sub) {
  return sub.progress != null ? sub.progress : (sub.done ? 100 : 0);
}
function effectiveActivityProgress(a) {
  const subs = a.subActivities || [];
  if (subs.length) return Math.round(subs.reduce((acc, s) => acc + subProgress(s), 0) / subs.length);
  return a.progress ?? 0;
}
/* Activity/Sub-Activity status: driven by Planned Start/End vs progress
   (via the same timelineStatus() used for objectives/initiatives), with an
   explicit Actual End marking it Completed regardless of the math. */
function activityStatus(a) {
  if (a.actualEnd) return "Completed";
  const start = a.plannedStart || effectiveDate(a);
  const end = a.plannedEnd || start;
  return timelineStatus(start, end, effectiveActivityProgress(a));
}
function subActivityStatus(s) {
  if (s.actualEnd) return "Completed";
  const start = s.plannedStart || "2026-07-01";
  const end = s.plannedEnd || start;
  return timelineStatus(start, end, subProgress(s));
}
/* Most recent lastUpdated timestamp across an objective's Activities,
   Sub-Activities, and Milestones — the real signal of "the owner did
   something in the Timeline", used to drive Update Compliance. */
function lastActivityUpdate(o) {
  const dates = [];
  o.initiatives.forEach(i => {
    (i.activities || []).forEach(a => {
      if (a.lastUpdated) dates.push(a.lastUpdated);
      (a.subActivities || []).forEach(s => { if (s.lastUpdated) dates.push(s.lastUpdated); });
    });
  });
  (o.milestones || []).forEach(m => { if (m.lastUpdated) dates.push(m.lastUpdated); });
  if (!dates.length) return null;
  return dates.sort().slice(-1)[0];
}

/* KPI values are now ONLY updated via a quarterly checkpoint milestone that
   the Objective Owner submits and the BA Lead approves — not from any
   activity/sub-activity. This finds the most recently approved checkpoint's
   values for a given objective and uses those as the "official" current KPI
   value; if none is approved yet, the seeded baseline is used. */
function latestApprovedCheckpoint(o) {
  const approved = (o.milestones || []).filter(m => m.kind === "kpi_checkpoint" && m.reviewStatus === "Approved");
  if (!approved.length) return null;
  return [...approved].sort((a, b) => (a.date < b.date ? -1 : 1)).slice(-1)[0];
}

function enrichObjectives(objs) {
  return objs.map(o => {
    const initiatives = o.initiatives.map(i => {
      const activities = i.activities || [];
      if (!activities.length) return i;
      const progress = Math.round(activities.reduce((a, act) => a + effectiveActivityProgress(act), 0) / activities.length);
      return { ...i, progress };
    });
    const checkpoint = latestApprovedCheckpoint(o);
    const records = checkpoint?.kpiRecords || {};
    const kpiVal = records.kpi;
    const kpi = (kpiVal !== undefined && kpiVal !== null && kpiVal !== "" && !Number.isNaN(Number(kpiVal)))
      ? { ...o.kpi, previous: o.kpi.current, current: Number(kpiVal) } : o.kpi;
    const subMetrics = o.subMetrics.map(sm => {
      const v = records[sm.id];
      return (v !== undefined && v !== null && v !== "" && !Number.isNaN(Number(v)))
        ? { ...sm, previous: sm.current, current: Number(v) } : sm;
    });
    return { ...o, initiatives, kpi, subMetrics };
  });
}

/* Strategy health is now entirely KPI-driven. Its four components are all
   different reads on measurement performance rather than activity delivery:
     - kpiAch:      average headline KPI achievement across objectives
     - subMetricAch: average sub-metric achievement (depth behind the KPI)
     - kpisOnTarget: share of objectives whose KPI is at/over target
     - measured:    share of objectives with an approved KPI checkpoint
                    (i.e. how much of the picture is actually evidenced) */
function strategyHealth(streams, objectives, weights, forecastOverrides) {
  if (!objectives.length) return { score: 0, kpiAch: 0, subMetricAch: 0, kpisOnTarget: 0, measured: 0 };
  const kpiAch = Math.round(objectives.reduce((a, o) => a + Math.min(100, achievementPct(o.kpi)), 0) / objectives.length);

  const allSubs = objectives.flatMap(o => o.subMetrics || []);
  const subMetricAch = allSubs.length
    ? Math.round(allSubs.reduce((a, sm) => {
        const ach = sm.lowerBetter
          ? (sm.target / Math.max(sm.current, 0.0001)) * 100
          : (sm.current / Math.max(sm.target, 0.0001)) * 100;
        return a + Math.min(100, ach);
      }, 0) / allSubs.length)
    : kpiAch;

  const onTargetCount = objectives.filter(o => achievementPct(o.kpi) >= 100).length;
  const kpisOnTarget = Math.round((onTargetCount / objectives.length) * 100);

  const measuredCount = objectives.filter(o => latestApprovedCheckpoint(o) != null).length;
  const measured = Math.round((measuredCount / objectives.length) * 100);

  const score = kpiAch * 0.40 + subMetricAch * 0.25 + kpisOnTarget * 0.20 + measured * 0.15;
  return { score: Math.round(score), kpiAch, subMetricAch, kpisOnTarget, measured };
}

const STATUS_COLOR = {
  "On Track": T.green, "Completed": T.blue, "At Risk": T.amber, "Delayed": T.red,
  "Not Started": T.gray, "In Progress": T.blue, "On Hold": T.gray,
  "Meeting Target": T.green, "Below Target": T.amber,
  "Submitted": T.green, "Pending": T.amber, "Late": T.red,
  "Critical": T.red, "High": T.amber, "Medium": T.blue, "Low": T.gray,
};
const STATUS_SOFT = {
  "On Track": T.greenSoft, "Completed": T.blueSoft, "At Risk": T.amberSoft, "Delayed": T.redSoft,
  "Not Started": T.graySoft, "In Progress": T.blueSoft, "On Hold": T.graySoft,
  "Meeting Target": T.greenSoft, "Below Target": T.amberSoft,
  "Submitted": T.greenSoft, "Pending": T.amberSoft, "Late": T.redSoft,
  "Critical": T.redSoft, "High": T.amberSoft, "Medium": T.blueSoft, "Low": T.graySoft,
};

/* ============================================================================
   SMALL UI PRIMITIVES
============================================================================ */
const StatusChip = ({ status, size = "sm" }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: size === "sm" ? "3px 9px" : "4px 12px",
    borderRadius: 20, fontSize: size === "sm" ? 11.5 : 12.5, fontWeight: 600,
    color: STATUS_COLOR[status] || T.gray, background: STATUS_SOFT[status] || T.graySoft,
    whiteSpace: "nowrap", fontFamily: FONT,
  }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLOR[status] || T.gray }} />
    {status}
  </span>
);

const ProgressBar = ({ value, color, height = 7, track = T.graySoft }) => (
  <div style={{ width: "100%", height, background: track, borderRadius: 20, overflow: "hidden" }}>
    <div style={{ width: `${Math.min(100, Math.max(0, value))}%`, height: "100%", background: color || T.blue, borderRadius: 20, transition: "width .4s ease" }} />
  </div>
);

const Trend = ({ current, previous, lowerBetter = false, suffix = "" }) => {
  if (previous == null) return null;
  const diff = current - previous;
  const good = lowerBetter ? diff < 0 : diff > 0;
  const flat = Math.abs(diff) < 0.5;
  const Icon = flat ? Minus : (good ? TrendingUp : TrendingDown);
  const color = flat ? T.gray : (good ? T.green : T.red);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color, fontSize: 12.5, fontWeight: 600, fontFamily: MONO }}>
      <Icon size={13} />{diff > 0 ? "+" : ""}{diff.toFixed(1)}{suffix}
    </span>
  );
};

const Num = ({ children, size = 15, weight = 700, color = T.ink }) => (
  <span style={{ fontFamily: MONO, fontSize: size, fontWeight: weight, color }}>{children}</span>
);

const Card = ({ children, style, onClick, hoverable }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.bg, border: `1px solid ${hov && hoverable ? T.borderStrong : T.border}`,
        borderRadius: 12, transition: "border-color .15s ease, box-shadow .15s ease, transform .15s ease",
        cursor: onClick ? "pointer" : "default",
        boxShadow: hov && hoverable ? "0 6px 18px rgba(14,42,71,0.08)" : "0 1px 2px rgba(14,42,71,0.03)",
        transform: hov && hoverable ? "translateY(-1px)" : "none",
        ...style,
      }}
    >{children}</div>
  );
};

const SectionLabel = ({ children, icon: Icon }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
    {Icon && <Icon size={15} color={T.plum} />}
    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: T.inkMuted, textTransform: "uppercase", fontFamily: FONT }}>{children}</span>
  </div>
);

/* ============================================================================
   STRATEGY HEALTH GAUGE  — signature element: arc segments encode the
   configured weighting (35/30/20/15) and each segment's fill = its own score.
============================================================================ */
const HealthGauge = ({ health, weights }) => {
  const segs = [
    { key: "kpiAch", label: "KPI Achievement", w: weights.kpiAch, color: T.blue },
    { key: "subMetricAch", label: "Sub-Metrics", w: weights.subMetricAch, color: T.plum },
    { key: "kpisOnTarget", label: "KPIs On Target", w: weights.kpisOnTarget, color: T.green },
    { key: "measured", label: "Measured", w: weights.measured, color: T.amber },
  ];
  const R = 78, CX = 100, CY = 100, STROKE = 16;
  const circumference = 2 * Math.PI * R;
  const gapDeg = 3;
  let cursor = -90;
  const arcs = segs.map(s => {
    const sweep = s.w * 360 - gapDeg;
    const startAngle = cursor;
    cursor += s.w * 360;
    const filled = sweep * (s => s / 100)(health[s.key] ?? 0);
    return { ...s, startAngle, sweep, filled };
  });
  const polar = (cx, cy, r, angleDeg) => {
    const a = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };
  const arcPath = (startAngle, sweepAngle, r) => {
    const end = startAngle + sweepAngle;
    const p1 = polar(CX, CY, r, startAngle);
    const p2 = polar(CX, CY, r, end);
    const large = sweepAngle > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`;
  };
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ maxWidth: 220, maxHeight: 220 }}>
      {arcs.map((s, idx) => (
        <g key={s.key}>
          <path d={arcPath(s.startAngle, s.sweep, R)} stroke={STATUS_SOFT["Not Started"]} strokeWidth={STROKE} fill="none" strokeLinecap="round" />
          <path d={arcPath(s.startAngle, s.filled, R)} stroke={s.color} strokeWidth={STROKE} fill="none" strokeLinecap="round" />
        </g>
      ))}
      <text x="100" y="94" textAnchor="middle" fontFamily={MONO} fontSize="34" fontWeight="700" fill={T.ink}>{health.score}</text>
      <text x="100" y="116" textAnchor="middle" fontFamily={FONT} fontSize="11" fontWeight="600" fill={T.inkMuted} letterSpacing="0.5">HEALTH / 100</text>
    </svg>
  );
};

/* ============================================================================
   FILTER BAR
============================================================================ */
function FilterBar({ filters, setFilters, objectives, streams, lockedOwner }) {
  const owners = useMemo(() => Array.from(new Set(objectives.map(o => o.owner))).sort(), [objectives]);
  const objectiveOptions = useMemo(
    () => (lockedOwner ? objectives.filter(o => o.owner === lockedOwner) : objectives),
    [objectives, lockedOwner]
  );
  const statuses = ["On Track", "At Risk", "Delayed", "Completed", "Not Started"];
  const Select = ({ label, value, onChange, options }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 128 }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, color: T.inkFaint, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</span>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        style={{
          border: `1px solid ${T.border}`, borderRadius: 8, padding: "7px 9px", fontSize: 13,
          fontFamily: FONT, color: T.ink, background: T.surface, outline: "none", cursor: "pointer",
        }}>
        <option value="">All</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
  const resetTarget = { stream: "", objective: "", owner: lockedOwner || "", status: "" };
  const active = Object.entries(filters).some(([k, v]) => v && !(lockedOwner && k === "owner"));
  return (
    <div style={{
      display: "flex", alignItems: "flex-end", gap: 14, padding: "14px 24px",
      background: T.surface, borderBottom: `1px solid ${T.border}`, flexWrap: "wrap",
    }}>
      <Filter size={15} color={T.inkFaint} style={{ marginBottom: 9 }} />
      <Select label="Stream" value={filters.stream} onChange={v => setFilters(f => ({ ...f, stream: v }))} options={streams.map(s => s.name)} />
      <Select label="Objective" value={filters.objective} onChange={v => setFilters(f => ({ ...f, objective: v }))} options={objectiveOptions.map(o => `O${o.number} · ${o.title}`)} />
      {!lockedOwner && (
        <Select label="Owner" value={filters.owner} onChange={v => setFilters(f => ({ ...f, owner: v }))} options={owners} />
      )}
      <Select label="Status" value={filters.status} onChange={v => setFilters(f => ({ ...f, status: v }))} options={statuses} />
      {active && (
        <button onClick={() => setFilters(resetTarget)}
          style={{
            display: "flex", alignItems: "center", gap: 5, border: `1px solid ${T.border}`, background: T.bg,
            borderRadius: 8, padding: "7px 12px", fontSize: 12.5, fontWeight: 600, color: T.inkMuted, cursor: "pointer", marginBottom: 1,
          }}>
          <RotateCcw size={13} /> Reset filters
        </button>
      )}
    </div>
  );
}

function applyFilters(objectives, streams, filters) {
  return objectives.filter(o => {
    if (filters.stream && streams.find(s => s.id === o.streamId)?.name !== filters.stream) return false;
    if (filters.objective && `O${o.number} · ${o.title}` !== filters.objective) return false;
    if (filters.owner && o.owner !== filters.owner) return false;
    if (filters.status && objectiveStatus(o) !== filters.status) return false;
    return true;
  });
}

/* ============================================================================
   SIDEBAR NAV
============================================================================ */
const NAV_ITEMS = [
  { id: "overview", label: "Strategy Overview", icon: LayoutDashboard },
  { id: "streams", label: "Streams", icon: GitBranch },
  { id: "objectives", label: "Objectives", icon: Target },
  { id: "kpis", label: "KPIs & Sub-Metrics", icon: GaugeIcon },
  { id: "initiatives", label: "Initiatives", icon: ListChecks },
  { id: "timeline", label: "Timeline", icon: CalendarRange },
  { id: "risks", label: "Risks & Blockers", icon: AlertTriangle },
  { id: "compliance", label: "Update Compliance", icon: CheckSquare },
  { id: "settings", label: "Settings & Data", icon: SettingsIcon },
];

function Sidebar({ page, setPage, allowedTabs }) {
  const items = NAV_ITEMS.filter(i => allowedTabs.includes(i.id));
  return (
    <div style={{
      width: 240, minWidth: 240, background: T.navyDeep, height: "100%",
      display: "flex", flexDirection: "column", padding: "22px 14px",
    }}>
      <div style={{ padding: "0 10px 22px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 16 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.2, color: "#8FA8C4", textTransform: "uppercase", marginBottom: 4 }}>AZM Business Analysis</div>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", fontFamily: FONT, lineHeight: 1.25 }}>Strategy Command<br/>Center</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {items.map(item => {
          const Icon = item.icon;
          const activeItem = page === item.id;
          return (
            <button key={item.id} onClick={() => setPage(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8,
                border: "none", cursor: "pointer", textAlign: "left", fontFamily: FONT,
                background: activeItem ? "rgba(142,42,99,0.28)" : "transparent",
                color: activeItem ? "#fff" : "#A9BAD0", fontSize: 13.5, fontWeight: activeItem ? 700 : 500,
                borderLeft: activeItem ? `3px solid ${T.plum}` : "3px solid transparent",
                transition: "background .15s ease",
              }}>
              <Icon size={16} />{item.label}
            </button>
          );
        })}
      </div>
      <div style={{ padding: "12px 12px 0", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 11, color: "#6E85A0" }}>
        From Depth to Value — 2026
      </div>
    </div>
  );
}

/* ============================================================================
   TOP BAR
============================================================================ */
function TopBar({ forecastMode, setForecastMode, canEdit, year, setYear }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 24px", borderBottom: `1px solid ${T.border}`, background: T.bg,
    }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, color: T.navy }}>BA Strategy Command Center</div>
        <div style={{ fontSize: 12.5, color: T.inkMuted, marginTop: 1 }}>From Depth to Value — Strategy 2026</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <select value={year} onChange={e => setYear(e.target.value)} title="Compare a different year"
          style={{ border: `1px solid ${T.border}`, borderRadius: 8, padding: "7px 10px", fontSize: 12.5, fontWeight: 600, color: T.navy, background: T.surface, cursor: "pointer" }}>
          <option value="2026">2026 (Current)</option>
          <option value="2025">2025 (Archived)</option>
        </select>
        {canEdit && (
          <button onClick={() => setForecastMode(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 8,
              border: `1px solid ${forecastMode ? T.plum : T.border}`, cursor: "pointer",
              background: forecastMode ? T.plumSoft : T.bg, color: forecastMode ? T.plum : T.inkMuted,
              fontSize: 13, fontWeight: 700, fontFamily: FONT,
            }}>
            <Sliders size={14} /> {forecastMode ? "Forecast Mode: ON" : "Forecast Strategy"}
          </button>
        )}
        {!canEdit && (
          <span style={{
            display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20,
            background: T.graySoft, color: T.inkMuted, fontSize: 12, fontWeight: 700,
          }}>View only</span>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: T.inkMuted, fontSize: 12.5 }}>
          <Bell size={15} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: T.inkMuted, fontSize: 12 }}>
          <Clock size={13} /> Data refreshed Aug 17, 2026
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: "50%", background: T.navy, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, fontWeight: 700, fontFamily: FONT,
        }}>BA</div>
      </div>
    </div>
  );
}

/* ============================================================================
   KPI EXECUTIVE CARDS
============================================================================ */
function ExecCards({ objectives, streams, forecastOverrides, cycles, setPage, role }) {
  const progress = strategyProgress(streams, objectives, forecastOverrides);
  // Compare to last year's closed-out strategy, not last month's cycle.
  const prevYearProgress = RAW.archive2025.overallProgress;
  const prevYearLabel = RAW.archive2025.year;
  const objStatuses = objectives.map(o => objectiveStatus(o, forecastOverrides));
  const onTrack = objStatuses.filter(s => s === "On Track").length;
  const atRisk = objStatuses.filter(s => s === "At Risk").length;
  const delayed = objStatuses.filter(s => s === "Delayed").length;
  const completed = objStatuses.filter(s => s === "Completed").length;

  const kpiMeeting = objectives.filter(o => achievementPct(o.kpi) >= 100).length;
  const kpiBelow = objectives.filter(o => achievementPct(o.kpi) < 80).length;

  const allSubs = objectives.flatMap(o => o.subMetrics || []);
  const subsBelow = allSubs.filter(sm => {
    const ach = sm.lowerBetter ? (sm.target / Math.max(sm.current, 0.0001)) * 100 : (sm.current / Math.max(sm.target, 0.0001)) * 100;
    return ach < 80;
  }).length;

  const measuredCount = objectives.filter(o => latestApprovedCheckpoint(o) != null).length;
  const pendingReview = objectives.reduce((a, o) =>
    a + (o.milestones || []).filter(m => m.kind === "kpi_checkpoint" && m.reviewStatus === "Pending Review").length, 0);

  const cards = [
    {
      title: "Overall KPI Progress",
      value: `${progress}%`,
      sub: (
        <div>
          <Trend current={progress} previous={prevYearProgress} suffix="pt" />
          <div style={{ fontSize: 10.5, color: T.inkMuted, marginTop: 2 }}>vs {prevYearLabel} ({prevYearProgress}%)</div>
        </div>
      ),
      onClick: () => setPage("overview"),
    },
    {
      title: "Objectives by KPI",
      value: `${objectives.length} Total`,
      sub: (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 2 }}>
          <span style={{ fontSize: 11.5, color: T.blue, fontWeight: 700 }}>{completed} At Target</span>
          <span style={{ fontSize: 11.5, color: T.green, fontWeight: 700 }}>{onTrack} On Track</span>
          <span style={{ fontSize: 11.5, color: T.amber, fontWeight: 700 }}>{atRisk} At Risk</span>
          <span style={{ fontSize: 11.5, color: T.red, fontWeight: 700 }}>{delayed} Behind</span>
        </div>
      ),
      onClick: () => setPage("objectives"),
    },
    {
      title: "KPIs Meeting Target",
      value: `${kpiMeeting} / ${objectives.length}`,
      sub: <span style={{ fontSize: 12, color: kpiBelow ? T.amber : T.inkMuted, fontWeight: 600 }}>{kpiBelow} below 80% achievement</span>,
      onClick: () => setPage("kpis"),
    },
    {
      title: "Sub-Metrics Below Target",
      value: `${subsBelow} / ${allSubs.length}`,
      sub: <span style={{ fontSize: 12, color: subsBelow ? T.amber : T.inkMuted, fontWeight: 600 }}>{subsBelow ? "underperforming" : "all healthy"}</span>,
      onClick: () => setPage("kpis"),
    },
    {
      title: "Checkpoints",
      value: `${measuredCount} / ${objectives.length}`,
      sub: <span style={{ fontSize: 12, color: pendingReview ? T.amber : T.inkMuted, fontWeight: 600 }}>
        {pendingReview ? `${pendingReview} pending your review` : "measured & approved"}
      </span>,
      onClick: () => setPage("timeline"),
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
      {cards.map((c, i) => (
        <Card key={i} hoverable onClick={c.onClick} style={{ padding: "16px 18px" }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 8 }}>{c.title}</div>
          <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 700, color: T.navy, marginBottom: 6 }}>{c.value}</div>
          {c.sub}
        </Card>
      ))}
    </div>
  );
}

/* ============================================================================
   OVERVIEW PAGE
============================================================================ */
function insightsForData(objectives, streams, forecastOverrides) {
  const withProg = objectives.map(o => ({ o, p: objectiveProgress(o, forecastOverrides), h: objectiveHealth(o, RAW.settings.healthWeights, forecastOverrides) }));
  const strongest = [...withProg].sort((a,b) => b.p - a.p)[0];
  const weakest = [...withProg].sort((a,b) => a.p - b.p)[0];
  const s1p = streamProgress(streams[0], objectives, forecastOverrides);
  const s2p = streamProgress(streams[1], objectives, forecastOverrides);
  const belowTarget = objectives.filter(o => achievementPct(o.kpi) < 80).length;
  const unmeasured = objectives.filter(o => latestApprovedCheckpoint(o) == null).length;
  const pendingReview = objectives.reduce((a, o) =>
    a + (o.milestones || []).filter(m => m.kind === "kpi_checkpoint" && m.reviewStatus === "Pending Review").length, 0);

  // A KPI that looks acceptable while its sub-metrics lag is worth surfacing.
  const hollowKpi = objectives.find(o => {
    const kAch = achievementPct(o.kpi);
    const subs = o.subMetrics || [];
    if (!subs.length || kAch < 85) return false;
    const weakSubs = subs.filter(sm => {
      const ach = sm.lowerBetter ? (sm.target / Math.max(sm.current, 0.0001)) * 100 : (sm.current / Math.max(sm.target, 0.0001)) * 100;
      return ach < 70;
    });
    return weakSubs.length > 0;
  });

  const list = [
    `Objective ${strongest.o.number} ("${strongest.o.title}") has the strongest KPI achievement at ${strongest.p}% of target.`,
    `Objective ${weakest.o.number} ("${weakest.o.title}") is furthest from its KPI target at ${weakest.p}% and needs leadership attention.`,
    `${belowTarget} of ${objectives.length} objectives are below 80% KPI achievement.`,
    `${streams[0].name} is ${Math.abs(s1p - s2p)} percentage points ${s1p >= s2p ? "ahead of" : "behind"} ${streams[1].name} on KPI achievement.`,
  ];
  if (pendingReview > 0) {
    list.push(`${pendingReview} KPI checkpoint${pendingReview === 1 ? "" : "s"} awaiting your review before the numbers become official.`);
  }
  if (unmeasured > 0) {
    list.push(`${unmeasured} objective${unmeasured === 1 ? " has" : "s have"} no approved KPI checkpoint yet, so ${unmeasured === 1 ? "its" : "their"} figures are still baseline estimates.`);
  }
  if (hollowKpi) {
    list.push(`Objective ${hollowKpi.number}'s headline KPI looks healthy, but at least one sub-metric is under 70% — worth checking what's driving the average.`);
  }
  return list;
}

/* Illustrative prior-year summary shown when the Year filter is switched to
   an archived year. Real years will populate this automatically over time
   as each year's approved KPI checkpoints close out. */
function ArchivedYearSummary({ archive }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.amberSoft, borderRadius: 10, padding: "12px 16px" }}>
        <Clock size={16} color={T.amber} />
        <div style={{ fontSize: 13, color: T.ink }}>
          Viewing an <b>archived</b> year — {archive.label}. Closed out {archive.closedOut}.
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        <Card style={{ padding: "16px 18px" }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase", marginBottom: 8 }}>Overall Strategy Progress</div>
          <Num size={26} color={T.navy}>{archive.overallProgress}%</Num>
        </Card>
        <Card style={{ padding: "16px 18px" }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase", marginBottom: 8 }}>Strategy Health</div>
          <Num size={26} color={T.navy}>{archive.health}/100</Num>
        </Card>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {archive.streams.map(s => (
          <Card key={s.name} style={{ padding: 18, borderLeft: `4px solid ${s.color}` }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: s.color, marginBottom: 8 }}>{s.name}</div>
            <ProgressBar value={s.progress} color={s.color} height={8} />
            <div style={{ marginTop: 8, fontSize: 12, color: T.inkMuted }}>{s.progress}% complete</div>
          </Card>
        ))}
      </div>
      <Card style={{ padding: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.surface }}>
              {["KPI", "Result", "Target"].map(h => (
                <th key={h} style={{ padding: "10px 12px", fontSize: 10.5, fontWeight: 700, color: T.inkMuted, textAlign: "left", textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {archive.kpis.map((k, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: "12px", fontSize: 13, fontWeight: 600 }}>{k.objective}</td>
                <td style={{ padding: "12px", fontFamily: MONO, fontSize: 13 }}>{k.current}{k.unit}</td>
                <td style={{ padding: "12px", fontFamily: MONO, fontSize: 13, color: T.inkMuted }}>{k.target}{k.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div style={{ fontSize: 12, color: T.inkMuted, fontStyle: "italic" }}>{archive.note}</div>
    </div>
  );
}

/* KPI Progress at Strategy and Objective level — the primary view for the
   BA Lead, who cares about outcomes rather than activity-level tracking. */
function KpiProgressTable({ objectives, setSelectedObjective, setPage }) {
  const rows = [...objectives].sort((a, b) => achievementPct(b.kpi) - achievementPct(a.kpi));
  return (
    <Card style={{ padding: 0 }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: T.surface }}>
            {["Objective", "KPI", "Current", "Target", "Achievement", "Status"].map(h => (
              <th key={h} style={{ padding: "10px 12px", fontSize: 10.5, fontWeight: 700, color: T.inkMuted, textAlign: "left", textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(o => {
            const ach = achievementPct(o.kpi);
            return (
              <tr key={o.id} style={{ borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}
                onClick={() => { setSelectedObjective(o.id); setPage("objectives"); }}>
                <td style={{ padding: "12px", fontSize: 12.5 }}><span style={{ fontWeight: 700 }}>O{o.number}</span> <span style={{ color: T.inkMuted }}>{o.title}</span></td>
                <td style={{ padding: "12px", fontSize: 12.5, color: T.inkMuted }}>{o.kpi.name}</td>
                <td style={{ padding: "12px", fontFamily: MONO, fontSize: 13 }}>{o.kpi.current}{o.kpi.unit}</td>
                <td style={{ padding: "12px", fontFamily: MONO, fontSize: 13, color: T.inkMuted }}>{o.kpi.target}{o.kpi.unit}</td>
                <td style={{ padding: "12px", minWidth: 120 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1 }}><ProgressBar value={Math.min(100, ach)} color={ach >= 100 ? T.green : ach >= 80 ? T.blue : T.amber} height={6} /></div>
                    <Num size={11.5}>{Math.round(ach)}%</Num>
                  </div>
                </td>
                <td style={{ padding: "12px" }}><StatusChip status={kpiStatus(o.kpi)} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

function OverviewPage({ objectives, streams, forecastOverrides, cycles, setPage, setSelectedObjective, year, role }) {
  if (year === "2025") return <ArchivedYearSummary archive={RAW.archive2025} />;

  const health = strategyHealth(streams, objectives, RAW.settings.healthWeights, forecastOverrides);
  const insights = insightsForData(objectives, streams, forecastOverrides);
  const chartData = cycles.map(c => ({ name: c.label.split(" ")[0], value: c.overall }));

  const attentionItems = buildAttentionItems(objectives, forecastOverrides).slice(0, 4);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <ExecCards objectives={objectives} streams={streams} forecastOverrides={forecastOverrides} cycles={cycles} setPage={setPage} />

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 18 }}>
        <Card style={{ padding: 22, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <SectionLabel icon={GaugeIcon}>Overall Strategy Health</SectionLabel>
          <HealthGauge health={health} weights={RAW.settings.healthWeights} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: "100%", marginTop: 14 }}>
            {[
              { label: "KPI Achievement", v: health.kpiAch, color: T.blue },
              { label: "Sub-Metrics", v: health.subMetricAch, color: T.plum },
              { label: "KPIs On Target", v: health.kpisOnTarget, color: T.green },
              { label: "Measured", v: health.measured, color: T.amber },
            ].map(x => (
              <div key={x.label} style={{ fontSize: 11.5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: T.inkMuted, marginBottom: 2 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: x.color }} />{x.label}
                </div>
                <Num size={14}>{x.v}%</Num>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 22 }}>
          <SectionLabel icon={Lightbulb}>Leadership Insights</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
            {insights.map((ins, i) => (
              <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13.5, color: T.ink, lineHeight: 1.5 }}>
                <span style={{ minWidth: 6, height: 6, marginTop: 6, borderRadius: "50%", background: T.plum }} />
                {ins}
              </div>
            ))}
          </div>
          <div style={{ height: 170 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke={T.border} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: T.inkMuted, fontFamily: FONT }} axisLine={{ stroke: T.border }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: T.inkMuted, fontFamily: FONT }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <RTooltip contentStyle={{ fontFamily: FONT, fontSize: 12, borderRadius: 8, border: `1px solid ${T.border}` }} />
                <Line type="monotone" dataKey="value" stroke={T.plum} strokeWidth={2.5} dot={{ r: 3 }} name="Overall Strategy" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {streams.map(s => <StreamCard key={s.id} stream={s} objectives={objectives.filter(o => o.streamId === s.id)} forecastOverrides={forecastOverrides} onDrill={() => setPage("streams")} />)}
      </div>

      <div>
        <SectionLabel icon={GaugeIcon}>KPI Progress by Objective</SectionLabel>
        <KpiProgressTable objectives={objectives} setSelectedObjective={setSelectedObjective} setPage={setPage} />
      </div>

      {role !== "lead" && (
        <Card style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <SectionLabel icon={AlertTriangle}>Needs Your Attention</SectionLabel>
            <button onClick={() => setPage("risks")} style={{ border: "none", background: "none", color: T.plum, fontSize: 12.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
              View all <ChevronRight size={14} />
            </button>
          </div>
          <AttentionTable items={attentionItems} objectives={objectives} onSelect={(objId) => { setSelectedObjective(objId); setPage("objectives"); }} />
        </Card>
      )}
    </div>
  );
}

/* ============================================================================
   STREAM CARD
============================================================================ */
function StreamCard({ stream, objectives, forecastOverrides, onDrill }) {
  const p = streamProgress(stream, objectives, forecastOverrides);
  const statuses = objectives.map(o => objectiveStatus(o, forecastOverrides));
  const atTarget = statuses.filter(s => s === "Completed").length;
  const onTrack = statuses.filter(s => s === "On Track").length;
  const behind = statuses.filter(s => s === "At Risk" || s === "Delayed").length;
  const measured = objectives.filter(o => latestApprovedCheckpoint(o) != null).length;
  return (
    <Card hoverable onClick={onDrill} style={{ padding: 20, borderLeft: `4px solid ${stream.color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: stream.color, textTransform: "uppercase", letterSpacing: 0.5 }}>{stream.name}</div>
          <div style={{ fontSize: 12.5, color: T.inkMuted, marginTop: 2 }}>{stream.tagline}</div>
        </div>
        <Num size={24} color={stream.color}>{p}%</Num>
      </div>
      <div style={{ margin: "14px 0" }}><ProgressBar value={p} color={stream.color} height={8} /></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {[
          { label: "Objectives", v: objectives.length },
          { label: "At Target", v: atTarget },
          { label: "On Track", v: onTrack },
          { label: "Behind", v: behind },
        ].map(x => (
          <div key={x.label}>
            <div style={{ fontSize: 10.5, color: T.inkMuted, marginBottom: 2 }}>{x.label}</div>
            <Num size={15}>{x.v}</Num>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: T.inkMuted }}>
        Avg KPI Achievement: <Num size={13} color={T.ink}>{p}%</Num>
        <span style={{ marginLeft: 10 }}>Measured: <Num size={13} color={T.ink}>{measured}/{objectives.length}</Num></span>
      </div>
    </Card>
  );
}

/* ============================================================================
   ATTENTION / RISK LOGIC
============================================================================ */
function buildAttentionItems(objectives, forecastOverrides) {
  const items = [];
  objectives.forEach(o => {
    const ach = achievementPct(o.kpi);
    const unit = o.kpi.unit;
    // KPI-driven escalation — how far the measured value is from target.
    if (ach < 60) {
      items.push({ severity: "Critical", objective: o, initiative: null, owner: o.owner,
        issue: `${o.kpi.name} is far below target (${o.kpi.current}${unit} vs ${o.kpi.target}${unit}, ${Math.round(ach)}% achievement).`,
        action: "Reassess approach and resourcing with the objective owner.", due: o.end });
    } else if (ach < 85) {
      items.push({ severity: "High", objective: o, initiative: null, owner: o.owner,
        issue: `${o.kpi.name} is at ${Math.round(ach)}% of target and at risk of missing.`,
        action: "Review what's blocking the measure in the next check-in.", due: o.end });
    }

    // Sub-metrics dragging behind a headline KPI that looks acceptable.
    (o.subMetrics || []).forEach(sm => {
      const smAch = sm.lowerBetter
        ? (sm.target / Math.max(sm.current, 0.0001)) * 100
        : (sm.current / Math.max(sm.target, 0.0001)) * 100;
      if (smAch < 70) {
        items.push({ severity: "Medium", objective: o, initiative: null, owner: sm.dataOwner || o.owner,
          issue: `Sub-metric "${sm.name}" is at ${Math.round(smAch)}% of target (${sm.current}${sm.unit} vs ${sm.target}${sm.unit}).`,
          action: "Investigate root cause with the data owner.", due: o.end });
      }
    });

    // Governance: checkpoints awaiting review, or a quarter with nothing submitted.
    (o.milestones || []).filter(m => m.kind === "kpi_checkpoint").forEach(m => {
      if (m.reviewStatus === "Pending Review") {
        items.push({ severity: "High", objective: o, initiative: null, owner: o.owner,
          issue: `${m.name} is submitted and awaiting BA Lead review.`,
          action: "Review and approve so the figures become official.", due: m.date });
      } else if (m.reviewStatus === "Rejected") {
        items.push({ severity: "High", objective: o, initiative: null, owner: o.owner,
          issue: `${m.name} was rejected and needs resubmission.`,
          action: "Owner to correct the values and resubmit.", due: m.date });
      } else if (m.reviewStatus === "Not Submitted" && d(m.date) < TODAY) {
        items.push({ severity: "Critical", objective: o, initiative: null, owner: o.owner,
          issue: `${m.name} was due ${m.date} and has not been submitted.`,
          action: "Owner to measure and submit this quarter's KPI values.", due: m.date });
      }
    });
  });
  const rank = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  return items.sort((a, b) => rank[a.severity] - rank[b.severity]);
}

function AttentionTable({ items, onSelect }) {
  if (!items.length) return <div style={{ color: T.inkMuted, fontSize: 13 }}>No items currently need attention.</div>;
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {items.map((it, i) => (
        <div key={i} onClick={() => onSelect(it.objective.id)}
          style={{
            display: "grid", gridTemplateColumns: "90px minmax(0, 1fr) 130px 100px", gap: 12, alignItems: "center",
            padding: "11px 6px", borderTop: i === 0 ? "none" : `1px solid ${T.border}`, cursor: "pointer",
          }}>
          <StatusChip status={it.severity} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, color: T.ink, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.issue}</div>
            <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>O{it.objective.number} · {it.objective.title}{it.initiative ? ` — ${it.initiative.name}` : ""} · {it.action}</div>
          </div>
          <div style={{ fontSize: 12.5, color: T.inkMuted, display: "flex", alignItems: "center", gap: 5 }}><Users size={12} />{it.owner}</div>
          <div style={{ fontSize: 12.5, color: T.inkMuted, fontFamily: MONO }}>{it.due}</div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================================
   STREAMS PAGE
============================================================================ */
function StreamsPage({ objectives, streams, forecastOverrides, setPage, setSelectedObjective }) {
  const chartData = streams.map(s => ({
    name: s.name, Progress: streamProgress(s, objectives, forecastOverrides),
  }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {streams.map(s => <StreamCard key={s.id} stream={s} objectives={objectives.filter(o => o.streamId === s.id)} forecastOverrides={forecastOverrides} onDrill={() => {}} />)}
      </div>
      <Card style={{ padding: 22 }}>
        <SectionLabel icon={GitBranch}>Stream Comparison</SectionLabel>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid stroke={T.border} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: T.inkMuted, fontFamily: FONT }} axisLine={{ stroke: T.border }} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: T.inkMuted }} axisLine={false} tickLine={false} />
              <RTooltip contentStyle={{ fontFamily: FONT, fontSize: 12, borderRadius: 8, border: `1px solid ${T.border}` }} />
              <Bar dataKey="Progress" radius={[6, 6, 0, 0]} fill={T.blue} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      {streams.map(s => (
        <div key={s.id}>
          <SectionLabel icon={Target}>{s.name} — Objectives</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, marginBottom: 10 }}>
            {objectives.filter(o => o.streamId === s.id).map(o => (
              <ObjectiveCard key={o.id} obj={o} streamColor={s.color} forecastOverrides={forecastOverrides}
                onClick={() => { setSelectedObjective(o.id); setPage("objectives"); }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================================
   OBJECTIVE CARD (grid tile)
============================================================================ */
function ObjectiveCard({ obj, streamColor, forecastOverrides, onClick }) {
  const p = objectiveProgress(obj, forecastOverrides);
  const status = objectiveStatus(obj, forecastOverrides);
  const measured = latestApprovedCheckpoint(obj) != null;
  return (
    <Card hoverable onClick={onClick} style={{ padding: 16, borderTop: `3px solid ${streamColor}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7, background: T.navy, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 12, fontWeight: 700,
        }}>{obj.number}</div>
        <StatusChip status={status} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 6, lineHeight: 1.3 }}>{obj.title}</div>
      <div style={{ fontSize: 12, color: T.inkMuted, marginBottom: 10, display: "flex", alignItems: "center", gap: 5 }}>
        <Users size={12} /> {obj.owner}
      </div>
      <ProgressBar value={p} color={streamColor} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11.5, color: T.inkMuted }}>
        <span>KPI Achievement</span><Num size={12.5}>{p}%</Num>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11.5, color: T.inkMuted }}>
        <span>{obj.kpi.current}{obj.kpi.unit} / {obj.kpi.target}{obj.kpi.unit}</span>
        <span style={{ color: measured ? T.green : T.amber, fontWeight: 600 }}>{measured ? "Approved" : "Baseline"}</span>
      </div>
    </Card>
  );
}

/* ============================================================================
   OBJECTIVES PAGE (grid + drawer)
============================================================================ */
/* ============================================================================
   KPIs & SUB-METRICS PAGE — a single place to monitor every measure in the
   strategy and manage the metric set itself (targets change year to year).
   Editing rights follow the same rule as elsewhere: an Objective Owner can
   manage their own objectives' metrics; the BA Lead views only.
============================================================================ */
function KpisPage({ objectives, streams, role, currentOwner, perms, onUpdateKpi, onAddSubMetric, onUpdateSubMetric, onDeleteSubMetric, onUpdateMilestone, setSelectedObjective, setPage }) {
  const [expanded, setExpanded] = useState(null);
  const [kpiModal, setKpiModal] = useState(null); // { objectiveId, mode, metric, isMainKpi }
  const [checkpointModal, setCheckpointModal] = useState(null); // { objective, milestone }
  const [sortBy, setSortBy] = useState("lowest");
  const [query, setQuery] = useState("");

  const canEditObjective = (o) => role === "admin" || (role === "lead" && perms?.editKpiDefinition);
  const canApprove = role === "admin" || role === "lead";

  let rows = objectives.map(o => ({ o, ach: achievementPct(o.kpi) }));
  if (query) {
    const q = query.toLowerCase();
    rows = rows.filter(({ o }) =>
      o.kpi.name.toLowerCase().includes(q) ||
      o.title.toLowerCase().includes(q) ||
      (o.subMetrics || []).some(sm => sm.name.toLowerCase().includes(q))
    );
  }
  if (sortBy === "lowest") rows = [...rows].sort((a, b) => a.ach - b.ach);
  if (sortBy === "highest") rows = [...rows].sort((a, b) => b.ach - a.ach);
  if (sortBy === "objective") rows = [...rows].sort((a, b) => a.o.number - b.o.number);

  const allSubs = objectives.flatMap(o => o.subMetrics || []);
  const subAch = (sm) => sm.lowerBetter
    ? (sm.target / Math.max(sm.current, 0.0001)) * 100
    : (sm.current / Math.max(sm.target, 0.0001)) * 100;
  const meetingTarget = objectives.filter(o => achievementPct(o.kpi) >= 100).length;
  const subsBelow = allSubs.filter(sm => subAch(sm) < 80).length;
  const measured = objectives.filter(o => latestApprovedCheckpoint(o) != null).length;

  /* All quarterly KPI checkpoints that need someone's action, newest due first.
     Pending Review and Rejected come first, then overdue unsubmitted ones. */
  const checkpoints = objectives.flatMap(o =>
    (o.milestones || [])
      .filter(m => m.kind === "kpi_checkpoint")
      .map(m => ({ objective: o, m }))
  );
  const actionRank = (m) => {
    if (m.reviewStatus === "Pending Review") return 0;
    if (m.reviewStatus === "Rejected") return 1;
    if (m.reviewStatus === "Not Submitted" && d(m.date) < TODAY) return 2;
    if (m.reviewStatus === "Not Submitted") return 3;
    return 4; // Approved
  };
  const actionable = checkpoints
    .filter(({ m }) => actionRank(m) <= 2)
    .sort((a, b) => actionRank(a.m) - actionRank(b.m) || (a.m.date < b.m.date ? -1 : 1));
  const upcoming = checkpoints
    .filter(({ m }) => m.reviewStatus === "Not Submitted" && d(m.date) >= TODAY)
    .sort((a, b) => (a.m.date < b.m.date ? -1 : 1))
    .slice(0, 4);
  const pendingCount = checkpoints.filter(({ m }) => m.reviewStatus === "Pending Review").length;

  const checkpointChip = (m) =>
    m.reviewStatus === "Approved" ? "Completed"
      : m.reviewStatus === "Pending Review" ? "At Risk"
        : m.reviewStatus === "Rejected" ? "Delayed" : "Not Started";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {[
          { label: "Total KPIs", v: `${objectives.length}` },
          { label: "Meeting Target", v: `${meetingTarget} / ${objectives.length}` },
          { label: "Sub-Metrics Below Target", v: `${subsBelow} / ${allSubs.length}` },
          { label: "Approved Checkpoints", v: `${measured} / ${objectives.length}` },
        ].map(c => (
          <Card key={c.label} style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 8 }}>{c.label}</div>
            <Num size={22} color={T.navy}>{c.v}</Num>
          </Card>
        ))}
      </div>

      {/* Quarterly checkpoint review queue — this is where the BA Lead
          approves the numbers, since the Timeline tab is hidden for that role. */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <SectionLabel icon={CheckSquare}>
            Quarterly KPI Review Queue{pendingCount > 0 ? ` — ${pendingCount} awaiting approval` : ""}
          </SectionLabel>
        </div>
        <Card style={{ padding: 0 }}>
          {actionable.length === 0 ? (
            <div style={{ padding: 16, fontSize: 13, color: T.inkMuted }}>
              Nothing needs action right now — no submissions pending review and no overdue checkpoints.
            </div>
          ) : actionable.map(({ objective: o, m }, i) => {
            const mine = role === "admin" || (role === "leader" && currentOwner === o.owner);
            const overdue = m.reviewStatus === "Not Submitted" && d(m.date) < TODAY;
            return (
              <div key={m.id} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 110px 130px 120px 90px", gap: 12, alignItems: "center", padding: "12px 16px", borderTop: i === 0 ? "none" : `1px solid ${T.border}` }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, display: "flex", alignItems: "center", gap: 6 }}>
                    <GaugeIcon size={12} color={T.plum} />
                    {m.name}
                    {m.evidence && m.evidence.length > 0 && <Paperclip size={11} color={T.inkMuted} />}
                  </div>
                  <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    O{o.number} · {o.kpi.name} · {o.owner}
                  </div>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 12, color: overdue ? T.red : T.inkMuted }}>{m.date}</div>
                <StatusChip status={checkpointChip(m)} />
                <div style={{ fontSize: 11.5, color: T.inkMuted }}>
                  {m.reviewStatus === "Pending Review" ? "Needs your approval"
                    : m.reviewStatus === "Rejected" ? "Owner to resubmit"
                      : overdue ? "Overdue submission" : "—"}
                </div>
                {(mine || canApprove) ? (
                  <button onClick={() => setCheckpointModal({ objective: o, milestone: m })}
                    style={{
                      border: "none", borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                      background: m.reviewStatus === "Pending Review" && canApprove ? T.navy : T.surface,
                      color: m.reviewStatus === "Pending Review" && canApprove ? "#fff" : T.navy,
                    }}>
                    {m.reviewStatus === "Pending Review" && canApprove ? "Review" : mine ? "Open" : "View"}
                  </button>
                ) : <span />}
              </div>
            );
          })}
        </Card>
        {upcoming.length > 0 && (
          <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 8 }}>
            Next scheduled: {upcoming.map(({ objective: o, m }) => `O${o.number} ${m.quarter} (${m.date})`).join(" · ")}
          </div>
        )}
      </div>

      <SectionLabel icon={GaugeIcon}>All KPIs & Sub-Metrics</SectionLabel>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 220px", minWidth: 200, maxWidth: 340 }}>
          <Search size={15} style={{ position: "absolute", left: 10, top: 10, color: T.inkFaint }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search KPIs, sub-metrics, objectives…"
            style={{ width: "100%", boxSizing: "border-box", padding: "9px 10px 9px 32px", border: `1px solid ${T.border}`, borderRadius: 9, fontSize: 13, fontFamily: FONT }} />
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ flexShrink: 0, border: `1px solid ${T.border}`, borderRadius: 9, padding: "9px 10px", fontSize: 13, fontFamily: FONT, background: T.bg }}>
          <option value="lowest">Sort: Lowest achievement</option>
          <option value="highest">Sort: Highest achievement</option>
          <option value="objective">Sort: Objective</option>
        </select>
      </div>
      <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: -6 }}>
        KPI values change only via approved quarterly checkpoints — this manages the metric definitions themselves.
      </div>

      {rows.map(({ o, ach }) => {
        const stream = streams.find(s => s.id === o.streamId);
        const isOpen = expanded === o.id;
        const editable = canEditObjective(o);
        const checkpoint = latestApprovedCheckpoint(o);
        return (
          <Card key={o.id} style={{ padding: 0, borderLeft: `4px solid ${stream?.color || T.blue}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 130px 130px 90px 28px 28px", gap: 12, alignItems: "center", padding: "14px 16px" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: T.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.kpi.name}</div>
                <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  O{o.number} · {o.title} · {o.owner}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: T.inkMuted, marginBottom: 2 }}>Current / Target</div>
                <Num size={13}>{o.kpi.current}{o.kpi.unit} / {o.kpi.target}{o.kpi.unit}</Num>
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: T.inkMuted, marginBottom: 3 }}>Achievement</div>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ flex: 1 }}><ProgressBar value={Math.min(100, ach)} color={ach >= 100 ? T.green : ach >= 80 ? T.blue : T.amber} height={6} /></div>
                  <Num size={11.5}>{Math.round(ach)}%</Num>
                </div>
              </div>
              <StatusChip status={kpiStatus(o.kpi)} />
              {editable ? (
                <button onClick={() => setKpiModal({ objectiveId: o.id, mode: "edit", metric: o.kpi, isMainKpi: true })} title="Edit KPI"
                  style={{ border: "none", background: "none", cursor: "pointer", color: T.inkFaint, padding: 2, display: "flex" }}>
                  <Pencil size={13} />
                </button>
              ) : <span />}
              <button onClick={() => setExpanded(isOpen ? null : o.id)} title="Sub-metrics"
                style={{ border: "none", background: "none", cursor: "pointer", color: T.inkMuted, padding: 2, display: "flex" }}>
                {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </button>
            </div>

            {isOpen && (
              <div style={{ borderTop: `1px solid ${T.border}`, background: T.surface, padding: "12px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>
                    Sub-Metrics ({(o.subMetrics || []).length})
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, color: checkpoint ? T.green : T.amber, fontWeight: 600 }}>
                      {checkpoint ? `Last approved: ${checkpoint.name} (${checkpoint.date})` : "No approved checkpoint yet — baseline figures"}
                    </span>
                    {editable && (
                      <button onClick={() => setKpiModal({ objectiveId: o.id, mode: "add", metric: null, isMainKpi: false })}
                        style={{ display: "flex", alignItems: "center", gap: 5, border: `1px dashed ${T.borderStrong}`, background: T.bg, color: T.navy, borderRadius: 7, padding: "4px 9px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                        <Plus size={11} /> Add Sub-Metric
                      </button>
                    )}
                  </div>
                </div>
                {(o.subMetrics || []).length === 0 ? (
                  <div style={{ fontSize: 12.5, color: T.inkMuted, padding: "6px 0" }}>No sub-metrics defined for this KPI.</div>
                ) : (
                  <Card style={{ padding: 0 }}>
                    {o.subMetrics.map((sm, i) => {
                      const a = subAch(sm);
                      return (
                        <div key={sm.id} style={{ display: "grid", gridTemplateColumns: `minmax(0, 1fr) 120px 120px 90px ${editable ? "28px" : ""}`, gap: 10, alignItems: "center", padding: "10px 12px", borderTop: i === 0 ? "none" : `1px solid ${T.border}` }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.number}.{i + 1} {sm.name}</div>
                            <div style={{ fontSize: 10.5, color: T.inkMuted }}>owner: {sm.dataOwner || o.owner} · updated {sm.lastUpdated || "—"}</div>
                          </div>
                          <Num size={12.5}>{sm.current}{sm.unit} / {sm.target}{sm.unit}</Num>
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <div style={{ flex: 1 }}><ProgressBar value={Math.min(100, a)} color={a >= 100 ? T.green : a >= 80 ? T.blue : T.amber} height={5} /></div>
                            <span style={{ fontSize: 11, color: T.inkMuted }}>{Math.round(a)}%</span>
                          </div>
                          <StatusChip status={a >= 100 ? "Meeting Target" : a >= 80 ? "On Track" : "Below Target"} />
                          {editable && (
                            <button onClick={() => setKpiModal({ objectiveId: o.id, mode: "edit", metric: sm, isMainKpi: false })} title="Edit sub-metric"
                              style={{ border: "none", background: "none", cursor: "pointer", color: T.inkFaint, padding: 2, display: "flex" }}>
                              <Pencil size={12} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </Card>
                )}
              </div>
            )}
          </Card>
        );
      })}

      {kpiModal && (
        <KpiFormModal
          mode={kpiModal.mode} metric={kpiModal.metric} isMainKpi={kpiModal.isMainKpi}
          objectives={kpiModal.objectiveId ? undefined : objectives.filter(o => canEditObjective(o))}
          onClose={() => setKpiModal(null)}
          onSave={(payload) => {
            const { objectiveId: pickedId, ...rest } = payload;
            const targetObjId = kpiModal.objectiveId || pickedId;
            if (kpiModal.isMainKpi) onUpdateKpi(targetObjId, rest);
            else if (kpiModal.mode === "add") onAddSubMetric(targetObjId, rest);
            else onUpdateSubMetric(targetObjId, kpiModal.metric.id, rest);
            setKpiModal(null);
          }}
          onDelete={(!kpiModal.isMainKpi && kpiModal.mode === "edit") ? () => {
            onDeleteSubMetric(kpiModal.objectiveId, kpiModal.metric.id);
            setKpiModal(null);
          } : undefined}
        />
      )}

      {checkpointModal && (
        <KpiCheckpointModal
          milestone={checkpointModal.milestone} objective={checkpointModal.objective}
          canSubmit={role === "admin" || (role === "leader" && currentOwner === checkpointModal.objective.owner)}
          canApprove={canApprove}
          onClose={() => setCheckpointModal(null)}
          onSubmit={(values, evidence) => {
            onUpdateMilestone(checkpointModal.objective.id, checkpointModal.milestone.id, {
              kpiRecords: values, evidence, reviewStatus: "Pending Review", reviewedBy: null, reviewNote: "",
            });
            setCheckpointModal(null);
          }}
          onApprove={(note) => {
            onUpdateMilestone(checkpointModal.objective.id, checkpointModal.milestone.id, {
              reviewStatus: "Approved", reviewedBy: "BA Lead", reviewNote: note, status: "Completed",
            });
            setCheckpointModal(null);
          }}
          onReject={(note) => {
            onUpdateMilestone(checkpointModal.objective.id, checkpointModal.milestone.id, {
              reviewStatus: "Rejected", reviewedBy: "BA Lead", reviewNote: note,
            });
            setCheckpointModal(null);
          }}
        />
      )}
    </div>
  );
}

function ObjectivesPage({ objectives, streams, forecastOverrides, selectedObjective, setSelectedObjective, role, currentOwner, perms, onUpdateKpi, onAddSubMetric, onUpdateSubMetric, onDeleteSubMetric, onUpdateAssignedOwner }) {
  const selected = objectives.find(o => o.id === selectedObjective);
  const canEditKpi = selected && (role === "admin" || (role === "lead" && perms?.editKpiDefinition));
  const canAssignOwner = selected && (role === "admin" || (role === "leader" && currentOwner === selected.owner));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionLabel icon={Target}>Nine Objectives — Strategy Map</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 14 }}>
        {objectives.map(o => {
          const stream = streams.find(s => s.id === o.streamId);
          return <ObjectiveCard key={o.id} obj={o} streamColor={stream.color} forecastOverrides={forecastOverrides} onClick={() => setSelectedObjective(o.id)} />;
        })}
      </div>
      {selected && (
        <ObjectiveDrawer obj={selected} stream={streams.find(s => s.id === selected.streamId)} forecastOverrides={forecastOverrides} onClose={() => setSelectedObjective(null)}
          canEditKpi={canEditKpi}
          onUpdateKpi={(patch) => onUpdateKpi(selected.id, patch)}
          onAddSubMetric={(payload) => onAddSubMetric(selected.id, payload)}
          onUpdateSubMetric={(smId, patch) => onUpdateSubMetric(selected.id, smId, patch)}
          onDeleteSubMetric={(smId) => onDeleteSubMetric(selected.id, smId)}
          canAssignOwner={canAssignOwner}
          onUpdateAssignedOwner={(ownerName) => onUpdateAssignedOwner(selected.id, ownerName)}
        />
      )}
    </div>
  );
}

/* ============================================================================
   HISTORY MODAL
============================================================================ */
function HistoryModal({ initiative, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(8,26,46,0.45)", zIndex: 60,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.bg, borderRadius: 14, width: 560, maxWidth: "100%", maxHeight: "80vh", overflow: "auto",
        padding: 24, boxShadow: "0 20px 60px rgba(8,26,46,0.3)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.navy }}>Progress Update History</div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: T.inkMuted }}><X size={18} /></button>
        </div>
        <div style={{ fontSize: 13, color: T.inkMuted, marginBottom: 18 }}>{initiative.name}</div>
        {initiative.history.length === 0 ? (
          <div style={{ color: T.inkMuted, fontSize: 13 }}>No updates logged yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {initiative.history.map((h, i) => (
              <div key={i} style={{ borderLeft: `3px solid ${T.plum}`, paddingLeft: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Num size={12.5} color={T.navy}>{h.date}</Num>
                  <StatusChip status={h.next >= 100 ? "Completed" : "In Progress"} />
                </div>
                <div style={{ fontSize: 13, color: T.ink, margin: "6px 0", fontWeight: 500 }}>{h.summary}</div>
                <div style={{ fontSize: 12, color: T.inkMuted, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <span>Progress: <Num size={12} color={T.ink}>{h.prev}% → {h.next}%</Num></span>
                  <span>By {h.by}</span>
                </div>
                {h.blockers && h.blockers !== "None" && <div style={{ fontSize: 12, color: T.red, marginTop: 4 }}>Blocker: {h.blockers}</div>}
                {h.next2 && <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 2 }}>Next: {h.next2}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   OBJECTIVE DRAWER
============================================================================ */
/* ============================================================================
   KPI FORM MODAL — edit the objective's main KPI, or add/edit a Sub-Metric.
   Targets and metric sets change year to year, so these stay editable.
============================================================================ */
function KpiFormModal({ mode, metric, isMainKpi, objectives, onSave, onDelete, onClose }) {
  const [name, setName] = useState(metric?.name || "");
  const [target, setTarget] = useState(metric?.target ?? 0);
  const [unit, setUnit] = useState(metric?.unit ?? "%");
  const [lowerBetter, setLowerBetter] = useState(!!metric?.lowerBetter);
  const [objectiveId, setObjectiveId] = useState(objectives?.[0]?.id || "");
  const needsObjectivePicker = !!objectives; // only passed when adding to the overall list, not from a specific row

  const handleSave = () => {
    if (!name.trim()) return;
    if (needsObjectivePicker && !objectiveId) return;
    const payload = { name: name.trim(), target: Number(target), unit, lowerBetter };
    onSave(needsObjectivePicker ? { ...payload, objectiveId } : payload);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(8,26,46,0.45)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bg, borderRadius: 14, width: 440, maxWidth: "100%", padding: 24, boxShadow: "0 20px 60px rgba(8,26,46,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.navy }}>
            {isMainKpi ? "Edit KPI" : mode === "add" ? "Add KPI" : "Edit KPI"}
          </div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: T.inkMuted }}><X size={18} /></button>
        </div>

        {needsObjectivePicker && (
          <>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Objective</label>
            <select value={objectiveId} onChange={e => setObjectiveId(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 16px", fontFamily: FONT }}>
              {objectives.map(o => <option key={o.id} value={o.id}>O{o.number} · {o.title}</option>)}
            </select>
          </>
        )}

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Discovery Output Coverage"
          style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 16px", fontFamily: FONT }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Target</label>
            <input type="number" value={target} onChange={e => setTarget(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 0", fontFamily: MONO }} />
          </div>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Unit</label>
            <input value={unit} onChange={e => setUnit(e.target.value)} placeholder="%"
              style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 0", fontFamily: FONT }} />
          </div>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: T.ink, marginBottom: 18, cursor: "pointer" }}>
          <input type="checkbox" checked={lowerBetter} onChange={e => setLowerBetter(e.target.checked)} style={{ accentColor: T.plum }} />
          Lower values are better for this metric
        </label>

        <div style={{ display: "flex", gap: 10 }}>
          {mode === "edit" && !isMainKpi && onDelete && (
            <button onClick={onDelete}
              style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${T.red}`, background: T.redSoft, color: T.red, borderRadius: 9, padding: "10px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              <Trash2 size={14} /> Delete
            </button>
          )}
          <button onClick={handleSave}
            style={{ flex: 1, padding: "11px", borderRadius: 9, border: "none", cursor: "pointer", background: T.navy, color: "#fff", fontSize: 13.5, fontWeight: 700 }}>
            {isMainKpi ? "Save Changes" : mode === "add" ? "Add KPI" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ObjectiveDrawer({ obj, stream, forecastOverrides, onClose, canEditKpi, onUpdateKpi, onAddSubMetric, onUpdateSubMetric, onDeleteSubMetric, canAssignOwner, onUpdateAssignedOwner }) {
  const [historyFor, setHistoryFor] = useState(null);
  const [expandedSM, setExpandedSM] = useState(null);
  const [kpiModal, setKpiModal] = useState(null); // { mode, metric, isMainKpi }
  const [ownerInput, setOwnerInput] = useState(obj.assignedOwner || "");
  const [copied, setCopied] = useState(false);
  const p = objectiveProgress(obj, forecastOverrides);
  const health = objectiveHealth(obj, RAW.settings.healthWeights, forecastOverrides);
  const status = objectiveStatus(obj, forecastOverrides);
  const daysLeft = daysBetween(TODAY, d(obj.end));
  const kAch = achievementPct(obj.kpi);

  const memberLink = ownerInput.trim()
    ? `${window.location.origin}${window.location.pathname}?member=${encodeURIComponent(ownerInput.trim())}`
    : "";

  const saveOwner = () => onUpdateAssignedOwner(ownerInput.trim() || null);

  const copyLink = () => {
    const name = ownerInput.trim();
    if (!name) return;
    onUpdateAssignedOwner(name); // typing a name and copying its link assigns them in one step
    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?member=${encodeURIComponent(name)}`)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(() => {});
  };

  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ background: T.navy, padding: "20px 24px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#B9CBE0", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Objective {obj.number} · {stream.name}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{obj.title}</div>
            {obj.subtitle && <div style={{ fontSize: 13, color: "#C7D6E8", marginTop: 3 }}>{obj.subtitle}</div>}
          </div>
          <button onClick={onClose} style={{ border: "none", background: "rgba(255,255,255,0.12)", borderRadius: 8, padding: 6, cursor: "pointer", color: "#fff" }}><X size={16} /></button>
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 16, flexWrap: "wrap" }}>
          {[
            ["Leader", obj.owner], ["Start", obj.start], ["Target End", obj.end],
            ["Days Remaining", daysLeft >= 0 ? daysLeft : "0 (past due)"], ["Last Update", obj.lastUpdate],
          ].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize: 10.5, color: "#8FA8C4", textTransform: "uppercase", letterSpacing: 0.4 }}>{l}</div>
              <div style={{ fontFamily: MONO, fontSize: 13.5, fontWeight: 600, marginTop: 2 }}>{v}</div>
            </div>
          ))}
          {!canAssignOwner && (
            <div>
              <div style={{ fontSize: 10.5, color: "#8FA8C4", textTransform: "uppercase", letterSpacing: 0.4 }}>Team Owner</div>
              <div style={{ fontFamily: MONO, fontSize: 13.5, fontWeight: 600, marginTop: 2 }}>{obj.assignedOwner || "— Unassigned —"}</div>
            </div>
          )}
          <div>
            <div style={{ fontSize: 10.5, color: "#8FA8C4", textTransform: "uppercase", letterSpacing: 0.4 }}>Status</div>
            <div style={{ marginTop: 3 }}><StatusChip status={status} /></div>
          </div>
        </div>

        {canAssignOwner && (
          <div style={{ marginTop: 16, background: "rgba(255,255,255,0.08)", borderRadius: 9, padding: "12px 14px" }}>
            <div style={{ fontSize: 10.5, color: "#8FA8C4", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 8 }}>Team Owner</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <input value={ownerInput} onChange={e => setOwnerInput(e.target.value)} placeholder="Type a name…"
                style={{
                  flex: "1 1 160px", minWidth: 140, fontFamily: FONT, fontSize: 13, padding: "7px 10px",
                  background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 7,
                }} />
              <button onClick={saveOwner}
                style={{ border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: 7, padding: "7px 12px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                Save
              </button>
              <button onClick={copyLink} disabled={!ownerInput.trim()}
                style={{
                  display: "flex", alignItems: "center", gap: 6, border: "none", borderRadius: 7, padding: "7px 12px", fontSize: 12.5, fontWeight: 700,
                  cursor: ownerInput.trim() ? "pointer" : "default", opacity: ownerInput.trim() ? 1 : 0.5,
                  background: copied ? T.green : T.plum, color: "#fff",
                }}>
                <Link2 size={13} /> {copied ? "Link copied!" : "Copy Link"}
              </button>
            </div>
            {ownerInput.trim() && (
              <div style={{ fontSize: 11, color: "#B9CBE0", marginTop: 8, fontFamily: MONO, wordBreak: "break-all" }}>{memberLink}</div>
            )}
            <div style={{ fontSize: 11, color: "#8FA8C4", marginTop: 6 }}>
              Send this link to {ownerInput.trim() || "them"} — opening it shows the Objective Owner view scoped to this objective.
            </div>
          </div>
        )}

        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ flex: 1 }}><ProgressBar value={p} color={stream.color} height={8} track="rgba(255,255,255,0.15)" /></div>
          <Num size={16} color="#fff">{p}% progress</Num>
          <Num size={16} color="#fff">Health {health}</Num>
        </div>
      </div>

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ background: T.surface, borderRadius: 10, padding: 14, fontSize: 13, color: T.ink, fontStyle: "italic" }}>
          "{obj.meaning}"
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <SectionLabel icon={GaugeIcon}>KPI</SectionLabel>
              {canEditKpi && (
                <button onClick={() => setKpiModal({ mode: "edit", metric: obj.kpi, isMainKpi: true })} title="Edit KPI"
                  style={{ border: "none", background: "none", cursor: "pointer", color: T.inkFaint, padding: 2, display: "flex", marginBottom: 14 }}>
                  <Pencil size={13} />
                </button>
              )}
            </div>
            <Card style={{ padding: 16 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: T.navy, marginBottom: 10 }}>{obj.kpi.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
                <Num size={26}>{obj.kpi.current}{obj.kpi.unit}</Num>
                <span style={{ fontSize: 12.5, color: T.inkMuted }}>/ target {obj.kpi.target}{obj.kpi.unit}</span>
                <Trend current={obj.kpi.current} previous={obj.kpi.previous} suffix={obj.kpi.unit} />
              </div>
              <ProgressBar value={Math.min(100, kAch)} color={kAch >= 100 ? T.green : kAch >= 80 ? T.blue : T.amber} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ fontSize: 11.5, color: T.inkMuted }}>Achievement</span>
                <Num size={13}>{Math.round(kAch)}%</Num>
              </div>
              <div style={{ marginTop: 8 }}><StatusChip status={kpiStatus(obj.kpi)} /></div>
            </Card>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <SectionLabel icon={ListChecks}>Sub-Metrics</SectionLabel>
              {canEditKpi && (
                <button onClick={() => setKpiModal({ mode: "add", metric: null, isMainKpi: false })}
                  style={{ display: "flex", alignItems: "center", gap: 5, border: `1px dashed ${T.borderStrong}`, background: "none", color: T.navy, borderRadius: 7, padding: "4px 9px", fontSize: 11, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
                  <Plus size={11} /> Add
                </button>
              )}
            </div>
            <Card style={{ padding: 0 }}>
              {obj.subMetrics.length === 0 && <div style={{ padding: 14, fontSize: 12.5, color: T.inkMuted }}>No sub-metrics yet.</div>}
              {obj.subMetrics.map((sm, i) => {
                const ach = Math.round((sm.current / sm.target) * 100);
                const expanded = expandedSM === sm.id;
                return (
                  <div key={sm.id} style={{ borderTop: i === 0 ? "none" : `1px solid ${T.border}` }}>
                    <div onClick={() => setExpandedSM(expanded ? null : sm.id)} style={{ display: "grid", gridTemplateColumns: canEditKpi ? "minmax(0, 1fr) 70px 70px 90px 20px 20px" : "minmax(0, 1fr) 70px 70px 90px 20px", gap: 8, alignItems: "center", padding: "11px 14px", cursor: "pointer" }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{obj.number}.{i+1} {sm.name}</div>
                      <Num size={12.5}>{sm.current}{sm.unit}</Num>
                      <span style={{ fontSize: 11.5, color: T.inkMuted }}>/ {sm.target}{sm.unit}</span>
                      <StatusChip status={ach >= 90 ? "On Track" : ach >= 65 ? "At Risk" : "Delayed"} />
                      {canEditKpi && (
                        <button onClick={(e) => { e.stopPropagation(); setKpiModal({ mode: "edit", metric: sm, isMainKpi: false }); }} title="Edit sub-metric"
                          style={{ border: "none", background: "none", cursor: "pointer", color: T.inkFaint, padding: 2, display: "flex" }}>
                          <Pencil size={12} />
                        </button>
                      )}
                      {expanded ? <ChevronDown size={14} color={T.inkMuted} /> : <ChevronRight size={14} color={T.inkMuted} />}
                    </div>
                    {expanded && (
                      <div style={{ padding: "0 14px 12px 14px", fontSize: 12, color: T.inkMuted, display: "flex", gap: 16 }}>
                        <span>Previous: <Num size={12} color={T.ink}>{sm.previous}{sm.unit}</Num></span>
                        <span>Last updated: <Num size={12} color={T.ink}>{sm.lastUpdated}</Num></span>
                        <span>Data owner: <Num size={12} color={T.ink}>{sm.dataOwner}</Num></span>
                      </div>
                    )}
                  </div>
                );
              })}
            </Card>
          </div>
        </div>

        <div>
          <SectionLabel icon={ListChecks}>Initiative Tracker</SectionLabel>
          <InitiativeTable initiatives={obj.initiatives} onHistory={setHistoryFor} />
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <SectionLabel icon={CalendarRange}>Milestones</SectionLabel>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {obj.milestones.length === 0 && <div style={{ fontSize: 13, color: T.inkMuted }}>No milestones added yet.</div>}
            {obj.milestones.map((m, i) => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, padding: "8px 4px", borderTop: i === 0 ? "none" : `1px solid ${T.border}` }}>
                <Num size={12.5} color={T.navy}>{m.date}</Num>
                <span style={{ color: T.ink, flex: 1 }}>{m.name}</span>
                {m.fileName && <Paperclip size={13} color={T.inkMuted} />}
                <StatusChip status={m.status === "Overdue" ? "Delayed" : m.status === "Completed" ? "Completed" : "Not Started"} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {historyFor && <HistoryModal initiative={historyFor} onClose={() => setHistoryFor(null)} />}
      {kpiModal && (
        <KpiFormModal
          mode={kpiModal.mode} metric={kpiModal.metric} isMainKpi={kpiModal.isMainKpi}
          onClose={() => setKpiModal(null)}
          onSave={(payload) => {
            if (kpiModal.isMainKpi) onUpdateKpi(payload);
            else if (kpiModal.mode === "add") onAddSubMetric(payload);
            else onUpdateSubMetric(kpiModal.metric.id, payload);
            setKpiModal(null);
          }}
          onDelete={(!kpiModal.isMainKpi && kpiModal.mode === "edit") ? () => {
            onDeleteSubMetric(kpiModal.metric.id);
            setKpiModal(null);
          } : undefined}
        />
      )}
    </Card>
  );
}

/* ============================================================================
   INITIATIVE TABLE (editable) + edit modal
============================================================================ */
function InitiativeTable({ initiatives, onHistory, onEdit, showObjective, objectivesById }) {
  return (
    <Card style={{ padding: 0, overflow: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT }}>
        <thead>
          <tr style={{ background: T.surface, textAlign: "left" }}>
            {["Initiative", ...(showObjective ? ["Objective"] : []), "Owner", "Progress", "Status", "Priority", "Due", "", ""].map((h, i) => (
              <th key={i} style={{ padding: "10px 12px", fontSize: 10.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase", letterSpacing: 0.3, borderBottom: `1px solid ${T.border}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {initiatives.map(i => {
            const status = initiativeStatus(i);
            const overdue = isOverdue(i.due, i.progress);
            return (
              <tr key={i.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: "10px 12px", fontSize: 12.5, fontWeight: 600, color: T.ink, maxWidth: 220 }}>
                  {i.name}
                  <div style={{ fontSize: 11, color: T.inkMuted, fontWeight: 400, marginTop: 1 }}>{i.phase}</div>
                </td>
                {showObjective && <td style={{ padding: "10px 12px", fontSize: 12, color: T.inkMuted }}>O{objectivesById[i.objectiveId]?.number}</td>}
                <td style={{ padding: "10px 12px", fontSize: 12, color: T.inkMuted }}>{i.owner}</td>
                <td style={{ padding: "10px 12px", minWidth: 110 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1 }}><ProgressBar value={i.progress} color={STATUS_COLOR[status]} height={6} /></div>
                    <Num size={11.5}>{i.progress}%</Num>
                  </div>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <StatusChip status={status} />
                  {overdue && <div style={{ fontSize: 10.5, color: T.red, marginTop: 3, fontWeight: 700 }}>OVERDUE</div>}
                </td>
                <td style={{ padding: "10px 12px" }}><StatusChip status={i.priority} /></td>
                <td style={{ padding: "10px 12px", fontSize: 12, color: T.inkMuted, fontFamily: MONO }}>{i.due}</td>
                <td style={{ padding: "10px 12px" }}>
                  <button onClick={() => onHistory(i)} style={{ border: "none", background: "none", cursor: "pointer", color: T.inkMuted, display: "flex", alignItems: "center", gap: 4, fontSize: 11.5 }}>
                    <History size={13} /> History
                  </button>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  {onEdit && (
                    <button onClick={() => onEdit(i)} style={{ border: `1px solid ${T.border}`, background: T.bg, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 11.5, color: T.navy, fontWeight: 600 }}>
                      Update
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

function EditInitiativeModal({ initiative, onClose, onSave }) {
  const [owner, setOwner] = useState(initiative.owner || "");
  const [progress, setProgress] = useState(initiative.progress);
  const [nextStep, setNextStep] = useState(initiative.nextMilestone);
  const [comment, setComment] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    onSave(initiative.id, { owner: owner.trim(), progress: Number(progress), nextStep, comment });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(8,26,46,0.45)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bg, borderRadius: 14, width: 460, maxWidth: "100%", padding: 24, boxShadow: "0 20px 60px rgba(8,26,46,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.navy }}>Update Initiative</div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: T.inkMuted }}><X size={18} /></button>
        </div>
        <div style={{ fontSize: 13, color: T.inkMuted, marginBottom: 18 }}>{initiative.name}</div>

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Owner</label>
        <input value={owner} onChange={e => setOwner(e.target.value)} placeholder="e.g. Sara"
          style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 16px", fontFamily: FONT }} />

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Progress ({progress}%)</label>
        <input type="range" min={0} max={100} value={progress} onChange={e => setProgress(e.target.value)} style={{ width: "100%", margin: "8px 0 16px", accentColor: T.plum }} />

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Next Step</label>
        <input value={nextStep} onChange={e => setNextStep(e.target.value)}
          style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 16px", fontFamily: FONT }} />

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Comment</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
          style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 18px", fontFamily: FONT, resize: "vertical" }} />

        <button onClick={save} disabled={saved}
          style={{
            width: "100%", padding: "11px", borderRadius: 9, border: "none", cursor: "pointer",
            background: saved ? T.green : T.navy, color: "#fff", fontSize: 13.5, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          }}>
          {saved ? <><Check size={15} /> Saved</> : "Save Update"}
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
   INITIATIVES PAGE
============================================================================ */
/* ============================================================================
   ADD INITIATIVE MODAL — create a new initiative and assign it to an objective.
============================================================================ */
function AddInitiativeModal({ objectives, defaultObjectiveId, onSave, onClose }) {
  const [name, setName] = useState("");
  const [objectiveId, setObjectiveId] = useState(defaultObjectiveId || objectives[0]?.id || "");
  const [owner, setOwner] = useState("");
  const [start, setStart] = useState("2026-08-01");
  const [due, setDue] = useState("2026-10-31");
  const [priority, setPriority] = useState("Medium");

  const handleSave = () => {
    if (!name.trim() || !objectiveId) return;
    onSave(objectiveId, { name: name.trim(), owner: owner.trim(), start, due, priority });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(8,26,46,0.45)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bg, borderRadius: 14, width: 480, maxWidth: "100%", maxHeight: "85vh", overflow: "auto", padding: 24, boxShadow: "0 20px 60px rgba(8,26,46,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.navy }}>Add Initiative</div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: T.inkMuted }}><X size={18} /></button>
        </div>

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Initiative Name</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Discovery Sign-off SLA"
          style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 16px", fontFamily: FONT }} />

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Assign to Objective</label>
        <select value={objectiveId} onChange={e => setObjectiveId(e.target.value)}
          style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 16px", fontFamily: FONT }}>
          {objectives.map(o => <option key={o.id} value={o.id}>O{o.number} · {o.title}</option>)}
        </select>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Owner</label>
            <input value={owner} onChange={e => setOwner(e.target.value)} placeholder="e.g. Sara"
              style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 0", fontFamily: FONT }} />
          </div>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 0", fontFamily: FONT }}>
              {["High", "Medium", "Low"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Start Date</label>
            <input type="date" value={start} onChange={e => setStart(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 0", fontFamily: FONT }} />
          </div>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Due Date</label>
            <input type="date" value={due} onChange={e => setDue(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 0", fontFamily: FONT }} />
          </div>
        </div>

        <div style={{ fontSize: 11.5, color: T.inkMuted, marginBottom: 16 }}>
          Progress and status will be derived from the Activities you add under this initiative in the Timeline tab.
        </div>

        <button onClick={handleSave}
          style={{ width: "100%", padding: "11px", borderRadius: 9, border: "none", cursor: "pointer", background: T.navy, color: "#fff", fontSize: 13.5, fontWeight: 700 }}>
          Add Initiative
        </button>
      </div>
    </div>
  );
}

function InitiativesPage({ objectives, onEdit, editable, currentOwner, onAddInitiative }) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("due");
  const [showAdd, setShowAdd] = useState(false);
  const objectivesById = Object.fromEntries(objectives.map(o => [o.id, o]));
  let all = objectives.flatMap(o => o.initiatives.map(i => ({ ...i, objectiveId: o.id })));
  if (query) all = all.filter(i => i.name.toLowerCase().includes(query.toLowerCase()) || (i.owner || "").toLowerCase().includes(query.toLowerCase()));
  if (sortBy === "due") all = [...all].sort((a, b) => d(a.due) - d(b.due));
  if (sortBy === "progress") all = [...all].sort((a, b) => a.progress - b.progress);
  if (sortBy === "owner") all = [...all].sort((a, b) => (a.owner || "").localeCompare(b.owner || ""));

  const [historyFor, setHistoryFor] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 220px", minWidth: 200, maxWidth: 320 }}>
          <Search size={15} style={{ position: "absolute", left: 10, top: 10, color: T.inkFaint }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search initiatives or owners…"
            style={{ width: "100%", boxSizing: "border-box", padding: "9px 10px 9px 32px", border: `1px solid ${T.border}`, borderRadius: 9, fontSize: 13, fontFamily: FONT }} />
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ flexShrink: 0, border: `1px solid ${T.border}`, borderRadius: 9, padding: "9px 10px", fontSize: 13, fontFamily: FONT, background: T.bg }}>
          <option value="due">Sort: Due date</option>
          <option value="progress">Sort: Lowest progress</option>
          <option value="owner">Sort: Owner</option>
        </select>
        {editable && (
          <button onClick={() => setShowAdd(true)}
            style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6, border: "none", background: T.navy, color: "#fff", borderRadius: 9, padding: "9px 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
            <Plus size={13} /> Add Initiative
          </button>
        )}
        <div style={{ fontSize: 12.5, color: T.inkMuted, marginLeft: "auto", flexShrink: 0 }}>{all.length} initiatives</div>
      </div>
      <InitiativeTable initiatives={all} onHistory={setHistoryFor} onEdit={onEdit} showObjective objectivesById={objectivesById} />
      {historyFor && <HistoryModal initiative={historyFor} onClose={() => setHistoryFor(null)} />}
      {showAdd && (
        <AddInitiativeModal
          objectives={objectives}
          defaultObjectiveId={objectives[0]?.id}
          onClose={() => setShowAdd(false)}
          onSave={(objectiveId, payload) => { onAddInitiative(objectiveId, payload); setShowAdd(false); }}
        />
      )}
    </div>
  );
}

/* ============================================================================
   TIMELINE PAGE
============================================================================ */
/* ============================================================================
   TIMELINE TEMPLATE
   4 quarters + Initiatives + a 5-stage phase pipeline that every Activity
   (and its Sub-Activities) moves through. Objective owners add their own
   Activities/Sub-Activities under their initiatives using this same template.
============================================================================ */
const QUARTERS = [
  { id: "Q1", label: "Q1", range: "Jul – Sep 2026" },
  { id: "Q2", label: "Q2", range: "Oct – Dec 2026" },
  { id: "Q3", label: "Q3", range: "Jan – Mar 2027" },
  { id: "Q4", label: "Q4", range: "Apr – Jun 2027" },
];
const PHASES = ["As-Is Scan", "Standard", "Pilot", "Baseline & Measure", "Scale"];
const ACTIVITY_VIEWS = ["Quarterly", "Phase", "List"];

/* Scheduling helpers — an Activity's `date` is the source of truth for
   sorting in the List view; legacy activities that only have a `quarter`
   fall back to that quarter's start date. */
function quarterStartDate(q) {
  return { Q1: "2026-07-01", Q2: "2026-10-01", Q3: "2027-01-01", Q4: "2027-04-01" }[q] || "2026-07-01";
}
function effectiveDate(a) {
  return a.plannedStart || a.date || quarterStartDate(a.quarter);
}
function quarterFromDate(dateStr) {
  const dt = d(dateStr);
  if (dt < d("2026-10-01")) return "Q1";
  if (dt < d("2027-01-01")) return "Q2";
  if (dt < d("2027-04-01")) return "Q3";
  return "Q4";
}
function monthLabel(dateStr) {
  return d(dateStr).toLocaleString("en-US", { month: "short", year: "numeric" });
}

function PhaseTracker({ phase, onChange, editable }) {
  const idx = Math.max(0, PHASES.indexOf(phase));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {PHASES.map((p, i) => {
        const state = i < idx ? "done" : i === idx ? "current" : "pending";
        const dot = (
          <span key={p} title={p} onClick={editable ? () => onChange(p) : undefined}
            style={{
              width: 9, height: 9, borderRadius: "50%", cursor: editable ? "pointer" : "default",
              background: state === "pending" ? T.graySoft : (state === "current" ? T.plum : T.blue),
              border: state === "current" ? `2px solid ${T.plum}` : "none",
              boxSizing: "border-box",
            }} />
        );
        return (
          <React.Fragment key={p}>
            {dot}
            {i < PHASES.length - 1 && <span style={{ width: 12, height: 2, background: i < idx ? T.blue : T.graySoft }} />}
          </React.Fragment>
        );
      })}
      <span style={{ fontSize: 11, color: T.inkMuted, marginLeft: 6, whiteSpace: "nowrap" }}>{phase}</span>
    </div>
  );
}

/* Read-only quarter badge, derived from the activity's target date.
   The underlying date is edited via the Activity form, not inline. */
function SchedBadge({ activity }) {
  const dt = effectiveDate(activity);
  return <span style={{ fontSize: 10.5, fontWeight: 700, color: T.blue, background: T.blueSoft, borderRadius: 6, padding: "2px 7px", whiteSpace: "nowrap" }}>{quarterFromDate(dt)}</span>;
}

function SubActivityRow({ sub, editable, onToggle, onDelete, onRequestEdit }) {
  const progress = subProgress(sub);
  const hasKpi = sub.kpiRecords && Object.keys(sub.kpiRecords).length > 0;
  const status = subActivityStatus(sub);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0 6px 34px" }}>
      <input type="checkbox" checked={progress >= 100} disabled={!editable} onChange={onToggle}
        style={{ width: 14, height: 14, accentColor: T.green, cursor: editable ? "pointer" : "default" }} />
      <span style={{ flex: 1, fontSize: 12.5, color: progress >= 100 ? T.inkMuted : T.ink, textDecoration: progress >= 100 ? "line-through" : "none" }}>{sub.name}</span>
      {hasKpi && <GaugeIcon size={11} color={T.plum} />}
      <StatusChip status={status} size="sm" />
      <span style={{ fontSize: 10.5, color: T.inkMuted, minWidth: 30, textAlign: "right" }}>{progress}%</span>
      {editable && (
        <>
          <button onClick={onRequestEdit} title="Edit sub-activity" style={{ border: "none", background: "none", cursor: "pointer", color: T.inkFaint, padding: 2, display: "flex" }}>
            <Pencil size={11} />
          </button>
          <button onClick={onDelete} title="Delete sub-activity" style={{ border: "none", background: "none", cursor: "pointer", color: T.inkFaint, padding: 2, display: "flex" }}>
            <X size={12} />
          </button>
        </>
      )}
    </div>
  );
}

/* ============================================================================
   SUB-ACTIVITY FORM MODAL — add or edit a sub-activity: name, its own
   progress, and the same KPI-contribution fields as the Activity form.
============================================================================ */
function SubActivityFormModal({ mode, sub, onSave, onDelete, onClose }) {
  const [name, setName] = useState(sub?.name || "");
  const [plannedStart, setPlannedStart] = useState(sub?.plannedStart || "2026-07-15");
  const [plannedEnd, setPlannedEnd] = useState(sub?.plannedEnd || sub?.plannedStart || "2026-07-22");
  const [actualStart, setActualStart] = useState(sub?.actualStart || "");
  const [actualEnd, setActualEnd] = useState(sub?.actualEnd || "");
  const [progress, setProgress] = useState(sub ? subProgress(sub) : 0);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), plannedStart, plannedEnd, actualStart: actualStart || null, actualEnd: actualEnd || null, progress: Number(progress) });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(8,26,46,0.45)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bg, borderRadius: 14, width: 480, maxWidth: "100%", maxHeight: "85vh", overflow: "auto", padding: 24, boxShadow: "0 20px 60px rgba(8,26,46,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.navy }}>{mode === "add" ? "Add Sub-Activity" : "Edit Sub-Activity"}</div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: T.inkMuted }}><X size={18} /></button>
        </div>

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Sub-Activity Name</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Collect last 5 discovery docs"
          style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 16px", fontFamily: FONT }} />

        <PlannedActualDateFields
          plannedStart={plannedStart} plannedEnd={plannedEnd} actualStart={actualStart} actualEnd={actualEnd}
          setPlannedStart={setPlannedStart} setPlannedEnd={setPlannedEnd} setActualStart={setActualStart} setActualEnd={setActualEnd}
        />

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Progress</label>
        <input type="range" min={0} max={100} value={progress} onChange={e => setProgress(e.target.value)} style={{ width: "100%", margin: "8px 0 4px", accentColor: T.plum }} />
        <div style={{ fontSize: 11.5, color: T.inkMuted, marginBottom: 16 }}>{progress}%</div>

        <div style={{ display: "flex", gap: 10 }}>
          {mode === "edit" && onDelete && (
            <button onClick={onDelete}
              style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${T.red}`, background: T.redSoft, color: T.red, borderRadius: 9, padding: "10px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              <Trash2 size={14} /> Delete
            </button>
          )}
          <button onClick={handleSave}
            style={{ flex: 1, padding: "11px", borderRadius: 9, border: "none", cursor: "pointer", background: T.navy, color: "#fff", fontSize: 13.5, fontWeight: 700 }}>
            {mode === "add" ? "Add Sub-Activity" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   ACTIVITY FORM MODAL — add or edit an activity: name, phase, quarter,
   progress (auto-computed from sub-activities when present), and the
   objective's own KPI + Sub-Metrics so each activity can record the value
   it measured. These recorded values are what feed the automatic roll-up.
============================================================================ */
/* Shared Planned/Actual date fields used by both the Activity and
   Sub-Activity forms. Planned dates + progress drive the computed status
   (On Track/At Risk/Delayed); an Actual End marks it Completed outright. */
function PlannedActualDateFields({ plannedStart, plannedEnd, actualStart, actualEnd, setPlannedStart, setPlannedEnd, setActualStart, setActualEnd }) {
  const Field = ({ label, value, onChange }) => (
    <div>
      <label style={{ fontSize: 10.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>{label}</label>
      <input type="date" value={value || ""} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "7px 9px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12.5, margin: "5px 0 0", fontFamily: FONT }} />
    </div>
  );
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase", marginBottom: 6 }}>Planned</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        <Field label="Start" value={plannedStart} onChange={setPlannedStart} />
        <Field label="End" value={plannedEnd} onChange={setPlannedEnd} />
      </div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase", marginBottom: 6 }}>Actual</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Start" value={actualStart} onChange={setActualStart} />
        <Field label="End" value={actualEnd} onChange={setActualEnd} />
      </div>
      <div style={{ fontSize: 10.5, color: T.inkMuted, marginTop: 6 }}>
        Leave Actual dates blank until they happen — status is computed from Planned dates vs. progress until then.
      </div>
    </div>
  );
}

/* ============================================================================
   MILESTONE FORM MODAL — same pattern as the Activity form: name, date,
   status, plus a file-upload field (stored as a data URL so the attachment
   works fully client-side — download/view it straight from the browser).
============================================================================ */
const MILESTONE_STATUSES = ["Upcoming", "Completed", "Overdue"];

/* ============================================================================
   RISK FORM MODAL — add or edit a logged risk/blocker: severity, which
   objective (and optionally which initiative) it's tied to, owner, the
   issue, the required action, and a due date.
============================================================================ */
const RISK_SEVERITIES = ["Critical", "High", "Medium", "Low"];

function RiskFormModal({ mode, risk, objectives, onSave, onDelete, onClose }) {
  const [severity, setSeverity] = useState(risk?.severity || "Medium");
  const [objectiveId, setObjectiveId] = useState(risk?.objective || objectives[0]?.id || "");
  const [initiativeId, setInitiativeId] = useState(risk?.initiative || "");
  const [owner, setOwner] = useState(risk?.owner || "");
  const [issue, setIssue] = useState(risk?.issue || "");
  const [action, setAction] = useState(risk?.action || "");
  const [due, setDue] = useState(risk?.due || "2026-09-01");

  const selectedObjective = objectives.find(o => o.id === objectiveId);
  const initiatives = selectedObjective?.initiatives || [];

  const handleSave = () => {
    if (!issue.trim() || !objectiveId) return;
    onSave({ severity, objective: objectiveId, initiative: initiativeId || null, owner: owner.trim(), issue: issue.trim(), action: action.trim(), due });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(8,26,46,0.45)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bg, borderRadius: 14, width: 520, maxWidth: "100%", maxHeight: "85vh", overflow: "auto", padding: 24, boxShadow: "0 20px 60px rgba(8,26,46,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.navy }}>{mode === "add" ? "Add Risk / Blocker" : "Edit Risk / Blocker"}</div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: T.inkMuted }}><X size={18} /></button>
        </div>

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Issue</label>
        <input value={issue} onChange={e => setIssue(e.target.value)} placeholder="e.g. Use-case repository is blocked pending baseline report"
          style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 16px", fontFamily: FONT }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Severity</label>
            <select value={severity} onChange={e => setSeverity(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 0", fontFamily: FONT }}>
              {RISK_SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Due Date</label>
            <input type="date" value={due} onChange={e => setDue(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 0", fontFamily: FONT }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Objective</label>
            <select value={objectiveId} onChange={e => { setObjectiveId(e.target.value); setInitiativeId(""); }}
              style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 0", fontFamily: FONT }}>
              {objectives.map(o => <option key={o.id} value={o.id}>O{o.number} · {o.title}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Initiative (optional)</label>
            <select value={initiativeId} onChange={e => setInitiativeId(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 0", fontFamily: FONT }}>
              <option value="">— None —</option>
              {initiatives.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
        </div>

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Owner</label>
        <input value={owner} onChange={e => setOwner(e.target.value)} placeholder="e.g. Randa"
          style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 16px", fontFamily: FONT }} />

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Required Action</label>
        <textarea value={action} onChange={e => setAction(e.target.value)} rows={3} placeholder="e.g. Escalate resourcing; unblock baseline report this week."
          style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 18px", fontFamily: FONT, resize: "vertical" }} />

        <div style={{ display: "flex", gap: 10 }}>
          {mode === "edit" && onDelete && (
            <button onClick={onDelete}
              style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${T.red}`, background: T.redSoft, color: T.red, borderRadius: 9, padding: "10px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              <Trash2 size={14} /> Delete
            </button>
          )}
          <button onClick={handleSave}
            style={{ flex: 1, padding: "11px", borderRadius: 9, border: "none", cursor: "pointer", background: T.navy, color: "#fff", fontSize: 13.5, fontWeight: 700 }}>
            {mode === "add" ? "Add Risk" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   KPI CHECKPOINT MODAL — the quarterly, governed way KPI values change.
   The Objective Owner fills in measured values and submits for review; the
   BA Lead approves or rejects. Only an Approved submission updates the
   objective's official KPI/Sub-Metric values (see enrichObjectives()).
============================================================================ */
function KpiCheckpointModal({ milestone, objective, canSubmit, canApprove, onSubmit, onApprove, onReject, onClose }) {
  const [values, setValues] = useState({ ...(milestone.kpiRecords || {}) });
  const [note, setNote] = useState(milestone.reviewNote || "");
  const [evidence, setEvidence] = useState(milestone.evidence || []);
  const [fileError, setFileError] = useState("");
  const metrics = [
    { id: "kpi", label: objective.kpi.name, target: objective.kpi.target, unit: objective.kpi.unit },
    ...objective.subMetrics.map(sm => ({ id: sm.id, label: sm.name, target: sm.target, unit: sm.unit })),
  ];
  const setMetricValue = (id, v) => setValues(prev => {
    const next = { ...prev };
    if (v === "") delete next[id];
    else next[id] = Number(v);
    return next;
  });
  const editableNow = canSubmit && milestone.reviewStatus !== "Pending Review";
  const pendingReview = milestone.reviewStatus === "Pending Review";

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setFileError("");
    const oversized = files.find(f => f.size > 5 * 1024 * 1024);
    if (oversized) {
      setFileError(`"${oversized.name}" is larger than 5MB.`);
      e.target.value = "";
      return;
    }
    Promise.all(files.map(file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: file.name, data: reader.result });
      reader.onerror = () => reject(new Error(file.name));
      reader.readAsDataURL(file);
    })))
      .then(loaded => setEvidence(prev => [...prev, ...loaded]))
      .catch(err => setFileError(`Could not read "${err.message}".`));
    e.target.value = "";
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(8,26,46,0.45)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bg, borderRadius: 14, width: 500, maxWidth: "100%", maxHeight: "85vh", overflow: "auto", padding: 24, boxShadow: "0 20px 60px rgba(8,26,46,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.navy }}>{milestone.name}</div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: T.inkMuted }}><X size={18} /></button>
        </div>
        <div style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 4 }}>O{objective.number} · {objective.title} · due {milestone.date}</div>
        <div style={{ marginBottom: 16 }}><StatusChip status={
          milestone.reviewStatus === "Approved" ? "Completed" : milestone.reviewStatus === "Pending Review" ? "At Risk" : milestone.reviewStatus === "Rejected" ? "Delayed" : "Not Started"
        } /> <span style={{ fontSize: 11.5, color: T.inkMuted, marginLeft: 6 }}>{milestone.reviewStatus}</span></div>

        <div style={{ fontSize: 11.5, color: T.inkMuted, marginBottom: 10 }}>
          {canSubmit
            ? "Enter the values measured for this quarter. Once submitted, the BA Lead reviews and approves before they become official."
            : "Values submitted by the Objective Owner for this quarter's checkpoint."}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          {metrics.map(m => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, background: T.surface, borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ flex: 1, fontSize: 12.5, color: T.ink, fontWeight: 600 }}>{m.label}</div>
              <div style={{ fontSize: 11, color: T.inkMuted }}>target {m.target}{m.unit}</div>
              {editableNow ? (
                <input type="number" value={values[m.id] ?? ""} onChange={e => setMetricValue(m.id, e.target.value)}
                  placeholder="—" style={{ width: 72, padding: "5px 7px", border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12.5, fontFamily: MONO, textAlign: "right" }} />
              ) : (
                <Num size={13}>{values[m.id] ?? "—"}</Num>
              )}
              <span style={{ fontSize: 11, color: T.inkMuted, minWidth: 18 }}>{m.unit}</span>
            </div>
          ))}
        </div>

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Evidence & Files</label>
        <div style={{ fontSize: 11, color: T.inkMuted, margin: "4px 0 8px" }}>
          Attach the reports, exports, or survey results these numbers came from, so the review is based on evidence.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
          {evidence.map(f => (
            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 8, background: T.surface, borderRadius: 8, padding: "7px 10px" }}>
              <Paperclip size={13} color={T.inkMuted} />
              <a href={f.data} download={f.name} style={{ flex: 1, fontSize: 12.5, color: T.blue, textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</a>
              {editableNow && (
                <button onClick={() => setEvidence(prev => prev.filter(x => x.id !== f.id))} title="Remove"
                  style={{ border: "none", background: "none", cursor: "pointer", color: T.inkFaint, display: "flex" }}>
                  <X size={13} />
                </button>
              )}
            </div>
          ))}
          {evidence.length === 0 && !editableNow && (
            <div style={{ fontSize: 12, color: T.inkFaint }}>No evidence attached.</div>
          )}
          {editableNow && (
            <label style={{
              display: "flex", alignItems: "center", gap: 8, border: `1px dashed ${T.borderStrong}`, borderRadius: 8,
              padding: "9px 12px", cursor: "pointer", color: T.navy, fontSize: 12.5, fontWeight: 600,
            }}>
              <Paperclip size={13} /> Attach evidence (multiple files allowed)
              <input type="file" multiple onChange={handleFiles} style={{ display: "none" }} />
            </label>
          )}
          {fileError && <div style={{ fontSize: 11.5, color: T.red }}>{fileError}</div>}
        </div>

        {canApprove && pendingReview && (
          <>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Review Note (optional)</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
              style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 16px", fontFamily: FONT, resize: "vertical" }} />
          </>
        )}

        {milestone.reviewedBy && (
          <div style={{ fontSize: 11.5, color: T.inkMuted, marginBottom: 16 }}>
            Reviewed by {milestone.reviewedBy}{milestone.reviewNote ? ` — "${milestone.reviewNote}"` : ""}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          {canApprove && pendingReview && (
            <>
              <button onClick={() => onReject(note)}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, border: `1px solid ${T.red}`, background: T.redSoft, color: T.red, borderRadius: 9, padding: "10px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Reject
              </button>
              <button onClick={() => onApprove(note)}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, border: "none", background: T.green, color: "#fff", borderRadius: 9, padding: "10px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                <Check size={14} /> Approve
              </button>
            </>
          )}
          {editableNow && (
            <button onClick={() => onSubmit(values, evidence)}
              style={{ flex: 1, padding: "11px", borderRadius: 9, border: "none", cursor: "pointer", background: T.navy, color: "#fff", fontSize: 13.5, fontWeight: 700 }}>
              {milestone.reviewStatus === "Approved" ? "Edit & Resubmit" : "Submit for Review"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MilestoneFormModal({ mode, milestone, objectives, defaultObjectiveId, onSave, onDelete, onClose }) {
  const [name, setName] = useState(milestone?.name || "");
  const [objectiveId, setObjectiveId] = useState(defaultObjectiveId || objectives[0]?.id || "");
  const [activityId, setActivityId] = useState(milestone?.activity || "");
  const [date, setDate] = useState(milestone?.date || "2026-08-01");
  const [status, setStatus] = useState(milestone?.status || "Upcoming");
  const [fileName, setFileName] = useState(milestone?.fileName || "");
  const [fileData, setFileData] = useState(milestone?.fileData || "");
  const [fileError, setFileError] = useState("");

  const selectedObjective = objectives.find(o => o.id === objectiveId);
  const activityOptions = (selectedObjective?.initiatives || []).flatMap(init =>
    (init.activities || []).map(a => ({ id: a.id, label: `${init.name} — ${a.name}` }))
  );

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError("");
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File is too large (max 5MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { setFileName(file.name); setFileData(reader.result); };
    reader.onerror = () => setFileError("Could not read this file.");
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = () => {
    if (!name.trim() || !objectiveId) return;
    onSave({ name: name.trim(), objective: objectiveId, activity: activityId || null, date, status, fileName, fileData });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(8,26,46,0.45)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bg, borderRadius: 14, width: 480, maxWidth: "100%", maxHeight: "85vh", overflow: "auto", padding: 24, boxShadow: "0 20px 60px rgba(8,26,46,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.navy }}>{mode === "add" ? "Add Milestone" : "Edit Milestone"}</div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: T.inkMuted }}><X size={18} /></button>
        </div>

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Milestone Name</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Discovery Repository live"
          style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 16px", fontFamily: FONT }} />

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Objective</label>
        <select value={objectiveId} onChange={e => { setObjectiveId(e.target.value); setActivityId(""); }}
          style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 16px", fontFamily: FONT }}>
          {objectives.map(o => <option key={o.id} value={o.id}>O{o.number} · {o.title}</option>)}
        </select>

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Activity (optional)</label>
        <select value={activityId} onChange={e => setActivityId(e.target.value)}
          style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 16px", fontFamily: FONT }}>
          <option value="">— None —</option>
          {activityOptions.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 0", fontFamily: FONT }} />
          </div>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 0", fontFamily: FONT }}>
              {MILESTONE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Attachment</label>
        <div style={{ margin: "6px 0 16px" }}>
          {fileName ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.surface, borderRadius: 8, padding: "8px 10px" }}>
              <Paperclip size={13} color={T.inkMuted} />
              <a href={fileData} download={fileName} style={{ flex: 1, fontSize: 12.5, color: T.blue, textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fileName}</a>
              <button onClick={() => { setFileName(""); setFileData(""); }} title="Remove attachment"
                style={{ border: "none", background: "none", cursor: "pointer", color: T.inkFaint, display: "flex" }}>
                <X size={13} />
              </button>
            </div>
          ) : (
            <label style={{
              display: "flex", alignItems: "center", gap: 8, border: `1px dashed ${T.borderStrong}`, borderRadius: 8,
              padding: "9px 12px", cursor: "pointer", color: T.navy, fontSize: 12.5, fontWeight: 600,
            }}>
              <Paperclip size={13} /> Upload evidence / document
              <input type="file" onChange={handleFile} style={{ display: "none" }} />
            </label>
          )}
          {fileError && <div style={{ fontSize: 11.5, color: T.red, marginTop: 6 }}>{fileError}</div>}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {mode === "edit" && onDelete && (
            <button onClick={onDelete}
              style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${T.red}`, background: T.redSoft, color: T.red, borderRadius: 9, padding: "10px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              <Trash2 size={14} /> Delete
            </button>
          )}
          <button onClick={handleSave}
            style={{ flex: 1, padding: "11px", borderRadius: 9, border: "none", cursor: "pointer", background: T.navy, color: "#fff", fontSize: 13.5, fontWeight: 700 }}>
            {mode === "add" ? "Add Milestone" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ActivityFormModal({ mode, activity, onSave, onDelete, onClose }) {
  const [name, setName] = useState(activity?.name || "");
  const [owner, setOwner] = useState(activity?.owner || "");
  const [phase, setPhase] = useState(activity?.phase || PHASES[0]);
  const [plannedStart, setPlannedStart] = useState(activity ? effectiveDate(activity) : "2026-07-15");
  const [plannedEnd, setPlannedEnd] = useState(activity?.plannedEnd || (activity ? effectiveDate(activity) : "2026-07-29"));
  const [actualStart, setActualStart] = useState(activity?.actualStart || "");
  const [actualEnd, setActualEnd] = useState(activity?.actualEnd || "");
  const subs = activity?.subActivities || [];
  const autoProgress = subs.length ? Math.round((subs.filter(s => s.done).length / subs.length) * 100) : null;
  const [progress, setProgress] = useState(activity?.progress ?? 0);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(), owner: owner.trim(), phase,
      plannedStart, plannedEnd, actualStart: actualStart || null, actualEnd: actualEnd || null,
      date: plannedStart, quarter: quarterFromDate(plannedStart),
      progress: autoProgress != null ? autoProgress : Number(progress),
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(8,26,46,0.45)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bg, borderRadius: 14, width: 520, maxWidth: "100%", maxHeight: "85vh", overflow: "auto", padding: 24, boxShadow: "0 20px 60px rgba(8,26,46,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.navy }}>{mode === "add" ? "Add Activity" : "Edit Activity"}</div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: T.inkMuted }}><X size={18} /></button>
        </div>

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Activity Name</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Review existing discovery templates"
          style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 16px", fontFamily: FONT }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Owner</label>
            <input value={owner} onChange={e => setOwner(e.target.value)} placeholder="e.g. Sara"
              style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 0", fontFamily: FONT }} />
          </div>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Phase</label>
            <select value={phase} onChange={e => setPhase(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 0", fontFamily: FONT }}>
              {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <PlannedActualDateFields
          plannedStart={plannedStart} plannedEnd={plannedEnd} actualStart={actualStart} actualEnd={actualEnd}
          setPlannedStart={setPlannedStart} setPlannedEnd={setPlannedEnd} setActualStart={setActualStart} setActualEnd={setActualEnd}
        />

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>
          Progress {autoProgress != null && <span style={{ color: T.inkFaint, fontWeight: 500, textTransform: "none" }}>(auto from sub-activities)</span>}
        </label>
        {autoProgress != null ? (
          <div style={{ margin: "8px 0 16px" }}>
            <ProgressBar value={autoProgress} />
            <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 4 }}>{autoProgress}% complete</div>
          </div>
        ) : (
          <>
            <input type="range" min={0} max={100} value={progress} onChange={e => setProgress(e.target.value)} style={{ width: "100%", margin: "8px 0 4px", accentColor: T.plum }} />
            <div style={{ fontSize: 11.5, color: T.inkMuted, marginBottom: 16 }}>{progress}%</div>
          </>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          {mode === "edit" && onDelete && (
            <button onClick={onDelete}
              style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${T.red}`, background: T.redSoft, color: T.red, borderRadius: 9, padding: "10px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              <Trash2 size={14} /> Delete
            </button>
          )}
          <button onClick={handleSave}
            style={{ flex: 1, padding: "11px", borderRadius: 9, border: "none", cursor: "pointer", background: T.navy, color: "#fff", fontSize: 13.5, fontWeight: 700 }}>
            {mode === "add" ? "Add Activity" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ActivityBlock({ activity, editable, viewMode, onUpdatePhase, onToggleSub, onDeleteSub, onRequestEdit, onRequestEditSub, onRequestAddSub }) {
  const [open, setOpen] = useState(false);
  const subs = activity.subActivities || [];
  const doneCount = subs.filter(s => subProgress(s) >= 100).length;
  const hasKpiRecords = activity.kpiRecords && Object.keys(activity.kpiRecords).length > 0;
  return (
    <div style={{ borderTop: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0 9px 20px" }}>
        <button onClick={() => setOpen(o => !o)} style={{ border: "none", background: "none", cursor: "pointer", color: T.inkMuted, padding: 0 }}>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: T.ink, flex: 1 }}>
          {activity.name}
          {activity.owner && <span style={{ fontSize: 11, color: T.inkMuted, fontWeight: 500 }}> · {activity.owner}</span>}
        </span>
        {hasKpiRecords && <GaugeIcon size={12} color={T.plum} />}
        {subs.length > 0 && <span style={{ fontSize: 11, color: T.inkMuted }}>{doneCount}/{subs.length}</span>}
        <StatusChip status={activityStatus(activity)} size="sm" />
        <SchedBadge activity={activity} />
        <PhaseTracker phase={activity.phase} editable={editable} onChange={onUpdatePhase} />
        {editable && (
          <button onClick={onRequestEdit} title="Edit activity" style={{ border: "none", background: "none", cursor: "pointer", color: T.inkFaint, padding: 2, display: "flex" }}>
            <Pencil size={13} />
          </button>
        )}
      </div>
      {open && (
        <div style={{ paddingBottom: 8 }}>
          {subs.map(sub => (
            <SubActivityRow key={sub.id} sub={sub} editable={editable}
              onToggle={() => onToggleSub(sub.id)} onDelete={() => onDeleteSub(sub.id)}
              onRequestEdit={() => onRequestEditSub(sub)} />
          ))}
          {editable && (
            <div style={{ paddingLeft: 34, paddingTop: 4 }}>
              <button onClick={onRequestAddSub}
                style={{ display: "flex", alignItems: "center", gap: 5, border: `1px dashed ${T.borderStrong}`, background: "none", color: T.navy, borderRadius: 7, padding: "5px 10px", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
                <Plus size={12} /> Add Sub-Activity
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InitiativeTimelineBlock({ initiative, editable, viewMode, onToggleSub, onDeleteSub, onRequestAdd, onRequestEdit, onRequestAddSub, onRequestEditSub, onQuickUpdate }) {
  const [open, setOpen] = useState(true);
  const activitiesAll = initiative.activities || [];
  const activities = viewMode === "List" ? [] : activitiesAll;
  const status = initiativeStatus(initiative);
  return (
    <Card style={{ padding: 0, marginBottom: 12 }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", cursor: "pointer", background: T.surface }}>
        {open ? <ChevronDown size={15} color={T.inkMuted} /> : <ChevronRight size={15} color={T.inkMuted} />}
        <span style={{ fontSize: 13.5, fontWeight: 700, color: T.navy, flex: 1 }}>{initiative.name}</span>
        <span style={{ fontSize: 11.5, color: T.inkMuted }}>{initiative.owner}</span>
        <StatusChip status={status} />
        <div style={{ width: 90 }}><ProgressBar value={initiative.progress} height={6} /></div>
        <span style={{ fontSize: 11, color: T.inkMuted, minWidth: 30, textAlign: "right" }}>{activitiesAll.length} act.</span>
      </div>
      {open && (
        <div style={{ padding: "4px 16px 14px" }}>
          {activitiesAll.length === 0 && <div style={{ fontSize: 12, color: T.inkMuted, padding: "10px 0" }}>No activities added yet.</div>}
          {activities.map(a => (
            <ActivityBlock key={a.id} activity={a} editable={editable} viewMode={viewMode}
              onUpdatePhase={(phase) => onQuickUpdate(a.id, { phase })}
              onToggleSub={(subId) => onToggleSub(a.id, subId)}
              onDeleteSub={(subId) => onDeleteSub(a.id, subId)}
              onRequestEdit={() => onRequestEdit(a)}
              onRequestEditSub={(sub) => onRequestEditSub(a.id, sub)}
              onRequestAddSub={() => onRequestAddSub(a.id)}
            />
          ))}
          {editable && (
            <div style={{ paddingTop: 10, borderTop: activitiesAll.length ? `1px solid ${T.border}` : "none", marginTop: activitiesAll.length ? 6 : 0 }}>
              <button onClick={onRequestAdd}
                style={{ display: "flex", alignItems: "center", gap: 6, border: `1px dashed ${T.borderStrong}`, background: "none", color: T.navy, borderRadius: 7, padding: "7px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                <Plus size={13} /> Add Activity
              </button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function QuarterLegend() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
      {QUARTERS.map(q => (
        <div key={q.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 9, padding: "8px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: T.navy }}>{q.label}</div>
          <div style={{ fontSize: 10.5, color: T.inkMuted }}>{q.range}</div>
        </div>
      ))}
    </div>
  );
}


/* Flat, date-sorted list of every activity across the current objectives —
   the "List" view. */
/* Groups every activity by its pipeline Phase — a Kanban-style view across
   all objectives so you can see how much work sits in each stage. */
function PhaseView({ objectives, streams, editable, onRequestEdit }) {
  const rows = objectives.flatMap(o => o.initiatives.flatMap(init =>
    (init.activities || []).map(a => ({ activity: a, objective: o, initiative: init }))
  ));
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${PHASES.length}, 1fr)`, gap: 12, alignItems: "start" }}>
      {PHASES.map(phase => {
        const items = rows.filter(r => r.activity.phase === phase);
        return (
          <div key={phase}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11.5, fontWeight: 800, color: T.navy }}>{phase}</span>
              <span style={{ fontSize: 10.5, color: T.inkMuted, background: T.surface, borderRadius: 10, padding: "1px 7px" }}>{items.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.length === 0 && <div style={{ fontSize: 11.5, color: T.inkFaint, padding: "8px 0" }}>—</div>}
              {items.map(({ activity, objective, initiative }) => (
                <Card key={activity.id} hoverable={editable} onClick={editable ? () => onRequestEdit(objective.id, initiative.id, activity) : undefined} style={{ padding: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, marginBottom: 4 }}>{activity.name}</div>
                  <div style={{ fontSize: 10.5, color: T.inkMuted, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    O{objective.number} · {initiative.name}
                  </div>
                  <ProgressBar value={effectiveActivityProgress(activity)} height={5} />
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ActivityListView({ objectives, streams, editable, onRequestEdit }) {
  const rows = objectives.flatMap(o => o.initiatives.flatMap(init =>
    (init.activities || []).map(a => ({ activity: a, objective: o, initiative: init }))
  )).sort((x, y) => d(effectiveDate(x.activity)) - d(effectiveDate(y.activity)));

  if (!rows.length) return <div style={{ fontSize: 13, color: T.inkMuted, padding: "16px 4px" }}>No activities added yet.</div>;

  return (
    <Card style={{ padding: 0, overflow: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: T.surface }}>
            {["Date", "Objective", "Initiative", "Activity", "Owner", "Phase", "Status", "Progress", ""].map(h => (
              <th key={h} style={{ padding: "10px 12px", fontSize: 10.5, fontWeight: 700, color: T.inkMuted, textAlign: "left", textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ activity, objective, initiative }) => {
            const stream = streams.find(s => s.id === objective.streamId);
            return (
              <tr key={activity.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: "10px 12px", fontFamily: MONO, fontSize: 12 }}>{effectiveDate(activity)}</td>
                <td style={{ padding: "10px 12px", fontSize: 12 }}>
                  <span style={{ color: stream?.color, fontWeight: 700 }}>O{objective.number}</span> <span style={{ color: T.inkMuted }}>{objective.title}</span>
                </td>
                <td style={{ padding: "10px 12px", fontSize: 12, color: T.inkMuted }}>{initiative.name}</td>
                <td style={{ padding: "10px 12px", fontSize: 12.5, fontWeight: 600 }}>{activity.name}</td>
                <td style={{ padding: "10px 12px", fontSize: 12, color: T.inkMuted }}>{activity.owner || "—"}</td>
                <td style={{ padding: "10px 12px" }}><PhaseTracker phase={activity.phase} editable={false} /></td>
                <td style={{ padding: "10px 12px" }}><StatusChip status={activityStatus(activity)} /></td>
                <td style={{ padding: "10px 12px", minWidth: 110 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1 }}><ProgressBar value={effectiveActivityProgress(activity)} height={6} /></div>
                    <span style={{ fontSize: 11, color: T.inkMuted }}>{effectiveActivityProgress(activity)}%</span>
                  </div>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  {editable && (
                    <button onClick={() => onRequestEdit(objective.id, initiative.id, activity)} title="Edit activity"
                      style={{ border: "none", background: "none", cursor: "pointer", color: T.inkFaint, padding: 2, display: "flex" }}>
                      <Pencil size={13} />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}


function TimelinePage({ objectives, streams, editable, canSubmitCheckpoint, canApproveCheckpoint, role, currentOwner, onAddActivity, onUpdateActivity, onDeleteActivity, onAddSub, onUpdateSub, onToggleSub, onDeleteSub, onAddMilestone, onUpdateMilestone, onDeleteMilestone }) {
  const [view, setView] = useState("Month");
  const [activityView, setActivityView] = useState("Quarterly");
  const [modalCtx, setModalCtx] = useState(null); // { mode, kind, objectiveId, initiativeId, activity/activityId/sub, kpi, subMetrics }
  const [hoverIdx, setHoverIdx] = useState(null);

  const isQuarterAxis = view === "Quarter";
  // Always span the full planning horizon (Jul 2026 – Jun 2027 / all 4
  // quarters), even where a given view has no data yet in later quarters.
  const columns = isQuarterAxis
    ? QUARTERS.map(q => `${q.label} · ${q.range}`)
    : ["Jul 2026", "Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026", "Jan 2027", "Feb 2027", "Mar 2027", "Apr 2027", "May 2027", "Jun 2027"];
  const rangeStart = d("2026-07-01");
  const rangeEnd = d("2027-07-01");
  const totalDays = daysBetween(rangeStart, rangeEnd);
  const pct = (dateStr) => (daysBetween(rangeStart, d(dateStr)) / totalDays) * 100;
  const todayPct = pct("2026-08-17");
  const fmtDate = (dateStr) => d(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  // Build the Gantt rows for the selected view.
  let ganttRows = [];
  if (view === "Objective") {
    objectives.forEach(o => {
      const stream = streams.find(s => s.id === o.streamId);
      ganttRows.push({ type: "header", label: `O${o.number} · ${o.title}`, color: stream.color });
      o.initiatives.forEach(init => {
        ganttRows.push({
          type: "bar", label: init.name, start: init.start, end: init.due, color: stream.color,
          progress: init.progress, status: initiativeStatus(init), indent: true,
        });
      });
    });
  } else if (view === "Stream") {
    streams.forEach(s => {
      const objs = objectives.filter(o => o.streamId === s.id);
      if (!objs.length) return;
      const start = objs.reduce((min, o) => (o.start < min ? o.start : min), objs[0].start);
      const end = objs.reduce((max, o) => (o.end > max ? o.end : max), objs[0].end);
      const streamProg = streamProgress(s, objectives);
      ganttRows.push({
        type: "bar", label: s.name, start, end, color: s.color,
        progress: streamProg, status: timelineStatus(start, end, streamProg),
      });
    });
  } else {
    objectives.forEach(o => {
      const stream = streams.find(s => s.id === o.streamId);
      ganttRows.push({
        type: "bar", label: `O${o.number} · ${o.title}`, start: o.start, end: o.end, color: stream.color,
        progress: objectiveProgress(o), status: objectiveStatus(o),
      });
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {["Month", "Quarter", "Objective", "Stream"].map(v => (
          <button key={v} onClick={() => setView(v)}
            style={{
              border: `1px solid ${view === v ? T.navy : T.border}`, background: view === v ? T.navy : T.bg,
              color: view === v ? "#fff" : T.inkMuted, borderRadius: 8, padding: "6px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
            }}>{v} view</button>
        ))}
      </div>
      <Card style={{ padding: 20, overflowX: "auto", overflowY: "visible" }}>
        <div style={{ fontSize: 11.5, color: T.inkMuted, marginBottom: 12 }}>
          {view === "Month" && "Monthly columns (Jul 2026 – Jun 2027), one bar per objective. Hover a bar for dates and progress."}
          {view === "Quarter" && "All four quarters (Jul 2026 – Jun 2027), one bar per objective. Hover a bar for dates and progress."}
          {view === "Objective" && "Monthly columns (Jul 2026 – Jun 2027), broken down into each objective's initiatives. Hover a bar for dates and progress."}
          {view === "Stream" && "Monthly columns (Jul 2026 – Jun 2027), rolled up to one bar per stream. Hover a bar for dates and progress."}
        </div>
        <div style={{ position: "relative", minWidth: isQuarterAxis ? 760 : 1180 }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns.length}, 1fr)`, marginBottom: 10, paddingLeft: 200 }}>
            {columns.map(c => <div key={c} style={{ fontSize: 11, fontWeight: 700, color: T.inkMuted, textAlign: "center" }}>{c}</div>)}
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: `calc(200px + (100% - 200px) * ${todayPct / 100})`, top: 0, bottom: 0, width: 1.5, background: T.plum, zIndex: 2 }} />
            {ganttRows.map((row, i) => {
              if (row.type === "header") {
                return (
                  <div key={`h-${i}`} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: i === 0 ? 0 : 14, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: row.color }} />
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: T.navy }}>{row.label}</span>
                  </div>
                );
              }
              const left = pct(row.start), width = Math.max(pct(row.end) - pct(row.start), 1.5);
              const hovered = hoverIdx === i;
              const tooltipBelow = i < 2;
              return (
                <div key={`b-${i}`} style={{ display: "flex", alignItems: "center", marginBottom: 10, height: 30 }}>
                  <div style={{
                    width: 200, minWidth: 200, fontSize: 12, color: T.ink, fontWeight: row.indent ? 500 : 600,
                    paddingRight: 10, paddingLeft: row.indent ? 16 : 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {row.label}
                  </div>
                  <div style={{ position: "relative", flex: 1, height: 20 }}>
                    <div
                      onMouseEnter={() => setHoverIdx(i)}
                      onMouseLeave={() => setHoverIdx(null)}
                      style={{
                        position: "absolute", left: `${left}%`, width: `${width}%`, height: "100%", borderRadius: 6,
                        background: STATUS_SOFT[row.status], border: `1px solid ${row.color}`, display: "flex", alignItems: "center", overflow: "hidden",
                        cursor: "pointer", boxShadow: hovered ? `0 0 0 2px ${row.color}` : "none",
                      }}>
                      <div style={{ height: "100%", width: `${row.progress}%`, background: row.color, opacity: 0.85 }} />
                    </div>
                    {hovered && (
                      <div style={{
                        position: "absolute", left: `${Math.min(left, 70)}%`, zIndex: 10,
                        ...(tooltipBelow ? { top: "calc(100% + 8px)" } : { bottom: "calc(100% + 8px)" }),
                        background: T.navy, color: "#fff", borderRadius: 8, padding: "8px 11px", minWidth: 170,
                        boxShadow: "0 8px 20px rgba(8,26,46,0.25)", pointerEvents: "none",
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{row.label}</div>
                        <div style={{ fontSize: 11, color: "#C7D6E8" }}>{fmtDate(row.start)} – {fmtDate(row.end)}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
                          <span style={{ fontSize: 11, color: "#C7D6E8" }}>Progress</span>
                          <span style={{ fontFamily: MONO, fontSize: 12.5, fontWeight: 700 }}>{row.progress}%</span>
                        </div>
                        <div style={{ marginTop: 5 }}><StatusChip status={row.status} /></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 18, fontSize: 11.5, color: T.inkMuted, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: T.blue }} /> Stream 1 — Drive the Value</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: T.plum }} /> Stream 2 — Build the Engine</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 2, height: 10, background: T.plum }} /> Today (Aug 17, 2026)</span>
        </div>
      </Card>

      {role !== "lead" ? (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <SectionLabel icon={ListChecks}>Activity Template — Initiatives × Phases</SectionLabel>
            <div style={{ display: "flex", gap: 6 }}>
              {ACTIVITY_VIEWS.map(v => (
                <button key={v} onClick={() => setActivityView(v)}
                  style={{
                    border: `1px solid ${activityView === v ? T.navy : T.border}`, background: activityView === v ? T.navy : T.bg,
                    color: activityView === v ? "#fff" : T.inkMuted, borderRadius: 8, padding: "6px 13px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                  }}>{v}</button>
              ))}
            </div>
          </div>
          {activityView === "Quarterly" && <QuarterLegend />}
          <div style={{ fontSize: 12, color: T.inkMuted, margin: "-6px 0 4px" }}>
            Every activity moves through: <b style={{ color: T.ink }}>As-Is Scan → Standard → Pilot → Baseline & Measure → Scale</b>.
            Progress rolls up automatically into the initiative and objective{editable ? "" : " (view only)"}. KPI values only change via the quarterly KPI Checkpoint below, once approved by the BA Lead.
          </div>

          {activityView === "List" ? (
            <ActivityListView objectives={objectives} streams={streams} editable={editable}
              onRequestEdit={(objectiveId, initiativeId, activity) => {
                setModalCtx({ mode: "edit", kind: "activity", objectiveId, initiativeId, activity });
              }}
            />
          ) : activityView === "Phase" ? (
            <PhaseView objectives={objectives} streams={streams} editable={editable}
              onRequestEdit={(objectiveId, initiativeId, activity) => {
                setModalCtx({ mode: "edit", kind: "activity", objectiveId, initiativeId, activity });
              }}
            />
          ) : objectives.map(o => {
            const stream = streams.find(s => s.id === o.streamId);
            return (
              <div key={o.id} style={{ marginTop: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: stream.color }} />
                  <span style={{ fontSize: 13.5, fontWeight: 800, color: T.navy }}>O{o.number} · {o.title}</span>
                  <span style={{ fontSize: 11.5, color: T.inkMuted }}>{o.owner}</span>
                </div>
                {o.initiatives.map(init => (
                  <InitiativeTimelineBlock key={init.id} initiative={init} editable={editable} viewMode={activityView}
                    onToggleSub={(activityId, subId) => onToggleSub(o.id, init.id, activityId, subId)}
                    onDeleteSub={(activityId, subId) => onDeleteSub(o.id, init.id, activityId, subId)}
                    onQuickUpdate={(activityId, patch) => onUpdateActivity(o.id, init.id, activityId, patch)}
                    onRequestAdd={() => setModalCtx({ mode: "add", kind: "activity", objectiveId: o.id, initiativeId: init.id, activity: null })}
                    onRequestEdit={(activity) => setModalCtx({ mode: "edit", kind: "activity", objectiveId: o.id, initiativeId: init.id, activity })}
                    onRequestAddSub={(activityId) => setModalCtx({ mode: "add", kind: "sub", objectiveId: o.id, initiativeId: init.id, activityId, sub: null })}
                    onRequestEditSub={(activityId, sub) => setModalCtx({ mode: "edit", kind: "sub", objectiveId: o.id, initiativeId: init.id, activityId, sub })}
                  />
                ))}
              </div>
            );
          })}
        </>
      ) : (
        <div style={{ fontSize: 12.5, color: T.inkMuted, background: T.surface, borderRadius: 10, padding: "12px 14px" }}>
          Activity-level tracking is hidden in this view. Use the KPI checkpoints below to review and approve quarterly KPI submissions.
        </div>
      )}

      <SectionLabel icon={Clock}>Milestones & KPI Checkpoints</SectionLabel>
      <MilestonesCard objectives={objectives} editable={editable}
        canSubmitCheckpoint={canSubmitCheckpoint} canApproveCheckpoint={canApproveCheckpoint}
        role={role} currentOwner={currentOwner} onAddMilestone={onAddMilestone} onUpdateMilestone={onUpdateMilestone} onDeleteMilestone={onDeleteMilestone} />

      {modalCtx && modalCtx.kind === "activity" && (
        <ActivityFormModal
          mode={modalCtx.mode} activity={modalCtx.activity}
          onClose={() => setModalCtx(null)}
          onSave={(payload) => {
            if (modalCtx.mode === "add") onAddActivity(modalCtx.objectiveId, modalCtx.initiativeId, payload);
            else onUpdateActivity(modalCtx.objectiveId, modalCtx.initiativeId, modalCtx.activity.id, payload);
            setModalCtx(null);
          }}
          onDelete={modalCtx.mode === "edit" ? () => {
            onDeleteActivity(modalCtx.objectiveId, modalCtx.initiativeId, modalCtx.activity.id);
            setModalCtx(null);
          } : undefined}
        />
      )}

      {modalCtx && modalCtx.kind === "sub" && (
        <SubActivityFormModal
          mode={modalCtx.mode} sub={modalCtx.sub}
          onClose={() => setModalCtx(null)}
          onSave={(payload) => {
            if (modalCtx.mode === "add") onAddSub(modalCtx.objectiveId, modalCtx.initiativeId, modalCtx.activityId, payload);
            else onUpdateSub(modalCtx.objectiveId, modalCtx.initiativeId, modalCtx.activityId, modalCtx.sub.id, payload);
            setModalCtx(null);
          }}
          onDelete={modalCtx.mode === "edit" ? () => {
            onDeleteSub(modalCtx.objectiveId, modalCtx.initiativeId, modalCtx.activityId, modalCtx.sub.id);
            setModalCtx(null);
          } : undefined}
        />
      )}
    </div>
  );
}

function MilestonesCard({ objectives, editable, canSubmitCheckpoint, canApproveCheckpoint, role, currentOwner, onAddMilestone, onUpdateMilestone, onDeleteMilestone }) {
  // filterMode is either a day-window number (7/30/90), a quarter id
  // ("Q1".."Q4"), or "all" — quarters are the natural lens for the KPI
  // checkpoints, which land at each quarter end.
  const [filterMode, setFilterMode] = useState(30);
  const [typeFilter, setTypeFilter] = useState("all");
  const [milestoneModal, setMilestoneModal] = useState(null); // { mode, objectiveId, milestone }
  const [checkpointModal, setCheckpointModal] = useState(null); // { objective, milestone }
  const all = objectives.flatMap(o => o.milestones.map(m => ({ ...m, objective: o })));

  const quarterRanges = {
    Q1: ["2026-07-01", "2026-09-30"],
    Q2: ["2026-10-01", "2026-12-31"],
    Q3: ["2027-01-01", "2027-03-31"],
    Q4: ["2027-04-01", "2027-06-30"],
  };

  const isQuarter = typeof filterMode === "string" && quarterRanges[filterMode];
  const shown = all.filter(m => {
    if (filterMode === "all") return true;
    if (isQuarter) {
      const [from, to] = quarterRanges[filterMode];
      return m.date >= from && m.date <= to;
    }
    const days = daysBetween(TODAY, d(m.date));
    return days >= -3650 && days <= filterMode && m.status !== "Completed";
  }).sort((a, b) => d(a.date) - d(b.date));

  const heading = filterMode === "all"
    ? "All Milestones"
    : isQuarter
      ? `${filterMode} · ${QUARTERS.find(q => q.id === filterMode)?.range || ""}`
      : `Next ${filterMode} Days`;

  const canApprove = canApproveCheckpoint;

  const btn = (active) => ({
    border: `1px solid ${active ? T.navy : T.border}`, background: active ? T.navy : T.bg,
    color: active ? "#fff" : T.inkMuted, borderRadius: 7, padding: "4px 10px", fontSize: 11.5, cursor: "pointer", fontWeight: 600,
  });

  return (
    <Card style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>{heading} <span style={{ fontWeight: 500, color: T.inkMuted }}>({shown.length})</span></div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[7, 30, 90].map(r => (
              <button key={r} onClick={() => setFilterMode(r)} style={btn(filterMode === r)}>{r}d</button>
            ))}
          </div>
          <span style={{ width: 1, height: 18, background: T.border }} />
          <div style={{ display: "flex", gap: 6 }}>
            {QUARTERS.map(q => (
              <button key={q.id} onClick={() => setFilterMode(q.id)} title={q.range} style={btn(filterMode === q.id)}>{q.id}</button>
            ))}
            <button onClick={() => setFilterMode("all")} style={btn(filterMode === "all")}>All</button>
          </div>
          <span style={{ width: 1, height: 18, background: T.border }} />
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { id: "all", label: "All types" },
              { id: "checkpoint", label: "KPI Checkpoints" },
              { id: "delivery", label: "Delivery" },
            ].map(t => (
              <button key={t.id} onClick={() => setTypeFilter(t.id)} style={btn(typeFilter === t.id)}>{t.label}</button>
            ))}
          </div>
          {editable && (
            <button onClick={() => setMilestoneModal({ mode: "add", objectiveId: objectives[0]?.id, milestone: null })}
              style={{ display: "flex", alignItems: "center", gap: 5, border: `1px dashed ${T.borderStrong}`, background: "none", color: T.navy, borderRadius: 7, padding: "5px 10px", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
              <Plus size={12} /> Add Milestone
            </button>
          )}
        </div>
      </div>

      {/* KPI measurement checkpoints and ordinary delivery milestones are
          different animals — one is a governed quarterly measurement with an
          approval flow, the other is a normal deliverable date. They're shown
          as separate groups so they're never confused. */}
      {[
        { key: "checkpoint", title: "KPI Measurement Checkpoints", hint: "Quarterly — owner submits, BA Lead approves", accent: T.plum, items: shown.filter(m => m.kind === "kpi_checkpoint") },
        { key: "delivery", title: "Delivery Milestones", hint: "Objective deliverables and target dates", accent: T.blue, items: shown.filter(m => m.kind !== "kpi_checkpoint") },
      ]
        .filter(g => typeFilter === "all" || typeFilter === g.key)
        .map(group => (
          <div key={group.key} style={{ marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, paddingLeft: 4, borderLeft: `3px solid ${group.accent}` }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: T.navy, marginLeft: 6 }}>{group.title}</span>
              <span style={{ fontSize: 10.5, color: T.inkMuted, background: T.surface, borderRadius: 10, padding: "1px 7px" }}>{group.items.length}</span>
              <span style={{ fontSize: 11, color: T.inkFaint }}>{group.hint}</span>
            </div>
            {group.items.length === 0 ? (
              <div style={{ color: T.inkMuted, fontSize: 12.5, padding: "4px 0 8px" }}>None in this window.</div>
            ) : group.items.map((m, i) => {
              const isCheckpoint = m.kind === "kpi_checkpoint";
              // Only the Objective Leader who owns this objective (or admin)
              // may submit its quarterly KPI values.
              const canSubmitThis = canSubmitCheckpoint && (role === "admin" || currentOwner === m.objective.owner);
              const rowStatus = isCheckpoint
                ? (m.reviewStatus === "Approved" ? "Completed" : m.reviewStatus === "Pending Review" ? "At Risk" : m.reviewStatus === "Rejected" ? "Delayed" : "Not Started")
                : (m.status === "Overdue" ? "Delayed" : m.status === "Completed" ? "Completed" : "Not Started");
              return (
                <div key={m.id || i} style={{
                  display: "grid",
                  gridTemplateColumns: (editable || isCheckpoint) ? "90px minmax(0, 1fr) 90px 120px 28px" : "90px minmax(0, 1fr) 90px 120px",
                  gap: 10, alignItems: "center", padding: "9px 4px 9px 10px",
                  borderTop: i === 0 ? "none" : `1px solid ${T.border}`,
                  borderLeft: `3px solid ${isCheckpoint ? T.plumSoft : "transparent"}`,
                  background: isCheckpoint ? "rgba(247,233,241,0.35)" : "transparent",
                }}>
                  <Num size={12} color={T.navy}>{m.date}</Num>
                  <div style={{ fontSize: 13, color: T.ink, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
                    {isCheckpoint
                      ? <GaugeIcon size={12} color={T.plum} />
                      : <CalendarRange size={12} color={T.inkFaint} />}
                    {((m.evidence && m.evidence.length > 0) || m.fileName) && <Paperclip size={11} color={T.inkMuted} />}
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                      {m.name}
                      <div style={{ fontSize: 11, color: T.inkMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>O{m.objective.number} · {m.objective.title}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: T.inkMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.objective.owner}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <StatusChip status={rowStatus} />
                    {isCheckpoint && m.reviewStatus === "Pending Review" && (
                      <span style={{ fontSize: 9.5, fontWeight: 800, color: T.plum, background: T.plumSoft, borderRadius: 4, padding: "1px 5px", whiteSpace: "nowrap" }}>REVIEW</span>
                    )}
                  </div>
                  {isCheckpoint ? (
                    (canSubmitThis || canApprove) && (
                      <button onClick={() => setCheckpointModal({ objective: m.objective, milestone: m })} title="Open KPI checkpoint"
                        style={{ border: "none", background: "none", cursor: "pointer", color: T.inkFaint, padding: 2, display: "flex" }}>
                        <Pencil size={13} />
                      </button>
                    )
                  ) : editable && (
                    <button onClick={() => setMilestoneModal({ mode: "edit", objectiveId: m.objective.id, milestone: m })} title="Edit milestone"
                      style={{ border: "none", background: "none", cursor: "pointer", color: T.inkFaint, padding: 2, display: "flex" }}>
                      <Pencil size={13} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      {milestoneModal && (
        <MilestoneFormModal
          mode={milestoneModal.mode} milestone={milestoneModal.milestone} objectives={objectives} defaultObjectiveId={milestoneModal.objectiveId}
          onClose={() => setMilestoneModal(null)}
          onSave={(payload) => {
            const { objective: newObjectiveId, ...rest } = payload;
            if (milestoneModal.mode === "add") {
              onAddMilestone(newObjectiveId, rest);
            } else if (newObjectiveId !== milestoneModal.objectiveId) {
              onDeleteMilestone(milestoneModal.objectiveId, milestoneModal.milestone.id);
              onAddMilestone(newObjectiveId, rest);
            } else {
              onUpdateMilestone(milestoneModal.objectiveId, milestoneModal.milestone.id, rest);
            }
            setMilestoneModal(null);
          }}
          onDelete={milestoneModal.mode === "edit" ? () => {
            onDeleteMilestone(milestoneModal.objectiveId, milestoneModal.milestone.id);
            setMilestoneModal(null);
          } : undefined}
        />
      )}
      {checkpointModal && (
        <KpiCheckpointModal
          milestone={checkpointModal.milestone} objective={checkpointModal.objective}
          canSubmit={canSubmitCheckpoint && (role === "admin" || currentOwner === checkpointModal.objective.owner)}
          canApprove={canApprove}
          onClose={() => setCheckpointModal(null)}
          onSubmit={(values, evidence) => {
            onUpdateMilestone(checkpointModal.objective.id, checkpointModal.milestone.id, {
              kpiRecords: values, evidence, reviewStatus: "Pending Review", reviewedBy: null, reviewNote: "",
            });
            setCheckpointModal(null);
          }}
          onApprove={(note) => {
            onUpdateMilestone(checkpointModal.objective.id, checkpointModal.milestone.id, {
              reviewStatus: "Approved", reviewedBy: "BA Lead", reviewNote: note, status: "Completed",
            });
            setCheckpointModal(null);
          }}
          onReject={(note) => {
            onUpdateMilestone(checkpointModal.objective.id, checkpointModal.milestone.id, {
              reviewStatus: "Rejected", reviewedBy: "BA Lead", reviewNote: note,
            });
            setCheckpointModal(null);
          }}
        />
      )}
    </Card>
  );
}

/* ============================================================================
   RISKS PAGE
============================================================================ */
function RisksPage({ objectives, forecastOverrides, risks, editable, onAddRisk, onUpdateRisk, onDeleteRisk }) {
  const [riskModal, setRiskModal] = useState(null); // { mode, risk }
  const items = buildAttentionItems(objectives, forecastOverrides);
  const objById = Object.fromEntries(objectives.map(o => [o.id, o]));
  const scopedRisks = risks.filter(r => objById[r.objective]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionLabel icon={AlertTriangle}>Needs Your Attention — {items.length} items</SectionLabel>
      <Card style={{ padding: 8 }}>
        <AttentionTable items={items} onSelect={() => {}} />
      </Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <SectionLabel icon={AlertTriangle}>Logged Risks & Blockers</SectionLabel>
        {editable && (
          <button onClick={() => setRiskModal({ mode: "add", risk: null })}
            style={{ display: "flex", alignItems: "center", gap: 5, border: `1px dashed ${T.borderStrong}`, background: "none", color: T.navy, borderRadius: 7, padding: "5px 10px", fontSize: 11.5, fontWeight: 700, cursor: "pointer", marginBottom: 14 }}>
            <Plus size={12} /> Add Risk
          </button>
        )}
      </div>
      <Card style={{ padding: 0 }}>
        {scopedRisks.length === 0 ? (
          <div style={{ padding: 16, fontSize: 13, color: T.inkMuted }}>No logged risks for the current view.</div>
        ) : scopedRisks.map((r, i) => {
          const o = objById[r.objective];
          return (
            <div key={r.id} style={{ display: "grid", gridTemplateColumns: "90px minmax(0, 1fr) 100px 100px 32px", gap: 12, alignItems: "center", padding: "12px 16px", borderTop: i === 0 ? "none" : `1px solid ${T.border}` }}>
              <StatusChip status={r.severity} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, color: T.ink, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.issue}</div>
                <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>O{o.number} · {o.title} · Action: {r.action}</div>
              </div>
              <div style={{ fontSize: 12.5, color: T.inkMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.owner}</div>
              <div style={{ fontSize: 12.5, color: T.inkMuted, fontFamily: MONO }}>{r.due}</div>
              {editable && (
                <button onClick={() => setRiskModal({ mode: "edit", risk: r })} title="Edit risk"
                  style={{ border: "none", background: "none", cursor: "pointer", color: T.inkFaint, padding: 2, display: "flex" }}>
                  <Pencil size={13} />
                </button>
              )}
            </div>
          );
        })}
      </Card>
      {riskModal && (
        <RiskFormModal
          mode={riskModal.mode} risk={riskModal.risk} objectives={objectives}
          onClose={() => setRiskModal(null)}
          onSave={(payload) => {
            if (riskModal.mode === "add") onAddRisk(payload);
            else onUpdateRisk(riskModal.risk.id, payload);
            setRiskModal(null);
          }}
          onDelete={riskModal.mode === "edit" ? () => { onDeleteRisk(riskModal.risk.id); setRiskModal(null); } : undefined}
        />
      )}
    </div>
  );
}

/* ============================================================================
   COMPLIANCE PAGE
============================================================================ */
const CYCLE_START = "2026-08-01";
const CYCLE_EXPECTED = "2026-08-15";

function CompliancePage({ objectives }) {
  const owners = Array.from(new Set(objectives.map(o => o.owner))).sort();
  const rows = owners.map(owner => {
    const objs = objectives.filter(o => o.owner === owner);
    const lastDates = objs.map(o => lastActivityUpdate(o)).filter(Boolean);
    const actual = lastDates.length ? lastDates.sort().slice(-1)[0] : null;
    let status;
    if (actual && actual >= CYCLE_START) status = "Submitted";
    else if (TODAY_STR > CYCLE_EXPECTED) status = "Late";
    else status = "Pending";
    return { owner, objs, actual, status };
  });
  const submitted = rows.filter(r => r.status === "Submitted").length;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <Card style={{ padding: 20, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{
          width: 62, height: 62, borderRadius: "50%", border: `5px solid ${T.green}`,
          display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 700, fontSize: 15, color: T.navy,
        }}>{submitted}/{rows.length}</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.navy }}>Update Compliance — This Cycle</div>
          <div style={{ fontSize: 13, color: T.inkMuted }}>{submitted} of {rows.length} objective owners have made a Timeline update since {CYCLE_START}.</div>
        </div>
      </Card>
      <Card style={{ padding: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.surface }}>
              {["Owner", "Objectives", "Expected By", "Last Timeline Update", "Status"].map(h => (
                <th key={h} style={{ padding: "10px 12px", fontSize: 10.5, fontWeight: 700, color: T.inkMuted, textAlign: "left", textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.owner} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: "12px", fontSize: 13, fontWeight: 600 }}>{r.owner}</td>
                <td style={{ padding: "12px", fontSize: 12.5, color: T.inkMuted }}>
                  {r.objs.map(o => `O${o.number}`).join(", ")}
                </td>
                <td style={{ padding: "12px", fontFamily: MONO, fontSize: 12.5 }}>{CYCLE_EXPECTED}</td>
                <td style={{ padding: "12px", fontFamily: MONO, fontSize: 12.5 }}>{r.actual || "—"}</td>
                <td style={{ padding: "12px" }}><StatusChip status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <SectionLabel icon={Users}>Progress by Objective Owner</SectionLabel>
      <OwnerSection objectives={objectives} />
    </div>
  );
}

/* ============================================================================
   OWNER (PROGRESS BY OWNER) — folded into Compliance page bottom section
============================================================================ */
function OwnerSection({ objectives }) {
  const owners = Array.from(new Set(objectives.map(o => o.owner)));
  const rows = owners.map(owner => {
    const objs = objectives.filter(o => o.owner === owner);
    const allInit = objs.flatMap(o => o.initiatives);
    const avgProgress = Math.round(objs.reduce((a, o) => a + objectiveProgress(o), 0) / objs.length);
    const onTime = allInit.filter(i => !isOverdue(i.due, i.progress)).length;
    const delayed = allInit.filter(i => initiativeStatus(i) === "Delayed").length;
    const atRisk = allInit.filter(i => initiativeStatus(i) === "At Risk").length;
    const kpiAch = Math.round(objs.reduce((a, o) => a + Math.min(100, achievementPct(o.kpi)), 0) / objs.length);
    const lastUpdate = objs.map(o => o.lastUpdate).sort().reverse()[0];
    return { owner, objCount: objs.length, initCount: allInit.length, avgProgress, onTimePct: Math.round((onTime / allInit.length) * 100), delayed, atRisk, kpiAch, lastUpdate };
  });
  return (
    <Card style={{ padding: 0, overflow: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: T.surface }}>
            {["Owner", "Objectives", "Initiatives", "Avg Progress", "On-Time %", "Delayed", "At Risk", "KPI Ach.", "Last Update"].map(h => (
              <th key={h} style={{ padding: "10px 12px", fontSize: 10.5, fontWeight: 700, color: T.inkMuted, textAlign: "left", textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.owner} style={{ borderBottom: `1px solid ${T.border}` }}>
              <td style={{ padding: "12px", fontSize: 13, fontWeight: 700, color: T.navy }}>{r.owner}</td>
              <td style={{ padding: "12px", fontFamily: MONO, fontSize: 12.5 }}>{r.objCount}</td>
              <td style={{ padding: "12px", fontFamily: MONO, fontSize: 12.5 }}>{r.initCount}</td>
              <td style={{ padding: "12px", fontFamily: MONO, fontSize: 12.5 }}>{r.avgProgress}%</td>
              <td style={{ padding: "12px", fontFamily: MONO, fontSize: 12.5 }}>{r.onTimePct}%</td>
              <td style={{ padding: "12px", fontFamily: MONO, fontSize: 12.5, color: r.delayed ? T.red : T.inkMuted }}>{r.delayed}</td>
              <td style={{ padding: "12px", fontFamily: MONO, fontSize: 12.5, color: r.atRisk ? T.amber : T.inkMuted }}>{r.atRisk}</td>
              <td style={{ padding: "12px", fontFamily: MONO, fontSize: 12.5 }}>{r.kpiAch}%</td>
              <td style={{ padding: "12px", fontFamily: MONO, fontSize: 12, color: T.inkMuted }}>{r.lastUpdate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

/* ============================================================================
   SETTINGS & DATA PAGE  (same pattern as the Objective 5 app)
   - Export all data as JSON so changes made in the app can be sent back
     and merged into the source file, or kept as a backup.
   - Import a previously exported JSON to restore/continue from it.
   - Reset to the original seeded data.
============================================================================ */
function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function SettingsPage({ liveObjectives, setLiveObjectives, onToast, scopeOwner }) {
  const [importError, setImportError] = useState("");
  const fileInputRef = React.useRef(null);

  const scopeObjectives = scopeOwner ? liveObjectives.filter(o => o.owner === scopeOwner) : liveObjectives;
  const scopeIds = new Set(scopeObjectives.map(o => o.id));
  const allInit = scopeObjectives.flatMap(o => o.initiatives);
  const stats = [
    { label: "Objectives", v: scopeObjectives.length },
    { label: "Initiatives", v: allInit.length },
    { label: "Completed Initiatives", v: allInit.filter(i => i.progress >= 100).length },
    { label: "Last export", v: "—" },
  ];

  const handleExport = () => {
    const today = "2026-08-19";
    downloadJSON(
      { exportedAt: today, strategy: RAW.strategy.name, scope: scopeOwner || "all", objectives: scopeObjectives },
      `ba-strategy-data-${(scopeOwner || "all").toLowerCase()}-${today}.json`
    );
    onToast("Data exported");
  };

  const handleReset = () => {
    const msg = scopeOwner
      ? `Reset ${scopeOwner}'s objectives to the original seeded values? Any edits made in this session will be lost.`
      : "Reset all data to the original seeded values? Any edits made in this session will be lost.";
    if (window.confirm(msg)) {
      if (scopeOwner) {
        setLiveObjectives(prev => prev.map(o => (scopeIds.has(o.id) ? RAW.objectives.find(r => r.id === o.id) : o)));
      } else {
        setLiveObjectives(RAW.objectives);
      }
      onToast("Data reset to initial values");
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError("");
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const objs = parsed.objectives || parsed;
        if (!Array.isArray(objs) || !objs.every(o => o.id && o.initiatives)) {
          throw new Error("File does not look like a valid strategy data export.");
        }
        const permitted = scopeOwner ? objs.filter(o => scopeIds.has(o.id)) : objs;
        if (scopeOwner && permitted.length === 0) {
          throw new Error(`This file doesn't contain any of ${scopeOwner}'s objectives.`);
        }
        const byId = Object.fromEntries(permitted.map(o => [o.id, o]));
        setLiveObjectives(prev => prev.map(o => byId[o.id] || o));
        onToast("Data imported");
      } catch (err) {
        setImportError(err.message || "Could not read this file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionLabel icon={SettingsIcon}>Settings & Data{scopeOwner ? ` — ${scopeOwner}` : ""}</SectionLabel>

      <Card style={{ padding: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 11, color: T.inkMuted, marginBottom: 4 }}>{s.label}</div>
              <Num size={18}>{s.v}</Num>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 4 }}>Export {scopeOwner ? "my" : "all"} data</div>
        <div style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 14 }}>
          {scopeOwner
            ? `Downloads a JSON file with your own objectives, KPIs, sub-metrics and initiatives — including any edits made in this session. Send this file back so it can be merged into the source code.`
            : "Downloads a JSON file with every objective, KPI, sub-metric and initiative — including any edits made in this session. Send this file back so it can be merged into the source code, or keep it as a backup."}
        </div>
        <button onClick={handleExport}
          style={{
            display: "flex", alignItems: "center", gap: 8, border: "none", background: T.navy, color: "#fff",
            borderRadius: 9, padding: "10px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>
          <Download size={15} /> Export {scopeOwner ? "my" : "all"} data (JSON)
        </button>
      </Card>

      <Card style={{ padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 4 }}>Import data</div>
        <div style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 14 }}>
          {scopeOwner
            ? "Load a previously exported JSON file to continue from it. Only entries matching your own objectives will be applied."
            : "Load a previously exported JSON file to continue from it in this browser session."}
        </div>
        <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImportFile} style={{ display: "none" }} />
        <button onClick={() => fileInputRef.current?.click()}
          style={{
            display: "flex", alignItems: "center", gap: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.navy,
            borderRadius: 9, padding: "10px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>
          <Upload size={15} /> Import from file
        </button>
        {importError && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.red, fontSize: 12.5, marginTop: 10 }}>
            <AlertCircle size={14} /> {importError}
          </div>
        )}
      </Card>

      <Card style={{ padding: 20, borderColor: T.redSoft }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 4 }}>Reset {scopeOwner ? "my" : "all"} data</div>
        <div style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 14 }}>
          {scopeOwner
            ? "Discards any edits you made this session and restores your objectives to their originally seeded values."
            : "Discards any edits made in this session and restores the originally seeded strategy data."}
        </div>
        <button onClick={handleReset}
          style={{
            display: "flex", alignItems: "center", gap: 8, border: `1px solid ${T.red}`, background: T.redSoft, color: T.red,
            borderRadius: 9, padding: "10px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>
          <RotateCcw size={15} /> Reset {scopeOwner ? "my" : "all"} data
        </button>
      </Card>
    </div>
  );
}

/* ============================================================================
   FORECAST PANEL
============================================================================ */
function ForecastPanel({ objectives, streams, forecastOverrides, setForecastOverrides, onClose, onApply }) {
  const baseline = strategyProgress(streams, objectives, {});
  const forecast = strategyProgress(streams, objectives, forecastOverrides);
  return (
    <Card style={{ padding: 20, border: `1px solid ${T.plum}`, background: T.plumSoft }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Sliders size={16} color={T.plum} />
          <span style={{ fontSize: 14, fontWeight: 700, color: T.navy }}>Forecast Strategy — What-If Mode</span>
        </div>
        <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: T.inkMuted }}><X size={16} /></button>
      </div>
      <div style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 16 }}>
        Adjust forecasted objective progress below. Nothing is saved to the live dataset until you click Apply.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 16 }}>
        {objectives.map(o => {
          const actual = objectiveProgress(o, {});
          const value = forecastOverrides[o.id] ?? actual;
          return (
            <div key={o.id} style={{ background: T.bg, borderRadius: 9, padding: 12, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: T.ink, marginBottom: 6 }}>O{o.number} · {o.title.slice(0, 28)}{o.title.length > 28 ? "…" : ""}</div>
              <input type="range" min={0} max={100} value={value} style={{ width: "100%", accentColor: T.plum }}
                onChange={e => setForecastOverrides(f => ({ ...f, [o.id]: Number(e.target.value) }))} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ color: T.inkMuted }}>Actual {actual}%</span>
                <Num size={12} color={T.plum}>{value}%</Num>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: T.bg, borderRadius: 10, padding: "14px 16px" }}>
        <ArrowRight size={16} color={T.plum} />
        <div style={{ fontSize: 13.5, color: T.ink }}>
          If these initiatives reach forecasted targets, overall strategy progress moves from <Num size={14} color={T.navy}>{baseline}%</Num> to <Num size={14} color={T.plum}>{forecast}%</Num>.
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={() => setForecastOverrides({})} style={{ border: `1px solid ${T.border}`, background: T.bg, borderRadius: 8, padding: "8px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", color: T.inkMuted }}>Clear</button>
          <button onClick={onApply} style={{ border: "none", background: T.navy, color: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>Apply</button>
        </div>
      </div>
    </Card>
  );
}

/* ============================================================================
   ROLES & URL LINKS
   - default link (no params)   → Fatima (Lead): sees everything, read-only,
     no Settings & Data, no editing, no Forecast Strategy.
   - ?edit=1                    → Mashael (Admin): full control, everything visible.
   - ?owner=Leen / Yasser / Baghdady / Randa → that owner's personal link:
     locked to their own objectives, can edit their initiatives, sees a
     Settings & Data tab scoped to just their own data.
   No separate deploy needed — same repo, same Vercel project, different links.
============================================================================ */
const OBJECTIVE_LEADERS = ["Yasser", "Leen", "Baghdady", "Randa"];

function getRoleFromUrl() {
  const fallback = { role: "lead", person: "" };
  if (typeof window === "undefined") return fallback;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("edit") === "1") return { role: "admin", person: "" };

    const leaderParam = params.get("leader") || params.get("owner"); // ?owner= kept for existing links
    if (leaderParam) {
      const matched = OBJECTIVE_LEADERS.find(o => o.toLowerCase() === leaderParam.trim().toLowerCase());
      if (matched) return { role: "leader", person: matched };
    }
    // Objective Owners are assigned freely by their Leader (any name, typed
    // in on the Objectives page), so any non-empty ?member= is accepted —
    // scoping then depends on whether that name is actually assigned to an
    // objective (see scopeObjectivesForRole).
    const memberParam = params.get("member");
    if (memberParam && memberParam.trim()) {
      return { role: "member", person: memberParam.trim() };
    }
    return fallback;
  } catch {
    return fallback;
  }
}

/* ============================================================================
   PERMISSION MODEL
   Four roles, each with its own tab set, data scope, and edit rights:

   admin   (?edit=1)          — everything, unrestricted.
   lead    (no parameter)     — BA Lead (Fatima). Sees Overview, Objectives,
                                KPIs, Risks, Update Compliance. View-only,
                                except she is the ONLY one who approves the
                                quarterly KPI checkpoints.
   leader  (?leader=Yasser)   — Objective Leader. Sees only their objectives:
                                Objectives, Initiatives, Timeline, Risks.
                                Timeline is view-only for them EXCEPT the
                                quarterly KPI checkpoint, which they submit.
   member  (?member=Sara)     — Objective Owner working under a leader. Sees
                                Objectives, Timeline, Risks for the objectives
                                they hold. Full Timeline editing EXCEPT the KPI
                                checkpoint, which is not theirs to touch.
============================================================================ */
const PERMISSIONS = {
  admin: {
    tabs: ["overview", "streams", "objectives", "kpis", "initiatives", "timeline", "risks", "compliance", "settings"],
    editTimeline: true, editInitiatives: true, submitCheckpoint: true, approveCheckpoint: true,
    editKpiDefinition: true, editRisks: true, forecast: true,
  },
  lead: {
    tabs: ["overview", "objectives", "kpis", "compliance"],
    editTimeline: false, editInitiatives: false, submitCheckpoint: false, approveCheckpoint: true,
    // The BA Lead owns the metric set itself — she can add/edit/delete
    // KPIs and Sub-Metrics (their definitions), separate from approving
    // the quarterly measured values, which stays a checkpoint action.
    editKpiDefinition: true, editRisks: false, forecast: false,
  },
  leader: {
    tabs: ["objectives", "initiatives", "timeline", "risks"],
    // Timeline itself (activities/sub-activities) is view-only for leaders,
    // but they can add/edit the initiatives that sit under their objectives.
    editTimeline: false, editInitiatives: true, submitCheckpoint: true, approveCheckpoint: false,
    editKpiDefinition: false, editRisks: true, forecast: false,
  },
  member: {
    tabs: ["objectives", "timeline", "risks"],
    editTimeline: true, editInitiatives: false, submitCheckpoint: false, approveCheckpoint: false,
    editKpiDefinition: false, editRisks: true, forecast: false,
  },
};

/* Which objectives a person is allowed to see. Leaders own objectives
   outright; members are scoped to objectives explicitly assigned to them
   by their leader, or where they already own an initiative. */
function scopeObjectivesForRole(objectives, role, person) {
  if (role === "leader") return objectives.filter(o => o.owner === person);
  if (role === "member") {
    const p = person.trim().toLowerCase();
    return objectives.filter(o =>
      (o.assignedOwner && o.assignedOwner.trim().toLowerCase() === p) ||
      (o.initiatives || []).some(i => (i.owner || "").trim().toLowerCase() === p)
    );
  }
  return objectives;
}


/* ============================================================================
   ROOT APP
============================================================================ */
export default function App() {
  const { role, person } = useMemo(() => getRoleFromUrl(), []);
  const perms = PERMISSIONS[role] || PERMISSIONS.lead;
  const initialOwner = role === "leader" ? person : "";
  const canEdit = perms.editTimeline;
  const [page, setPage] = useState(perms.tabs[0]);
  const [filters, setFilters] = useState({ stream: "", objective: "", owner: "", status: "" });
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [forecastMode, setForecastMode] = useState(false);
  const [year, setYear] = useState("2026");
  const [forecastOverrides, setForecastOverrides] = useState({});
  const [liveObjectives, setLiveObjectives] = useState(RAW.objectives);
  const [liveRisks, setLiveRisks] = useState(RAW.risks);
  const [editingInitiative, setEditingInitiative] = useState(null);
  const [toast, setToast] = useState(null);

  const enrichedObjectives = useMemo(() => enrichObjectives(liveObjectives), [liveObjectives]);
  // Role scope is applied before user filters, so a leader/member can never
  // widen their view past their own objectives via the filter bar.
  const scopedObjectives = useMemo(() => scopeObjectivesForRole(enrichedObjectives, role, person), [enrichedObjectives, role, person]);
  const filteredObjectives = useMemo(() => applyFilters(scopedObjectives, RAW.streams, filters), [scopedObjectives, filters]);
  const activeOverrides = forecastMode ? forecastOverrides : {};

  const saveInitiativeUpdate = useCallback((initId, patch) => {
    setLiveObjectives(prev => prev.map(o => ({
      ...o,
      initiatives: o.initiatives.map(i => {
        if (i.id !== initId) return i;
        const prevProgress = i.progress;
        const newHistoryEntry = {
          date: "2026-08-17", prev: prevProgress, next: patch.progress,
          summary: patch.comment || `Progress updated to ${patch.progress}%.`,
          blockers: "None", next2: patch.nextStep || i.nextMilestone, by: "Mashael",
        };
        return {
          ...i, owner: patch.owner || i.owner, progress: patch.progress, nextMilestone: patch.nextStep || i.nextMilestone,
          updatedBy: "Mashael", comments: patch.comment || i.comments,
          history: [newHistoryEntry, ...i.history],
        };
      }),
    })));
    setToast("Update saved");
    setTimeout(() => setToast(null), 2000);
  }, []);

  const applyForecast = () => {
    setLiveObjectives(prev => prev.map(o => {
      if (forecastOverrides[o.id] == null) return o;
      const target = forecastOverrides[o.id];
      const n = o.initiatives.length || 1;
      return { ...o, initiatives: o.initiatives.map(i => ({ ...i, progress: Math.min(100, target) })) };
    }));
    setForecastOverrides({});
    setForecastMode(false);
    setToast("Forecast applied to dataset");
    setTimeout(() => setToast(null), 2000);
  };

  const genId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const addActivity = useCallback((objectiveId, initiativeId, payload) => {
    setLiveObjectives(prev => prev.map(o => {
      if (o.id !== objectiveId) return o;
      return {
        ...o,
        initiatives: o.initiatives.map(i => i.id !== initiativeId ? i : {
          ...i, activities: [...(i.activities || []), {
            id: genId("act"), name: payload.name, owner: payload.owner || "", phase: payload.phase, quarter: payload.quarter, date: payload.date,
            plannedStart: payload.plannedStart, plannedEnd: payload.plannedEnd,
            actualStart: payload.actualStart || null, actualEnd: payload.actualEnd || null,
            progress: payload.progress ?? 0, kpiRecords: payload.kpiRecords || {}, subActivities: [],
            lastUpdated: TODAY_STR,
          }],
        }),
      };
    }));
    setToast("Activity added");
    setTimeout(() => setToast(null), 2000);
  }, []);

  const updateActivity = useCallback((objectiveId, initiativeId, activityId, patch) => {
    setLiveObjectives(prev => prev.map(o => {
      if (o.id !== objectiveId) return o;
      return {
        ...o,
        initiatives: o.initiatives.map(i => i.id !== initiativeId ? i : {
          ...i, activities: (i.activities || []).map(a => a.id === activityId ? { ...a, ...patch, lastUpdated: TODAY_STR } : a),
        }),
      };
    }));
    if (patch.name || patch.kpiRecords) {
      setToast("Activity updated");
      setTimeout(() => setToast(null), 2000);
    }
  }, []);

  const deleteActivity = useCallback((objectiveId, initiativeId, activityId) => {
    setLiveObjectives(prev => prev.map(o => {
      if (o.id !== objectiveId) return o;
      return {
        ...o,
        initiatives: o.initiatives.map(i => i.id !== initiativeId ? i : {
          ...i, activities: (i.activities || []).filter(a => a.id !== activityId),
        }),
      };
    }));
    setToast("Activity deleted");
    setTimeout(() => setToast(null), 2000);
  }, []);

  const addSubActivity = useCallback((objectiveId, initiativeId, activityId, payload) => {
    setLiveObjectives(prev => prev.map(o => {
      if (o.id !== objectiveId) return o;
      return {
        ...o,
        initiatives: o.initiatives.map(i => i.id !== initiativeId ? i : {
          ...i, activities: (i.activities || []).map(a => a.id !== activityId ? a : {
            ...a, lastUpdated: TODAY_STR, subActivities: [...(a.subActivities || []), {
              id: genId("sub"), name: payload.name,
              plannedStart: payload.plannedStart, plannedEnd: payload.plannedEnd,
              actualStart: payload.actualStart || null, actualEnd: payload.actualEnd || null,
              progress: payload.progress ?? 0, kpiRecords: payload.kpiRecords || {},
              lastUpdated: TODAY_STR,
            }],
          }),
        }),
      };
    }));
    setToast("Sub-activity added");
    setTimeout(() => setToast(null), 2000);
  }, []);

  const updateSubActivity = useCallback((objectiveId, initiativeId, activityId, subId, patch) => {
    setLiveObjectives(prev => prev.map(o => {
      if (o.id !== objectiveId) return o;
      return {
        ...o,
        initiatives: o.initiatives.map(i => i.id !== initiativeId ? i : {
          ...i, activities: (i.activities || []).map(a => a.id !== activityId ? a : {
            ...a, lastUpdated: TODAY_STR, subActivities: (a.subActivities || []).map(s => s.id === subId ? { ...s, ...patch, lastUpdated: TODAY_STR } : s),
          }),
        }),
      };
    }));
    setToast("Sub-activity updated");
    setTimeout(() => setToast(null), 2000);
  }, []);

  const toggleSubActivity = useCallback((objectiveId, initiativeId, activityId, subId) => {
    setLiveObjectives(prev => prev.map(o => {
      if (o.id !== objectiveId) return o;
      return {
        ...o,
        initiatives: o.initiatives.map(i => i.id !== initiativeId ? i : {
          ...i, activities: (i.activities || []).map(a => a.id !== activityId ? a : {
            ...a, lastUpdated: TODAY_STR, subActivities: (a.subActivities || []).map(s => {
              if (s.id !== subId) return s;
              const cur = subProgress(s);
              const { done, ...rest } = s;
              return { ...rest, progress: cur >= 100 ? 0 : 100, lastUpdated: TODAY_STR };
            }),
          }),
        }),
      };
    }));
  }, []);

  const deleteSubActivity = useCallback((objectiveId, initiativeId, activityId, subId) => {
    setLiveObjectives(prev => prev.map(o => {
      if (o.id !== objectiveId) return o;
      return {
        ...o,
        initiatives: o.initiatives.map(i => i.id !== initiativeId ? i : {
          ...i, activities: (i.activities || []).map(a => a.id !== activityId ? a : {
            ...a, subActivities: (a.subActivities || []).filter(s => s.id !== subId),
          }),
        }),
      };
    }));
    setToast("Sub-activity deleted");
    setTimeout(() => setToast(null), 2000);
  }, []);

  const addInitiative = useCallback((objectiveId, payload) => {
    setLiveObjectives(prev => prev.map(o => o.id !== objectiveId ? o : {
      ...o, initiatives: [...o.initiatives, {
        id: genId("i"), name: payload.name, owner: payload.owner || o.owner,
        start: payload.start, due: payload.due, progress: 0, priority: payload.priority,
        phase: "Not Started", nextMilestone: "—", deps: [], risks: "None",
        comments: "", evidence: "—", updatedBy: "Mashael", history: [], activities: [],
      }],
    }));
    setToast("Initiative added");
    setTimeout(() => setToast(null), 2000);
  }, []);

  const addMilestone = useCallback((objectiveId, payload) => {
    setLiveObjectives(prev => prev.map(o => o.id !== objectiveId ? o : {
      ...o, milestones: [...o.milestones, { id: genId("ms"), ...payload, lastUpdated: TODAY_STR }],
    }));
    setToast("Milestone added");
    setTimeout(() => setToast(null), 2000);
  }, []);

  const updateMilestone = useCallback((objectiveId, milestoneId, patch) => {
    setLiveObjectives(prev => prev.map(o => o.id !== objectiveId ? o : {
      ...o, milestones: o.milestones.map(m => m.id === milestoneId ? { ...m, ...patch, lastUpdated: TODAY_STR } : m),
    }));
    setToast("Milestone updated");
    setTimeout(() => setToast(null), 2000);
  }, []);

  const deleteMilestone = useCallback((objectiveId, milestoneId) => {
    setLiveObjectives(prev => prev.map(o => o.id !== objectiveId ? o : {
      ...o, milestones: o.milestones.filter(m => m.id !== milestoneId),
    }));
    setToast("Milestone deleted");
    setTimeout(() => setToast(null), 2000);
  }, []);

  const updateKpi = useCallback((objectiveId, patch) => {
    setLiveObjectives(prev => prev.map(o => o.id !== objectiveId ? o : { ...o, kpi: { ...o.kpi, ...patch } }));
    setToast("KPI updated");
    setTimeout(() => setToast(null), 2000);
  }, []);

  const updateAssignedOwner = useCallback((objectiveId, ownerName) => {
    setLiveObjectives(prev => prev.map(o => o.id !== objectiveId ? o : { ...o, assignedOwner: ownerName || null }));
    setToast(ownerName ? `${ownerName} assigned` : "Owner unassigned");
    setTimeout(() => setToast(null), 2000);
  }, []);

  const addSubMetric = useCallback((objectiveId, payload) => {
    setLiveObjectives(prev => prev.map(o => o.id !== objectiveId ? o : {
      ...o, subMetrics: [...o.subMetrics, {
        id: genId("sm"), name: payload.name, current: 0, target: payload.target, previous: 0,
        unit: payload.unit, lowerBetter: payload.lowerBetter, trend: "flat", lastUpdated: TODAY_STR, dataOwner: o.owner,
      }],
    }));
    setToast("Sub-metric added");
    setTimeout(() => setToast(null), 2000);
  }, []);

  const updateSubMetric = useCallback((objectiveId, smId, patch) => {
    setLiveObjectives(prev => prev.map(o => o.id !== objectiveId ? o : {
      ...o, subMetrics: o.subMetrics.map(sm => sm.id === smId ? { ...sm, ...patch } : sm),
    }));
    setToast("Sub-metric updated");
    setTimeout(() => setToast(null), 2000);
  }, []);

  const deleteSubMetric = useCallback((objectiveId, smId) => {
    setLiveObjectives(prev => prev.map(o => o.id !== objectiveId ? o : {
      ...o, subMetrics: o.subMetrics.filter(sm => sm.id !== smId),
    }));
    setToast("Sub-metric deleted");
    setTimeout(() => setToast(null), 2000);
  }, []);

  const addRisk = useCallback((payload) => {
    setLiveRisks(prev => [...prev, { id: genId("r"), ...payload }]);
    setToast("Risk added");
    setTimeout(() => setToast(null), 2000);
  }, []);

  const updateRisk = useCallback((riskId, patch) => {
    setLiveRisks(prev => prev.map(r => r.id === riskId ? { ...r, ...patch } : r));
    setToast("Risk updated");
    setTimeout(() => setToast(null), 2000);
  }, []);

  const deleteRisk = useCallback((riskId) => {
    setLiveRisks(prev => prev.filter(r => r.id !== riskId));
    setToast("Risk deleted");
    setTimeout(() => setToast(null), 2000);
  }, []);

  const pageProps = {
    objectives: filteredObjectives, streams: RAW.streams, forecastOverrides: activeOverrides,
    setPage, setSelectedObjective, selectedObjective, cycles: RAW.reportingCycles, editable: canEdit,
    onAddMilestone: addMilestone, onUpdateMilestone: updateMilestone, onDeleteMilestone: deleteMilestone,
    role, currentOwner: person, perms, year,
    onUpdateKpi: updateKpi, onAddSubMetric: addSubMetric, onUpdateSubMetric: updateSubMetric, onDeleteSubMetric: deleteSubMetric,
    onUpdateAssignedOwner: updateAssignedOwner,
  };

  return (
    <div style={{ fontFamily: FONT, color: T.ink, height: "100%", minHeight: 640, display: "flex", background: T.bg, borderRadius: 12, overflow: "hidden", border: `1px solid ${T.border}` }}>
      <Sidebar page={page} setPage={setPage} allowedTabs={perms.tabs} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar forecastMode={forecastMode} setForecastMode={setForecastMode} canEdit={perms.forecast} year={year} setYear={setYear} />
        {person && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 24px", background: T.plumSoft, borderBottom: `1px solid ${T.border}`,
          }}>
            <Users size={15} color={T.plum} />
            <span style={{ fontSize: 13, color: T.navy, fontWeight: 600 }}>
              {role === "leader" ? "Objective Leader" : "Objective Owner"} view for <span style={{ color: T.plum }}>{person}</span>
              {" — "}{role === "leader"
                ? "your objectives; Timeline is view-only apart from the quarterly KPI checkpoint"
                : "objectives you hold; you can update the Timeline apart from the KPI checkpoint"}
            </span>
          </div>
        )}
        <FilterBar filters={filters} setFilters={setFilters} objectives={scopedObjectives} streams={RAW.streams} lockedOwner={role === "leader" ? person : ""} />
        <div style={{ flex: 1, overflow: "auto", padding: 24, background: T.surface2 }}>
          {forecastMode && perms.forecast && (
            <div style={{ marginBottom: 18 }}>
              <ForecastPanel
                objectives={filteredObjectives} streams={RAW.streams}
                forecastOverrides={forecastOverrides} setForecastOverrides={setForecastOverrides}
                onClose={() => setForecastMode(false)} onApply={applyForecast}
              />
            </div>
          )}
          {!perms.tabs.includes(page) ? (
            <Card style={{ padding: 20, fontSize: 13, color: T.inkMuted }}>
              This section isn't available for your role.
            </Card>
          ) : (
            <>
              {page === "overview" && <OverviewPage {...pageProps} />}
              {page === "streams" && <StreamsPage {...pageProps} />}
              {page === "objectives" && <ObjectivesPage {...pageProps} />}
              {page === "kpis" && <KpisPage {...pageProps} />}
              {page === "initiatives" && (
                <InitiativesPage objectives={filteredObjectives} onEdit={perms.editInitiatives ? setEditingInitiative : undefined}
                  editable={perms.editInitiatives} currentOwner={person} onAddInitiative={addInitiative} />
              )}
              {page === "timeline" && (
                <TimelinePage objectives={filteredObjectives} streams={RAW.streams}
                  editable={perms.editTimeline} canSubmitCheckpoint={perms.submitCheckpoint} canApproveCheckpoint={perms.approveCheckpoint}
                  role={role} currentOwner={person}
                  onAddActivity={addActivity} onUpdateActivity={updateActivity} onDeleteActivity={deleteActivity}
                  onAddSub={addSubActivity} onUpdateSub={updateSubActivity} onToggleSub={toggleSubActivity} onDeleteSub={deleteSubActivity}
                  onAddMilestone={addMilestone} onUpdateMilestone={updateMilestone} onDeleteMilestone={deleteMilestone} />
              )}
              {page === "risks" && (
                <RisksPage objectives={filteredObjectives} forecastOverrides={activeOverrides} risks={liveRisks} editable={perms.editRisks}
                  onAddRisk={addRisk} onUpdateRisk={updateRisk} onDeleteRisk={deleteRisk} />
              )}
              {page === "compliance" && <CompliancePage objectives={filteredObjectives} />}
              {page === "settings" && (
                <SettingsPage liveObjectives={liveObjectives} setLiveObjectives={setLiveObjectives} scopeOwner={null}
                  onToast={(msg) => { setToast(msg); setTimeout(() => setToast(null), 2000); }} />
              )}
            </>
          )}
        </div>
      </div>

      {editingInitiative && (
        <EditInitiativeModal initiative={editingInitiative} onClose={() => setEditingInitiative(null)}
          onSave={(id, patch) => saveInitiativeUpdate(id, patch)} />
      )}

      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, background: T.navy, color: "#fff", padding: "12px 18px",
          borderRadius: 10, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
          boxShadow: "0 10px 30px rgba(8,26,46,0.3)", zIndex: 70,
        }}>
          <Check size={15} /> {toast}
        </div>
      )}
    </div>
  );
}

