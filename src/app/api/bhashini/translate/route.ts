import { NextResponse } from "next/server";
import { BHASHINI_LANGUAGES } from "@/config/languages";

const DHRUVA_PIPELINE_URL = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline";

interface TranslationRequest {
  text?: string | string[];
  sourceLanguage?: string;
  targetLanguage?: string;
}

interface TranslationOutput {
  target?: string;
  output?: string;
  text?: string;
}

function readString(value: unknown, keys: string[]): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  if (Array.isArray(value)) {
    for (const item of value) {
      const result = readString(item, keys);
      if (result) return result;
    }
    return undefined;
  }

  const record = value as Record<string, unknown>;
  for (const key of keys) {
    const matchingKey = Object.keys(record).find((candidate) => candidate.toLowerCase() === key.toLowerCase());
    if (matchingKey && typeof record[matchingKey] === "string" && record[matchingKey]) {
      return record[matchingKey] as string;
    }
  }
  for (const child of Object.values(record)) {
    const result = readString(child, keys);
    if (result) return result;
  }
  return undefined;
}

function parseOutputs(data: unknown, fallback: string[]): string[] {
  if (!data || typeof data !== "object") return fallback;
  const record = data as Record<string, unknown>;
  const pipelineResponse = Array.isArray(record.pipelineResponse) ? record.pipelineResponse : [];

  for (const task of pipelineResponse) {
    if (!task || typeof task !== "object") continue;
    const output = (task as Record<string, unknown>).output;
    if (!Array.isArray(output)) continue;
    return fallback.map((original, index) => {
      const item = output[index] as TranslationOutput | string | undefined;
      if (typeof item === "string") return item;
      return item?.target || item?.output || item?.text || original;
    });
  }

  if (Array.isArray(record.output)) {
    const output = record.output as unknown[];
    return fallback.map((original, index) => {
      const item = output[index] as TranslationOutput | string | undefined;
      if (typeof item === "string") return item;
      return item?.target || item?.output || item?.text || original;
    });
  }

  const single = readString(data, ["target", "output", "text"]);
  return fallback.map((original, index) => (index === 0 && single ? single : original));
}

function fallbackResponse(
  textList: string[],
  isArray: boolean,
  sourceLanguage: string,
  targetLanguage: string,
  reason: string,
) {
  console.warn(`[Bhashini Dhruva] Returning original text fallback ${JSON.stringify({
    reason,
    sourceLanguage,
    targetLanguage,
    itemCount: textList.length,
  })}`);
  const translations = [...textList];
  return NextResponse.json({
    text: isArray ? translations : translations[0] || "",
    translations,
    sourceLanguage,
    targetLanguage,
    isFallback: true,
  });
}

