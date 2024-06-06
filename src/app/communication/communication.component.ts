import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { CommunicationServiceService } from '../Services/communication-service.service';



import { Subscription } from 'rxjs';
import { Communication } from '../Model/Communication';


import { Community } from '../Model/Community';
import { CommunityServiceService } from '../Services/community-service.service';
import { ERole, Gender, UserModule } from '../Models/user.module';






@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.css']
})
export class CommunicationComponent implements AfterViewInit {
 


  @ViewChild('messagesList') htmlMessages:ElementRef; 
  @ViewChild('MessageInput') messageInput:ElementRef;



  @Input() idFromParent:number;
  @Input() communityMembers:UserModule[];
  @Input( ) currentUser:UserModule;
  @Output() messageEvent = new EventEmitter<UserModule>();
  @Output() event=new EventEmitter<string>();
  
 
  
  


  subscription:Subscription;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
page:number;
//bd old messages
messages:Communication[]=[];
//Community name waiting for session

//Community members
members:UserModule[]  // User[]=[]

// Sending message

message:string="";

//Message resieved 


communityId:number;
community:Community=new Community();
goToOne:number;

//videChat variable
chatUrl:string;
video: boolean;

imagePath:string;
imageFolder="http://localhost/CommunicationsImages/";

constructor(private service:CommunicationServiceService,private comService:CommunityServiceService ){

    

    this.page=0;
    this.members=[];
    this.goToOne=0;
    this.video=false;
    this.imagePath=null;
    
    
   

  }
  ngAfterViewInit(): void {
  
    this.scrollToBottom();
    



  }

  scrollToBottom(){
    
    
      const element = this.htmlMessages.nativeElement;
      element.scrollTop=element.scrollHeight;
     
    
  }



  pagePlus() {
    this.page=this.page+1;
    this.getAllCommunicationByCommunity();
    }







 

ngOnInit(){
  
  
console.log("cureent com "+this.currentUser.idUser+"current input "+this.currentUser.idUser)

  this.communityId=this.idFromParent;
  this.service.myChannel="C"+this.communityId;
  
  this.community.id=this.communityId;

 
  this.connect();
  this.getAllCommunicationByCommunity();
  this.getMembres();
  this.subscription=this.service.fonctionAppelee.subscribe((comunication:Communication)=>{
    console.log(comunication)
    if(comunication.community!=null&&comunication.community.id==this.communityId){
    this.handleMessage(comunication);
  }
    
  })
  
  
}





  getAllCommunicationByCommunity(){
    
    this.service.findByCommunity(this.communityId,this.page).subscribe(response=>{
      if(this.messages.length==0){
      this.messages=response.content.reverse();
      
      setTimeout(() => {
        this.scrollToBottom();
      }, 10);
      }else{
        this.messages=response.content.reverse().concat(this.messages)
      }
     

    })
  }


  handleMessage(communication:Communication) {
    console.log("reee:: "+communication.message+"length"+communication.message.length)

    this.messages.push(communication);
    

    console.log(this.messages)
    setTimeout(() => {
      this.scrollToBottom();
    }, 10);
  }
 

  connect(){
    this.service._connect();
  }

  disconnect(){
    this.service._disconnect();
    this.subscription.unsubscribe();
  }

  
  sendMessage(){
    var com:Communication=new Communication();
    com.sender=this.currentUser;
    
    
    com.message=this.message;
    com.community=this.community;
    com.imageSent=this.imagePath;

    

    
    this.service._send(com);
    
    this.message="";
    this.imagePath=null;
     
  }


  getMembres(){
    this.comService.getCommunityMembers(this.communityId).subscribe(response=>{
      this.members=response;
      console.log("got members "+response);
    },error=>{
      console.error("an error ocured ");
    })
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
        com.community=this.community
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

    seenMessages(){
      
      this.service.seenComunication(this.communityId,this.currentUser.idUser).subscribe(res=>{
        console.log(this.communityId,this.currentUser.idUser)
      });

      this.messages.forEach(communication=>{
        if(communication.sender.idUser!=this.currentUser.idUser){
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


    
    goToOneToOne(user:UserModule) {
      this.messageEvent.emit(user);
      this.disconnect();
      }


      goToVideoChat(){
        this.chatUrl=window.location.origin +window.location.pathname +'/videoChat'+'?roomID=' +this.communityId;
        this.message="a video call message";
        this.sendMessage()
        this.event.emit(this.chatUrl);
        
        
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
















       
    


      

}
