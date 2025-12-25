// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBrKddsPrn-P1K-AbCr68PkpghadU4Qf2k",
    authDomain: "myapp-19a00.firebaseapp.com",
    projectId: "myapp-19a00",
    storageBucket: "myapp-19a00.appspot.com",
    messagingSenderId: "239542332118",
    appId: "1:239542332118:web:445f7b6d27353140ccb777",
    databaseURL: "https://myapp-19a00-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Display current date
const dateElement = document.getElementById('currentDate');
const currentDate = new Date();
dateElement.textContent = currentDate.toLocaleDateString();

// Driver form functionality
const driverForm = document.getElementById('driverForm');
const driverStatus = document.getElementById('driverStatus');
const dieselStatus = document.getElementById('dieselStatus');
const dieselAmountGroup = document.getElementById('dieselAmountGroup');
const dieselAmount = document.getElementById('dieselAmount');
const paymentMethodGroup = document.getElementById('paymentMethodGroup');
const paymentMethod = document.querySelectorAll('input[name="paymentMethod"]');
const trips = document.getElementById('trips');
const tripsDetails = document.getElementById('tripsDetails');
const totalAmount = document.getElementById('totalAmount');
const dieselAmountError = document.getElementById('dieselAmountError');
const totalAmountError = document.getElementById('totalAmountError');
const tripsError = document.getElementById('tripsError');
const paymentMethodError = document.getElementById('paymentMethodError');

function updateFields() {
    const isDriver = driverStatus.value === 'yes' || driverStatus.value === 'self';
    dieselStatus.disabled = !isDriver;
    trips.disabled = !isDriver;
    paymentMethod.forEach(method => method.disabled = !isDriver);

    if (!isDriver) {
        dieselStatus.value = 'no';
        dieselAmountGroup.style.display = 'none';
        paymentMethodGroup.style.display = 'none';
        dieselAmount.value = '';
        trips.value = '';
        tripsDetails.style.display = 'none';
        document.getElementById('aboveTripsDetails').style.display = 'none';
        document.getElementById('phonePayAmounts').style.display = 'none';
        document.getElementById('phonePayAmounts').innerHTML = '';
        paymentMethod.forEach(method => method.checked = false);
        totalAmount.value = '';
    }

    updateDieselAmount();
}

function updateDieselAmount() {
    if (dieselStatus.value === 'yes') {
        dieselAmountGroup.style.display = 'block';
        paymentMethodGroup.style.display = 'block';
    } else {
        dieselAmountGroup.style.display = 'none';
        paymentMethodGroup.style.display = 'none';
        dieselAmount.value = '';
        paymentMethod.forEach(method => method.checked = false);
    }
}

driverStatus.addEventListener('change', updateFields);
dieselStatus.addEventListener('change', updateDieselAmount);

function createPhonePayFields(numberOfFields) {
    const phonePayAmounts = document.getElementById('phonePayAmounts');
    phonePayAmounts.innerHTML = ''; // Clear previous fields
    phonePayAmounts.style.display = 'block';

    for (let i = 1; i <= numberOfFields; i++) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';

        const label = document.createElement('label');
        if (trips.value === '0.5') {
            label.textContent = `PhonePay Amount for Half Trip:`;
        } else if (trips.value === '1') {
            label.textContent = `PhonePay Amount for Full Trip:`;
        } else if (trips.value === '1.5') {
            label.textContent = i === 1 ? `PhonePay Amount for First Trip:` : `PhonePay Amount for Half Trip:`;
        } else if (trips.value === '2') {
            label.textContent = `PhonePay Amount for Trip ${i}:`;
        } else {
            label.textContent = `PhonePay Amount for Trip ${i}:`;
        }
        label.htmlFor = `phonePayAmount${i}`;

        const input = document.createElement('input');
        input.type = 'number';
        input.name = `phonePayAmount${i}`;
        input.id = `phonePayAmount${i}`;
        input.placeholder = `Enter PhonePay amount`;
        input.classList.add('no-spinners');
        input.addEventListener('input', calculateTotalAmount);

        inputGroup.appendChild(label);
        inputGroup.appendChild(input);
        phonePayAmounts.appendChild(inputGroup);
    }
}

