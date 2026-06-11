import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../auth/state/auth.store';

interface ChildMenuItem {
  readonly label: string;
  readonly path: string;
}

interface MenuItem {
  readonly label: string;
  readonly path?: string;
  readonly roles?: ReadonlyArray<string>;
  readonly children?: ReadonlyArray<ChildMenuItem>;
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

  readonly openDropdown = signal<string | null>(null);

  private readonly allItems: MenuItem[] = [
    {
      label: 'Usuarios',
      roles: ['SUPERADMIN', 'GERENTE'],
      children: [
        { label: 'Perfil', path: '/profile' },
        { label: 'Roles', path: '/roles' },
        { label: 'Usuarios', path: '/users' },
      ],
    },
    { label: 'Activos Fijos', path: '/activos-fijos', roles: ['SUPERADMIN', 'GERENTE', 'TECNICO', 'ASISTENTE', 'OPERADOR'] },
    {
      label: 'Mantenimientos',
      roles: ['SUPERADMIN', 'GERENTE', 'TECNICO', 'OPERADOR'],
      children: [
        { label: 'Solicitudes pendientes', path: '/mantenimientos' },
        { label: 'Mis solicitudes', path: '/mantenimientos/mis-solicitudes' },
      ],
    },
    {
      label: 'Business Intelligence',
      roles: ['SUPERADMIN', 'GERENTE'],
      children: [
        { label: 'Estadísticas', path: '/estadisticas' },
        { label: 'Reportes', path: '/reportes' },
      ],
    },
  ];

  readonly visibleItems = computed(() => {
    const userRoles = this.roles();
    return this.allItems.filter(
      (item) => !item.roles || item.roles.some((r) => userRoles.includes(r))
    );
  });

  toggleDropdown(label: string): void {
    this.openDropdown.update((cur) => (cur === label ? null : label));
  }

  closeDropdown(): void {
    this.openDropdown.set(null);
  }

  onLogout(): void {
    this.store.logout();
  }
}
