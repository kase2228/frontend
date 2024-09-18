document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://backend-p7op.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json();
  
      if (data.access_token) {
        sessionStorage.setItem('token', data.access_token);
        sessionStorage.setItem('email', email); // Store email in sessionStorage
        alert('Login successful');
        window.location.href = 'portalpage.html'; // Redirect to portal page after login
      }
    } catch (error) {
      alert(`Login error: ${error.message}`);
      
    }
  });
});