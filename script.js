// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        } else {
            console.warn('Target not found:', this.getAttribute('href'));
        }
    });
});

// Update times
function updateTimes() {
    const now = new Date();

    // Update date
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    document.getElementById('current-date').textContent = `Date: ${dateString}`;

    // Philippines time (Manila, UTC+8)
    const philippinesTime = now.toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('philippines-time').textContent = `Philippines Time: ${philippinesTime}`;

    // Australia time (Sydney, UTC+10)
    const australiaTime = now.toLocaleString('en-US', {
        timeZone: 'Australia/Sydney',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('australia-time').textContent = `Australia Time: ${australiaTime}`;

    // Property-specific Australian times
    // Port Adelaide (South Australia - ACST UTC+9:30)
    const portAdelaideTime = now.toLocaleString('en-US', {
        timeZone: 'Australia/Adelaide',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('port-adelaide-time').textContent = `Local Time: ${portAdelaideTime} (ACST)`;

    // Warrnambool (Victoria - AEST UTC+10)
    const warrnamboolTime = now.toLocaleString('en-US', {
        timeZone: 'Australia/Melbourne',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('warrnambool-time').textContent = `Local Time: ${warrnamboolTime} (AEST)`;

    // Whyalla (South Australia - ACST UTC+9:30)
    const whyallaTime = now.toLocaleString('en-US', {
        timeZone: 'Australia/Adelaide',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('whyalla-time').textContent = `Local Time: ${whyallaTime} (ACST)`;

    // Melbourne (Victoria - AEST UTC+10)
    const melbourneTime = now.toLocaleString('en-US', {
        timeZone: 'Australia/Melbourne',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('melbourne-time').textContent = `Local Time: ${melbourneTime} (AEST)`;
}

// Update times every second
setInterval(updateTimes, 1000);
updateTimes(); // Initial call

function renderSmallCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    const monthNames = [
        'January','February','March','April','May','June','July','August','September','October','November','December'
    ];

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendar = document.getElementById('small-calendar');
    if (!calendar) return;

    let html = `<h5>${monthNames[month]} ${year}</h5>`;
    html += '<div class="calendar-grid">';
    ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(weekday => {
        html += `<div class="day-name">${weekday}</div>`;
    });

    for (let i = 0; i < firstDay; i++) {
        html += '<div class="day-cell"></div>';
    }

    for (let date = 1; date <= daysInMonth; date++) {
        const todayClass = date === day ? 'day-cell today' : 'day-cell';
        html += `<div class="${todayClass}">${date}</div>`;
    }

    html += '</div>';
    calendar.innerHTML = html;
}

renderSmallCalendar();

function renderAustraliaEvents() {
    const events = [
        { date: 'Jan 26', name: 'Australia Day' },
        { date: 'Mar 10', name: 'Labour Day (VIC/SA/ACT)' },
        { date: 'Apr 25', name: 'ANZAC Day' },
        { date: 'Dec 25', name: 'Christmas Day' },
        { date: 'Dec 26', name: 'Boxing Day' },
        { date: 'Nov 11', name: 'Melbourne Cup Day' },
        { date: 'Jan 1', name: 'New Year’s Day' },
        { date: 'Jun 10', name: 'King’s Birthday (most states)' }
    ];

    const now = new Date();
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    const monthLookup = { 'Jan':0,'Feb':1,'Mar':2,'Apr':3,'May':4,'Jun':5,'Jul':6,'Aug':7,'Sep':8,'Oct':9,'Nov':10,'Dec':11 };
    const currentMonth = now.getMonth();

    const monthlyEvents = events
        .map(e => {
            const [m, d] = e.date.split(' ');
            return {
                ...e,
                month: monthLookup[m],
                day: parseInt(d, 10)
            };
        })
        .filter(e => e.month === currentMonth)
        .sort((a, b) => a.day - b.day);

    const list = document.getElementById('australia-event-list');
    if (!list) return;

    list.innerHTML = '';

    if (monthlyEvents.length === 0) {
        const fallback = events.map(e => ({
            month: monthLookup[e.date.split(' ')[0]],
            day: parseInt(e.date.split(' ')[1], 10),
            name: e.name,
            display: e.date
        }))
        .map(e => {
            let year = now.getFullYear();
            const cand = new Date(year, e.month, e.day);
            if (cand < now) year += 1;
            return { ...e, dateObj: new Date(year, e.month, e.day) };
        })
        .sort((a, b) => a.dateObj - b.dateObj)
        .slice(0, 5);

        const notice = document.createElement('li');
        notice.textContent = 'No holidays/events this month; here are the nearest upcoming ones:';
        notice.style.fontStyle = 'italic';
        notice.style.marginBottom = '0.2rem';
        list.appendChild(notice);

        fallback.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.display} - ${item.name}`;
            list.appendChild(li);
        });
        return;
    }

    monthlyEvents.forEach(item => {
        const li = document.createElement('li');
        const isToday = item.day === now.getDate();
        li.textContent = `${item.date} - ${item.name}` + (isToday ? ' (Today)' : '');
        if (isToday) li.style.fontWeight = '700';
        list.appendChild(li);
    });
}

renderAustraliaEvents();