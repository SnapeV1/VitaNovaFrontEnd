import { Community } from "./Community";


export enum ChallengeType{
    WATER,
    CALORIES
}

export enum ChallengeCompare{
    MORE,
    LESS

}


export class Challenges
{

    id:number;

    name:string;

    creationDate:Date;

    active:boolean;

    description:string;

    goal:number;
    type:ChallengeType;

    compare:ChallengeCompare;

    community:Community;



}