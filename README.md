<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
    <h1>TourFlix Web Application</h1>
    <p>TourFlix is a feature-rich web application built using <strong>Express.js</strong>, <strong>Pug</strong>, <strong>Node.js</strong>, <strong>CSS</strong>, and <strong>SASS</strong>. It provides users with the ability to explore and book tours, create their profiles, and enjoy a seamless booking experience with robust authentication and payment integration.</p>
    <h2>Features</h2>
    <ul>
        <li><strong>User Profiles:</strong> Users can create and manage their profiles.</li>
        <li><strong>Authentication:</strong> Solid authentication using <strong>JWT (JSON Web Tokens)</strong> ensures secure user sessions.</li>
        <li><strong>Email OTP Verification:</strong> Users are verified via a secure OTP sent to their email address.</li>
        <li><strong>Payment Integration:</strong> Secure and efficient payment gateway integration allows users to book tours.</li>
        <li><strong>Tour Booking:</strong> Users can browse available tours and book the ones they are interested in.</li>
    </ul>
    <h2>Technologies Used</h2>
    <ul>
        <li><strong>Express.js:</strong> Backend framework for building the web application.</li>
        <li><strong>Pug:</strong> Templating engine for rendering dynamic content.</li>
        <li><strong>Node.js:</strong> Server-side JavaScript runtime for handling backend logic.</li>
        <li><strong>CSS & SASS:</strong> Styling the frontend with modern CSS and SASS for enhanced styling capabilities.</li>
        <li><strong>JWT (JSON Web Tokens):</strong> Used for secure authentication.</li>
        <li><strong>OTP Email Verification:</strong> Secure user verification via email.</li>
        <li><strong>Payment Gateway Integration:</strong> Secure payment processing.</li>
    </ul>
    <h2>Installation</h2>
    <p>To set up the TourFlix web app locally, follow these steps:</p>
    <ol>
        <li>Clone the repository:
            <br><code>git clone https://github.com/Amrit-WEB/tourflix.git</code>
        </li>
        <li>Navigate to the project directory:
            <br><code>cd tourflix</code>
        </li>
        <li>Install the dependencies:
            <br><code>npm install</code>
        </li>
        <li>Create a <code>.env</code> file in the root directory and configure your environment variables:</li>
        <ul>
            <li><code>JWT_SECRET=your_jwt_secret</code></li>
            <li><code>DB_URL=your_database_url</code></li>
            <li><code>EMAIL_SERVICE=your_email_service</code></li>
            <li><code>PAYMENT_API_KEY=your_payment_gateway_api_key</code></li>
        </ul>
        <li>Start the development server:
            <br><code>npm run start</code>
        </li>
        <li>Open your browser and go to <code>http://localhost:3000</code> to see the app in action.</li>
    </ol>
    <h2>Usage</h2>
    <p>Once the application is running, users can sign up, verify their email via OTP, create a profile, and start exploring tours. The app ensures secure booking through JWT-based authentication and integrated payment gateway services.</p>
    <h2>Contributing</h2>
    <p>Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure that your code follows the established style guide and passes all tests.</p>
    <h2>License</h2>
    <p>This project is licensed under the MIT License. See the <code>LICENSE</code> file for more details.</p>
    <div class="footer">
        <p>Made with ❤️ by Amritanshu</p>
    </div>
</body>

</html> 

