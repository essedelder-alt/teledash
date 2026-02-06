import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.currentOrganization?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orgId = session.user.currentOrganization.id;

    // Get recent interactions
    const interactions = await prisma.interaction.findMany({
      where: { organizationId: orgId },
      orderBy: { startedAt: 'desc' },
      take: 5,
      include: {
        customer: {
          select: { name: true },
        },
      },
    });

    // Get recent tickets
    const tickets = await prisma.ticket.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        customer: {
          select: { name: true },
        },
      },
    });

    // Combine and format activities
    const activities = [
      ...interactions.map((interaction) => ({
        id: interaction.id,
        type: interaction.type as 'CALL' | 'SMS' | 'TICKET' | 'TRANSACTION',
        description: `${interaction.type} ${interaction.direction.toLowerCase()}`,
        customerName: interaction.customer.name || 'Unknown',
        agentName: interaction.agentId,
        timestamp: interaction.startedAt.toISOString(),
        status: interaction.status,
      })),
      ...tickets.map((ticket) => ({
        id: ticket.id,
        type: 'TICKET' as const,
        description: `Ticket ${ticket.ticketNumber}: ${ticket.subject}`,
        customerName: ticket.customer.name || 'Unknown',
        agentName: ticket.assignedTo,
        timestamp: ticket.createdAt.toISOString(),
        status: ticket.status,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    return NextResponse.json({ success: true, data: activities });
  } catch (error) {
    console.error('Failed to fetch recent activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity' },
      { status: 500 }
    );
  }
}
