import { Injectable } from '@angular/core';

const SESSION_KEY = 'gestion.session';

interface StoredUser {
  id: string;
  username: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  private get storedUser(): StoredUser | null {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return (JSON.parse(raw) as { user: StoredUser }).user ?? null;
  }

  get userId(): string { return this.storedUser?.id ?? ''; }
  get username(): string { return this.storedUser?.username ?? ''; }
  get roles(): string[] { return this.storedUser?.roles ?? []; }

  isTecnico(): boolean { return this.roles.includes('TECNICO'); }
  isAdmin(): boolean {
    return this.roles.includes('SUPERADMIN') || this.roles.includes('GERENTE');
  }
}
