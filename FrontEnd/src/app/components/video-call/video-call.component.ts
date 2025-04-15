import { AfterViewInit, Component } from '@angular/core';
declare const ZegoUIKitPrebuilt: any;
@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css']
})
export class VideoCallComponent implements AfterViewInit {

  async ngAfterViewInit() {
    await this.loadZegoScript();

    // @ts-ignore
    const roomID = this.getRoomIDFromURL() || Math.floor(Math.random() * 10000) + "";
    // @ts-ignore
    const userID = Math.floor(Math.random() * 10000) + "";
    const userName = "user" + userID;
    // @ts-ignore
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      1548379652,
      "cc3dd205e826d20b6fb55694812e3e10",
      roomID,
      userID,
      userName
    );

    // @ts-ignore
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    const container = document.querySelector("#root");

    if (container) {
      zp.joinRoom({
        container,
        sharedLinks: [{
          name: 'Personal link',
          url: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID,
        }],
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: true,
        showTextChat: true,
        showUserList: true,
        maxUsers: 2,
        layout: "Auto",
        showLayoutButton: false,
      });
    } else {
      console.error('❌ #root introuvable.');
    }
  }

  getRoomIDFromURL(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('roomID');
  }

  loadZegoScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[src*="zego-uikit-prebuilt"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@zegocloud/zego-uikit-prebuilt/zego-uikit-prebuilt.js';
        script.onload = () => {
          console.log("✅ Script Zego chargé");
          resolve();
        };
        script.onerror = (error) => reject(error);
        document.body.appendChild(script);
      } else {
        resolve(); // déjà chargé
      }
    });
  }
}