// Handle trips selection
trips.addEventListener('change', function() {
    const tripsDetails = document.getElementById('tripsDetails');
    const aboveTripsDetails = document.getElementById('aboveTripsDetails');
    const aboveTripsAmounts = document.getElementById('aboveTripsAmounts');

    if (this.value === 'above') {
        tripsDetails.style.display = 'none';
        aboveTripsDetails.style.display = 'block';
        aboveTripsAmounts.innerHTML = ''; // Clear previous inputs
        document.getElementById('numberOfTrips').value = ''; // Reset number of trips
        totalAmount.value = ''; // Reset total amount
    } else {
        tripsDetails.style.display = 'block';
        aboveTripsDetails.style.display = 'none';
        // Show/hide relevant input fields based on trip type
        document.getElementById('tripHalfAmount').style.display = this.value === '0.5' ? 'block' : 'none';
        document.getElementById('tripOneAmount').style.display = this.value === '1' ? 'block' : 'none';
        document.getElementById('tripOneAndHalfFirstAmount').style.display = this.value === '1.5' ? 'block' : 'none';
        document.getElementById('tripOneAndHalfHalfAmount').style.display = this.value === '1.5' ? 'block' : 'none';
        document.getElementById('tripTwoFirstAmount').style.display = this.value === '2' ? 'block' : 'none';
        document.getElementById('tripTwoSecondAmount').style.display = this.value === '2' ? 'block' : 'none';

        let numberOfFields;
        if (this.value === '0.5') {
            numberOfFields = 1;
        } else if (this.value === '1') {
            numberOfFields = 1;
        } else if (this.value === '1.5') {
            numberOfFields = 2;
        } else if (this.value === '2') {
            numberOfFields = 2;
        } else {
            numberOfFields = 0;
        }
        createPhonePayFields(numberOfFields);
    }
    calculateTotalAmount();
});

document.getElementById('numberOfTrips').addEventListener('input', function() {
    const aboveTripsAmounts = document.getElementById('aboveTripsAmounts');
    aboveTripsAmounts.innerHTML = ''; // Clear previous inputs

    const trips = parseInt(this.value) || 0;
    for (let i = 1; i <= trips; i++) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';

        const label = document.createElement('label');
        label.textContent = `Amount for Trip ${i}:`;
        label.htmlFor = `tripAmount${i}`;

        const input = document.createElement('input');
        input.type = 'number';
        input.name = `tripAmount${i}`;
        input.id = `tripAmount${i}`;
        input.placeholder = `Enter amount`;
        input.classList.add('no-spinners');
        input.addEventListener('input', calculateTotalAmount);

        inputGroup.appendChild(label);
        inputGroup.appendChild(input);
        aboveTripsAmounts.appendChild(inputGroup);
    }
    createPhonePayFields(trips);
    calculateTotalAmount();
});

function calculateTotalAmount() {
    const tripType = trips.value;
    let tripTotal = 0;
    let phonePayTotal = 0;

    if (tripType === '0.5') {
        tripTotal = parseFloat(document.getElementById('halfTripAmount').value) || 0;
    } else if (tripType === '1') {
        tripTotal = parseFloat(document.getElementById('oneTripAmount').value) || 0;
    } else if (tripType === '1.5') {
        const firstAmount = parseFloat(document.getElementById('oneAndHalfFirstTripAmount').value) || 0;
        const halfAmount = parseFloat(document.getElementById('oneAndHalfHalfTripAmount').value) || 0;
        tripTotal = firstAmount + halfAmount;
    } else if (tripType === '2') {
        const firstAmount = parseFloat(document.getElementById('twoFirstTripAmount').value) || 0;
        const secondAmount = parseFloat(document.getElementById('twoSecondTripAmount').value) || 0;
        tripTotal = firstAmount + secondAmount;
    } else if (tripType === 'above') {
        const tripInputs = document.querySelectorAll('#aboveTripsAmounts input');
        tripInputs.forEach(input => {
            tripTotal += parseFloat(input.value) || 0;
        });
    }

    // Calculate PhonePay amounts
    const phonePayInputs = document.querySelectorAll('#phonePayAmounts input');
    phonePayInputs.forEach(input => {
        phonePayTotal += parseFloat(input.value) || 0;
    });

    const total = tripTotal + phonePayTotal;
    totalAmount.value = total > 0 ? total.toFixed(2) : '';
}

