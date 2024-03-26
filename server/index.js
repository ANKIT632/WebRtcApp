
import { Server } from 'socket.io';

const io =new Server(8000,{
  cors:'true',
});

const emailToSocketIdMap=new Map();
const socketIdToEmailMap=new Map();

io.on('connection',(socket)=>{ 
  socket.on('room-join',(data)=>{
  const {email,room}=data;
  emailToSocketIdMap.set(email,socket.id);
  socketIdToEmailMap.set(socket.id,email);
  
// if user join the room.
  io.to(room).emit('user-join',{email,id:socket.id});
  socket.join(room);

  io.to(socket.id).emit('room-join',data);
  });

  socket.on('user-call',({to,offer})=>{
    io.to(to).emit("incomming-call",{from:socket.id,offer});
  });

  socket.on('call-accept',({to,ans})=>{
    io.to(to).emit("call-accept",{from:socket.id,ans});
  });

});



// here user-join and room-join are event listner which is same both side client as well as sever .