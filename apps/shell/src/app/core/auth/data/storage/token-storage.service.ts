// core/auth/data/storage/token-storage.service.ts
import { Injectable } from '@angular/core';
import { Session } from '../../domain/models/session.model';

const KEY = 'gestion.session';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  save(session: Session): void {
    sessionStorage.setItem(KEY, JSON.stringify(session));
  }
  get(): Session | null {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  }
  getAccessToken(): string | null {
    return this.get()?.accessToken ?? null;
  }
  clear(): void {
    sessionStorage.removeItem(KEY);
  }
}