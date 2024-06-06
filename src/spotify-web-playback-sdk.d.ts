declare module 'spotify-web-playback-sdk' {
    class Player {
      constructor(options: any);
      addListener(event: string, listener: Function): void;
      removeListener(event: string, listener: Function): void;
      connect(): void;
      disconnect(): void;
      // Add other methods and properties as needed
    }
   
    export default Player;
  }