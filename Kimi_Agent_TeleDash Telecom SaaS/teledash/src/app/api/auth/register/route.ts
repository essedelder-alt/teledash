import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        emailVerified: new Date(),
        status: 'ACTIVE',
      },
    });

    // Create personal organization
    const organization = await prisma.organization.create({
      data: {
        name: `${validated.name}'s Organization`,
        slug: `org-${user.id.slice(-8)}`,
        ownerId: user.id,
        subscriptionTier: 'STARTER',
        subscriptionStatus: 'TRIAL',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        settings: {
          create: {
            enableChurnPrediction: true,
            enableNetworkMonitoring: true,
            enableWorkflowBuilder: true,
            enableMobileMoney: true,
          },
        },
      },
    });

    // Add user as organization owner
    await prisma.organizationMember.create({
      data: {
        organizationId: organization.id,
        userId: user.id,
        role: 'OWNER',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
