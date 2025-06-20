import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my-rooms')
  public async getMyRooms(@Req() req: any) {
    console.log('req', req);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = req.user as { id: string }; // حسب ما تستخدم في JWT

    const rooms = await this.prisma.room.findMany({
      where: {
        messages: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          include: { user: true },
        },
      },
    });

    return rooms;
  }
}
