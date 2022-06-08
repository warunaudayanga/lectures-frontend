// import { Injectable } from "@angular/core";
// import { io, Socket } from "socket.io-client";
// import { fromEvent, Observable } from "rxjs";
// import { environment } from "../../../environments/environment";
//
// @Injectable({
//     providedIn: "root"
// })
// export class SocketService {
//
//     socket!: Socket;
//
//     connect(token: string | null) {
//         if (!this.socket?.connected) {
//             this.socket = io(environment.socketUrl, {
//                 transports: ["websocket"],
//                 auth: {
//                     token
//                 }
//             });
//
//             this.socket.on("connect", (...args) => {
//                 console.log("connected:", this.socket.connected); // true
//                 console.log(args);
//             });
//
//             this.socket.on("message", (message: any) => {
//                 console.log(this.socket.connected); // true
//                 console.log(message);
//             });
//         }
//     }
//
//     onEvent<T>(event: string): Observable<T> | null {
//         if (!this.socket) {
//             return null;
//         }
//         // @ts-ignore
//         return fromEvent<T>(this.socket, event);
//     }
//
//     disconnect(): void {
//         this.socket.disconnect();
//     }
// }
