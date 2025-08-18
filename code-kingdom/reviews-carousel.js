const reviews = [
            {text: "תודה רבה על הספר. הבן שלי מרותק. יישר כח על הרעיון והיישום!", author: "תמר, אמא של נועם בן ה-9"},
            {text: "הוא מאוד נהנה! אוהב את השילוב של הספר והמחשב", author: "אילנית, אמא של איל בן  ה-10"},
            {text: "איזה יופי! היא ממש קוראת ועושה עצמאית. זה ממש חריג שהיא מבקשת ככה לעשות משהו... מראה שהיא מתייחסת לזה כמו משחק ולא כמו ספר קריאה או לימוד", author: "אניה, אמא של רוני בת ה-8"},
            {text: "הוא ישב על זה מהרגע שקם עד שהיינו צריכים לצאת מהבית", author: "אורי, אבא של איתמר בן ה-8"},
            {text: "הספר ניתן לאחיין שלי היום והוא בעננים", author: "תמי, דודה של אופיר בן ה-9"},
            ];

        let current = 0;
        const track = document.getElementById('carousel-track');

function reviewCard(review, isActive = false) {
  return `
    <div class="carousel-review${isActive ? ' active' : ''}">
      <div class="review-text">
        <span class="big-quote right-quote">”</span>
        ${review.text}&nbsp;<span class="big-quote left-quote">“</span>
      </div>
      <div class="review-author">(${review.author})</div>
    </div>
  `;
}

let autoRotate;

function resetAutoRotate() {
    clearInterval(autoRotate);
    autoRotate = setInterval(() => {
        current = (current + 1) % reviews.length;
        renderCarousel();
    }, 6000);
}

function renderCarousel() {
    const isMobile = window.innerWidth < 700;
    if (isMobile) {
        track.innerHTML = `
            <button class="carousel-arrow left" aria-label="הקודם">&gt;</button>
            ${reviewCard(reviews[current], true)}
            <button class="carousel-arrow right" aria-label="הבא">&lt;</button>
        `;
    } else {
        track.innerHTML = `
            <button class="carousel-arrow left" aria-label="הקודם">&gt;</button>
            ${reviewCard(reviews[(current - 1 + reviews.length) % reviews.length])}
            ${reviewCard(reviews[current], true)}
            ${reviewCard(reviews[(current + 1) % reviews.length])}
            <button class="carousel-arrow right" aria-label="הבא">&lt;</button>
        `;
    }
    track.querySelector('.carousel-arrow.left').onclick = () => {
        current = (current + 1) % reviews.length;
        renderCarousel();
        resetAutoRotate();
    };
    track.querySelector('.carousel-arrow.right').onclick = () => {
        current = (current - 1 + reviews.length) % reviews.length;
        renderCarousel();
        resetAutoRotate();
    };
}

renderCarousel();
resetAutoRotate();

window.addEventListener('resize', renderCarousel);