
# VitaNova

VitaNova is an AI-driven e-Commerce platform designed to enhance user lifestyle and shopping experience. Built with Angular and Spring Boot, it leverages modern technologies including WebSocket, JWT/OAuth authentication, and microservices for scalable, real-time performance.

## 🧠 Key Features

- **AI-driven Product Suggestions** – Personalized shopping powered by machine learning.
- **Real-time Inventory Updates** – Stay updated with instant stock changes using WebSocket.
- **QR Food Scanner** – Scan food packages and track nutritional values on the fly.
- **Calorie Tracker** – Monitor your daily intake based on scanned and purchased items.
- **Spotify API Integration** – Discover healthy living playlists while shopping or tracking.
- **Google Maps Integration** – Locate nearby stores with healthy product options.
- **Authentication & Authorization** – Secure user access with JWT and OAuth 2.0.
- **Microservices Architecture** – Scalable and independently deployable service modules.

## 🛠 Tech Stack

- **Frontend:** Angular 15.2.10
- **Backend:** Spring Boot
- **Database:** MySQL
- **Security:** JWT, OAuth 2.0
- **Real-time:** WebSocket
- **External APIs:** Spotify API, Google Maps API
- **Others:** Docker (for deployment), Postman (for API testing)

---

## 🚀 How to Run the Project

### 📦 Backend Setup (Spring Boot)

1. **Clone the repository**  
   ```bash
   git clone https://github.com/SnapeV1/VitaNovaBackEnd.git
   cd VitaNovaBackEnd
   ```

2. **Configure MySQL & Environment Variables**  
   Update `application.properties` with:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/vitanova
   spring.datasource.username=yourUsername
   spring.datasource.password=yourPassword
   jwt.secret=yourJWTSecret
   spotify.api.key=yourSpotifyAPIKey
   google.maps.api.key=yourGoogleMapsAPIKey
   ```

3. **Run the backend**  
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

---

### 💻 Frontend Setup (Angular 15.2.10)

1. **Navigate to the frontend folder**  
   ```bash
   cd VitaNovaFrontEnd
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Start the development server**  
   ```bash
   ng serve
   ```

4. Open your browser and go to:  
   [http://localhost:4200](http://localhost:4200)

---

## 🧪 Development Tools

### Code Scaffolding

```bash
ng generate component component-name
ng generate directive|pipe|service|class|guard|interface|enum|module
```

### Build the Project

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

### Run Unit Tests

```bash
ng test
```

Executes the unit tests via Karma.

### Run End-to-End Tests

```bash
ng e2e
```

To use this command, you need to first add a package that implements end-to-end testing capabilities (e.g. Cypress or Protractor).

---

## 📍 Future Enhancements

- AI-powered meal recommendations
- Social integration (share meals, playlists)
- Voice-based food scanner

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 📄 License

This project is licensed under the MIT License.
