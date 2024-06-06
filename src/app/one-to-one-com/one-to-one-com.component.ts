import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommunicationServiceService } from '../Services/communication-service.service';

import { Communication } from '../Model/Communication';
import { Subscription } from 'rxjs';
import { ERole, Gender, UserModule } from '../Models/user.module';
import { PersonalGoalsModule } from '../Models/personal-goals.module';

@Component({
  selector: 'app-one-to-one-com',
  templateUrl: './one-to-one-com.component.html',
  styleUrls: ['./one-to-one-com.component.css']
})
export class OneToOneComComponent {



  @ViewChild('messagesList') htmlMessages:ElementRef; 
 
  @Input() current:UserModule;
  @Input() otherUser:UserModule;
  @Output() messageEvent = new EventEmitter<number>();
  
  
  
  
  
  page:number;
  messages:Communication[];
  subscription:Subscription;
  imagePath:string;
  imageFolder="http://localhost/CommunicationsImages/";

  message:string;
  constructor(private service:CommunicationServiceService){
    this.imagePath=null;
    this.page=0;
    this.messages=[];
    this.message="";

  }

  ngOnInit(){

    console.log(this.otherUser.idUser);
    
    
    
    if(this.current.idUser<this.otherUser.idUser){
    this.service.myChannel="U"+this.current.idUser+"+U"+this.otherUser.idUser;
    }else
    this.service.myChannel="U"+this.otherUser.idUser+"+U"+this.current.idUser;
    console.log("aaaaaaaaaaaaaaaaaaaaaa"+this.service.myChannel+" " +this.current.idUser+" "+this.otherUser.idUser);
    this.connect();
 
   console.log("subscribed  to "+this.service.myChannel);
   this.getCommunicationsByUsers();

  this.subscription=this.service.fonctionAppelee.subscribe((comunication:Communication)=>{
    
    if(comunication.sender!=null && comunication.reciever!=null){
      if((comunication.sender.idUser==this.current.idUser&&comunication.reciever.idUser==this.otherUser.idUser)
        ||(comunication.reciever.idUser==this.current.idUser&&comunication.sender.idUser==this.otherUser.idUser)){
      console.log("got heeereeee aaaaaaaaaa")
    this.handleMessage(comunication);
        }
  }
    
  })
  }

  

  connect(){
    this.service._connect();
  }
  disconnect(){
    this.service._disconnect();

  }

  //User///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //User///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //User///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //User///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //User///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //User///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //User///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //User///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getCommunicationsByUsers(){
    this.service.findBysenderAndReciever(this.current.idUser,this.otherUser.idUser,this.page).subscribe(response=>{
      if(this.messages.length==0){
        this.messages=response.content.reverse();
        setTimeout(() => {
          this.scrollToBottom();
        }, 10);
      }
      else{
        this.messages=response.content.reverse().concat(this.messages)
      }

    })
  }
  

  pagePlus(){
    this.page++;
    this.getCommunicationsByUsers();
  }

  
  scrollToBottom(){
    const element = this.htmlMessages.nativeElement;
    element.scrollTop=element.scrollHeight;
}


handleMessage(communication:Communication) {
  console.log("reee:: "+communication.message)
  this.messages.push(communication);
  console.log(this.messages)
  setTimeout(() => {
    this.scrollToBottom();
  }, 10);
}

sendMessage(){
  var  com:Communication=new Communication();
  com.sender=this.current;

  com.reciever=this.otherUser;
  
  
  com.message=this.message;
  com.imageSent=this.imagePath;
  
  

  this.service._send(com);
  
  this.message="";
  this.imagePath=null;

  
  
  
}


sendImage(event:any){
  console.log(event.target.files[0])
  this.service.uploadImage(event.target.files[0]).subscribe((path)=>{
    console.log(path+" aaa le path ");
    this.imagePath=path;
    this.message="An image is Sent";
    this.sendMessage();

  })
}




  //User///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //User///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //User///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //User///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //User///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //User///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //User///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //User///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
seenMessages(){
      
  this.service.setSeenCommunicationOneToOne(this.otherUser.idUser,this.current.idUser).subscribe(res=>{
    console.log("Server response to Seen:: "+res)
  });

  this.messages.forEach(communication=>{
    if(communication.sender.idUser!=this.current.idUser){
    communication.seen=true;
    }
  })
}

activeSeen(){
  this.seenMessages();
}

ngOnDestroy(){
  this.service._disconnect();
}
goToCommunityChat() {
  this.messageEvent.emit(0);
  this.disconnect();
  }

  elToTextArea:boolean=false;
  updateCom:number=0;
  
  updateHtml(comId: number) {
   
    
    this.elToTextArea=true;
    this.updateCom=comId;

    
    }




    deleteHtml(comId:number){
      const index = this.messages.findIndex(message => message.id === comId);
      if (index !== -1) {
        this.messages.splice(index, 1);
      }
      this.service.deleteCommunication(comId).subscribe(res=>{
        console.log('Communication deleted:: '+comId);
        
        
      },
      error=>{
        console.error(error)
      });
     

    }

    cancelUpdate(){
      this.elToTextArea=false;
      this.updateCom=0;
    }
    updateMessage(com:Communication,value:string){
      const index = this.messages.findIndex(message => message.id === com.id);
      com.message=value;

      
      if (index !== -1) { 
        
        this.messages[index]=com;
      }

      this.service.updateCommunication(com,com.id).subscribe(res=>{
        console.log("Communication Updated ::"+com.id);
        this.elToTextArea=false;
        this.updateCom=0;
      },error=>{
        console.log("Backend Error:: "+error);
        this.elToTextArea=false;
        this.updateCom=0;
      })


    }

    



























    
}