function calculateTripAmount(data) {
    let tripAmount = 0;
    if (data.trips === '0.5') {
        tripAmount = data.halfTripAmount || 0;
    } else if (data.trips === '1') {
        tripAmount = data.oneTripAmount || 0;
    } else if (data.trips === '1.5') {
        tripAmount = (data.oneAndHalfFirstTripAmount || 0) + (data.oneAndHalfHalfTripAmount || 0);
    } else if (data.trips === '2') {
        tripAmount = (data.twoFirstTripAmount || 0) + (data.twoSecondTripAmount || 0);
    } else if (data.trips === 'above' && data.tripAmounts) {
        tripAmount = data.tripAmounts.reduce((sum, amount) => sum + amount, 0);
    }
    return `₹${tripAmount.toFixed(2)}`;
}

function calculatePhonePayAmount(data) {
    if (data.phonePayAmounts && Array.isArray(data.phonePayAmounts)) {
        const total = data.phonePayAmounts.reduce((sum, amount) => sum + amount, 0);
        return `₹${total.toFixed(2)}`;
    }
    return '₹0.00';
}



// Validate form submission
driverForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    let isValid = true;

    // Reset error messages
    dieselAmountError.textContent = '';
    totalAmountError.textContent = '';
    tripsError.textContent = '';
    paymentMethodError.textContent = '';

    if (dieselStatus.value === 'yes' && (dieselAmount.value === '' || parseFloat(dieselAmount.value) <= 0)) {
        isValid = false;
        dieselAmountError.textContent = 'Diesel amount must be greater than 0';
    }

    if (totalAmount.value === '' || parseFloat(totalAmount.value) <= 0) {
        isValid = false;
        totalAmountError.textContent = 'Total amount must be greater than 0';
    }

    if (trips.value === '') {
        isValid = false;
        tripsError.textContent = 'Please select a trip option';
    }

    if (dieselStatus.value === 'yes' && !document.querySelector('input[name="paymentMethod"]:checked')) {
        isValid = false;
        paymentMethodError.textContent = 'Please select a payment method';
    }

    if (isValid) {
        try {
            const formData = {
                date: currentDate.toISOString(),
                driverStatus: driverStatus.value,
                dieselStatus: dieselStatus.value,
                dieselAmount: parseFloat(dieselAmount.value) || 0,
                paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value || '',
                trips: trips.value,
                totalAmount: parseFloat(totalAmount.value) || 0,
            };

            // Add trip-specific data
            if (trips.value === '0.5') {
                formData.halfTripAmount = parseFloat(document.getElementById('halfTripAmount').value) || 0;
            } else if (trips.value === '1') {
                formData.oneTripAmount = parseFloat(document.getElementById('oneTripAmount').value) || 0;
            } else if (trips.value === '1.5') {
                formData.oneAndHalfFirstTripAmount = parseFloat(document.getElementById('oneAndHalfFirstTripAmount').value) || 0;
                formData.oneAndHalfHalfTripAmount = parseFloat(document.getElementById('oneAndHalfHalfTripAmount').value) || 0;
            } else if (trips.value === '2') {
                formData.twoFirstTripAmount = parseFloat(document.getElementById('twoFirstTripAmount').value) || 0;
                formData.twoSecondTripAmount = parseFloat(document.getElementById('twoSecondTripAmount').value) || 0;
            } else if (trips.value === 'above') {
                formData.numberOfTrips = parseInt(document.getElementById('numberOfTrips').value) || 0;
                formData.tripAmounts = Array.from(document.querySelectorAll('#aboveTripsAmounts input')).map(input => parseFloat(input.value) || 0);
            }

            // Add PhonePay amounts
            formData.phonePayAmounts = Array.from(document.querySelectorAll('#phonePayAmounts input')).map(input => parseFloat(input.value) || 0);

            // Submit to Firebase Realtime Database
            const tripsRef = db.ref('trips');
            const newTripRef = tripsRef.push();
            await newTripRef.set(formData);
            console.log("Data saved successfully with key: ", newTripRef.key);
            alert("Form submitted successfully!");
            driverForm.reset();
            updateFields();
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("An error occurred while submitting the form. Please try again.");
        }
    }
});

