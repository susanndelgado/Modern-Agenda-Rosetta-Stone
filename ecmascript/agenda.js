fetch("../data/agenda-data.json")
  .then((response) => response.json())
  .then((data) => renderAgenda(data))
  .catch((error) => console.error("Agenda load failed:", error));


function renderAgenda(data) {
  const agenda = document.getElementById("agenda");

  const days = data.reduce((groupedDays, session) => {
    const date = session.session_date;

    if (!groupedDays[date]) {
      groupedDays[date] = {
        name: session.name,
        sessions: []
      };
    }

    groupedDays[date].sessions.push(session);

    return groupedDays;
  }, {});


  agenda.innerHTML = Object.values(days)
    .map((day, index) => `
      <details
        class="panel glass agenda-day"
        ${index === 0 ? "open" : ""}
      >
        <summary class="day-heading cluster">
          <span class="date">${day.name}</span>
          <span
            class="day-toggle"
            aria-hidden="true"
          ></span>
        </summary>

        <div class="day-body stack">
          ${day.sessions
            .map((session) => renderSession(session))
            .join("")}
        </div>
      </details>
    `)
    .join("");
}


function renderSession(session) {
  return `
    <section class="session stack">

      <header class="session-heading split">

        <div class="stack stack--tight">
          <p class="label">
            ${session.session_type}
          </p>

          <h2>
            ${session.session_category}
          </h2>
        </div>

        <div class="session-place meta">
          <span>${session.location}</span>
          <span>${session.venue}</span>
        </div>

      </header>


      <div class="cluster">

        ${session.specialties
          .map((specialty) => `
            <span class="tag">
              ${specialty}
            </span>
          `)
          .join("")}

        ${
          session.accreditation
            ? `
              <span class="tag tag--accent">
                ${session.accreditation}
              </span>
            `
            : ""
        }

      </div>


      <p class="faculty">
        <span class="faculty-label">
          Moderators
        </span>

        ${session.moderator.lecturers.join(" · ")}
      </p>


      ${session.sections
        .map((section) => renderSection(section))
        .join("")}

    </section>
  `;
}


function renderSection(section) {
  return `
    <article class="section stack stack--tight">

      <header class="section-heading split">

        <div>
          <p class="time">
            ${section.time_start}–${section.time_end}
          </p>

          <h3>
            ${section.name}
          </h3>
        </div>


        <p class="faculty faculty--compact">
          <span class="faculty-label">
            Chair
          </span>

          ${section.moderator.lecturers.join(" · ")}
        </p>

      </header>


      ${
        section.segments.length
          ? renderSegments(section.segments)
          : ""
      }


      ${section.subsections
        .map((subsection) => renderSubsection(subsection))
        .join("")}

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
          ${subsection.name}
        </h4>

      </header>


      ${renderSegments(subsection.segments)}

    </section>
  `;
}


function renderSegments(segments) {
  return `
    <div class="segment-list">

      ${segments
        .map((segment) => `
          <div class="segment">

            <time class="segment-time">
              ${segment.time_start}
            </time>

            <div class="segment-content">

              <h4>
                ${segment.name}
              </h4>

              <p class="faculty">
                ${segment.moderator.lecturers.join(" · ")}
              </p>

            </div>

          </div>
        `)
        .join("")}

    </div>
  `;
}