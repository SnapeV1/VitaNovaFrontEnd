import { UserModule } from "../Models/user.module";
import { Community } from "./Community";




export class Communication{

    id!:number;

    message!:string;

    sentDate!:Date;

    seen!:boolean;

    sender: UserModule;

    reciever: UserModule;

    community :Community;
    imageSent:string;
    

}