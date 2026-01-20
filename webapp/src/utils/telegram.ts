declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

export class TelegramWebApp {
  private static instance: TelegramWebApp;
  public initDataUnsafe: any;
  public colorScheme: string;

  private constructor() {
    this.initDataUnsafe = window.Telegram?.WebApp?.initDataUnsafe || {};
    this.colorScheme = window.Telegram?.WebApp?.colorScheme || 'dark';
  }

  static getInstance(): TelegramWebApp {
    if (!TelegramWebApp.instance) {
      TelegramWebApp.instance = new TelegramWebApp();
    }
    return TelegramWebApp.instance;
  }

  expand() {
    window.Telegram?.WebApp?.expand?.();
  }

  setHeaderColor(color: string) {
    window.Telegram?.WebApp?.setHeaderColor?.(color);
  }

  setBackgroundColor(color: string) {
    window.Telegram?.WebApp?.setBackgroundColor?.(color);
  }

  sendData(data: any) {
    window.Telegram?.WebApp?.sendData?.(JSON.stringify(data));
  }

  close() {
    window.Telegram?.WebApp?.close?.();
  }

  openLink(url: string) {
    window.Telegram?.WebApp?.openLink?.(url);
  }

  showAlert(message: string) {
    window.Telegram?.WebApp?.showAlert?.(message);
  }

  showConfirm(message: string, callback: (ok: boolean) => void) {
    window.Telegram?.WebApp?.showConfirm?.(message, callback);
  }

  showPopup(
    params: {
      title?: string;
      message: string;
      buttons?: Array<{ id: string; text: string; type?: string }>;
    },
    callback?: (id: string) => void
  ) {
    window.Telegram?.WebApp?.showPopup?.(params, callback);
  }

  readTextFromClipboard(callback: (text: string) => void) {
    window.Telegram?.WebApp?.readTextFromClipboard?.(callback);
  }

  onEvent(eventType: string, callback: () => void) {
    window.Telegram?.WebApp?.onEvent?.(eventType, callback);
  }

  offEvent(eventType: string, callback: () => void) {
    window.Telegram?.WebApp?.offEvent?.(eventType, callback);
  }
}
