import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import fs from "fs";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { generateImageSchema, validateRequest } from '@/lib/validation';

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

// Model mapping - format: "owner/model" or "owner/model:version"
const MODEL_MAP = {
  "flux-pro": "black-forest-labs/flux-pro",
  "flux-dev": "black-forest-labs/flux-dev",
  "sdxl": "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
};

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check rate limit (strict for AI generation)
    const rateLimitResult = await checkRateLimit(request, RATE_LIMITS.AI_GENERATE);
    if (rateLimitResult) return rateLimitResult;

    const body = await request.json();

    // Validate input
    const validation = validateRequest(generateImageSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { prompt, negativePrompt, model = "flux-dev" } = validation.data;

    const replicate = getReplicateClient();
    const modelId = MODEL_MAP[model as keyof typeof MODEL_MAP] || MODEL_MAP["flux-pro"];

    // Prepare input based on model
    const input: Record<string, any> = {
      prompt: prompt.trim(),
    };

    // Add negative prompt if provided
    if (negativePrompt && negativePrompt.trim()) {
      input.negative_prompt = negativePrompt.trim();
    }

    // Add SDXL-specific parameters
    if (model === "sdxl") {
      input.width = 1024;
      input.height = 1024;
      input.num_inference_steps = 30;
      input.guidance_scale = 7.5;
    }

    // Create prediction (async) using model string directly
    const prediction = await replicate.predictions.create({
      model: modelId,
      input,
    } as any);

    // Return prediction ID for status polling
    return NextResponse.json({
      predictionId: prediction.id,
      status: prediction.status,
      success: true,
    });
  } catch (error) {
    console.error("Generation error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate image",
        success: false,
      },
      { status: 500 }
    );
  }
}