// Ensure these event listeners are added to update total amount for all trip types
document.getElementById('tripsDetails').addEventListener('input', calculateTotalAmount);
document.getElementById('aboveTripsAmounts').addEventListener('input', calculateTotalAmount);

// View Records button functionality
document.getElementById('viewRecordsBtn').addEventListener('click', async function() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    endDate.setHours(23, 59, 59, 999); // Set to end of day
    await displayRecordsInRange(startDate, endDate);
});

// View Analytics button functionality
document.getElementById('viewAnalyticsBtn').addEventListener('click', async function() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    endDate.setHours(23, 59, 59, 999); // Set to end of day
    await displayAnalytics(startDate, endDate);
});

async function displayRecordsInRange(startDate, endDate) {
    let recordsContainer = document.getElementById('recordsInRange');
    if (!recordsContainer) {
        recordsContainer = document.createElement('div');
        recordsContainer.id = 'recordsInRange';
        document.body.appendChild(recordsContainer);
    }
    recordsContainer.innerHTML = '<h2>Records in Selected Range</h2>';

    try {
        console.log("Fetching records from", startDate, "to", endDate);
        const tripsRef = db.ref('trips');
        const tripsQuery = tripsRef
            .orderByChild('date')
            .startAt(startDate.toISOString())
            .endAt(endDate.toISOString());

        console.log("Query created, attempting to fetch data...");
        const snapshot = await tripsQuery.once('value');
        console.log("Data fetched successfully");

        if (snapshot.exists()) {
            console.log("Snapshot exists, creating table...");
            const table = document.createElement('table');
            table.innerHTML = `
                <tr>
                    <th>Date</th>
                    <th>Driver</th>
                    <th>Diesel</th>
                    <th>Payment Method</th>
                    <th>Trips</th>
                    <th>Amount</th>
                    <th>PhonePay Amount</th>
                    <th>Total Amount</th>
                </tr>
            `;

            // Convert snapshot to array and sort by date in descending order
            const records = [];
            snapshot.forEach((childSnapshot) => {
                records.push({
                    key: childSnapshot.key,
                    data: childSnapshot.val()
                });
            });
            records.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));

            records.forEach(({ data }) => {
                const row = table.insertRow();
                row.innerHTML = `
                    <td>${new Date(data.date).toLocaleDateString()}</td>
                    <td>${data.driverStatus}</td>
                    <td>${data.dieselStatus === 'yes' ? `₹${data.dieselAmount.toFixed(2)}` : 'No'}</td>
                    <td>${data.paymentMethod || 'N/A'}</td>
                    <td>${data.trips}</td>
                    <td>${calculateTripAmount(data)}</td>
                    <td>${calculatePhonePayAmount(data)}</td>
                    <td>₹${data.totalAmount.toFixed(2)}</td>
                `;
            });

            recordsContainer.appendChild(table);
            console.log("Table created and appended to container");
        } else {
            console.log("No data found in the specified range");
            recordsContainer.innerHTML += '<p>No records found for the selected date range.</p>';
        }
    } catch (error) {
        console.error("Error fetching records: ", error);
        recordsContainer.innerHTML += `<p>Error fetching records: ${error.message}. Please try again.</p>`;
    }
}

let charts = {}; // Object to store chart instances

