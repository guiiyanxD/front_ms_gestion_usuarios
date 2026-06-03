import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../auth/state/auth.store';

interface MenuItem {
  readonly label: string;
  readonly path: string;
  readonly roles?: ReadonlyArray<string>; // si está vacío/ausente, visible para todos
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly store = inject(AuthStore);

  readonly user = this.store.currentUser;
  readonly roles = this.store.roles;

  private readonly allItems: MenuItem[] = [
    { label: 'Perfil', path: '/profile' },
    { label: 'Roles', path: '/roles', roles: ['superadmin', 'admin'] },
    { label: 'Usuarios', path: '/users', roles: ['superadmin', 'admin'] },
    { label: 'Activos Fijos', path: '/activos-fijos', roles: ['superadmin', 'admin'] },
  ];

  // Menú visible: filtra los items según los roles del usuario actual.
  readonly visibleItems = computed(() => {
    const userRoles = this.roles();
    return this.allItems.filter(
      (item) => !item.roles || item.roles.some((r) => userRoles.includes(r))
    );
  });

  onLogout(): void {
    this.store.logout();
  }
}