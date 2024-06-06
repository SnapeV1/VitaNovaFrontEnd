import { Component } from '@angular/core';
import { ChallengesService } from '../Services/challenges.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ChallengeCompare, ChallengeType, Challenges } from '../Model/Challenges';

@Component({
  selector: 'app-add-challenge',
  templateUrl: './add-challenge.component.html',
  styleUrls: ['./add-challenge.component.css']
})
export class AddChallengeComponent {

  challengeType=Object.keys(ChallengeType).filter(k => !isNaN(Number(ChallengeType[k])));
  challengeCompare=Object.keys(ChallengeCompare).filter(k => !isNaN(Number(ChallengeCompare[k])));
  communityId:number;
  object=Object;

  constructor(private service:ChallengesService,private router:Router,private ac:ActivatedRoute){}

  myForm: FormGroup;
  enumValidator(enumType: any): ValidatorFn {
    return (control: FormControl): {[key: string]: any} | null => {
      const valid = Object.values(enumType).includes(control.value);
      return valid ? null : { 'invalidEnumValue': { value: control.value } };
    };
  }

  ngOnInit(){
    this.myForm=new FormGroup({

        name: new FormControl('', [Validators.required]),

        description:new FormControl('',[Validators.required]),
        goal:new FormControl('',[Validators.required,Validators.pattern(/^\d+$/), Validators.min(10)]),
        type:new FormControl(ChallengeType.WATER,[Validators.required,this.enumValidator(ChallengeType)]),
        compare: new FormControl(ChallengeCompare.LESS,[this.enumValidator(ChallengeCompare)])


    });

    this.communityId=parseInt( this.ac.snapshot.paramMap.get('id'));
  }

  get name(){
    return this.myForm.get('name');
  }

  get description(){
    return this.myForm.get('description');
  }

  get goal(){
    return this.myForm.get('goal');
  }

  get type(){
    return this.myForm.get('type');
  }

  get compare(){
    return this.myForm.get('compare')
  }



  saveChallenge(){
    let challenge =new Challenges();

    challenge.name=this.name.value;
    challenge.description=this.description.value;
    challenge.goal=this.goal.value;
    challenge.type=this.type.value

    if(challenge.type==ChallengeType.CALORIES){
    challenge.compare=this.compare.value;
  }
    else{
      challenge.compare=ChallengeCompare.MORE;
    }
    this.service.addChallenge(challenge,this.communityId).subscribe(res=>{this.router.navigateByUrl('/vitaNova/community')},
    error=>{
      console.error('BackEnd error while adding challenge:',error);
    });
  }
  
}
