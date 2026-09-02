<?php

// ------------------------------------------------------------
// LOAD DATA
// ------------------------------------------------------------

$dataFile = __DIR__ . '/../data/agenda-data.json';

$json = file_get_contents($dataFile);

if ($json === false) {
    die('Could not load agenda data.');
}

$sessions = json_decode($json, true);

if (!is_array($sessions)) {
    die('Agenda data is invalid.');
}


// ------------------------------------------------------------
// GROUP SESSIONS BY DATE
// ------------------------------------------------------------

$agendaDays = [];

foreach ($sessions as $session) {

    $date = $session['session_date'];

    if (!isset($agendaDays[$date])) {

        $agendaDays[$date] = [
            'date' => $session['session_date'],
            'day' => $session['session_day'],
            'name' => $session['name'],
            'sessions' => []
        ];

    }

    $agendaDays[$date]['sessions'][] = $session;
}


// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

function e(string $value): string
{
    return htmlspecialchars(
        $value,
        ENT_QUOTES,
        'UTF-8'
    );
}


function lecturers(array $moderator): string
{
    return implode(
        ' · ',
        $moderator['lecturers'] ?? []
    );
}

?>

<!doctype html>

<html lang="en">

<head>

    <meta charset="utf-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
    >

    <title>Modern Agenda — PHP</title>

    <link
        rel="stylesheet"
        href="../css/agenda.css"
    >

</head>


<body>

<main class="page">

    <section
        class="agenda stack"
        aria-labelledby="agenda-title"
    >


        <header class="agenda-header cluster">

            <div class="stack stack--tight">

                <p class="label">
                    Conference Program
                </p>

                <h1 id="agenda-title">
                    Modern Agenda
                </h1>

                <p class="meta">
                    North Harbor Conference Center · October 17–20, 2026
                </p>

            </div>

            <p class="notice">
                Agenda is subject to change.
            </p>

        </header>


        <?php

        $firstDay = true;

        foreach ($agendaDays as $day):

        ?>


            <details
                class="panel glass agenda-day"
                <?= $firstDay ? 'open' : '' ?>
            >

                <summary class="day-heading cluster">

                    <span class="date">
                        <?= e($day['name']) ?>
                    </span>

                    <span
                        class="day-toggle"
                        aria-hidden="true"
                    ></span>

                </summary>


                <div class="day-body stack">


                    <?php foreach ($day['sessions'] as $session): ?>


                        <section class="session stack">


                            <header class="session-heading split">

                                <div class="stack stack--tight">

                                    <p class="label">
                                        <?= e($session['session_type']) ?>
                                    </p>

                                    <h2>
                                        <?= e($session['session_category']) ?>
                                    </h2>

                                </div>


                                <div class="session-place meta">

                                    <span>
                                        <?= e($session['location']) ?>
                                    </span>

                                    <span>
                                        <?= e($session['venue']) ?>
                                    </span>

                                </div>

                            </header>


                            <div class="cluster">

                                <?php foreach ($session['specialties'] as $specialty): ?>

                                    <span class="tag">
                                        <?= e($specialty) ?>
                                    </span>

                                <?php endforeach; ?>


                                <span class="tag tag--accent">
                                    <?= e($session['accreditation']) ?>
                                </span>

                            </div>


                            <p class="faculty">

                                <span class="faculty-label">
                                    Moderators
                                </span>

                                <?= e(lecturers($session['moderator'])) ?>

                            </p>


                            <?php foreach ($session['sections'] as $section): ?>


                                <article class="section stack stack--tight">


                                    <header class="section-heading split">

                                        <div>

                                            <p class="time">

                                                <?= e($section['time_start']) ?>
                                                –
                                                <?= e($section['time_end']) ?>

                                            </p>

                                            <h3>
                                                <?= e($section['name']) ?>
                                            </h3>

                                        </div>


                                        <p class="faculty faculty--compact">

                                            <span class="faculty-label">
                                                Chair
                                            </span>

                                            <?= e(lecturers($section['moderator'])) ?>

                                        </p>

                                    </header>


                                    <?php if (!empty($section['segments'])): ?>


                                        <div class="segment-list">


                                            <?php foreach ($section['segments'] as $segment): ?>


                                                <div class="segment">

                                                    <time class="segment-time">

                                                        <?= e($segment['time_start']) ?>

                                                    </time>


                                                    <div class="segment-content">

                                                        <h4>
                                                            <?= e($segment['name']) ?>
                                                        </h4>

                                                        <p class="faculty">

                                                            <?= e(
                                                                lecturers(
                                                                    $segment['moderator']
                                                                )
                                                            ) ?>

                                                        </p>

                                                    </div>

                                                </div>


                                            <?php endforeach; ?>


                                        </div>


                                    <?php endif; ?>


                                    <?php foreach ($section['subsections'] as $subsection): ?>


                                        <section class="subsection stack stack--tight">


                                            <header class="subsection-heading">

                                                <p class="label">
                                                    Subsection
                                                </p>

                                                <h4>
                                                    <?= e($subsection['name']) ?>
                                                </h4>

                                            </header>


                                            <div class="segment-list">


                                                <?php foreach ($subsection['segments'] as $segment): ?>


                                                    <div class="segment">

                                                        <time class="segment-time">

                                                            <?= e($segment['time_start']) ?>

                                                        </time>


                                                        <div class="segment-content">

                                                            <h4>
                                                                <?= e($segment['name']) ?>
                                                            </h4>

                                                            <p class="faculty">

                                                                <?= e(
                                                                    lecturers(
                                                                        $segment['moderator']
                                                                    )
                                                                ) ?>

                                                            </p>

                                                        </div>

                                                    </div>


                                                <?php endforeach; ?>


                                            </div>


                                        </section>


                                    <?php endforeach; ?>


                                </article>


                            <?php endforeach; ?>


                        </section>


                    <?php endforeach; ?>


                </div>

            </details>


        <?php

        $firstDay = false;

        endforeach;

        ?>


        <p class="notice notice--footer">
            ** Agenda is subject to change.
        </p>


    </section>

</main>

</body>

</html>