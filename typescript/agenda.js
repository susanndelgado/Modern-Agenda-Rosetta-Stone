"use strict";
fetch('../data/agenda-data.json')
    .then(response => {
    if (!response.ok) {
        throw new Error('Could not load agenda data.');
    }
    return response.json();
})
    .then(data => {
    const agendaDays = groupSessionsByDay(data);
    renderAgenda(agendaDays);
})
    .catch(error => {
    console.error(error);
});
function groupSessionsByDay(sessions) {
    return sessions.reduce((days, session) => {
        const existingDay = days.find(day => day.date === session.session_date);
        if (existingDay) {
            existingDay.sessions.push(session);
        }
        else {
            days.push({
                date: session.session_date,
                day: session.session_day,
                name: session.name,
                sessions: [session]
            });
        }
        return days;
    }, []);
}
function renderAgenda(days) {
    const container = document.querySelector('#agenda-days');
    if (!container) {
        return;
    }
    container.innerHTML = days
        .map((day, index) => renderDay(day, index === 0))
        .join('');
}
function renderDay(day, open) {
    return `
    <details
      class="panel glass agenda-day"
      ${open ? 'open' : ''}
    >

      <summary class="day-heading cluster">

        <span class="date">
          ${escapeHtml(day.name)}
        </span>

        <span
          class="day-toggle"
          aria-hidden="true"
        ></span>

      </summary>

      <div class="day-body stack">

        ${day.sessions
        .map(session => renderSession(session))
        .join('')}

      </div>

    </details>
  `;
}
function renderSession(session) {
    return `
    <section class="session stack">

      <header class="session-heading split">

        <div class="stack stack--tight">

          <p class="label">
            ${escapeHtml(session.session_type)}
          </p>

          <h2>
            ${escapeHtml(session.session_category)}
          </h2>

        </div>

        <div class="session-place meta">

          <span>
            ${escapeHtml(session.location)}
          </span>

          <span>
            ${escapeHtml(session.venue)}
          </span>

        </div>

      </header>

      <div class="cluster">

        ${session.specialties
        .map(specialty => `
              <span class="tag">
                ${escapeHtml(specialty)}
              </span>
            `)
        .join('')}

        <span class="tag tag--accent">
          ${escapeHtml(session.accreditation)}
        </span>

      </div>

      <p class="faculty">

        <span class="faculty-label">
          Moderators
        </span>

        ${escapeHtml(session.moderator.lecturers.join(' · '))}

      </p>

      ${session.sections
        .map(section => renderSection(section))
        .join('')}

    </section>
  `;
}
function renderSection(section) {
    return `
    <article class="section stack stack--tight">

      <header class="section-heading split">

        <div>

          <p class="time">
            ${escapeHtml(section.time_start)}
            –
            ${escapeHtml(section.time_end)}
          </p>

          <h3>
            ${escapeHtml(section.name)}
          </h3>

        </div>

        <p class="faculty faculty--compact">

          <span class="faculty-label">
            Chair
          </span>

          ${escapeHtml(section.moderator.lecturers.join(' · '))}

        </p>

      </header>

      ${renderSegments(section.segments)}

      ${section.subsections
        .map(subsection => renderSubsection(subsection))
        .join('')}

    </article>
  `;
}
function renderSubsection(subsection) {
    return `
    <section class="subsection stack stack--tight">

      <header class="subsection-heading">

        <p class="label">
          Subsection
        </p>

        <h4>
          ${escapeHtml(subsection.name)}
        </h4>

      </header>

      ${renderSegments(subsection.segments)}

    </section>
  `;
}
function renderSegments(segments) {
    if (segments.length === 0) {
        return '';
    }
    return `
    <div class="segment-list">

      ${segments
        .map(segment => `
            <div class="segment">

              <time class="segment-time">
                ${escapeHtml(segment.time_start)}
              </time>

              <div class="segment-content">

                <h4>
                  ${escapeHtml(segment.name)}
                </h4>

                <p class="faculty">
                  ${escapeHtml(segment.moderator.lecturers.join(' · '))}
                </p>

              </div>

            </div>
          `)
        .join('')}

    </div>
  `;
}
function escapeHtml(value) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