async function displayAnalytics(startDate, endDate) {
    let analyticsContainer = document.getElementById('analyticsContainer');
    if (!analyticsContainer) {
        analyticsContainer = document.createElement('div');
        analyticsContainer.id = 'analyticsContainer';
        document.body.appendChild(analyticsContainer);
    }
    analyticsContainer.innerHTML = '<h2>Analytics for Selected Range</h2>';

    try {
        const tripsRef = db.ref('trips');
        const tripsQuery = tripsRef
            .orderByChild('date')
            .startAt(startDate.toISOString())
            .endAt(endDate.toISOString());

        const snapshot = await tripsQuery.once('value');

        if (snapshot.exists()) {
            const records = [];
            snapshot.forEach((childSnapshot) => {
                records.push(childSnapshot.val());
            });

            // Calculate analytics
            const totalTrips = records.length;
            const totalRevenue = records.reduce((sum, record) => sum + record.totalAmount, 0);
            const totalDieselCost = records.reduce((sum, record) => sum + (record.dieselStatus === 'yes' ? record.dieselAmount : 0), 0);
            const totalPhonePayAmount = records.reduce((sum, record) => sum + (record.phonePayAmounts ? record.phonePayAmounts.reduce((a, b) => a + b, 0) : 0), 0);
            const netProfit = totalRevenue - totalDieselCost;

            const tripCounts = {
                '0.5': 0,
                '1': 0,
                '1.5': 0,
                '2': 0,
                'above': 0
            };

            records.forEach(record => {
                const tripValue = parseFloat(record.trips);
                if (tripValue <= 0.5) tripCounts['0.5']++;
                else if (tripValue <= 1) tripCounts['1']++;
                else if (tripValue <= 1.5) tripCounts['1.5']++;
                else if (tripValue <= 2) tripCounts['2']++;
                else tripCounts['above']++;
            });

            // Additional analysis
            const averageRevenuePerTrip = totalRevenue / totalTrips;
            const averageDieselCostPerTrip = totalDieselCost / totalTrips;
            const profitMargin = (netProfit / totalRevenue) * 100;
            const phonePayPercentage = (totalPhonePayAmount / totalRevenue) * 100;

            // Create chart containers
            analyticsContainer.innerHTML += `
                <div class="chart-container">
                    <canvas id="tripDistributionChart"></canvas>
                </div>
                <div class="chart-container">
                    <canvas id="revenueExpenseChart"></canvas>
                </div>
                <div class="chart-container">
                    <canvas id="weeklyRevenueChart"></canvas>
                </div>
                <div class="chart-container">
                    <canvas id="monthlyRevenueChart"></canvas>
                </div>
                <div class="analytics-summary">
                    <h3>Summary</h3>
                    <p><strong>Total Trips:</strong> ${totalTrips}</p>
                    <p><strong>Total Revenue:</strong> ₹${totalRevenue.toFixed(2)}</p>
                    <p><strong>Total Diesel Cost:</strong> ₹${totalDieselCost.toFixed(2)}</p>
                    <p><strong>Total PhonePay Amount:</strong> ₹${totalPhonePayAmount.toFixed(2)}</p>
                    <p><strong>Net Profit:</strong> ₹${netProfit.toFixed(2)}</p>
                    <p><strong>Average Revenue per Trip:</strong> ₹${averageRevenuePerTrip.toFixed(2)}</p>
                    <p><strong>Average Diesel Cost per Trip:</strong> ₹${averageDieselCostPerTrip.toFixed(2)}</p>
                    <p><strong>Profit Margin:</strong> ${profitMargin.toFixed(2)}%</p>
                    <p><strong>PhonePay Usage:</strong> ${phonePayPercentage.toFixed(2)}% of total revenue</p>
                </div>
            `;

            // Create charts
            createTripDistributionChart(tripCounts);
            createRevenueExpenseChart(totalRevenue, totalDieselCost, totalPhonePayAmount, netProfit);
            createWeeklyRevenueChart(records, endDate);
            await createMonthlyRevenueChart(endDate);

        } else {
            analyticsContainer.innerHTML += '<p>No records found for the selected date range.</p>';
        }
    } catch (error) {
        console.error("Error fetching analytics: ", error);
        analyticsContainer.innerHTML += `<p>Error fetching analytics: ${error.message}. Please try again.</p>`;
    }
}

