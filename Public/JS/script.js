// Wait for the entire HTML document to be loaded and parsed before running the script
document.addEventListener("DOMContentLoaded", function() {

    // --- Section 1: Mobile Menu Toggle ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }));


    // --- Section 2: Dynamically Create Service Cards ---
    const services = [
        {
            icon: "fas fa-paint-brush",
            title: "Poster Designing",
            description: "Attractive and impactful posters that convey your message to the audience."
        },
        {
            icon: "fas fa-vector-square",
            title: "Graphic Designing",
            description: "Creative design solutions for logos, brochures, and other marketing materials."
        },
        {
            icon: "fas fa-desktop",
            title: "UI/UX Designing",
            description: "Intuitive and engaging interface designs to enhance the user experience."
        },
        {
            icon: "fas fa-file-alt",
            title: "Resume Builder",
            description: "Professional resumes that help you land your dream job."
        },
        {
            icon: "fas fa-bullhorn",
            title: "Social Media Marketing",
            description: "Effective marketing strategies to increase your brand's reach and connect with customers."
        },
        {
            icon: "fas fa-chart-line",
            title: "Digital Marketing & Ads",
            description: "Reach your target audience by running ads on Google Ads and other platforms."
        }
    ];

    const servicesContainer = document.getElementById("services-container");
    if (servicesContainer) {
        services.forEach(service => {
            const card = document.createElement("div");
            card.className = "service-card";
            card.innerHTML = `
                <div class="icon"><i class="${service.icon}"></i></div>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
            `;
            servicesContainer.appendChild(card);
        });
    }


    // --- Section 3: Scroll Animation for Sections ---
    const sections = document.querySelectorAll('section');
    const options = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });


    // --- Section 4: Contact Form Handling ---
    // (This is the new code you provided)
    const contactForm = document.querySelector('.contact-form');

    // Make sure the form exists before adding an event listener
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // Prevent the default form submission which reloads the page
            event.preventDefault();

            const name = contactForm.querySelector('input[name="name"]').value;
            const email = contactForm.querySelector('input[name="email"]').value;
            const message = contactForm.querySelector('textarea[name="message"]').value;
            
            // Create the data payload to send to the server
            const formData = {
                name: name,
                email: email,
                message: message
            };

            // Use the Fetch API to send data to the backend
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            .then(response => response.json())
            .then(data => {
                // Log the response from the server
                console.log('Success:', data);
                alert(data.message); // Show a success message to the user from the server
                if (data.success) {
                    contactForm.reset(); // Clear the form fields if successful
                }
            })
            .catch((error) => {
                // Handle any network errors
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            });
        });
    }

}); // This closing bracket and parenthesis ends the DOMContentLoaded listener.