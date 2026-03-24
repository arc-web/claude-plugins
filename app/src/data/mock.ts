import type { GraphData } from "@/lib/types";

/** Sample data for standalone development. */
export const MOCK_DATA: GraphData = {
  repoName: "composure",
  generatedAt: "Mar 2026",
  stats: { totalNodes: 85, totalEdges: 50, filesCount: 21 },
  nodes: [
    { id: "1", label: "server.ts", path: "graph/src/server.ts", cat: "source", lines: 293, functions: 1, classes: 0, types: 0, isTest: false, language: "typescript", imports: ["2","3","4","5"] },
    { id: "2", label: "store.ts", path: "graph/src/store.ts", cat: "source", lines: 376, functions: 15, classes: 1, types: 0, isTest: false, language: "typescript", imports: ["6","7"] },
    { id: "3", label: "parser.ts", path: "graph/src/parser.ts", cat: "source", lines: 452, functions: 12, classes: 0, types: 0, isTest: false, language: "typescript", imports: ["7","8"] },
    { id: "4", label: "incremental.ts", path: "graph/src/incremental.ts", cat: "source", lines: 310, functions: 8, classes: 0, types: 0, isTest: false, language: "typescript", imports: ["2","3","6"] },
    { id: "5", label: "generate-graph-html.ts", path: "graph/src/tools/generate-graph-html.ts", cat: "source", lines: 260, functions: 5, classes: 0, types: 0, isTest: false, language: "typescript", imports: ["2","4","9"] },
    { id: "6", label: "types.ts", path: "graph/src/types.ts", cat: "types", lines: 114, functions: 0, classes: 0, types: 8, isTest: false, language: "typescript", imports: [] },
    { id: "7", label: "serialization.ts", path: "graph/src/serialization.ts", cat: "source", lines: 82, functions: 4, classes: 0, types: 0, isTest: false, language: "typescript", imports: ["6"] },
    { id: "8", label: "parser-helpers.ts", path: "graph/src/parser-helpers.ts", cat: "source", lines: 220, functions: 10, classes: 0, types: 0, isTest: false, language: "typescript", imports: [] },
    { id: "9", label: "html-template.ts", path: "graph/src/html-template.ts", cat: "source", lines: 660, functions: 12, classes: 0, types: 2, isTest: false, language: "typescript", imports: [] },
    { id: "10", label: "bfs.ts", path: "graph/src/bfs.ts", cat: "source", lines: 95, functions: 2, classes: 0, types: 0, isTest: false, language: "typescript", imports: ["2","6"] },
    { id: "11", label: "view-graph.ts", path: "graph/src/view-graph.ts", cat: "source", lines: 50, functions: 1, classes: 0, types: 0, isTest: false, language: "typescript", imports: ["4","5"] },
    { id: "12", label: "esbuild.config.js", path: "graph/esbuild.config.js", cat: "config", lines: 83, functions: 1, classes: 0, types: 0, isTest: false, language: "javascript", imports: [] },
    { id: "13", label: "SKILL.md", path: "skills/view-graph/SKILL.md", cat: "source", lines: 40, functions: 0, classes: 0, types: 0, isTest: false, language: "typescript", imports: [] },
    { id: "14", label: "hooks.json", path: "hooks/hooks.json", cat: "config", lines: 78, functions: 0, classes: 0, types: 0, isTest: false, language: "javascript", imports: [] },
  ],
};
