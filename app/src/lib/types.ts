export interface VisNode {
  id: string;
  label: string;
  path: string;
  cat: string;
  lines: number;
  functions: number;
  classes: number;
  types: number;
  isTest: boolean;
  language: string;
  imports: string[];
}

export interface GraphData {
  nodes: VisNode[];
  repoName: string;
  generatedAt: string;
  stats: {
    totalNodes: number;
    totalEdges: number;
    filesCount: number;
  };
}

export interface TreeDir {
  name: string;
  children: Record<string, TreeDir>;
  files: VisNode[];
  stats: { count: number; lines: number };
}

export type Activity = "explorer" | "graph" | "legend";

export const CATEGORY_META: Record<string, { label: string; color: string }> = {
  pages:      { label: "Pages",       color: "#f37029" },
  api:        { label: "API Routes",  color: "#ef4444" },
  components: { label: "Components",  color: "#8b5cf6" },
  hooks:      { label: "Hooks",       color: "#06b6d4" },
  lib:        { label: "Core Lib",    color: "#22c55e" },
  auth:       { label: "Auth",        color: "#f59e0b" },
  data:       { label: "Data Layer",  color: "#3b82f6" },
  types:      { label: "Types",       color: "#eab308" },
  config:     { label: "Config",      color: "#64748b" },
  tests:      { label: "Tests",       color: "#22d3ee" },
  styles:     { label: "Styles",      color: "#f472b6" },
  source:     { label: "Source",      color: "#94a3b8" },
};
