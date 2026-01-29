import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/init - Initialize default user
export async function GET() {
  try {
    // Create default user if doesn't exist
    const defaultUser = await prisma.user.upsert({
      where: { email: 'default@pixelforge.app' },
      update: {},
      create: {
        id: 'default-user',
        email: 'default@pixelforge.app',
        name: 'Default User',
        subscriptionTier: 'free',
        apiUsageLimit: 100,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Default user initialized',
      user: defaultUser,
    });
  } catch (error) {
    console.error('Error initializing default user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize default user' },
      { status: 500 }
    );
  }
}
