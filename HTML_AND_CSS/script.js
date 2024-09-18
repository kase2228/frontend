document.addEventListener("DOMContentLoaded", function() {
    initializeNewsCardListeners();
    handleInitialPageView();
    initializePaginationDots();
    initializeFormSubmission();
    initializeDoctorDropdown(); 
    initializeNewsletterForm()
});

function initializeDoctorDropdown() {
    const doctorSelect = document.getElementById('doctor');

    fetch('http://backend-p7op.onrender.com/doctors/doctor', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch doctors');
        }
        return response.json();
    })
    .then(doctors => {
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.name;
            option.text = `${doctor.name} (${doctor.speciality})`;
            doctorSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching doctors:', error.message);
        alert('Failed to fetch doctors. Please try again.');
    });
}

function initializeNewsCardListeners() {
    const newsCards = document.querySelectorAll(".news-card");
    const viewCounts = document.querySelectorAll(".view-count");
    const likeCounts = document.querySelectorAll(".like-count");
    

    newsCards.forEach((card, index) => {
        const viewIcon = card.querySelector(".fa-eye");
        const likeIcon = card.querySelector(".fa-heart");

        viewIcon.addEventListener("click", () => {
            let views = parseInt(viewCounts[index].textContent);
            viewCounts[index].textContent = views + 1;
        });

        likeIcon.addEventListener("click", () => {
            let likes = parseInt(likeCounts[index].textContent);
            likeCounts[index].textContent = likes + 1;
        });
    });
}

function handleInitialPageView() {
    const viewCounts = document.querySelectorAll(".view-count");

    if (!getCookie("visited")) {
        viewCounts.forEach((count) => {
            let views = parseInt(count.textContent);
            count.textContent = views + 1;
        });
        setCookie("visited", true, 7);
    }
}

function linkToReseption(){
    const token = sessionStorage.getItem('token');
  if (!token) {
    window.location.href = 'addlogin.html';
    return;
  }
}

function initializePaginationDots() {
    const dots = document.querySelectorAll(".pagination-dot");

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index + 1);
        });
    });

    showSlide(1); // Initialize the first slide
}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(cname) == 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

function showSlide(n) {
    const cards = document.querySelectorAll('.news-card');
    const dots = document.querySelectorAll('.pagination-dot');
    let start = (n - 1) * 3;

    cards.forEach((card, index) => {
        card.style.display = (index >= start && index < start + 3) ? 'flex' : 'none';
    });

    dots.forEach(dot => dot.classList.remove('active'));
    dots[n - 1].classList.add('active');
}

function initializeFormSubmission() {
    const form = document.querySelector('.appointment-form form');
    form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const appointmentDate = new Date(data.date);
    const currentTime = new Date();

    if (appointmentDate < currentTime) {
        alert("Error: Appointment date cannot be in the past.");
        return;
    }

    fetch('http://backend-p7op.onrender.com/appointments/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            alert("Success!"); 
            event.target.submit(); 
        } else {
            return response.json().then(errorData => {
                alert('Error: ' + JSON.stringify(errorData));
            });
        }
    })
    .catch(error => {
        alert("Fetch error: " + error);
    });

    function initializeNewsletterForm() {
        const newsletterForm = document.querySelector('.newsletter-form');
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    function handleNewsletterSubmit(event) {
        event.preventDefault();
    
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
    
        fetch('http://backend-p7op.onrender.com/newsletter/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                alert("Subscription successful!");
                event.target.reset(); // Reset the form on successful subscription
            } else {
                return response.json().then(errorData => {
                    alert('Error: ' + JSON.stringify(errorData));
                });
            }
        })
        .catch(error => {
            alert("Fetch error: " + error);
        });
    }
}