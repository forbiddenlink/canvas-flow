import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/projects/[id]/duplicate - Duplicate a project
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find the original project
    const originalProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!originalProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    if (originalProject.isDeleted) {
      return NextResponse.json(
        { success: false, error: 'Cannot duplicate deleted project' },
        { status: 400 }
      );
    }

    // Create a duplicate with a new name
    const duplicateName = `${originalProject.name} (Copy)`;

    const duplicateProject = await prisma.project.create({
      data: {
        userId: originalProject.userId,
        name: duplicateName,
        canvasData: originalProject.canvasData,
        thumbnailUrl: originalProject.thumbnailUrl,
        width: originalProject.width,
        height: originalProject.height,
        fileSizeBytes: originalProject.fileSizeBytes,
        isTemplate: false,
        isDeleted: false,
      },
    });

    return NextResponse.json({
      success: true,
      project: duplicateProject,
    });
  } catch (error) {
    console.error('Error duplicating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to duplicate project' },
      { status: 500 }
    );
  }
}
