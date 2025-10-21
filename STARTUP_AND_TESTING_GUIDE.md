# CompliantPay - Startup & Testing Guide

## 🚀 **COMPLETE STARTUP INSTRUCTIONS**

### **Step 1: Start the Backend (Spring Boot)**

```bash
# Navigate to backend directory
cd backend

# Run Maven to start the Spring Boot application
mvn spring-boot:run
```

**Expected Output:**
```
Started CompliantPayApplication in X.XXX seconds
Server running on http://localhost:8080
```

**Backend API Endpoints:**
- Base URL: `http://localhost:8080/api`
- Health Check: `http://localhost:8080/actuator/health`

---

### **Step 2: Start the Frontend (React)**

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start the development server
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view the app in the browser.
Local: http://localhost:3000
```

---

### **Step 3: Access the Application**

1. Open browser: `http://localhost:3000`
2. You should see the modern login page
3. Login with demo credentials:
   - **Username**: `admin`
   - **Password**: `password`

---

## ✅ **TESTING CHECKLIST**

### **Frontend Tests**

- [ ] **Login Page**
  - [ ] Page loads with modern styling
  - [ ] Demo credentials display correctly
  - [ ] Login button works
  - [ ] Error handling displays properly
  - [ ] Animations are smooth

- [ ] **Dashboard**
  - [ ] Stats cards display with trends
  - [ ] Quick actions visible
  - [ ] System status shows
  - [ ] Payroll history loads
  - [ ] All components responsive

- [ ] **Employee Management**
  - [ ] Employee list loads
  - [ ] Search functionality works
  - [ ] Filter by department works
  - [ ] Sort options work
  - [ ] Add employee modal opens
  - [ ] Edit employee works
  - [ ] Delete employee works

- [ ] **Compliance & Tax Engine**
  - [ ] Jurisdiction selector works
  - [ ] Tax brackets display
  - [ ] Expandable sections work
  - [ ] Calculations are correct
  - [ ] Compliance notes display

- [ ] **Run Payroll**
  - [ ] Payroll summary displays
  - [ ] Calculations are correct
  - [ ] Confirmation modal works
  - [ ] Processing status shows

- [ ] **Profile Page**
  - [ ] User info displays (username, email, roles)
  - [ ] Admin role shows if applicable
  - [ ] Edit profile works
  - [ ] Logout button works
  - [ ] Account status shows

- [ ] **Header & Sidebar**
  - [ ] Header displays correctly
  - [ ] Dropdown menu works
  - [ ] Sidebar navigation works
  - [ ] Active states highlight
  - [ ] Mobile menu works

- [ ] **Responsive Design**
  - [ ] Mobile (< 640px) - single column
  - [ ] Tablet (640-1024px) - 2 columns
  - [ ] Desktop (> 1024px) - 3+ columns

---

## 🔧 **BACKEND TESTING**

### **Check Backend Health**

```bash
# Check if backend is running
curl http://localhost:8080/actuator/health

# Expected response:
# {"status":"UP"}
```

### **Test API Endpoints**

```bash
# Get all employees
curl http://localhost:8080/api/employees

# Get dashboard metrics
curl http://localhost:8080/api/dashboard/metrics

# Get tax rules
curl http://localhost:8080/api/tax-rules
```

---

## 📊 **DATABASE TESTING**

### **Check Database Connection**

The application uses:
- **Database**: H2 (In-memory) or MySQL (if configured)
- **ORM**: JPA/Hibernate

### **Verify Database**

1. **Check H2 Console** (if using H2):
   - URL: `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:testdb`
   - Username: `sa`
   - Password: (leave blank)

2. **Check Database Tables**:
   - `users` - User accounts
   - `employees` - Employee data
   - `payroll_history` - Payroll records
   - `blockchain_transactions` - Audit trail

---

## 👤 **PROFILE PAGE TESTING**

### **Admin User Profile**

When logged in as **admin**:

✅ **Expected Display:**
- Username: `admin`
- Email: `admin@example.com`
- Roles: `ADMIN` (blue badge)
- Account Type: `Administrator`
- Account Status: `Active`
- Avatar: `A` (first letter)

