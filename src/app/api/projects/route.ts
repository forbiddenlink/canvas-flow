import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { createProjectSchema, validateRequest } from '@/lib/validation';

// GET /api/projects - List all projects for a user
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(request, RATE_LIMITS.PROJECT_CRUD);
    if (rateLimitResult) return rateLimitResult;

    const userId = session.user.id;

    const projects = await prisma.project.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      orderBy: {
        lastEditedAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        thumbnailUrl: true,
        width: true,
        height: true,
        createdAt: true,
        updatedAt: true,
        lastEditedAt: true,
        fileSizeBytes: true,
      },
    });

    return NextResponse.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(request, RATE_LIMITS.PROJECT_CRUD);
    if (rateLimitResult) return rateLimitResult;

    const body = await request.json();

    // Validate input
    const validation = validateRequest(createProjectSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, canvasData, width, height, thumbnailUrl } = validation.data;
    const userId = session.user.id;

    // Calculate file size from canvas data
    const fileSizeBytes = new Blob([canvasData]).size;

    const project = await prisma.project.create({
      data: {
        userId,
        name,
        canvasData,
        width: width || 1920,
        height: height || 1080,
        thumbnailUrl,
        fileSizeBytes,
        lastEditedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
