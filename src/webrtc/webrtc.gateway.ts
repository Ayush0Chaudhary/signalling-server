// webrtc.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebRtcGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private connections: Map<string, Socket> = new Map();
  private rooms: Map<string, Socket[]> = new Map();

  afterInit() {
    console.log('Gateway Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.connections.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connections.delete(client.id);
  }

  @SubscribeMessage('test')
  handleMessage(client: Socket, data: string) {
    console.log(data);
    const { to, test } = JSON.parse(data);
    const receiver = this.connections.get(to);
    if (receiver) {
      receiver.emit('test', { from: client.id, test });
    } else {
      client.emit('error', 'Not found');
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, room: string) {
    // console.log(room);

    client.join(room);
    client.emit('hello', room.toString());
    this.rooms.get(room)?.push(client) || this.rooms.set(room, [client]);
  }

  @SubscribeMessage('send-message-to-room')
  handleSendMessageToRoom(client: Socket, data: string) {
    console.log(data);
    const { room, message } = JSON.parse(data);
    console.log(room, message);
    this.server.to(room).emit('message', message);
  }

  @SubscribeMessage('offer')
  handleOffer(client: Socket, data: string) {
    // Offer here is the RTCSessionDescription containing type and sdp
    try {
      console.log(data);
      const { to, offer } = JSON.parse(data);
      console.log(to, offer);
      // get where to is the id of the client to send the offer to
      const receiver = this.connections.get(to);
      if (receiver) {
        receiver.emit(
          'offer',
          JSON.stringify({ from: client.id, offer: offer }),
        );
      } else {
        console.log('fick up');

        client.emit('error', 'Recipient not found');
      }
    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage('answer')
  handleAnswer(client: Socket, data: string) {
    console.log(data);
    const { to, answer } = JSON.parse(data);
    const receiver = this.connections.get(to);
    if (receiver) {
      receiver.emit(
        'answer',
        JSON.stringify({ from: client.id, answer: answer }),
      );
    } else {
      client.emit('error', 'Recipient not found');
    }
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(client: Socket, data: string) {
    const { to, icec } = JSON.parse(data);
    const receiver = this.connections.get(to);
    console.log(to, icec);

    if (receiver) {
      receiver.emit('ice-candidate', JSON.stringify({ from: client.id, icec }));
    } else {
      client.emit('error', 'Recipient not found');
    }
  }
}

// interface WebRtcMessage {
//   to: string;
//   clientConfig: any;
// }
