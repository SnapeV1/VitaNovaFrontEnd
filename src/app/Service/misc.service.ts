import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import SpotifyWebApi from 'spotify-web-api-js';

@Injectable({
  providedIn: 'root'
})
export class MiscService {
  private clientSecret = '04d7a9d06d2246968ec07e1621dc7688';
  private baseUrl: string = 'http://localhost:8081/api';
  private clientId = 'e50a63e1054f4b3da4c242ffbcb74542';
  private redirectUri = 'http://localhost:4200/vitaNova/profile';
  private scopes = ['user-read-private', 'user-read-email'];
  public accessToken: string | null = null;
  public spotifyApi = new SpotifyWebApi();
  playlists: any;
  playlistsUpdated: EventEmitter<any[]> = new EventEmitter<any[]>();
ipadress:string;
  constructor(private http: HttpClient) {

  }

  loginSpotify(): void {
    const authWindow = window.open(
      `https://accounts.spotify.com/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${encodeURIComponent(this.scopes.join(' '))}`,
      '_blank'
    );

    if (authWindow) {
      authWindow.addEventListener('beforeunload', () => {
        this.spotifyApi.setAccessToken(null);
      });

      authWindow.addEventListener('load', () => {
        const url = new URL(authWindow.location.href);
        const code = url.searchParams.get('code');

        if (code) {
          this.requestAccessToken(code);
          authWindow.close(); // Close the authentication window after a successful authorization

        }
      });
    } else {
      console.error('Failed to open Spotify authentication window');
    }
    console.log(this.spotifyApi)
  }

  private requestAccessToken(code: string): void {
    const params = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('redirect_uri', this.redirectUri);

    const headers = new HttpHeaders({
      'Authorization': `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    this.http.post<any>(this.tokenEndpoint, params.toString(), { headers }).subscribe(
      response => {
        if (response && response['access_token']) {
          this.accessToken = response['access_token'];
          this.spotifyApi.setAccessToken(this.accessToken);
          this.loadPlaylists();
          sessionStorage.setItem("accessToken", this.accessToken); // Set access token in session storage
          console.log("Access token:", this.accessToken);
          
        } else {
          console.error('Access token not found in the response.');
        }
      },
      error => {
        console.error(`Error getting access token: ${error}`);
      }
    );
  }    

  public get tokenEndpoint(): string {
    return 'https://accounts.spotify.com/api/token';
  }

  private loadPlaylists(): void {
    if (!this.accessToken) {
      console.error('Access token is missing.');
      return;
    }
  
    this.spotifyApi.getUserPlaylists().then(
      (response: any) => {
        this.playlists = response.items;
        this.playlistsUpdated.emit(this.playlists); // Emit the event after updating playlists
      },
      (error: any) => {
        console.error('Error fetching playlists:', error);
      }
    );
  

    this.spotifyApi.getUserPlaylists().then(
      (response: any) => {
        this.playlists = response.items;
      },
      (error: any) => {
        console.error('Error fetching playlists:', error);
      }
    );
  }

  playPlaylist(playlistId: string): void {
    console.log('Playing playlist with ID:', playlistId);
    alert(`Playlist with ID ${playlistId} is now playing.`);
  }

  checkIpAddress(username: string,ip:string): Observable<boolean> {
    console.log("adresse : " , ip)
    return this.http.get<boolean>(`${this.baseUrl}/CheckIpAddress?username=${username}&ipAdress=${ip}`);
  }

  encrypt(value: string, key: string): string {
    const keyWordArray = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.TripleDES.encrypt(value, keyWordArray, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  }
  private apiUrl = 'http://localhost:8081/RestController/search-image'; // Assuming this is the relative path to your endpoint


  searchImage(query: string, page: number = 1): Observable<{ url: string }> { // Specify the return type
    const params = {
      query: query,
      page: page.toString()
    };

    return this.http.get<{ url: string }>(this.apiUrl, { params: params }); // Return type should match the expected response
  }



  getWANIPAddress(): Observable<string> {
    const url = 'https://api.ipify.org';

    return this.http.get(url, { responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error('Error retrieving WAN IP address:', error);
          return throwError('Unable to retrieve WAN IP address');
        })
      );
  }

}
