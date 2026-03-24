import { useState, useEffect } from "react";
import type { GraphData } from "@/lib/types";
import { MOCK_DATA } from "@/data/mock";

declare global {
  interface Window {
    __GRAPH_DATA__?: GraphData;
  }
}

export function useGraphData() {
  const [data, setData] = useState<GraphData | null>(
    window.__GRAPH_DATA__ ?? null,
  );
  const [loading, setLoading] = useState(!window.__GRAPH_DATA__);

  useEffect(() => {
    if (window.__GRAPH_DATA__) return;

    fetch("/api/data")
      .then((r) => {
        if (!r.ok) throw new Error("API unavailable");
        return r.json();
      })
      .then((d: GraphData) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to mock data for standalone dev
        setData(MOCK_DATA);
        setLoading(false);
      });
  }, []);

  // SSE live reload
  useEffect(() => {
    if (window.__GRAPH_DATA__) return; // static mode, no SSE

    let es: EventSource | null = null;
    try {
      es = new EventSource("/events");
      es.addEventListener("reload", () => {
        fetch("/api/data")
          .then((r) => r.json())
          .then((d: GraphData) => setData(d));
      });
    } catch {
      // SSE not available (static file mode)
    }
    return () => es?.close();
  }, []);

  return { data, loading };
}
