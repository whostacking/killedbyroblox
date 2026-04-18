(function() {
    const soonToDieIdioms = [
        'Sentenced to death',
        '"Off with their heads!"',
        'Kicking the bucket',
        'Dead as a doorknob',
        'Done for',
        'Expiring',
        'Biting the big one',
        'Another one bites the dust',
        'To be turned off',
        'Like a fork stuck in the outlet',
        'Scheduled to be killed',
        'To be exterminated',
        'To be flushed',
        'Getting unplugged',
        'Vanishing',
        'Going poof',
        'Turning to ashes',
        'Getting KO\'d',
        'Running out of juice',
        'Fading into darkness',
        'Getting bloxxed'
    ];

    function getIdiom(relativeDate) {
        const seed = relativeDate.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return soonToDieIdioms[seed % soonToDieIdioms.length];
    }

    function formatDistanceToNow(date) {
        const now = new Date();
        const diff = Math.abs(now - date);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);
        if (years > 0) return years === 1 ? 'a year' : `${years} years`;
        if (months > 0) return months === 1 ? 'a month' : `${months} months`;
        if (days > 0) return days === 1 ? 'a day' : `${days} days`;
        if (hours > 0) return hours === 1 ? 'an hour' : `${hours} hours`;
        if (minutes > 0) return minutes === 1 ? 'a minute' : `${minutes} minutes`;
        return 'seconds';
    }

    function formatDuration(start, end) {
        const diff = Math.abs(end - start);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const years = Math.floor(days / 365);
        const remainingDays = days % 365;
        const months = Math.floor(remainingDays / 30);
        let parts = [];
        if (years > 0) parts.push(years === 1 ? 'a year' : `${years} years`);
        if (months > 0) parts.push(months === 1 ? 'a month' : `${months} months`);
        if (parts.length === 0) return 'less than a month';
        return parts.join(' and ');
    }

    function updateDynamicContent() {
        const now = new Date();
        document.querySelectorAll('.listItem').forEach(item => {
            const iconEl = item.querySelector('.icon');
            const dateCloseStr = iconEl.dataset.date;
            const dateClose = new Date(dateCloseStr);
            const isPast = now > dateClose;
            const relativeDateStr = formatDistanceToNow(dateClose);
            
            if (isPast) {
                iconEl.src = 'assets/images/tombstone.svg';
                iconEl.alt = 'Tombstone';
            } else {
                iconEl.src = 'assets/images/guillotine.svg';
                iconEl.alt = 'Guillotine';
            }
            
            const relativeDateEl = item.querySelector('.relativeDate');
            if (isPast) {
                relativeDateEl.textContent = `Killed ${relativeDateStr} ago, `;
            } else {
                const idiom = getIdiom(relativeDateStr);
                relativeDateEl.textContent = `${idiom} in ${relativeDateStr}, `;
            }
            
            const durationEl = item.querySelector('.duration');
            const dateOpen = new Date(durationEl.dataset.open);
            const durationStr = formatDuration(dateOpen, dateClose);
            if (isPast) {
                durationEl.textContent = ` It was ${durationStr} old.`;
            } else {
                durationEl.textContent = ` It will be ${durationStr} old.`;
            }
        });
    }

    function filterItems() {
        const searchTerm = document.getElementById('searchBox').value.toLowerCase();
        const filterType = document.getElementById('filter-select').value;
        const items = document.querySelectorAll('.listItem');
        items.forEach(item => {
            const name = item.dataset.name;
            const description = item.dataset.description;
            const type = item.dataset.type;
            const matchesSearch = name.includes(searchTerm) || description.includes(searchTerm);
            const matchesFilter = filterType === 'all' || type === filterType;
            if (matchesSearch && matchesFilter) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const getStoredTheme = () => {
        try {
            return localStorage.getItem('theme');
        } catch {
            return null;
        }
    };
    const setStoredTheme = (theme) => {
        try {
            localStorage.setItem('theme', theme);
        } catch {
            // Ignore storage failures; the in-page theme still updates.
        }
    };
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = 'Light Mode';
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.textContent = 'Dark Mode';
        }
    };

    if (themeToggle) {
        applyTheme(getStoredTheme() || 'light');

        themeToggle.addEventListener('click', () => {
            const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
            setStoredTheme(nextTheme);
        });
    }

    document.getElementById('searchBox').addEventListener('input', filterItems);
    document.getElementById('filter-select').addEventListener('change', filterItems);
    updateDynamicContent();
})();
