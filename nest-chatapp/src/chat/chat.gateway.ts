import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { Message, User } from '@prisma/client';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly prisma: PrismaService) {}

  public handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  public handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('send_message')
  public async handleMessage(
    @MessageBody() data: { userId: string; content: string; roomId: string },
  ) {
    const saved = await this.prisma.message.create({
      data: {
        content: data.content,
        userId: data.userId,
        roomId: data.roomId,
      },
      include: { user: true },
    });

    const formattedMessage = {
      id: saved.id,
      content: saved.content,
      createdAt: saved.createdAt,
      user: {
        id: saved.user.id,
        username: saved.user.username,
      },
    };

    this.server.to(data.roomId).emit('new_message', formattedMessage);
  }

  @SubscribeMessage('join_public_room')
  public async handleJoinPublicRoom(@ConnectedSocket() client: Socket) {
    const publicRoom = await this.prisma.room.upsert({
      where: { name: 'public' },
      update: {},
      create: { name: 'public' },
      include: {
        messages: {
          include: { user: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    const formattedMessages = publicRoom.messages?.map(
      (m: Message & { user: User }) => ({
        id: m.id,
        content: m.content,
        createdAt: m.createdAt,
        user: {
          id: m.user.id,
          username: m.user.username,
        },
      }),
    );

    await client.join(publicRoom.id);
    client.emit('messages_history', formattedMessages);
    client.emit('joined_room', publicRoom.id);
  }

  @SubscribeMessage('join_room')
  public async handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(data.roomId);

    const messages = await this.prisma.message.findMany({
      where: { roomId: data.roomId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });

    const formattedMessages = messages.map((m) => ({
      id: m.id,
      content: m.content,
      createdAt: m.createdAt,
      user: {
        id: m.user.id,
        username: m.user.username,
      },
    }));

    client.emit('messages_history', formattedMessages);
  }

  @SubscribeMessage('create_room')
  public async handleCreateRoom(
    @MessageBody() data: { name: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const room = await this.prisma.room.create({
      data: {
        name: data.name,
      },
    });

    await client.join(room.id);

    client.emit('room_created', {
      id: room.id,
      name: room.name,
    });
  }

  @SubscribeMessage('start_private_chat')
  public async handlePrivateChat(
    @MessageBody() data: { targetUserId: string },
    @ConnectedSocket() client: Socket,
  ) {
    // نفرض أن المستخدم المرسل موجود داخل client.handshake.auth.userId
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const currentUserId = client.handshake.auth.userId;
    const targetUserId = data.targetUserId;

    if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
      return;
    }

    // نرتب الـ ID لتفادي تكرار غرف بين نفس الشخصين
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [userA, userB] = [currentUserId, targetUserId].sort();

    const existingRoom = await this.prisma.room.findFirst({
      where: {
        name: `private-${userA}-${userB}`,
      },
      include: {
        messages: {
          include: { user: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    let room = existingRoom;

    if (!room) {
      room = await this.prisma.room.create({
        data: {
          name: `private-${userA}-${userB}`,
        },
        include: {
          messages: {
            include: { user: true },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    }

    await client.join(room.id);

    const formattedMessages =
      room.messages?.map((m) => ({
        id: m.id,
        content: m.content,
        createdAt: m.createdAt,
        user: {
          id: m.user.id,
          username: m.user.username,
        },
      })) || [];

    client.emit('private_chat_ready', {
      roomId: room.id,
      messages: formattedMessages,
    });
  }
}
