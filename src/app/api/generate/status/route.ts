import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import fs from "fs";

// Initialize Replicate client
let replicateClient: Replicate | null = null;

function getReplicateClient(): Replicate {
  if (replicateClient) return replicateClient;

  // Try environment variable first
  if (process.env.REPLICATE_API_KEY) {
    replicateClient = new Replicate({
      auth: process.env.REPLICATE_API_KEY,
    });
    return replicateClient;
  }

  // Try reading from file
  try {
    const apiKey = fs.readFileSync("/tmp/api-key/replicate", "utf8").trim();
    if (!apiKey) {
      throw new Error("API key is empty");
    }
    replicateClient = new Replicate({ auth: apiKey });
    return replicateClient;
  } catch (error) {
    throw new Error("Replicate API key not configured");
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const predictionId = searchParams.get("id");

    if (!predictionId) {
      return NextResponse.json(
        { error: "Prediction ID is required" },
        { status: 400 }
      );
    }

    const replicate = getReplicateClient();
    const prediction = await replicate.predictions.get(predictionId);

    // Calculate progress percentage
    let progress = 0;
    if (prediction.status === "starting") {
      progress = 10;
    } else if (prediction.status === "processing") {
      // If logs contain progress info, parse it
      // Otherwise estimate based on status
      progress = 50;
    } else if (prediction.status === "succeeded") {
      progress = 100;
    } else if (prediction.status === "failed" || prediction.status === "canceled") {
      progress = 0;
    }

    // Handle different output formats
    let imageUrl: string | null = null;
    if (prediction.status === "succeeded" && prediction.output) {
      if (Array.isArray(prediction.output)) {
        imageUrl = prediction.output[0] as string;
      } else if (typeof prediction.output === "string") {
        imageUrl = prediction.output;
      }
    }

    return NextResponse.json({
      id: prediction.id,
      status: prediction.status,
      progress,
      imageUrl,
      error: prediction.error || null,
      logs: prediction.logs || null,
    });
  } catch (error) {
    console.error("Status check error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to check status",
      },
      { status: 500 }
    );
  }
}
