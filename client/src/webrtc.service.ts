export class WebRTCService {
  private peerConnection: RTCPeerConnection;

  constructor() {
    const configuration: RTCConfiguration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    this.peerConnection = new RTCPeerConnection(configuration);
  }

  async makeOffer() {
    const offer = await this.peerConnection.createOffer();
    return offer;
  }

  async makeAnswer() {
    const answer = await this.peerConnection.createAnswer();
    return answer;
  }

  async setRemoteOffer(offer: RTCSessionDescriptionInit) {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  }

  async setLocalOffer(offer: RTCSessionDescriptionInit) {
    await this.peerConnection.setLocalDescription(offer);
  }
  
  async getMediaStream() {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    mediaStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, mediaStream);
    });
    return mediaStream;
  }
  
  onStream(cb: (media: MediaStream) => void ) {
    this.peerConnection.ontrack = function ({ streams: [stream] }) {
      console.log(stream)
      cb(stream);
    };
  }
}