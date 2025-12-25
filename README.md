# RO Water Plant Management System

A web-based application designed to streamline and simplify the operations of RO (Reverse Osmosis) water plants. This system provides comprehensive management tools for plant owners and administrators to track operations, manage resources, and analyze performance metrics.

## 📋 Project Overview

The RO Water Plant Management System is specifically tailored for plant administrators and owners. It enables:
- **Real-time monitoring** of plant operations
- **Data management** for daily operational records
- **Driver and fuel tracking** for operational logistics
- **Analytics and reports** for performance insights and trend analysis
- **Trip tracking and payment management** for delivery operations

## ✨ Features

- **Dashboard** with current operational status and date tracking
- **Driver Management** - Track driver availability (Yes/No/Self)
- **Fuel Management** - Monitor diesel usage and fuel amounts
- **Trip Tracking** - Record delivery trips and trip details
- **Payment Processing** - Support for both Card and Cash payment methods
- **Real-time Data Sync** - Firebase integration for live data updates
- **Analytics** - Chart.js integration for performance visualization
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: Firebase Realtime Database
- **Charts & Analytics**: Chart.js
- **Backend/Infrastructure**: Firebase (Authentication, Database, Hosting)

## 📁 Project Structure

```
Ro Water Plant Web Application/
├── index.html          # Main HTML file with form and dashboard
├── style.css          # Styling and responsive design
├── script.js          # Core application logic and Firebase integration
└── README.md          # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase project with Realtime Database enabled
- Internet connection for Firebase connectivity

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SAINATH0224/Ro-Water-Plant-Web-Application.git
cd Ro-Water-Plant-Web-Application
```

2. Open the application:
   - Navigate to `Ro Water Plant Web Application` folder
   - Open `index.html` in your web browser

3. Configure Firebase (if needed):
   - Update Firebase configuration in `script.js` with your Firebase project credentials

## 📊 Usage

1. **Daily Operations Entry**:
   - Select driver status (Yes/No/Self)
   - Enable diesel tracking if applicable
   - Enter diesel amount if required
   - Record number of trips completed
   - Select payment method (Card/Cash)
   - Submit the form to save data

2. **View Analytics**:
   - Charts display historical data and trends
   - Monitor performance metrics over time

## 🔧 Configuration

Update the Firebase configuration in `script.js`:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    databaseURL: "YOUR_DATABASE_URL"
};
```

## 👤 Author

**Sainath** - Project Creator

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📞 Support

For support, please open an issue on the GitHub repository or contact the project maintainer.

---

**Note**: Ensure your Firebase database is properly configured with appropriate security rules before deploying to production.
