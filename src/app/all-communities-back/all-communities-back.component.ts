import { Component } from '@angular/core';
import { CommunityServiceService } from '../Services/community-service.service';
import { Community } from '../Model/Community';

@Component({
  selector: 'app-all-communities-back',
  templateUrl: './all-communities-back.component.html',
  styleUrls: ['./all-communities-back.component.css']
})
export class AllCommunitiesBackComponent {



  page:number;
  sizePage:number;
  booltest:number;
  constructor(private service:CommunityServiceService){
    this.page=0;
    this.sizePage=5;
    this.booltest=0;
  }
  communities:Community[];
  

  ngOnInit(){
    this.getAllCommunities();
  }


  getAllCommunities(){
    this.service.getAllComunity(this.page,this.sizePage).subscribe((res)=>{
      if(res.numberOfElements!=0){
      this.communities=res.content;
      } 
      if (res.numberOfElements==0&& this.page>0){

        this.booltest=1;
        setTimeout(() => {
         this.booltest=0;
        }, 1000);
      }
      if (res.numberOfElements==0&& this.page==0){
        this.booltest=2;
      }

    })

  }



  nextPage(){
    this.page++;
    this.getAllCommunities();
  }

  previousPage(){
    if(this.page>0){
    this.page--;
    this.getAllCommunities();
    }
  }



  pageSize(pageSize:number) {
    this.pageSize(pageSize);
    this.getAllCommunities();
    
    }


    deleteCommunity(communityId: Number) {
     this.service.deleteComunity(communityId).subscribe(res=>{
      this.ngOnInit();
     })
      }

}
