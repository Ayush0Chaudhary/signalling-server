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
import { log } from 'console';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class WebRtcGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private connections: Map<string, Socket> = new Map();

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
  handleMessage(@MessageBody() data: any): void {
    console.log(data);
    this.server.emit('test', data);
  }

  @SubscribeMessage('join')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    console.log(`Client ${client.id} joined room ${room}`);
  }

  @SubscribeMessage('offer')
  handleOffer(client: Socket, data: string) {
    // Offer here is the RTCSessionDescription containing type and sdp
    const { to, offer } = JSON.parse(data);
    // console.log(to, offer.type, data);

    // get where to is the id of the client to send the offer to
    const receiver = this.connections.get(to);
    if (receiver) {
      receiver.emit('offer', { from: client.id, offer });
    } else {
      client.emit('error', 'Recipient not found');
    }
  }

  @SubscribeMessage('answer')
  handleAnswer(client: Socket, data: string) {
    const { to, answer } = JSON.parse(data);
    const receiver = this.connections.get(to);
    if (receiver) {
      receiver.emit('answer', { from: client.id, answer });
    } else {
      client.emit('error', 'Recipient not found');
    }
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(client: Socket, data: string) {
    const { to, candidate } = JSON.parse(data);
    const receiver = this.connections.get(to);
    if (receiver) {
      receiver.emit('ice-candidate', { from: client.id, candidate });
    } else {
      client.emit('error', 'Recipient not found');
    }
  }
}

// interface WebRtcMessage {
//   to: string;
//   clientConfig: any;
// }
