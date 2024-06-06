import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

// get token
function generateToken(tokenServerUrl: string, userID: string) {
  // Obtain the token interface provided by the App Server
  return fetch(
    `${tokenServerUrl}/access_token?userID=${userID}&expired_ts=7200`,
    {
      method: 'GET',
    }
  ).then((res) => res.json());
}

function randomID(len) {
  let result = '';
  if (result) return result;
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(
  url: string = window.location.href
): URLSearchParams {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}
@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css']
})
export class VideoChatComponent {

  //https://zegocloud-prebuilt-call-angular-aefemb.stackblitz.io/

  @ViewChild('root')
  root: ElementRef;

  @Input() cummunityId:number;
  @Input() url:string
  @Input() currentUserInfo:{userName:string, id:number}

  chatUrl:string;
  ngAfterViewInit() {
    
    const roomID = this.cummunityId.toString() ;//getUrlParams().get('roomID') || randomID(5);
    const userID = this.currentUserInfo.id.toString() ;//randomID(5); getUser from session
    const userName = this.currentUserInfo.userName//randomID(5);
    

    // generate token
    const appID = 405543930;
    const serverSecret = "da89d4f1f1bcaea6fd808679e2fcf228";
    generateToken('https://nextjs-token.vercel.app/api', userID).then((res) => {
      const token = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, userName);
      // create instance object from token
      const zp = ZegoUIKitPrebuilt.create(token);

      console.log(
        'this.root.nativeElement',
        this.root.nativeElement.clientWidth
      );
      // start the call
      this.chatUrl=window.location.origin +window.location.pathname +'?roomID=' +roomID //this.url;
      console.log(this.chatUrl+" aaaaaaaaaaaaaaa")
      zp.joinRoom({
        container: this.root.nativeElement,
        sharedLinks: [
          {
            name: 'Personal link',
            url:this.chatUrl,
            
              
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        },
      });
    });
  }

}
