import React, { useState, useMemo, useCallback } from "react";
import {
  LayoutDashboard, GitBranch, Target, ListChecks, Gauge as GaugeIcon,
  CalendarRange, AlertTriangle, CheckSquare, Lightbulb, X, ChevronRight,
  ChevronDown, Search, RotateCcw, Bell, Clock, Users, TrendingUp, TrendingDown,
  Minus, Link2, MessageSquare, Paperclip, History, Sliders, Check, ArrowRight,
  Filter, ExternalLink
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
    healthWeights: { kpi: 0.35, initiative: 0.30, objective: 0.20, timeline: 0.15 },
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
};

// ---- Objective 1 -----------------------------------------------------------
const O1 = {
  id: "o1", number: 1, streamId: "s1", owner: "Yasser",
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
      ]},
    { id:"i1-2", name:"Pre-Sales Discovery with BD", owner:"Sara", start:"2026-08-01", due:"2026-09-15", progress:55, priority:"High", phase:"Pilot", nextMilestone:"First joint discovery call", deps:["BD calendar alignment"], risks:"BD availability limited in Q3.", comments:"Piloting with one active opportunity.", evidence:"drive://pre-sales-pilot", updatedBy:"Sara",
      history:[
        {date:"2026-08-11", prev:35, next:55, summary:"Pilot kicked off with BD team on Acme opportunity.", blockers:"BD calendar constraints.", next2:"Run second pilot call.", by:"Sara"},
      ]},
    { id:"i1-3", name:"Discovery Sign-off SLA", owner:"Yasser", start:"2026-08-15", due:"2026-09-30", progress:30, priority:"Medium", phase:"Design", nextMilestone:"SLA draft to leadership", deps:["Discovery Output Standard"], risks:"None", comments:"Drafting turnaround targets per engagement size.", evidence:"—", updatedBy:"Yasser",
      history:[
        {date:"2026-08-01", prev:10, next:30, summary:"SLA tiers drafted for small/medium/large engagements.", blockers:"None", next2:"Circulate for feedback.", by:"Yasser"},
      ]},
    { id:"i1-4", name:"Discovery Repository", owner:"Fahad", start:"2026-08-01", due:"2026-08-20", progress:100, priority:"Medium", phase:"Closed", nextMilestone:"—", deps:[], risks:"None", comments:"Central repository live on SharePoint.", evidence:"sp://ba/discovery-repo", updatedBy:"Fahad", history:[
        {date:"2026-08-08", prev:70, next:100, summary:"Repository launched with folder taxonomy.", blockers:"None", next2:"Backfill historical discoveries.", by:"Fahad"},
      ]},
    { id:"i1-5", name:"Discovery Training Workshop", owner:"Noura", start:"2026-10-01", due:"2026-11-15", progress:0, priority:"Low", phase:"Not Started", nextMilestone:"Workshop agenda", deps:["Discovery Output Standard"], risks:"None", comments:"Scheduled for Q4 once standard is stable.", evidence:"—", updatedBy:"Noura", history:[]},
  ],
  milestones: [
    { date:"2026-08-20", name:"Discovery Repository live", status:"Completed" },
    { date:"2026-09-30", name:"Sign-off SLA approved", status:"Upcoming" },
    { date:"2026-11-15", name:"Training workshop delivered", status:"Upcoming" },
  ],
};

// ---- Objective 2 -----------------------------------------------------------
const O2 = {
  id:"o2", number:2, streamId:"s1", owner:"Leen",
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
    { date:"2026-08-31", name:"All engagements baselined", status:"Upcoming" },
    { date:"2026-10-15", name:"Automated reporting live", status:"Upcoming" },
  ],
};

// ---- Objective 3 -----------------------------------------------------------
const O3 = {
  id:"o3", number:3, streamId:"s1", owner:"Baghdady",
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
    { date:"2026-09-10", name:"Check instruments piloted", status:"Upcoming" },
    { date:"2026-10-31", name:"Value realization pilot complete", status:"Upcoming" },
  ],
};

// ---- Objective 4 -----------------------------------------------------------
const O4 = {
  id:"o4", number:4, streamId:"s1", owner:"Yasser",
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
    { date:"2026-08-31", name:"Opportunity Log live", status:"Upcoming" },
    { date:"2026-10-15", name:"BD collaboration agreement signed", status:"Upcoming" },
  ],
};

// ---- Objective 5 -----------------------------------------------------------
const O5 = {
  id:"o5", number:5, streamId:"s1", owner:"Leen",
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
    { date:"2026-09-15", name:"Delivery discipline fully rolled out", status:"Upcoming" },
    { date:"2026-11-30", name:"Continuous monitoring live", status:"Upcoming" },
  ],
};

// ---- Objective 6 -----------------------------------------------------------
const O6 = {
  id:"o6", number:6, streamId:"s2", owner:"Baghdady",
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
    { date:"2026-08-25", name:"Core standard set published", status:"Upcoming" },
    { date:"2026-09-30", name:"Governance cadence approved", status:"Upcoming" },
  ],
};

