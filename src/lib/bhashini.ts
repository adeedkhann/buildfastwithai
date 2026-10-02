const BHASHINI_PIPELINE_URL = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline";

export type TaskType = "translation" | "asr";

export interface PipelineConfig {
  serviceId: string;
  inferenceUrl: string;
  inferenceApiKey?: string;
  inferenceHeaderName?: string;
}

function findString(value: unknown, keys: string[]): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findString(item, keys);
      if (found) return found;
    }
    return undefined;
  }

  const record = value as Record<string, unknown>;
  for (const key of keys) {
    if (typeof record[key] === "string" && record[key]) return record[key] as string;
  }
  for (const child of Object.values(record)) {
    const found = findString(child, keys);
    if (found) return found;
  }
  return undefined;
}

export async function getPipelineConfig(
  taskType: TaskType,
  sourceLanguage: string,
  targetLanguage?: string,
): Promise<PipelineConfig> {
  const userId = process.env.BHASHINI_USER_ID;
  const udyatKey = process.env.BHASHINI_UDYAT_KEY;
  const inferenceKey = process.env.BHASHINI_INFERENCE_KEY;
  if (!userId || !udyatKey) throw new Error("Bhashini credentials are not configured on the server");

  console.info("[Bhashini Dhruva] Requesting pipeline config", {
    url: BHASHINI_PIPELINE_URL,
    taskType,
    sourceLanguage,
    targetLanguage,
    hasUserId: Boolean(userId),
    hasUdyatKey: Boolean(udyatKey),
    hasInferenceKey: Boolean(inferenceKey),
  });

  const payload = {
    pipelineTasks: [
      {
        taskType,
        config: {
          language: targetLanguage ? { sourceLanguage, targetLanguage } : { sourceLanguage },
        },
      },
    ],
    pipelineRequestConfig: {
      pipelineId: "64392f08a7050f326f56f488",
    },
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    userID: userId,
    ulcaApiKey: udyatKey,
  };

  if (inferenceKey) {
    headers["Authorization"] = inferenceKey;
  }

  try {
    const response = await fetch(BHASHINI_PIPELINE_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error("[Bhashini Dhruva] Pipeline config request failed", {
        status: response.status,
        statusText: response.statusText,
        body: errText.slice(0, 500),
      });
      throw new Error(`Bhashini pipeline request failed with HTTP ${response.status}`);
    }

    const data = await response.json();
    console.info("[Bhashini Dhruva] Pipeline discovery raw response:", JSON.stringify(data).slice(0, 400));

    const serviceId =
      data?.pipelineResponseConfig?.[0]?.config?.[0]?.serviceId ||
      data?.pipelineResponseConfig?.[0]?.serviceId ||
      findString(data, ["serviceId"]);

    const inferenceUrl =
      data?.pipelineInferenceAPIEndPoint?.callbackUrl ||
      findString(data, ["callbackUrl", "inferenceApiUrl", "computeUrl", "url"]);

    const inferenceApiKey =
      data?.pipelineInferenceAPIEndPoint?.inferenceApiKey?.value ||
      inferenceKey;

    const inferenceHeaderName =
      data?.pipelineInferenceAPIEndPoint?.inferenceApiKey?.name ||
      "Authorization";

    if (!serviceId || !inferenceUrl) {
      console.error("[Bhashini Dhruva] Missing serviceId or inferenceUrl in pipeline response", data);
      throw new Error("Bhashini pipeline response did not include serviceId and inference URL");
    }

    console.info("[Bhashini Dhruva] Pipeline config resolved successfully", {
      serviceId,
      inferenceUrl,
      inferenceHeaderName,
      hasApiKey: Boolean(inferenceApiKey),
    });

    return { serviceId, inferenceUrl, inferenceApiKey, inferenceHeaderName };
  } catch (err: any) {
    console.error("[Bhashini Dhruva] Pipeline config error details:", {
      message: err?.message,
      cause: err?.cause,
      code: err?.code,
    });
    throw err;
  }
}

export function extractInferenceText(data: unknown): string {
  const text = findString(data, ["target", "output", "text", "transcript"]);
  if (!text) throw new Error("Bhashini returned no text");
  return text;
}

export function extractInferenceResults(data: any, fallbackList: string[]): string[] {
  try {
    if (!data || typeof data !== "object") return fallbackList;

    // Check pipelineResponse -> output array
    const pipelineResponse = Array.isArray(data.pipelineResponse) ? data.pipelineResponse : [];
    for (const task of pipelineResponse) {
      if (Array.isArray(task.output) && task.output.length > 0) {
        const results = task.output.map((item: any, idx: number) => {
          if (typeof item === "string") return item;
          if (item && typeof item.target === "string") return item.target;
          if (item && typeof item.output === "string") return item.output;
          if (item && typeof item.text === "string") return item.text;
          return fallbackList[idx] ?? "";
        });
        if (results.length > 0) return results;
      }
    }

    // Direct output array
    if (Array.isArray(data.output)) {
      return data.output.map((item: any, idx: number) => {
        if (typeof item === "string") return item;
        if (item && typeof item.target === "string") return item.target;
        return fallbackList[idx] ?? "";
      });
    }

    // Single text match
    const singleText = findString(data, ["target", "output", "text"]);
    if (singleText && fallbackList.length === 1) {
      return [singleText];
    }
  } catch (err) {
    console.warn("[Bhashini] Failed extracting multiple inference results, falling back:", err);
  }

  return fallbackList;
}

export { findString };