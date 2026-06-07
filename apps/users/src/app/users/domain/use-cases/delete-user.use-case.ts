import { Observable, throwError } from 'rxjs';

export class DeleteUserUseCase {
  execute(_id: string): Observable<void> {
    return throwError(() => new Error('deleteUser is not supported by the API.'));
  }
}
