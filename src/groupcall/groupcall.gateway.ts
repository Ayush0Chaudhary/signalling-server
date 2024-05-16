import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'room',
})
export class GroupcallGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private rooms = new Map<string, Socket[]>();
  private connections: Map<string, Socket> = new Map();

  afterInit() {
    console.log('Gateway Initialized');
  }
  handleConnection(client: Socket) {
    this.connections.set(client.id, client);
    console.log(`Client connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    this.connections.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('start-call')
  handleStartCall(client: Socket, room: string) {
    console.log('Call started : ', room, 'User id :', client.id);
    client.join(room);
    this.rooms[room] = [client];
  }

  @SubscribeMessage('give-room-members')
  handleGiveRoomMembers(client: Socket, room: string) {
    console.log('Room members : ', room, 'User id :', client.id);
    const users = [];
    for (const user of this.rooms[room]) {
      users.push(user.id);
    }
    console.log(users);
    client.emit('room-participants', JSON.stringify({ userIds: users }));
  }
  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, room: string) {
    console.log('Room joined : ', room, 'User id :', client.id);
    client.join(room);
    this.rooms[room].push(client);
    const users = [];
    for (const user of this.rooms[room]) {
      users.push(user.id);
    }
    console.log(users);

    this.server
      .to(room)
      .emit('room-participants', JSON.stringify({ userIds: users }));
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(client: Socket, data: string) {
    const parsedJson = JSON.parse(data);
    console.log(
      '*******Ice Candidate*******',
      ' from :',
      client.id,
      'to :',
      parsedJson.to,
    );
    const receiver = this.connections.get(parsedJson.to);
    if (receiver) {
      receiver.emit(
        'ice-candidate',
        JSON.stringify({ candidate: parsedJson.candidate, from: client.id }),
      );
    } else {
      client.emit('error', 'Not found');
    }
  }

  @SubscribeMessage('offer')
  handleOffer(client: Socket, data: string) {
    const parsedJson = JSON.parse(data);
    console.log('*******Offer*******', client.id);
    const receiver = this.connections.get(parsedJson.to);
    if (receiver) {
      receiver.emit(
        'offer',
        JSON.stringify({ from: client.id, offer: parsedJson.offer }),
      );
    } else {
      client.emit('error', 'Not found');
    }
  }

  @SubscribeMessage('answer')
  handleAnswer(client: Socket, data: string) {
    const parsedJson = JSON.parse(data);
    console.log('*******Answer*******', client.id);
    const receiver = this.connections.get(parsedJson.to);
    if (receiver) {
      receiver.emit(
        'answer',
        JSON.stringify({ from: client.id, answer: parsedJson.answer }),
      );
    } else {
      client.emit('error', 'Not found');
    }
  }

  @SubscribeMessage('send-joining-data')
  handleSendMessageToRoom(client: Socket, data: string) {
    // console.log(data);
    const parsedJson = JSON.parse(data);
    console.log('gggggggggggg: ', parsedJson.type);
    // const data = {
    //   type: 'ice',
    //   room: meetinglink,
    //   data: event.candidate,
    // };

    // or

    // const data = {
    //   type: 'offer',
    //   room: meetinglink,
    //   data: offer,
    // };

    // messge needs to contain user ID so old user knows who to send
    this.server.to(parsedJson.room).emit(
      'user-joined',
      JSON.stringify({
        type: parsedJson.type,
        data: parsedJson.data,
        from: client.id,
      }),
    );
  }

  @SubscribeMessage('return-data-to-new-user')
  handleReturnMessageToRoom(client: Socket, data: string) {
    const parsedJson = JSON.parse(data);
    // to : parsedJson.from,
    // type: 'answer',
    // room: meetinglink, // we can remove this
    // data: answer,
    const receiver = this.connections.get(parsedJson.to);
    if (receiver) {
      receiver.emit(
        'receive-returning-data',
        JSON.stringify({
          type: parsedJson.type,
          data: parsedJson.data,
          from: client.id,
        }),
      );
    } else {
      client.emit('error', 'Not found');
    }
    // this.server.emit('receive-returning-data', message);
  }
}
// new user joins and trigger join-room
// nu create sdp and icec and send on send-joining-data
// existing user receives from user-joined
// existing user sends sdp and icec and trigger return-data-to-room
// nu gets the data from receive-returning-data
