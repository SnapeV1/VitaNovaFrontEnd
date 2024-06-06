import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  spotifyPlayer: any;
  iframeElement: any;
  isSpotifyIframeApiInitialized = false;
  constructor(private http: HttpClient) {}

  checkScope(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>('https://api.spotify.com/v1/me', { headers });
  }

  searchTrack(trackName: string, artistName: string, token: string): Observable<string | null> {
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}%20artist:${encodeURIComponent(artistName)}&type=track&limit=1`;
    const headersSpotify = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(url, { headers: headersSpotify });
  }

  searchSongOrPlaylist(query: string, token: string): Observable<any> {
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,playlist&limit=10`;
    const headersSpotify = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(url, { headers: headersSpotify });
  }

  playTrack(uri: string) {
    if (this.isSpotifyIframeApiInitialized && this.iframeElement) {
      // @ts-ignore
      window.onSpotifyIframeApiReady = (IFrameAPI) => {
        const options = {
          uri: uri,
          height: 100,
          width: '90%'
        };
        IFrameAPI.changeOptions(this.iframeElement, options);
      };
    } else {
      console.error('Spotify Iframe API is not initialized or iframeElement does not exist');
    }
  }

  playPlaylist(uri: string) {
    const headersSpotify = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
    });
    const requestBody = {
      context_uri: uri
    };
    return this.http.put<any>('https://api.spotify.com/v1/me/player/play', requestBody, { headers: headersSpotify });
  }

  playSong(uri: string) {
    const headersSpotify = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
    });
    const requestBody = {
      uris: [uri]
    };
    return this.http.put<any>('https://api.spotify.com/v1/me/player/play', requestBody, { headers: headersSpotify });
  }

  createIFrame(trackUri: string): void {
    if (!this.isSpotifyIframeApiInitialized) {
      const iFrameScript = document.createElement('script');
      iFrameScript.src = 'https://open.spotify.com/embed-podcast/iframe-api/v1';
      iFrameScript.addEventListener('load', () => {
        this.iframeElement = document.getElementById('embed-iframe') as HTMLIFrameElement;
        const options = {
          uri: trackUri,
          height: 100,
          width: '90%'
        };
        
        // @ts-ignore
        window.onSpotifyIframeApiReady = (IFrameAPI)=> {
          IFrameAPI.createController(this.iframeElement, options, () => {
            this.isSpotifyIframeApiInitialized = true;
            this.iframeElement.setAttribute('allow', 'fullscreen; encrypted-media');
          });
        };
      });
      document.head.appendChild(iFrameScript);
    } else {
      console.log("going to playtrack ... ");
      // If the API is already initialized, just change the song
      this.playTrack(trackUri);
    }
  }
}