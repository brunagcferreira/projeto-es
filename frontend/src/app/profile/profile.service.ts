import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface ProfileData {
  type: 'MENTOR' | 'MENTORADO' | 'UNKNOWN';
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8080';
  private profileTypeSubject = new BehaviorSubject<string>('UNKNOWN');
  public profileType$ = this.profileTypeSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getUserRoleFromToken(): string {
    const token = localStorage.getItem('token');
    if (!token) return 'UNKNOWN';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || 'UNKNOWN';
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return 'UNKNOWN';
    }
  }

  getCompleteProfile(): Observable<ProfileData> {
    const userRole = this.getUserRoleFromToken();
    this.profileTypeSubject.next(userRole);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    if (userRole === 'MENTOR') {
      return this.http.get(`${this.apiUrl}/mentor/me`, { headers }).pipe(
        map((data: any) => ({ type: 'MENTOR' as const, data })),
        catchError((error: any) => {
          console.error('Erro ao buscar perfil do mentor:', error);
          return of({ type: 'UNKNOWN' as const, data: null });
        })
      );
    } else if (userRole === 'MENTORADO') {
      return this.http.get(`${this.apiUrl}/mentored/me`, { headers }).pipe(
        map((data: any) => ({ type: 'MENTORADO' as const, data })),
        catchError((error: any) => {
          console.error('Erro ao buscar perfil do mentorado:', error);
          return of({ type: 'UNKNOWN' as const, data: null });
        })
      );
    } else {
      return of({ type: 'UNKNOWN' as const, data: null });
    }
  }

 updateMentorProfile(idMentor: number, data: any): Observable<any> {
   const token = localStorage.getItem('token');
   const headers = { Authorization: `Bearer ${token}` };
   return this.http.put(`${this.apiUrl}/mentor/${idMentor}`, data, { headers });
 }

updateMentoredProfile(data: any): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get(`${this.apiUrl}/mentored/me`, { headers }).pipe(
    switchMap((currentMentored: any) => {
      return this.http.put(`${this.apiUrl}/mentored/${currentMentored.id}`, data, { headers });
    })
  );
}

  getCurrentProfileType(): string {
    return this.profileTypeSubject.value;
  }
}