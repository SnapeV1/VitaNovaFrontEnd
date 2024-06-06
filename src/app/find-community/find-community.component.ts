import { Component } from '@angular/core';
import { Community } from '../Model/Community';
import { CommunityServiceService } from '../Services/community-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../Service/auth.service';
import { UserModule } from '../Models/user.module';

@Component({
  selector: 'app-find-community',
  templateUrl: './find-community.component.html',
  styleUrls: ['./find-community.component.css']
})
export class FindCommunityComponent {

communities: Community[];
page:number;
myForm:FormGroup;
whereAmI:number;
test:number;
current:UserModule;
errorMessage:string;

constructor(private service:CommunityServiceService,private router:Router,private userService:AuthService){
  this.page=0;
  this.communities=[];
  this.test=0;
  this.current=new UserModule();
  this.errorMessage="";
}

ngOnInit(){
  this.getCurrentUser();
  this.myForm=new FormGroup({
    
      communityName: new FormControl('', []),
  });
  this.getAllCommunities();
}

get communityName(){
  return this.myForm.get('communityName');
}



getAllCommunities(){
  this.whereAmI=0;
  this.service.getCommunitiesOrderByChallenge(this.page).subscribe((res)=>{
    if(res.numberOfElements!=0){
    this.communities=res.content;
    }else{
      if(this.page>0){
        this.page--;
      }
    }
    

  })

}

getCommunityByName(){
  this.whereAmI=1;
  this.communities=[];
  this.service.getByNomComunity(this.communityName.value,this.page).subscribe(res=>{
    if(res.numberOfElements==0&&this.page==0){
      this.test=2;
      this.getAllCommunities();

    }else if(res.numberOfElements==0&&this.page>0){
      this.page--;
    }
    else{
    this.communities=res.content;
    }
  })
}

clickHandles(){
  if(this.communityName.value==''){
    this.getAllCommunities();
  }else{
    this.getCommunityByName();
  }
}



nextPage(){
  this.page++;
  if(this.whereAmI==1){
 
  this.getCommunityByName();}

  if(this.whereAmI==0){

    this.getAllCommunities();
  }

}

previousPage(){
  if(this.page>0){
  this.page--;
  if(this.whereAmI==1){
  this.getCommunityByName();
  }
  if(this.whereAmI==0){

    this.getAllCommunities();
  }
  }
}

com:Community
joinCommunity(communityId:number) {
  if(this.current.communities!=null){
    this.errorMessage="You can't join multiple community at once...";
  }else{
  this.service.addMemberToCommunity(this.current.idUser,communityId).subscribe(res=>{
    if(res)
      this.router.navigateByUrl("/vitaNova/community");
  })
}
  }

  getCurrentUser(){
    //cal user service get the user connected
    this.userService.getUserInfoFromToken().subscribe(res=>{
      this.current=res;
    });
      
      
      
  }

}
