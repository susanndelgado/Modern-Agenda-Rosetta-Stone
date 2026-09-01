import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AgendaSession } from './agenda.model';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  constructor(private http: HttpClient) {}

  getAgenda() {
    return this.http.get<AgendaSession[]>('/data/agenda-data.json');
  }

}