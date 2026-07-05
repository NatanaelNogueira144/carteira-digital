const ACCESS_TOKEN_KEY = "@carteira-digital:access-token";

export const tokenService = {
  get(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  set(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  remove(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
  has(): boolean {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  },
};