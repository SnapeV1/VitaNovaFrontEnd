import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Communication } from '../Model/Communication';
import { UserModule } from '../Model/user/user.module';

@Injectable({
  providedIn: 'root'
})
export class CommunicationServiceService {

  public fonctionAppelee: EventEmitter<Communication> = new EventEmitter<Communication>();

  constructor(private http:HttpClient) { }
  URL="http://localhost:8081";
  addUrl="/addCommunication";
  updateUrl="/updateCommunication";
  deleteUrl="/deleteCommunication";
  findCommunicationById="/findCommunication";
  findBySenderAndRecieverUrl="/findBySenderAndReciever";
  findByCommunityUrl="/getCommbyCommunityFirst";
  seenUrl="/seenComunications";
  seenOneToOneUrl="/setSeenToComOneToOne"

  uploadImageUrl="/UploadImage";



                    //Get
  findyId(id:Number):Observable<Communication>{
    return this.http.get<Communication>(this.URL+this.findCommunicationById+"/"+id);
  }

  findBysenderAndReciever(sender:number, reciever:number,page:number):Observable<any>{
    var params=new HttpParams()
    .set('sender',sender)
    .set('reciever',reciever)
    .set('page',page);
    return this.http.get<any>(this.URL+this.findBySenderAndRecieverUrl,{params});
  }


findByCommunity(communityId:number,page:number):Observable<any>{
  var params=new HttpParams()
  .set('communityId',communityId)
  .set('page',page);
return this.http.get<any>(this.URL+this.findByCommunityUrl,{params,withCredentials:true});
}
                      //add
  addCommunication(communication:Communication):Observable<Communication>{
    return this.http.post<Communication>(this.URL+this.addCommunication,communication);
  }   



                      //Update
  updateCommunication(communication:Communication,id:number):Observable<Communication>{
      return this.http.put<Communication>(this.URL+this.updateUrl+"/"+id,communication);
  } 

  seenComunication(comunityId:number,senderId:number):Observable<any>{
    const params=new HttpParams()
  .set('comunityId',comunityId)
  .set('senderId',senderId);
  
    return this.http.put<any>(this.URL+this.seenUrl,params,{withCredentials:true});
  }

  setSeenCommunicationOneToOne(senderId:number,recieverId:number):Observable<any>{
    const params=new HttpParams()
  .set('senderId',senderId)
  .set('recieverId',recieverId);
  
    return this.http.put<any>(this.URL+this.seenOneToOneUrl,params,{withCredentials:true});
  }

                      //Delete
  deleteCommunication(id:Number):Observable<Communication>{
        return this.http.delete<Communication>(this.URL+this.deleteUrl+"/"+id,);
    }
  



    //Upload image For comm

    uploadImage(image:File):Observable<any>{
      
      const formData: FormData = new FormData();
      formData.append('image', image, "image.name");
      
      return this.http.post(this.URL+this.uploadImageUrl,formData,{responseType: 'text'});
    }


           ////////Web socket Messaging 

           myChannel:string='';
           
           webSocketEndPoint: string = 'http://localhost:8081/ws';
           topic:string="/topic/";
           sendMessage:string="/app/chat.sendMessage/"
         
           stompClient:any=null;
         
         
           _connect() {
             console.log("Initialize WebSocket Connection");
             
             let ws = new SockJS(this.webSocketEndPoint);
             this.stompClient = Stomp.over(ws);
             const _this = this;
             _this.stompClient.connect({}, this.onConnected.bind(_this), this.errorCallBack);
         };
         
         
         
          onConnected=()=> {
           console.log("Subscribed to the channel:: "+this.myChannel);
         
           //////////////////////////////////////////////////////////////////////////////////////////////////
           // Subscribe to the community Topic
           this.stompClient.subscribe(this.topic+this.myChannel, this.onMessageReceived);
           
         
           
         }
         
         _disconnect() {
           if (this.stompClient !== null) {
               this.stompClient.disconnect();
           }
           console.log("Disconnected");
         }
         
         
         errorCallBack(error:Communication) {
           console.log("errorCallBack -> " + error.message)
           setTimeout(() => {
               this._connect();
           }, 5000);
         }
         
         //Communication
         _send(message:Communication) {
           console.log("calling logout api via web socket");
        
           this.stompClient.send(this.sendMessage+this.myChannel, {}, JSON.stringify(message));
         
         }
         
         
         onMessageReceived=(payload)=> {
          var message:Communication=JSON.parse(payload.body);
           console.log("Message Recieved from Server :: " + message.message +" "+message.sentDate+" "+message.sender.idUser);
           this.fonctionAppelee.emit(message);
         } 

}
