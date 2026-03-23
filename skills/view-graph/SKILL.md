---
name: view-graph
description: Generate an interactive HTML visualization of the code knowledge graph. Shows file relationships, categories, imports, and blast radius in a self-contained .html file.
argument-hint: "[output path]"
---

# View Graph

Generate a self-contained HTML visualization of the code knowledge graph.

## Steps

1. **Ensure the graph exists** by calling the `list_graph_stats` MCP tool.
   - If the graph has never been built (`last_updated` is null or `total_nodes` is 0), tell the user to run `/build-graph` first.
   - If the graph exists, proceed.

2. **Generate the visualization** by calling `generate_graph_html`:
   - Default output: `.code-review-graph/graph.html`
   - If the user provides an argument, pass it as `output_path`.

3. **Report** the result:
   - Output file path
   - File count, connection count, categories detected
   - Suggest opening: `open .code-review-graph/graph.html` (macOS) or the appropriate command for the platform

## What It Shows

- **File-level nodes** grouped by auto-detected category (Pages, API Routes, Components, Hooks, Core Lib, Auth, Data Layer, Types, Config, Tests)
- **Import relationships** as bezier curves between files
- **Click any file** to see: line count, function count, imports, imported-by, blast radius
- **Search** by filename or path
- **Filter** by category (toggle buttons)
- **Zoom** in/out with controls or Ctrl+scroll

## Notes

- Output is a single self-contained HTML file — no external dependencies, works offline
- Works best after a full build: `/build-graph full`
- Categories are auto-detected from file paths (pages, api, components, hooks, lib, auth, data, types, config, tests, styles)
- Designed for codebases of 50–500+ files
