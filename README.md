# QuantiLabs

A full-stack web application serving as a quantitative trading strategy platform that allows users to create, test, and analyze various trading algorithms using real stock market data. Built with a modern tech stack including Spring Boot, React, and integrated with live market data APIs.

---

## 🧠 Features

- **Strategy Creation & Testing**: Create and backtest multiple trading strategies (Momentum, Mean-Reversion, SMA-Crossover)
- **Real-time Market Data**: Integration with live stock market APIs for accurate historical data
- **Interactive Data Visualization**: Dynamic charts and graphs showing strategy performance using Recharts
- **User Management**: Individual user accounts with personalized strategy portfolios
- **Performance Analytics**: Detailed profit/loss calculations, return percentages, and performance metrics
- **Responsive Design**: Modern, mobile-friendly UI with professional styling
- **Strategy Comparison**: Side-by-side analysis of multiple trading strategies

---

## ⚙️ Tech Stack

- **Frontend:** React 19, JavaScript, HTML, CSS, Vite
- **Backend:** Spring Boot 3.5 (Java 17)
- **Database:** PostgreSQL with JPA/Hibernate
- **Charts & Visualization:** Recharts
- **Routing:** React Router DOM
- **Build Tools:** Maven (Backend), Vite (Frontend)

---

## 🛠️ How to Run Locally

### Prerequisites

- Java 17+
- Node.js and npm
- PostgreSQL
- Maven

### 1. Clone the Repository

```bash
git clone https://github.com/seanlumasag/QuantiLabs
cd QuantiLabs
```

### 2. Setup Database

```bash
# Create PostgreSQL database
createdb quantilabs

# Update application.properties with your database credentials
```

### 3. Setup Backend

```bash
cd backend
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

---

## 📊 Trading Strategies

### Momentum Strategy

- Buys when stock price increases by a threshold percentage over a lookback period
- Sells when price decreases by the threshold percentage

### Mean-Reversion Strategy

- Buys when stock price drops significantly below its recent average
- Sells when price returns to or exceeds the average

### SMA-Crossover Strategy

- Uses two Simple Moving Averages (short and long period)
- Generates buy signals when short SMA crosses above long SMA
- Generates sell signals when short SMA crosses below long SMA

---

## 🚀 API Endpoints

### User Management

- `GET /api/users/{username}` - Get user by username
- `POST /api/users` - Create new user
- `DELETE /api/users/{username}` - Delete user

### Strategy Management

- `GET /api/strategy/user/{userId}` - Get all strategies for a user
- `POST /api/strategy` - Create new strategy
- `DELETE /api/strategy/{id}` - Delete strategy
- `GET /api/strategy/run/{id}` - Run strategy and get results

---

## 🚧 Future Features

- **Machine Learning Integration**: PyTorch-based predictive models for strategy optimization
- **Real-time Trading**: Live trading capabilities with broker API integration
- **Advanced Analytics**: Risk analysis, Sharpe ratio, maximum drawdown calculations
- **Portfolio Management**: Multi-strategy portfolio allocation and rebalancing
- **Social Features**: Strategy sharing and community rankings
- **Paper Trading**: Real-time simulation without real money
- **Alerts & Notifications**: Email/SMS alerts for strategy triggers
- **Advanced Charting**: Technical indicators, candlestick charts, and drawing tools

