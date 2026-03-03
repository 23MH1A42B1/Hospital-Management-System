import { createSlice } from '@reduxjs/toolkit';

const today = new Date().toISOString().split('T')[0];
const now = new Date();
const fmt = (h, m = 0) => {
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

// ── Inpatients assigned to nurse ──
export const MOCK_INPATIENTS = [
    {
        id: 'ip1', patientId: 'p3', name: 'Arjun Nair', age: 58, gender: 'Male',
        bedId: 'ICU-205', ward: 'ICU', floor: '2nd Floor',
        diagnosis: 'Myocardial Infarction', admittedOn: `${today}`,
        doctorName: 'Dr. Rajesh Sharma', status: 'critical',
        allergies: ['Aspirin', 'Sulfa drugs'],
        vitalsHistory: [
            { time: '06:00 AM', bp: '145/95', hr: 105, temp: 98.6, spo2: 92, rr: 22, pain: 7, recorded: `${today} 06:00` },
            { time: '10:00 AM', bp: '138/92', hr: 98, temp: 98.4, spo2: 94, rr: 20, pain: 6, recorded: `${today} 10:00` },
        ],
        medications: [
            { id: 'm1', name: 'Heparin 5000 IU', route: 'IV', frequency: 'Every 6 hours', times: ['06:00', '12:00', '18:00', '24:00'], indication: 'Anticoagulation', status: 'active' },
            { id: 'm2', name: 'Aspirin 75mg', route: 'Oral', frequency: 'Once daily', times: ['08:00'], indication: 'Antiplatelet', status: 'active' },
            { id: 'm3', name: 'Atorvastatin 40mg', route: 'Oral', frequency: 'Once daily at night', times: ['22:00'], indication: 'Lipid management', status: 'active' },
        ],
        orders: [
            { id: 'o1', type: 'vital', text: 'Monitor BP every 30 minutes', priority: 'urgent', dueTime: fmt(11, 15), completed: false },
            { id: 'o2', type: 'medication', text: 'Administer Heparin 5000 IU IV', priority: 'routine', dueTime: fmt(12, 0), completed: false },
            { id: 'o3', type: 'lab', text: 'Send blood for Troponin T', priority: 'urgent', dueTime: fmt(11, 0), completed: true },
        ],
        intake: [
            { id: 'in1', time: '06:00 AM', type: 'IV NS 0.9%', route: 'IV', amount: 500, unit: 'ml' },
            { id: 'in2', time: '08:00 AM', type: 'Water', route: 'Oral', amount: 150, unit: 'ml' },
        ],
        output: [
            { id: 'out1', time: '07:00 AM', type: 'Urine', amount: 300, color: 'Yellow' },
            { id: 'out2', time: '10:00 AM', type: 'Urine', amount: 250, color: 'Yellow' },
        ],
        notes: [
            { id: 'n1', time: '06:30 AM', note: 'Patient awake, complaining of chest pain 7/10. O2 support ongoing. ECG done and sent.', nurse: 'Nurse Sunita Rao' },
            { id: 'n2', time: '10:00 AM', note: 'Pain reducing to 6/10. Vitals slightly improving. Patient anxious.', nurse: 'Nurse Sunita Rao' },
        ],
    },
    {
        id: 'ip2', patientId: 'p2', name: 'Meera Singh', age: 32, gender: 'Female',
        bedId: 'Ward A-102', ward: 'General Ward A', floor: '1st Floor',
        diagnosis: 'Post-operative - Appendectomy', admittedOn: today,
        doctorName: 'Dr. Priya Mehta', status: 'stable',
        allergies: [],
        vitalsHistory: [
            { time: '06:00 AM', bp: '118/78', hr: 72, temp: 98.4, spo2: 99, rr: 16, pain: 4, recorded: `${today} 06:00` },
            { time: '10:00 AM', bp: '120/80', hr: 75, temp: 98.6, spo2: 98, rr: 16, pain: 3, recorded: `${today} 10:00` },
        ],
        medications: [
            { id: 'm4', name: 'Paracetamol 500mg', route: 'Oral', frequency: 'Every 6 hours', times: ['06:00', '12:00', '18:00', '24:00'], indication: 'Post-op pain', status: 'active' },
            { id: 'm5', name: 'Amoxicillin 500mg', route: 'Oral', frequency: 'Every 8 hours', times: ['06:00', '14:00', '22:00'], indication: 'Antibiotic prophylaxis', status: 'active' },
            { id: 'm6', name: 'IV Normal Saline 500ml', route: 'IV', frequency: 'TDS', times: ['06:00', '14:00', '22:00'], indication: 'Hydration', status: 'active' },
        ],
        orders: [
            { id: 'o4', type: 'vital', text: 'Check vitals every 4 hours', priority: 'routine', dueTime: fmt(14, 0), completed: false },
            { id: 'o5', type: 'wound', text: 'Assess and change surgical dressing', priority: 'routine', dueTime: fmt(12, 0), completed: false },
            { id: 'o6', type: 'medication', text: 'Administer Paracetamol 500mg oral', priority: 'routine', dueTime: fmt(12, 0), completed: false },
            { id: 'o7', type: 'mobility', text: 'Assist patient for ambulation', priority: 'routine', dueTime: fmt(11, 0), completed: true },
        ],
        intake: [
            { id: 'in3', time: '06:00 AM', type: 'IV NS 0.9%', route: 'IV', amount: 500, unit: 'ml' },
            { id: 'in4', time: '08:00 AM', type: 'Breakfast', route: 'Oral', amount: 250, unit: 'ml' },
            { id: 'in5', time: '10:30 AM', type: 'Juice', route: 'Oral', amount: 200, unit: 'ml' },
        ],
        output: [
            { id: 'out3', time: '07:30 AM', type: 'Urine', amount: 350, color: 'Yellow' },
            { id: 'out4', time: '10:30 AM', type: 'Urine', amount: 200, color: 'Light Yellow' },
        ],
        notes: [
            { id: 'n3', time: '06:30 AM', note: 'Patient awake and alert. Vital signs stable. Surgical dressing dry and intact. Pain 4/10 at surgical site.', nurse: 'Nurse Sunita Rao' },
            { id: 'n4', time: '10:00 AM', note: 'Pain reducing to 3/10. Tolerated breakfast well. Ambulated to bathroom with assistance.', nurse: 'Nurse Sunita Rao' },
        ],
    },
    {
        id: 'ip3', patientId: 'p5', name: 'Krishnamurthy V', age: 67, gender: 'Male',
        bedId: 'Ward B-210', ward: 'General Ward B', floor: '1st Floor',
        diagnosis: 'COPD Exacerbation', admittedOn: today,
        doctorName: 'Dr. Leela Srinivasan', status: 'stable',
        allergies: ['Ibuprofen'],
        vitalsHistory: [
            { time: '06:00 AM', bp: '138/88', hr: 88, temp: 99.1, spo2: 90, rr: 24, pain: 3, recorded: `${today} 06:00` },
            { time: '10:00 AM', bp: '135/85', hr: 84, temp: 98.8, spo2: 93, rr: 22, pain: 2, recorded: `${today} 10:00` },
        ],
        medications: [
            { id: 'm7', name: 'Salbutamol Nebulization', route: 'Nebulizer', frequency: 'Every 4 hours', times: ['06:00', '10:00', '14:00', '18:00', '22:00'], indication: 'Bronchodilation', status: 'active' },
            { id: 'm8', name: 'Prednisolone 40mg', route: 'Oral', frequency: 'Once daily', times: ['08:00'], indication: 'Anti-inflammatory', status: 'active' },
        ],
        orders: [
            { id: 'o8', type: 'vital', text: 'Monitor SpO2 continuous', priority: 'urgent', dueTime: 'Continuous', completed: false },
            { id: 'o9', type: 'medication', text: 'Salbutamol nebulization due', priority: 'routine', dueTime: fmt(14, 0), completed: false },
            { id: 'o10', type: 'lab', text: 'ABG (Arterial Blood Gas) analysis', priority: 'routine', dueTime: fmt(13, 0), completed: false },
        ],
        intake: [
            { id: 'in6', time: '06:00 AM', type: 'IV Dextrose 5%', route: 'IV', amount: 500, unit: 'ml' },
            { id: 'in7', time: '09:00 AM', type: 'Water', route: 'Oral', amount: 100, unit: 'ml' },
        ],
        output: [
            { id: 'out5', time: '08:00 AM', type: 'Urine', amount: 200, color: 'Dark Yellow' },
        ],
        notes: [
            { id: 'n5', time: '06:30 AM', note: 'Patient dyspneic. SpO2 90% on room air. Started O2 via nasal prongs @ 2L/min. SpO2 improved to 93%.', nurse: 'Nurse Sunita Rao' },
        ],
    },
];

// ── Medication administration records ──
const SEED_MAR = [
    { id: 'mar1', patientId: 'ip1', medicineId: 'm1', medicineName: 'Heparin 5000 IU', time: '06:00 AM', date: today, given: true, givenBy: 'Nurse Sunita Rao', patientResponse: 'normal', notes: '' },
    { id: 'mar2', patientId: 'ip2', medicineId: 'm4', medicineName: 'Paracetamol 500mg', time: '06:00 AM', date: today, given: true, givenBy: 'Nurse Sunita Rao', patientResponse: 'normal', notes: '' },
    { id: 'mar3', patientId: 'ip2', medicineId: 'm5', medicineName: 'Amoxicillin 500mg', time: '06:00 AM', date: today, given: true, givenBy: 'Nurse Sunita Rao', patientResponse: 'normal', notes: '' },
];

const nurseSlice = createSlice({
    name: 'nurse',
    initialState: {
        patients: MOCK_INPATIENTS,
        mar: SEED_MAR,
    },
    reducers: {
        recordVitals: (state, { payload: { patientId, vitals } }) => {
            const p = state.patients.find(p => p.id === patientId);
            if (p) {
                p.vitalsHistory.push({ ...vitals, recorded: new Date().toISOString() });
            }
        },
        addMAREntry: (state, { payload }) => {
            state.mar.push(payload);
        },
        completeOrder: (state, { payload: { patientId, orderId } }) => {
            const p = state.patients.find(p => p.id === patientId);
            if (p) {
                const o = p.orders.find(o => o.id === orderId);
                if (o) o.completed = true;
            }
        },
        addIntake: (state, { payload: { patientId, entry } }) => {
            const p = state.patients.find(p => p.id === patientId);
            if (p) p.intake.push({ id: `in${Date.now()}`, ...entry });
        },
        addOutput: (state, { payload: { patientId, entry } }) => {
            const p = state.patients.find(p => p.id === patientId);
            if (p) p.output.push({ id: `out${Date.now()}`, ...entry });
        },
        addNursingNote: (state, { payload: { patientId, note, nurseName } }) => {
            const p = state.patients.find(p => p.id === patientId);
            if (p) {
                p.notes.push({
                    id: `n${Date.now()}`,
                    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
                    note, nurse: nurseName,
                });
            }
        },
    },
});

export const { recordVitals, addMAREntry, completeOrder, addIntake, addOutput, addNursingNote } = nurseSlice.actions;
export default nurseSlice.reducer;
