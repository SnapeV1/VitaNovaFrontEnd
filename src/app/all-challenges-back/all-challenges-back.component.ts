import { Component } from '@angular/core';
import { ChallengesService } from '../Services/challenges.service';
import { Challenges } from '../Model/Challenges';

@Component({
  selector: 'app-all-challenges-back',
  templateUrl: './all-challenges-back.component.html',
  styleUrls: ['./all-challenges-back.component.css']
})
export class AllChallengesBackComponent {

  constructor(private service:ChallengesService){}

  page:number=0;
  challenges:Challenges[]=[];


  ngOnInit(){
    this.getAlllChallenges();
  }




  getAlllChallenges(){
    this.service.findAllChallenges(this.page).subscribe(res=>{this.challenges=res.content;
    console.log(res.content);
    })
  }

  nextPage(){
    this.page++;
    this.getAlllChallenges();
  }

  previousPage(){
    if(this.page>0){
    this.page--;
    this.getAlllChallenges();
    }
  }




}