export async function POST(request: Request) {
  let body: TranslationRequest;
  try {
    body = (await request.json()) as TranslationRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const rawText: unknown = body.text;
  const isArray = Array.isArray(rawText);
  const textList: string[] = isArray
    ? (rawText as unknown[]).filter((text: unknown): text is string => typeof text === "string")
    : typeof rawText === "string"
      ? [rawText]
      : [];
  const sourceLanguage = body.sourceLanguage || "en";
  const targetLanguage = body.targetLanguage || "en";

  if (!textList.length) return NextResponse.json({ error: "text is required" }, { status: 400 });

  const supportedCodes = new Set(BHASHINI_LANGUAGES.map((language) => language.bhashiniCode));
  if (!supportedCodes.has(sourceLanguage) || !supportedCodes.has(targetLanguage)) {
    return fallbackResponse(textList, isArray, sourceLanguage, targetLanguage, "unsupported language code");
  }
  if (sourceLanguage === targetLanguage) {
    return NextResponse.json({
      text: isArray ? textList : textList[0],
      translations: textList,
      sourceLanguage,
      targetLanguage,
    });
  }

  const userId = process.env.BHASHINI_USER_ID;
  const udyatKey = process.env.BHASHINI_UDYAT_KEY;
  const inferenceKey = process.env.BHASHINI_INFERENCE_KEY;
  if (!userId || !udyatKey || !inferenceKey) {
    return fallbackResponse(textList, isArray, sourceLanguage, targetLanguage, "missing Bhashini credentials");
  }

  const inputData = { input: textList.map((source: string) => ({ source })) };
  const pipelinePayload = {
    pipelineTasks: [{
      taskType: "translation",
      config: { language: { sourceLanguage: sourceLanguage || "en", targetLanguage } },
    }],
    inputData,
  };
  const pipelineHeaders = {
    "Content-Type": "application/json",
    userID: userId,
    ulcaApiKey: udyatKey,
    Authorization: inferenceKey,
  };

  try {
    console.info(`[Bhashini Dhruva] Pipeline request ${JSON.stringify({
      url: DHRUVA_PIPELINE_URL,
      sourceLanguage,
      targetLanguage,
      itemCount: textList.length,
      payloadShape: "pipelineTasks[0] + inputData.input",
    })}`);

    const pipelineResponse = await fetch(DHRUVA_PIPELINE_URL, {
      method: "POST",
      headers: pipelineHeaders,
      body: JSON.stringify(pipelinePayload),
      signal: AbortSignal.timeout(12000),
    });
    if (!pipelineResponse.ok) {
      const details = await pipelineResponse.text().catch(() => "");
      console.error(`[Bhashini Dhruva] Pipeline request failed ${JSON.stringify({
        status: pipelineResponse.status,
        body: details.slice(0, 1000),
      })}`);
      return fallbackResponse(textList, isArray, sourceLanguage, targetLanguage, `pipeline HTTP ${pipelineResponse.status}`);
    }

    const pipelineData: unknown = await pipelineResponse.json();
    const pipelineRecord = pipelineData as Record<string, unknown>;
    const endpointConfig = pipelineRecord.pipelineInferenceAPIEndPoint || pipelineRecord.pipelineInferenceApiEndPoint;
    const responseConfig = pipelineRecord.pipelineResponseConfig;
    const callbackUrl = readString(endpointConfig, ["callbackUrl", "callbackURL", "inferenceApiUrl", "url"])
      || readString(pipelineData, ["callbackUrl", "callbackURL", "inferenceApiUrl"])
      || DHRUVA_PIPELINE_URL;
    const serviceId = readString(responseConfig, ["serviceId"]) || readString(pipelineData, ["serviceId"]);
    console.info(`[Bhashini Dhruva] Pipeline response metadata ${JSON.stringify({
      topLevelKeys: Object.keys(pipelineRecord),
      endpointKeys: endpointConfig && typeof endpointConfig === "object" ? Object.keys(endpointConfig as Record<string, unknown>) : [],
      hasResponseConfig: Boolean(responseConfig),
      callbackUrlSource: callbackUrl === DHRUVA_PIPELINE_URL ? "default-dhruva-endpoint" : "pipeline-response",
      hasServiceId: Boolean(serviceId),
      serviceId: serviceId || null,
    })}`);

    // Dhruva can execute translation immediately and return pipelineResponse
    // instead of returning a callbackUrl/serviceId discovery envelope.
    if (!serviceId && Array.isArray(pipelineRecord.pipelineResponse)) {
      const results = parseOutputs(pipelineData, textList);
      console.info(`[Bhashini Dhruva] Direct pipeline response received ${JSON.stringify({ itemCount: results.length })}`);
      return NextResponse.json({
        text: isArray ? results : results[0] || textList[0],
        translations: results,
        sourceLanguage,
        targetLanguage,
      });
    }

    if (!callbackUrl || !serviceId) {
      return fallbackResponse(textList, isArray, sourceLanguage, targetLanguage, "pipeline response missing callbackUrl or serviceId");
    }

    const inferencePayload = {
      pipelineTasks: [{
        taskType: "translation",
        config: {
          language: { sourceLanguage: sourceLanguage || "en", targetLanguage },
          serviceId,
        },
      }],
      inputData,
    };
    console.info(`[Bhashini Dhruva] Inference request ${JSON.stringify({
      callbackUrl,
      serviceId,
      itemCount: textList.length,
      payloadShape: "pipelineTasks[0].config.serviceId + inputData.input",
    })}`);

    const inferenceResponse = await fetch(callbackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: inferenceKey },
      body: JSON.stringify(inferencePayload),
      signal: AbortSignal.timeout(12000),
    });
    if (!inferenceResponse.ok) {
      const details = await inferenceResponse.text().catch(() => "");
      console.error(`[Bhashini Dhruva] Inference request failed ${JSON.stringify({
        status: inferenceResponse.status,
        body: details.slice(0, 1000),
      })}`);
      return fallbackResponse(textList, isArray, sourceLanguage, targetLanguage, `inference HTTP ${inferenceResponse.status}`);
    }

    const results = parseOutputs(await inferenceResponse.json(), textList);
    return NextResponse.json({
      text: isArray ? results : results[0] || textList[0],
      translations: results,
      sourceLanguage,
      targetLanguage,
    });
  } catch (error) {
    console.error(`[Bhashini Dhruva] Translation exception ${JSON.stringify({
      message: error instanceof Error ? error.message : String(error),
      sourceLanguage,
      targetLanguage,
    })}`);
    return fallbackResponse(textList, isArray, sourceLanguage, targetLanguage, "runtime exception");
  }
}
