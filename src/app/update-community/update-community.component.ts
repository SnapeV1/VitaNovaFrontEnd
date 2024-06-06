import { Component } from '@angular/core';
import { CommunityServiceService } from '../Services/community-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModule } from '../Model/user/user.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Community } from '../Model/Community';

@Component({
  selector: 'app-update-community',
  templateUrl: './update-community.component.html',
  styleUrls: ['./update-community.component.css']
})
export class UpdateCommunityComponent {

  error:string;
  constructor(private service:CommunityServiceService,private router:Router,private ac:ActivatedRoute){
    this.router=router;
    this.error="";
    
  }

  current:UserModule;
  community:Community;

  myForm: FormGroup;

  ngOnInit(){
    this.myForm=new FormGroup({
      
      communityName: new FormControl('', [Validators.required]),
      
      description:new FormControl('',[Validators.required]),
   
    
   
  });
    this.findCommunity();

  }
  intializeForm(){
    this.communityName.setValue(this.community.communityName);
    this.description.setValue(this.community.description);
    
  
  }



    get communityName(){
      return this.myForm.get('communityName');
    }




    get description(){
      return this.myForm.get('description');
    }




    findCommunity(){
      this.service.getComunity(parseInt( this.ac.snapshot.paramMap.get('id'))).subscribe(result=>{
        this.community=result;
        
        this.intializeForm();
      },
      error=>{
        console.error("Community Not Found!",error)
      })
    }


    updateCommunity() {
      this.community.communityName=this.communityName.value;
      this.community.description=this.description.value;

      this.service.updateCommunity(this.community,this.community.id).subscribe(result=>{
        this.myForm.reset();
        this.router.navigateByUrl("/vitaNova/community");
      },
      error=>{
        console.error('BackEnd error while adding community:',error);

        if (error && error.error && Object.keys(error.error).length > 1) {
          // Accédez à la deuxième erreur
          const secondError = Object.values(error.error)[1];
          this.error=secondError.toString();
          
        } 
      }
      )
      }


      clearError(){
        this.error="";
      }

}