// ---- Objective 7 (weakest performer — flagged in insights) ----------------
const O7 = {
  id:"o7", number:7, streamId:"s2", owner:"Randa",
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
    { date:"2026-08-15", name:"Use-case repository structure agreed", status:"Overdue" },
    { date:"2026-09-30", name:"Baseline report to leadership", status:"Overdue" },
  ],
};

// ---- Objective 8 -----------------------------------------------------------
const O8 = {
  id:"o8", number:8, streamId:"s2", owner:"Leen",
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
    { date:"2026-09-15", name:"Engagement-health view fully live", status:"Upcoming" },
    { date:"2026-11-30", name:"Leadership rollout complete", status:"Upcoming" },
  ],
};

// ---- Objective 9 -----------------------------------------------------------
const O9 = {
  id:"o9", number:9, streamId:"s2", owner:"Yasser",
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
    { date:"2026-10-15", name:"Onboarding playbook complete", status:"Upcoming" },
    { date:"2026-12-15", name:"First quarterly talent review", status:"Upcoming" },
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

RAW.updateCompliance = [
  { owner:"Yasser", objectives:["o1","o4","o9"], expected:"2026-08-15", actual:"2026-08-12", status:"Submitted" },
  { owner:"Leen", objectives:["o2","o5","o8"], expected:"2026-08-15", actual:"2026-08-14", status:"Submitted" },
  { owner:"Baghdady", objectives:["o3","o6"], expected:"2026-08-15", actual:"2026-08-11", status:"Submitted" },
  { owner:"Randa", objectives:["o7"], expected:"2026-08-15", actual:null, status:"Late" },
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
function objectiveProgress(obj, forecastOverrides) {
  const ov = forecastOverrides?.[obj.id];
  if (ov != null) return ov;
  if (!obj.initiatives.length) return 0;
  const sum = obj.initiatives.reduce((a, i) => a + i.progress, 0);
  return Math.round(sum / obj.initiatives.length);
}
function objectiveHealth(obj, weights, forecastOverrides) {
  const kpiAch = Math.min(100, achievementPct(obj.kpi));
  const initProg = objectiveProgress(obj, forecastOverrides);
  const tStatus = timelineStatus(obj.start, obj.end, initProg);
  const timelineScore = tStatus === "On Track" ? 100 : tStatus === "At Risk" ? 65 : tStatus === "Delayed" ? 30 : tStatus === "Completed" ? 100 : 80;
  const score = kpiAch * weights.kpi / (weights.kpi + weights.initiative + weights.timeline)
    + initProg * weights.initiative / (weights.kpi + weights.initiative + weights.timeline)
    + timelineScore * weights.timeline / (weights.kpi + weights.initiative + weights.timeline);
  return Math.round(score);
}
function objectiveStatus(obj, forecastOverrides) {
  const p = objectiveProgress(obj, forecastOverrides);
  return timelineStatus(obj.start, obj.end, p);
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
function strategyHealth(streams, objectives, weights, forecastOverrides) {
  const kpiAch = Math.round(objectives.reduce((a, o) => a + Math.min(100, achievementPct(o.kpi)), 0) / objectives.length);
  const initComplete = Math.round(
    objectives.reduce((a, o) => a + o.initiatives.filter(i => initiativeStatus(i) === "Completed").length, 0) /
    Math.max(1, objectives.reduce((a, o) => a + o.initiatives.length, 0)) * 100
  );
  const objProg = strategyProgress(streams, objectives, forecastOverrides);
  const onTrackCount = objectives.filter(o => ["On Track", "Completed"].includes(objectiveStatus(o, forecastOverrides))).length;
  const timelineHealth = Math.round((onTrackCount / objectives.length) * 100);
  const score = kpiAch * weights.kpi + initComplete * weights.initiative + objProg * weights.objective + timelineHealth * weights.timeline;
  return { score: Math.round(score), kpiAch, initComplete, objProg, timelineHealth };
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
    { key: "kpiAch", label: "KPI", w: weights.kpi, color: T.blue },
    { key: "initComplete", label: "Initiatives", w: weights.initiative, color: T.plum },
    { key: "objProg", label: "Objectives", w: weights.objective, color: T.green },
    { key: "timelineHealth", label: "Timeline", w: weights.timeline, color: T.amber },
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
function FilterBar({ filters, setFilters, objectives, streams }) {
  const owners = useMemo(() => Array.from(new Set(objectives.map(o => o.owner))).sort(), [objectives]);
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
  const active = Object.values(filters).some(v => v);
  return (
    <div style={{
      display: "flex", alignItems: "flex-end", gap: 14, padding: "14px 24px",
      background: T.surface, borderBottom: `1px solid ${T.border}`, flexWrap: "wrap",
    }}>
      <Filter size={15} color={T.inkFaint} style={{ marginBottom: 9 }} />
      <Select label="Stream" value={filters.stream} onChange={v => setFilters(f => ({ ...f, stream: v }))} options={streams.map(s => s.name)} />
      <Select label="Objective" value={filters.objective} onChange={v => setFilters(f => ({ ...f, objective: v }))} options={objectives.map(o => `O${o.number} · ${o.title}`)} />
      <Select label="Owner" value={filters.owner} onChange={v => setFilters(f => ({ ...f, owner: v }))} options={owners} />
      <Select label="Status" value={filters.status} onChange={v => setFilters(f => ({ ...f, status: v }))} options={statuses} />
      {active && (
        <button onClick={() => setFilters({ stream: "", objective: "", owner: "", status: "" })}
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
  { id: "initiatives", label: "Initiatives", icon: ListChecks },
  { id: "timeline", label: "Timeline", icon: CalendarRange },
  { id: "risks", label: "Risks & Blockers", icon: AlertTriangle },
  { id: "compliance", label: "Update Compliance", icon: CheckSquare },
];

function Sidebar({ page, setPage, collapsedMobile }) {
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
        {NAV_ITEMS.map(item => {
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
function TopBar({ forecastMode, setForecastMode }) {
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
        <button onClick={() => setForecastMode(v => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 8,
            border: `1px solid ${forecastMode ? T.plum : T.border}`, cursor: "pointer",
            background: forecastMode ? T.plumSoft : T.bg, color: forecastMode ? T.plum : T.inkMuted,
            fontSize: 13, fontWeight: 700, fontFamily: FONT,
          }}>
          <Sliders size={14} /> {forecastMode ? "Forecast Mode: ON" : "Forecast Strategy"}
        </button>
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
function ExecCards({ objectives, streams, forecastOverrides, cycles, setPage }) {
  const progress = strategyProgress(streams, objectives, forecastOverrides);
  const prevCycle = cycles[cycles.findIndex(c => !c.projected) ] ; // Aug actual
  const prevProgress = cycles[0].overall; // Jul
  const objStatuses = objectives.map(o => objectiveStatus(o, forecastOverrides));
  const onTrack = objStatuses.filter(s => s === "On Track").length;
  const atRisk = objStatuses.filter(s => s === "At Risk").length;
  const delayed = objStatuses.filter(s => s === "Delayed").length;
  const completed = objStatuses.filter(s => s === "Completed").length;

  const allInit = objectives.flatMap(o => o.initiatives);
  const initStatuses = allInit.map(initiativeStatus);
  const counts = {
    Completed: initStatuses.filter(s => s === "Completed").length,
    "In Progress": initStatuses.filter(s => !["Completed","At Risk","Delayed","Not Started"].includes(s)).length + initStatuses.filter(s=>s==="On Track").length,
    "At Risk": initStatuses.filter(s => s === "At Risk").length,
    Delayed: initStatuses.filter(s => s === "Delayed").length,
    "Not Started": initStatuses.filter(s => s === "Not Started").length,
  };
  const kpiMeeting = objectives.filter(o => kpiStatus(o.kpi) === "Meeting Target").length;
  const overdueItems = allInit.filter(i => isOverdue(i.due, i.progress)).length;

  const cards = [
    {
      title: "Overall Strategy Progress",
      value: `${progress}%`, sub: <Trend current={progress} previous={prevProgress} suffix="pt" />,
      onClick: () => setPage("overview"),
    },
    {
      title: "Objectives",
      value: `${objectives.length} Total`,
      sub: (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 2 }}>
          <span style={{ fontSize: 11.5, color: T.green, fontWeight: 700 }}>{onTrack} On Track</span>
          <span style={{ fontSize: 11.5, color: T.amber, fontWeight: 700 }}>{atRisk} At Risk</span>
          <span style={{ fontSize: 11.5, color: T.red, fontWeight: 700 }}>{delayed} Delayed</span>
          <span style={{ fontSize: 11.5, color: T.blue, fontWeight: 700 }}>{completed} Completed</span>
        </div>
      ),
      onClick: () => setPage("objectives"),
    },
    {
      title: "Initiatives",
      value: `${allInit.length} Total`,
      sub: (
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 2 }}>
          <span style={{ fontSize: 11, color: T.blue, fontWeight: 700 }}>{counts.Completed} Done</span>
          <span style={{ fontSize: 11, color: T.amber, fontWeight: 700 }}>{counts["At Risk"]} At Risk</span>
          <span style={{ fontSize: 11, color: T.red, fontWeight: 700 }}>{counts.Delayed} Delayed</span>
          <span style={{ fontSize: 11, color: T.gray, fontWeight: 700 }}>{counts["Not Started"]} Not Started</span>
        </div>
      ),
      onClick: () => setPage("initiatives"),
    },
    {
      title: "KPI Performance",
      value: `${kpiMeeting} / ${objectives.length}`,
      sub: <span style={{ fontSize: 12, color: T.inkMuted }}>KPIs meeting target</span>,
      onClick: () => setPage("objectives"),
    },
    {
      title: "Overdue Items",
      value: `${overdueItems}`,
      sub: <span style={{ fontSize: 12, color: overdueItems ? T.red : T.inkMuted, fontWeight: 600 }}>{overdueItems ? "needs attention" : "all clear"}</span>,
      onClick: () => setPage("risks"),
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
  const overdueCount = objectives.flatMap(o => o.initiatives).filter(i => isOverdue(i.due, i.progress)).length;
  const improvingDespiteDelay = objectives.find(o => {
    const kAch = achievementPct(o.kpi);
    const delayed = o.initiatives.filter(i => initiativeStatus(i) === "Delayed").length > 0;
    return kAch >= 60 && kAch < 90 && delayed;
  });
  const list = [
    `Objective ${strongest.o.number} ("${strongest.o.title}") is the strongest performer at ${strongest.p}% progress.`,
    `Objective ${weakest.o.number} ("${weakest.o.title}") carries the highest delivery risk at ${weakest.p}% progress and needs leadership attention.`,
    `${overdueCount} initiative${overdueCount === 1 ? " is" : "s are"} currently overdue across the department.`,
    `${streams[0].name} is ${Math.abs(s1p - s2p)} percentage points ${s1p >= s2p ? "ahead of" : "behind"} ${streams[1].name}.`,
  ];
  if (improvingDespiteDelay) {
    list.push(`Objective ${improvingDespiteDelay.number} KPI performance is improving despite initiative delays.`);
  }
  return list;
}

function OverviewPage({ objectives, streams, forecastOverrides, cycles, setPage, setSelectedObjective }) {
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
              { label: "Initiatives", v: health.initComplete, color: T.plum },
              { label: "Objectives", v: health.objProg, color: T.green },
              { label: "Timeline", v: health.timelineHealth, color: T.amber },
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

      <Card style={{ padding: 22 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <SectionLabel icon={AlertTriangle}>Needs Your Attention</SectionLabel>
          <button onClick={() => setPage("risks")} style={{ border: "none", background: "none", color: T.plum, fontSize: 12.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
            View all <ChevronRight size={14} />
          </button>
        </div>
        <AttentionTable items={attentionItems} objectives={objectives} onSelect={(objId) => { setSelectedObjective(objId); setPage("objectives"); }} />
      </Card>
    </div>
  );
}

/* ============================================================================
   STREAM CARD
============================================================================ */
function StreamCard({ stream, objectives, forecastOverrides, onDrill }) {
  const p = streamProgress(stream, objectives, forecastOverrides);
  const statuses = objectives.map(o => objectiveStatus(o, forecastOverrides));
  const onTrack = statuses.filter(s => s === "On Track" || s === "Completed").length;
  const atRisk = statuses.filter(s => s === "At Risk").length;
  const allInit = objectives.flatMap(o => o.initiatives);
  const completedInit = allInit.filter(i => initiativeStatus(i) === "Completed").length;
  const kpiAch = Math.round(objectives.reduce((a,o) => a + Math.min(100, achievementPct(o.kpi)), 0) / objectives.length);
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
          { label: "On Track", v: onTrack },
          { label: "At Risk", v: atRisk },
          { label: "Init. Done", v: `${completedInit}/${allInit.length}` },
        ].map(x => (
          <div key={x.label}>
            <div style={{ fontSize: 10.5, color: T.inkMuted, marginBottom: 2 }}>{x.label}</div>
            <Num size={15}>{x.v}</Num>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: T.inkMuted }}>KPI Achievement: <Num size={13} color={T.ink}>{kpiAch}%</Num></div>
    </Card>
  );
}

/* ============================================================================
   ATTENTION / RISK LOGIC
============================================================================ */
function buildAttentionItems(objectives, forecastOverrides) {
  const items = [];
  objectives.forEach(o => {
    const st = objectiveStatus(o, forecastOverrides);
    if (st === "Delayed") items.push({ severity: "Critical", objective: o, initiative: null, owner: o.owner, issue: `Objective ${o.number} is delayed against its timeline.`, action: "Reassess plan and resourcing with owner.", due: o.end });
    else if (st === "At Risk") items.push({ severity: "High", objective: o, initiative: null, owner: o.owner, issue: `Objective ${o.number} is at risk of slipping.`, action: "Review blockers in next check-in.", due: o.end });
    if (kpiStatus(o.kpi) === "Below Target") items.push({ severity: "Medium", objective: o, initiative: null, owner: o.owner, issue: `${o.kpi.name} is below target (${o.kpi.current}${o.kpi.unit} vs ${o.kpi.target}${o.kpi.unit}).`, action: "Investigate root cause with data owner.", due: o.end });
    o.initiatives.forEach(i => {
      if (isOverdue(i.due, i.progress)) items.push({ severity: "Critical", objective: o, initiative: i, owner: i.owner, issue: `"${i.name}" is overdue.`, action: "Owner to provide revised date and blockers.", due: i.due });
      else {
        const dueSoon = daysBetween(TODAY, d(i.due)) <= 14 && daysBetween(TODAY, d(i.due)) >= 0 && i.progress < 100;
        if (dueSoon) items.push({ severity: "Low", objective: o, initiative: i, owner: i.owner, issue: `"${i.name}" is due within 14 days.`, action: "Confirm on-track for the deadline.", due: i.due });
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
            display: "grid", gridTemplateColumns: "90px 1fr 130px 100px", gap: 12, alignItems: "center",
            padding: "11px 6px", borderTop: i === 0 ? "none" : `1px solid ${T.border}`, cursor: "pointer",
          }}>
          <StatusChip status={it.severity} />
          <div>
            <div style={{ fontSize: 13.5, color: T.ink, fontWeight: 600 }}>{it.issue}</div>
            <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 1 }}>O{it.objective.number} · {it.objective.title}{it.initiative ? ` — ${it.initiative.name}` : ""} · {it.action}</div>
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
  const initDone = obj.initiatives.filter(i => initiativeStatus(i) === "Completed").length;
  const kAch = Math.round(achievementPct(obj.kpi));
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
        <span>Progress</span><Num size={12.5}>{p}%</Num>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11.5, color: T.inkMuted }}>
        <span>KPI {kAch}%</span>
        <span>Init. {initDone}/{obj.initiatives.length}</span>
        <span style={{ fontFamily: MONO }}>{obj.lastUpdate}</span>
      </div>
    </Card>
  );
}

/* ============================================================================
   OBJECTIVES PAGE (grid + drawer)
============================================================================ */
function ObjectivesPage({ objectives, streams, forecastOverrides, selectedObjective, setSelectedObjective }) {
  const selected = objectives.find(o => o.id === selectedObjective);
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
        <ObjectiveDrawer obj={selected} stream={streams.find(s => s.id === selected.streamId)} forecastOverrides={forecastOverrides} onClose={() => setSelectedObjective(null)} />
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
function ObjectiveDrawer({ obj, stream, forecastOverrides, onClose }) {
  const [historyFor, setHistoryFor] = useState(null);
  const [expandedSM, setExpandedSM] = useState(null);
  const p = objectiveProgress(obj, forecastOverrides);
  const health = objectiveHealth(obj, RAW.settings.healthWeights, forecastOverrides);
  const status = objectiveStatus(obj, forecastOverrides);
  const daysLeft = daysBetween(TODAY, d(obj.end));
  const kAch = achievementPct(obj.kpi);

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
            ["Owner", obj.owner], ["Start", obj.start], ["Target End", obj.end],
            ["Days Remaining", daysLeft >= 0 ? daysLeft : "0 (past due)"], ["Last Update", obj.lastUpdate],
          ].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize: 10.5, color: "#8FA8C4", textTransform: "uppercase", letterSpacing: 0.4 }}>{l}</div>
              <div style={{ fontFamily: MONO, fontSize: 13.5, fontWeight: 600, marginTop: 2 }}>{v}</div>
            </div>
          ))}
          <div>
            <div style={{ fontSize: 10.5, color: "#8FA8C4", textTransform: "uppercase", letterSpacing: 0.4 }}>Status</div>
            <div style={{ marginTop: 3 }}><StatusChip status={status} /></div>
          </div>
        </div>
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
            <SectionLabel icon={GaugeIcon}>KPI</SectionLabel>
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
            <SectionLabel icon={ListChecks}>Sub-Metrics</SectionLabel>
            <Card style={{ padding: 0 }}>
              {obj.subMetrics.map((sm, i) => {
                const ach = Math.round((sm.current / sm.target) * 100);
                const expanded = expandedSM === sm.id;
                return (
                  <div key={sm.id} style={{ borderTop: i === 0 ? "none" : `1px solid ${T.border}` }}>
                    <div onClick={() => setExpandedSM(expanded ? null : sm.id)} style={{ display: "grid", gridTemplateColumns: "1fr 70px 70px 90px 20px", gap: 8, alignItems: "center", padding: "11px 14px", cursor: "pointer" }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink }}>{obj.number}.{i+1} {sm.name}</div>
                      <Num size={12.5}>{sm.current}{sm.unit}</Num>
                      <span style={{ fontSize: 11.5, color: T.inkMuted }}>/ {sm.target}{sm.unit}</span>
                      <StatusChip status={ach >= 90 ? "On Track" : ach >= 65 ? "At Risk" : "Delayed"} />
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
          <SectionLabel icon={CalendarRange}>Milestones</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {obj.milestones.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, padding: "8px 4px", borderTop: i === 0 ? "none" : `1px solid ${T.border}` }}>
                <Num size={12.5} color={T.navy}>{m.date}</Num>
                <span style={{ color: T.ink, flex: 1 }}>{m.name}</span>
                <StatusChip status={m.status === "Overdue" ? "Delayed" : m.status === "Completed" ? "Completed" : "Not Started"} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {historyFor && <HistoryModal initiative={historyFor} onClose={() => setHistoryFor(null)} />}
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
  const [progress, setProgress] = useState(initiative.progress);
  const [status, setStatus] = useState(initiativeStatus(initiative));
  const [blockers, setBlockers] = useState(initiative.risks === "None" ? "" : initiative.risks);
  const [nextStep, setNextStep] = useState(initiative.nextMilestone);
  const [comment, setComment] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    onSave(initiative.id, { progress: Number(progress), blockers, nextStep, comment });
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

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Progress ({progress}%)</label>
        <input type="range" min={0} max={100} value={progress} onChange={e => setProgress(e.target.value)} style={{ width: "100%", margin: "8px 0 16px", accentColor: T.plum }} />

        <label style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase" }}>Blockers</label>
        <input value={blockers} onChange={e => setBlockers(e.target.value)} placeholder="None"
          style={{ width: "100%", padding: "8px 10px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, margin: "6px 0 16px", fontFamily: FONT }} />

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
function InitiativesPage({ objectives, onEdit }) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("due");
  const objectivesById = Object.fromEntries(objectives.map(o => [o.id, o]));
  let all = objectives.flatMap(o => o.initiatives.map(i => ({ ...i, objectiveId: o.id })));
  if (query) all = all.filter(i => i.name.toLowerCase().includes(query.toLowerCase()) || i.owner.toLowerCase().includes(query.toLowerCase()));
  if (sortBy === "due") all = [...all].sort((a, b) => d(a.due) - d(b.due));
  if (sortBy === "progress") all = [...all].sort((a, b) => a.progress - b.progress);
  if (sortBy === "owner") all = [...all].sort((a, b) => a.owner.localeCompare(b.owner));

  const [historyFor, setHistoryFor] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <Search size={15} style={{ position: "absolute", left: 10, top: 10, color: T.inkFaint }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search initiatives or owners…"
            style={{ width: "100%", padding: "9px 10px 9px 32px", border: `1px solid ${T.border}`, borderRadius: 9, fontSize: 13, fontFamily: FONT }} />
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ border: `1px solid ${T.border}`, borderRadius: 9, padding: "9px 10px", fontSize: 13, fontFamily: FONT }}>
          <option value="due">Sort: Due date</option>
          <option value="progress">Sort: Lowest progress</option>
          <option value="owner">Sort: Owner</option>
        </select>
        <div style={{ fontSize: 12.5, color: T.inkMuted, marginLeft: "auto" }}>{all.length} initiatives</div>
      </div>
      <InitiativeTable initiatives={all} onHistory={setHistoryFor} onEdit={onEdit} showObjective objectivesById={objectivesById} />
      {historyFor && <HistoryModal initiative={historyFor} onClose={() => setHistoryFor(null)} />}
    </div>
  );
}

/* ============================================================================
   TIMELINE PAGE
============================================================================ */
function TimelinePage({ objectives, streams }) {
  const [view, setView] = useState("Month");
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const rangeStart = d("2026-07-01"), rangeEnd = d("2027-01-01");
  const totalDays = daysBetween(rangeStart, rangeEnd);
  const pct = (dateStr) => (daysBetween(rangeStart, d(dateStr)) / totalDays) * 100;
  const todayPct = pct("2026-08-17");

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
      <Card style={{ padding: 20, overflowX: "auto" }}>
        <div style={{ position: "relative", minWidth: 760 }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${months.length}, 1fr)`, marginBottom: 10, paddingLeft: 200 }}>
            {months.map(m => <div key={m} style={{ fontSize: 11.5, fontWeight: 700, color: T.inkMuted, textAlign: "center" }}>{m} 2026</div>)}
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: `calc(200px + ${todayPct}% * (100% - 200px) / 100)`, top: 0, bottom: 0, width: 2, background: T.plum, zIndex: 2 }}>
              <div style={{ fontSize: 10, color: T.plum, fontWeight: 700, position: "absolute", top: -16, left: -14, whiteSpace: "nowrap" }}>TODAY</div>
            </div>
            {objectives.map(o => {
              const stream = streams.find(s => s.id === o.streamId);
              const left = pct(o.start), width = pct(o.end) - pct(o.start);
              const status = objectiveStatus(o);
              return (
                <div key={o.id} style={{ display: "flex", alignItems: "center", marginBottom: 10, height: 30 }}>
                  <div style={{ width: 200, minWidth: 200, fontSize: 12, color: T.ink, fontWeight: 600, paddingRight: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    O{o.number} · {o.title}
                  </div>
                  <div style={{ position: "relative", flex: 1, height: 20 }}>
                    <div style={{
                      position: "absolute", left: `${left}%`, width: `${width}%`, height: "100%", borderRadius: 6,
                      background: STATUS_SOFT[status], border: `1px solid ${stream.color}`, display: "flex", alignItems: "center", overflow: "hidden",
                    }}>
                      <div style={{ height: "100%", width: `${objectiveProgress(o)}%`, background: stream.color, opacity: 0.85 }} />
                    </div>
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

      <SectionLabel icon={Clock}>Upcoming Milestones</SectionLabel>
      <MilestonesCard objectives={objectives} />
    </div>
  );
}

function MilestonesCard({ objectives }) {
  const [range, setRange] = useState(30);
  const all = objectives.flatMap(o => o.milestones.map(m => ({ ...m, objective: o })));
  const withinRange = all.filter(m => {
    const days = daysBetween(TODAY, d(m.date));
    return days >= -3650 && days <= range && m.status !== "Completed";
  }).sort((a, b) => d(a.date) - d(b.date));
  return (
    <Card style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>Next {range} Days</div>
        <div style={{ display: "flex", gap: 6 }}>
          {[7, 30, 90].map(r => (
            <button key={r} onClick={() => setRange(r)}
              style={{
                border: `1px solid ${range === r ? T.navy : T.border}`, background: range === r ? T.navy : T.bg,
                color: range === r ? "#fff" : T.inkMuted, borderRadius: 7, padding: "4px 10px", fontSize: 11.5, cursor: "pointer", fontWeight: 600,
              }}>{r}d</button>
          ))}
        </div>
      </div>
      {withinRange.length === 0 ? <div style={{ color: T.inkMuted, fontSize: 13 }}>No milestones in this window.</div> :
        withinRange.map((m, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "90px 1fr 90px 90px", gap: 10, alignItems: "center", padding: "9px 4px", borderTop: i === 0 ? "none" : `1px solid ${T.border}` }}>
            <Num size={12} color={T.navy}>{m.date}</Num>
            <div style={{ fontSize: 13, color: T.ink }}>{m.name}<div style={{ fontSize: 11, color: T.inkMuted }}>O{m.objective.number} · {m.objective.title}</div></div>
            <div style={{ fontSize: 12, color: T.inkMuted }}>{m.objective.owner}</div>
            <StatusChip status={m.status === "Overdue" ? "Delayed" : "Not Started"} />
          </div>
        ))}
    </Card>
  );
}

/* ============================================================================
   RISKS PAGE
============================================================================ */
function RisksPage({ objectives, forecastOverrides }) {
  const items = buildAttentionItems(objectives, forecastOverrides);
  const objById = Object.fromEntries(objectives.map(o => [o.id, o]));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionLabel icon={AlertTriangle}>Needs Your Attention — {items.length} items</SectionLabel>
      <Card style={{ padding: 8 }}>
        <AttentionTable items={items} onSelect={() => {}} />
      </Card>
      <SectionLabel icon={AlertTriangle}>Logged Risks & Blockers</SectionLabel>
      <Card style={{ padding: 0 }}>
        {RAW.risks.map((r, i) => {
          const o = objById[r.objective];
          return (
            <div key={r.id} style={{ display: "grid", gridTemplateColumns: "90px 1fr 100px 100px", gap: 12, alignItems: "center", padding: "12px 16px", borderTop: i === 0 ? "none" : `1px solid ${T.border}` }}>
              <StatusChip status={r.severity} />
              <div>
                <div style={{ fontSize: 13.5, color: T.ink, fontWeight: 600 }}>{r.issue}</div>
                <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 2 }}>O{o.number} · {o.title} · Action: {r.action}</div>
              </div>
              <div style={{ fontSize: 12.5, color: T.inkMuted }}>{r.owner}</div>
              <div style={{ fontSize: 12.5, color: T.inkMuted, fontFamily: MONO }}>{r.due}</div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

/* ============================================================================
   COMPLIANCE PAGE
============================================================================ */
function CompliancePage({ objectives }) {
  const submitted = RAW.updateCompliance.filter(u => u.status === "Submitted").length;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <Card style={{ padding: 20, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{
          width: 62, height: 62, borderRadius: "50%", border: `5px solid ${T.green}`,
          display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 700, fontSize: 15, color: T.navy,
        }}>{submitted}/{RAW.updateCompliance.length}</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.navy }}>Update Compliance — This Cycle</div>
          <div style={{ fontSize: 13, color: T.inkMuted }}>{submitted} of {RAW.updateCompliance.length} objective owners submitted this cycle.</div>
        </div>
      </Card>
      <Card style={{ padding: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.surface }}>
              {["Owner", "Objectives", "Expected Date", "Actual Date", "Status"].map(h => (
                <th key={h} style={{ padding: "10px 12px", fontSize: 10.5, fontWeight: 700, color: T.inkMuted, textAlign: "left", textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RAW.updateCompliance.map((u, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: "12px", fontSize: 13, fontWeight: 600 }}>{u.owner}</td>
                <td style={{ padding: "12px", fontSize: 12.5, color: T.inkMuted }}>
                  {u.objectives.map(id => `O${objectives.find(o => o.id === id)?.number}`).join(", ")}
                </td>
                <td style={{ padding: "12px", fontFamily: MONO, fontSize: 12.5 }}>{u.expected}</td>
                <td style={{ padding: "12px", fontFamily: MONO, fontSize: 12.5 }}>{u.actual || "—"}</td>
                <td style={{ padding: "12px" }}><StatusChip status={u.status} /></td>
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
   URL-BASED OWNER LINKS  (?owner=Leen / ?owner=Yasser / ?owner=Baghdady / ?owner=Randa)
   Lets each objective owner get a personal link that auto-filters to their
   own objectives — no separate deploy needed, same repo & same Vercel project.
============================================================================ */
const KNOWN_OWNERS = ["Yasser", "Leen", "Baghdady", "Randa"];
function getOwnerFromUrl() {
  if (typeof window === "undefined") return "";
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("owner");
    if (!raw) return "";
    return KNOWN_OWNERS.find(o => o.toLowerCase() === raw.trim().toLowerCase()) || "";
  } catch {
    return "";
  }
}

/* ============================================================================
   ROOT APP
============================================================================ */
export default function App() {
  const initialOwner = useMemo(() => getOwnerFromUrl(), []);
  const [page, setPage] = useState(initialOwner ? "objectives" : "overview");
  const [filters, setFilters] = useState({ stream: "", objective: "", owner: initialOwner, status: "" });
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [forecastMode, setForecastMode] = useState(false);
  const [forecastOverrides, setForecastOverrides] = useState({});
  const [liveObjectives, setLiveObjectives] = useState(RAW.objectives);
  const [editingInitiative, setEditingInitiative] = useState(null);
  const [toast, setToast] = useState(null);

  const filteredObjectives = useMemo(() => applyFilters(liveObjectives, RAW.streams, filters), [liveObjectives, filters]);
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
          blockers: patch.blockers || "None", next2: patch.nextStep || i.nextMilestone, by: "Mashael",
        };
        return {
          ...i, progress: patch.progress, risks: patch.blockers || i.risks, nextMilestone: patch.nextStep || i.nextMilestone,
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

  const pageProps = {
    objectives: filteredObjectives, streams: RAW.streams, forecastOverrides: activeOverrides,
    setPage, setSelectedObjective, selectedObjective, cycles: RAW.reportingCycles,
  };

  return (
    <div style={{ fontFamily: FONT, color: T.ink, height: "100%", minHeight: 640, display: "flex", background: T.bg, borderRadius: 12, overflow: "hidden", border: `1px solid ${T.border}` }}>
      <Sidebar page={page} setPage={setPage} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar forecastMode={forecastMode} setForecastMode={setForecastMode} />
        {initialOwner && filters.owner === initialOwner && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 24px", background: T.plumSoft, borderBottom: `1px solid ${T.border}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.navy, fontWeight: 600 }}>
              <Users size={15} color={T.plum} />
              Personal view for <span style={{ color: T.plum }}>{initialOwner}</span> — showing only their objectives
            </div>
            <button onClick={() => setFilters(f => ({ ...f, owner: "" }))}
              style={{
                border: `1px solid ${T.plum}`, background: T.bg, color: T.plum, borderRadius: 7,
                padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>
              View all objectives
            </button>
          </div>
        )}
        <FilterBar filters={filters} setFilters={setFilters} objectives={liveObjectives} streams={RAW.streams} />
        <div style={{ flex: 1, overflow: "auto", padding: 24, background: T.surface2 }}>
          {forecastMode && (
            <div style={{ marginBottom: 18 }}>
              <ForecastPanel
                objectives={filteredObjectives} streams={RAW.streams}
                forecastOverrides={forecastOverrides} setForecastOverrides={setForecastOverrides}
                onClose={() => setForecastMode(false)} onApply={applyForecast}
              />
            </div>
          )}
          {page === "overview" && <OverviewPage {...pageProps} />}
          {page === "streams" && <StreamsPage {...pageProps} />}
          {page === "objectives" && <ObjectivesPage {...pageProps} />}
          {page === "initiatives" && <InitiativesPage objectives={filteredObjectives} onEdit={setEditingInitiative} />}
          {page === "timeline" && <TimelinePage objectives={filteredObjectives} streams={RAW.streams} />}
          {page === "risks" && <RisksPage objectives={filteredObjectives} forecastOverrides={activeOverrides} />}
          {page === "compliance" && <CompliancePage objectives={filteredObjectives} />}
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
