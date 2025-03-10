declare global {
  interface Window {
    JitsiMeetExternalAPI: typeof JitsiMeetExternalAPI;
  }
}

declare class JitsiMeetExternalAPI {
  constructor(
    domain: string,
    options: {
      roomName: string;
      width?: number | string;
      height?: number | string;
      parentNode?: HTMLElement;
    }
  );

  addEventListener(event: string, callback: (...args: any[]) => void): void;
  removeEventListener(event: string): void;
  executeCommand(command: string, ...args: any[]): void;
  dispose(): void;
}

export {};
