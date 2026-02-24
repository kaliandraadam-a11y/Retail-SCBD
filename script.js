import { auth, db, storage } from './firebase-config.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Navigasi Halaman
window.showView = (viewId) => {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
    document.getElementById('fab').classList.toggle('hidden', viewId !== 'dashboardView');
};

// Login
window.handleLogin = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try { await signInWithEmailAndPassword(auth, email, pass); } catch (e) { alert("Gagal: " + e.message); }
};

// Cek Status Login
onAuthStateChanged(auth, user => {
    if (user) { showView('dashboardView'); loadData(); } else { showView('authView'); }
});

// Scan Barcode
window.startScanner = () => {
    Quagga.init({ inputStream: { name: "Live", type: "LiveStream", target: document.querySelector('#interactive') }, decoder: { readers: ["ean_reader"] } }, (err) => {
        if (!err) Quagga.start();
    });
    Quagga.onDetected((res) => {
        document.getElementById('prodBarcode').value = res.codeResult.code;
        Quagga.stop();
    });
};

// Simpan Produk
window.saveProduct = async () => {
    await addDoc(collection(db, "expiry_records"), {
        name: document.getElementById('prodName').value,
        barcode: document.getElementById('prodBarcode').value,
        department: document.getElementById('prodDept').value,
        expiryDate: Timestamp.fromDate(new Date(document.getElementById('prodExpiry').value)),
        quantity: document.getElementById('prodQty').value,
        addedBy: auth.currentUser.email
    });
    showView('dashboardView');
};

// Export Excel
window.exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(window.currentData || []);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    XLSX.writeFile(wb, "Laporan_Expiry_SCBD.xlsx");
};

function loadData() {
    onSnapshot(query(collection(db, "expiry_records"), orderBy("expiryDate")), (snap) => {
        const container = document.getElementById('itemsContainer');
        container.innerHTML = "";
        window.currentData = snap.docs.map(doc => doc.data());
        window.currentData.forEach(item => {
            container.innerHTML += `<div class="card"><b>${item.name}</b><br>${item.department} - Exp: ${item.expiryDate.toDate().toLocaleDateString()}</div>`;
        });
    });
}
