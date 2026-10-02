import { NextResponse } from "next/server";
import { getBhashiniLanguage } from "@/config/languages";
import { extractInferenceText, getPipelineConfig } from "@/lib/bhashini";

function stripDataUrl(value: string): string {
  return value.replace(/^data:[^;]+;base64,/, "");
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let audio = "";
    let mimeType = "audio/webm";
    let sourceLanguage = "en";
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      audio = String(form.get("audio") || "");
      mimeType = String(form.get("mimeType") || mimeType);
      sourceLanguage = String(form.get("sourceLanguage") || sourceLanguage);
    } else {
      const body = await request.json();
      audio = typeof body.audio === "string" ? body.audio : "";
      mimeType = body.mimeType || mimeType;
      sourceLanguage = body.sourceLanguage || sourceLanguage;
    }
    if (!audio) return NextResponse.json({ error: "audio is required" }, { status: 400 });

    const language = getBhashiniLanguage(sourceLanguage).bhashiniCode;
    const pipeline = await getPipelineConfig("asr", language);
    const response = await fetch(pipeline.inferenceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.BHASHINI_INFERENCE_KEY || "",
        inferenceApiKey: process.env.BHASHINI_INFERENCE_KEY || "",
      },
      body: JSON.stringify({
        pipelineTasks: [{
          taskType: "asr",
          config: { language: { sourceLanguage: language }, serviceId: pipeline.serviceId, audioFormat: mimeType },
          inputData: { audio: [{ audioContent: stripDataUrl(audio) }] },
        }],
        sourceLanguage: language,
      }),
    });
    if (!response.ok) throw new Error(`Bhashini ASR failed: ${response.status}`);
    const data = await response.json();
    return NextResponse.json({ text: extractInferenceText(data), sourceLanguage: language });
  } catch (error) {
    console.error("Bhashini ASR error:", error);
    return NextResponse.json({ error: "Speech transcription failed" }, { status: 502 });
  }
}