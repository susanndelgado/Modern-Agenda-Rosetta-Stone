import { Component, OnInit } from '@angular/core';

import { AgendaDay, AgendaSession } from './agenda.model';
import { AgendaService } from './agenda.service';

@Component({
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {

  agendaSessions: AgendaSession[] = [];
  agendaDays: AgendaDay[] = [];

  constructor(private agendaService: AgendaService) {}

  ngOnInit() {
    this.loadAgenda();
  }

  loadAgenda() {

    this.agendaService
      .getAgenda()
      .subscribe(data => {

        this.agendaSessions = data;

        const grouped = data.reduce<AgendaDay[]>((days, session) => {

          const existingDay = days.find(
            day => day.date === session.session_date
          );

          if (existingDay) {

            existingDay.sessions.push(session);

          } else {

            days.push({
              date: session.session_date,
              day: session.session_day,
              name: session.name,
              sessions: [session]
            });

          }

          return days;

        }, []);

        this.agendaDays = grouped;

      });

  }

}