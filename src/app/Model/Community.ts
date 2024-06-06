import { UserModule } from "../Models/user.module";



export class Community{
    id!:number;

    communityName!:string;
    description!:string;

    status!:boolean;

    chatChannel!:string;
   
    creationDate:Date;
    
    creator:UserModule;

    membres:UserModule[];


    

}