function createTripDistributionChart(tripCounts) {
    const ctx = document.getElementById('tripDistributionChart').getContext('2d');
    if (charts.tripDistribution) charts.tripDistribution.destroy();
    charts.tripDistribution = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Half Trips', 'One Trips', 'One and Half Trips', 'Two Trips', 'Above Two Trips'],
            datasets: [{
                data: [tripCounts['0.5'], tripCounts['1'], tripCounts['1.5'], tripCounts['2'], tripCounts['above']],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Trip Distribution',
                    font: { size: 16 }
                },
                legend: { position: 'bottom' }
            }
        }
    });
}

function createRevenueExpenseChart(totalRevenue, totalDieselCost, totalPhonePayAmount, netProfit) {
    const ctx = document.getElementById('revenueExpenseChart').getContext('2d');
    if (charts.revenueExpense) charts.revenueExpense.destroy();
    charts.revenueExpense = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Revenue', 'Diesel Cost', 'PhonePay Amount', 'Net Profit'],
            datasets: [{
                label: 'Amount (₹)',
                data: [totalRevenue, totalDieselCost, totalPhonePayAmount, netProfit],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(54, 162, 235, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Revenue vs Expense',
                    font: { size: 16 }
                },
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount (₹)',
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

function createWeeklyRevenueChart(records, endDate) {
    const weeklyRevenue = {};
    const lastWeekStart = new Date(endDate);
    lastWeekStart.setDate(lastWeekStart.getDate() - 6);

    for (let i = 0; i < 7; i++) {
        const date = new Date(lastWeekStart);
        date.setDate(date.getDate() + i);
        weeklyRevenue[date.toISOString().split('T')[0]] = 0;
    }

    records.forEach(record => {
        const recordDate = new Date(record.date);
        if (recordDate >= lastWeekStart && recordDate <= endDate) {
            const dateKey = recordDate.toISOString().split('T')[0];
            weeklyRevenue[dateKey] = (weeklyRevenue[dateKey] || 0) + record.totalAmount;
        }
    });

    const ctx = document.getElementById('weeklyRevenueChart').getContext('2d');
    if (charts.weeklyRevenue) charts.weeklyRevenue.destroy();
    charts.weeklyRevenue = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(weeklyRevenue),
            datasets: [{
                label: 'Daily Revenue',
                data: Object.values(weeklyRevenue),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Last Week Revenue',
                    font: { size: 16 }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: { day: 'MMM d' }
                    },
                    title: {
                        display: true,
                        text: 'Date',
                        font: { size: 12 }
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Revenue (₹)',
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

async function createMonthlyRevenueChart(endDate) {
    const monthlyRevenue = {};
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - 4);

    for (let i = 0; i < 5; i++) {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + i);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyRevenue[monthKey] = 0;
    }

    const tripsRef = db.ref('trips');
    const tripsQuery = tripsRef
        .orderByChild('date')
        .startAt(startDate.toISOString())
        .endAt(endDate.toISOString());

    const snapshot = await tripsQuery.once('value');

    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
            const record = childSnapshot.val();
            const recordDate = new Date(record.date);
            const monthKey = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}`;
            monthlyRevenue[monthKey] += record.totalAmount;
        });
    }

    const ctx = document.getElementById('monthlyRevenueChart').getContext('2d');
    if (charts.monthlyRevenue) charts.monthlyRevenue.destroy();
    charts.monthlyRevenue = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(monthlyRevenue),
            datasets: [{
                label: 'Monthly Revenue',
                data: Object.values(monthlyRevenue),
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Last 5 Months Revenue',
                    font: { size: 16 }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Month',
                        font: { size: 12 }
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Revenue (₹)',
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}



// Initial call to set the correct state
updateFields();