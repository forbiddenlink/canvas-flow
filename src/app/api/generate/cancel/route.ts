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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { predictionId } = body;

    if (!predictionId) {
      return NextResponse.json(
        { error: "Prediction ID is required" },
        { status: 400 }
      );
    }

    const replicate = getReplicateClient();
    await replicate.predictions.cancel(predictionId);

    return NextResponse.json({
      success: true,
      message: "Generation canceled successfully",
    });
  } catch (error) {
    console.error("Cancellation error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to cancel generation",
        success: false,
      },
      { status: 500 }
    );
  }
}