✅ **Features:**
- Edit profile button
- Phone field editable
- Location field editable
- Save/Cancel buttons
- Logout button
- Account information card

### **Regular User Profile**

When logged in as a regular user:

✅ **Expected Display:**
- Username: `[username]`
- Email: `[username]@example.com`
- Roles: `USER` (blue badge)
- Account Type: `Standard User`
- Account Status: `Active`
- Avatar: First letter of username

---

## 🐛 **TROUBLESHOOTING**

### **Backend Won't Start**

**Problem**: `Port 8080 already in use`
```bash
# Kill the process using port 8080
# On Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :8080
kill -9 <PID>
```

### **Frontend Won't Start**

**Problem**: `Port 3000 already in use`
```bash
# Use a different port
PORT=3001 npm start
```

### **Backend Connection Error**

**Problem**: `Cannot connect to http://localhost:8080`
- Check if backend is running: `mvn spring-boot:run`
- Check firewall settings
- Verify API_URL in frontend

### **Database Connection Error**

**Problem**: `Cannot connect to database`
- Check database configuration in `application.properties`
- Verify database server is running
- Check database credentials

### **Profile Page Shows No User**

**Problem**: User data not loading
- Check if logged in properly
- Check browser console for errors
- Verify AuthContext is working
- Check backend API response

---

## 📱 **RESPONSIVE TESTING**

### **Test on Different Devices**

**Mobile (375x667)**
```bash
# Chrome DevTools: iPhone 12
```

**Tablet (768x1024)**
```bash
# Chrome DevTools: iPad
```

**Desktop (1920x1080)**
```bash
# Full screen
```

---

## 🧪 **AUTOMATED TESTING**

### **Run Frontend Tests**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### **Run Backend Tests**

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=EmployeeControllerTest
```

---

## 📊 **PERFORMANCE TESTING**

### **Check Frontend Performance**

1. Open Chrome DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Interact with app
5. Stop recording
6. Analyze results

### **Check Backend Performance**

```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8080/api/employees

# Monitor logs for slow queries
tail -f backend/logs/application.log
```

---

## ✅ **FINAL VERIFICATION CHECKLIST**

### **Before Deployment**

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Login works with demo credentials
- [ ] Dashboard loads all data
- [ ] Employee management CRUD works
- [ ] Compliance calculations work
- [ ] Payroll processing works
- [ ] Profile page shows user info
- [ ] Admin role displays correctly
- [ ] Responsive design works
- [ ] All animations smooth
- [ ] No console errors
- [ ] No network errors
- [ ] Database connected
- [ ] All API endpoints working

---

## 🚀 **DEPLOYMENT CHECKLIST**

### **Before Going to Production**

- [ ] All tests passing
- [ ] Performance optimized
- [ ] Security verified
- [ ] Error handling complete
- [ ] Logging configured
- [ ] Monitoring setup
- [ ] Backup strategy ready
- [ ] Documentation updated

---

## 📞 **QUICK REFERENCE**

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | http://localhost:3000 | ✅ |
| Backend | http://localhost:8080 | ✅ |
| API | http://localhost:8080/api | ✅ |
| H2 Console | http://localhost:8080/h2-console | ✅ |
| Health Check | http://localhost:8080/actuator/health | ✅ |

---

## 🎯 **EXPECTED RESULTS**

### **When Everything Works**

✅ Login page loads with modern styling
✅ Dashboard shows all stats
✅ Employee management works
✅ Compliance engine calculates taxes
✅ Payroll processes correctly
✅ Profile page shows user/admin info
✅ All animations smooth
✅ Responsive on all devices
✅ No errors in console
✅ Database connected

---

## 📝 **NOTES**

- Demo credentials: `admin` / `password`
- Backend runs on port 8080
- Frontend runs on port 3000
- Database is H2 (in-memory) by default
- All modern UI features are active
- Profile page shows user roles

---

**Your CompliantPay application is ready for testing!** 🎉

Start with Step 1 (Backend), then Step 2 (Frontend), then follow the testing checklist.

Good luck! 🚀
