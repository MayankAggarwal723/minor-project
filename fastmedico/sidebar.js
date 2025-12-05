// Sidebar Management
class SidebarManager {
    constructor() {
        this.init();
    }

    init() {
        this.updateSidebarUserInfo();
        this.setupEventListeners();
    }

    // Update sidebar user information
    updateSidebarUserInfo() {
        const profileData = this.loadProfileData();
        const firstName = profileData.personal.firstName || 'John';
        const lastName = profileData.personal.lastName || 'Smith';
        const fullName = `${firstName} ${lastName}`;
        const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
        const patientId = 'PM123456';
        
        // Update sidebar elements
        const sidebarName = document.getElementById('sidebarName');
        const sidebarInitials = document.getElementById('sidebarInitials');
        const sidebarPatientId = document.getElementById('sidebarPatientId');
        
        if (sidebarName) sidebarName.textContent = fullName;
        if (sidebarInitials) sidebarInitials.textContent = initials;
        if (sidebarPatientId) sidebarPatientId.textContent = `Patient ID: ${patientId}`;
        
        // Also update header avatar
        const headerAvatar = document.getElementById('headerAvatar');
        if (headerAvatar && !headerAvatar.style.backgroundImage) {
            headerAvatar.textContent = initials;
        }
    }

    // Load profile data from localStorage
    loadProfileData() {
        const savedData = localStorage.getItem('fastMedicoProfile');
        if (savedData) {
            return JSON.parse(savedData);
        }
        
        // Default data
        const now = new Date().toISOString();
        return {
            personal: {
                firstName: "John",
                lastName: "Smith",
                dob: "1985-06-15",
                gender: "male",
                email: "john.smith@example.com",
                phone: "+1 (555) 123-4567",
                address: "123 Main Street, Apt 4B",
                city: "New York",
                zipCode: "10001",
                lastUpdated: now
            },
            health: {
                heartRate: "72",
                bloodPressure: "120/80",
                temperature: "98.6",
                oxygen: "98%",
                bloodType: "O+",
                allergies: "Penicillin, Peanuts",
                medications: "Lisinopril 10mg daily, Atorvastatin 20mg daily",
                conditions: "Hypertension, High Cholesterol",
                emergencyNotes: "No known drug allergies aside from listed",
                insuranceProvider: "Blue Cross Blue Shield",
                policyNumber: "BCBS-87452963",
                groupNumber: "GRP-5521",
                lastUpdated: now
            },
            emergencyContacts: [],
            settings: {},
            lastProfileUpdate: now
        };
    }

    // Setup event listeners
    setupEventListeners() {
        // Emergency SOS button
        const sosButton = document.getElementById('sidebarEmergencyBtn');
        if (sosButton) {
            sosButton.addEventListener('click', () => {
                const globalSosBtn = document.getElementById('globalEmergencyBtn');
                if (globalSosBtn) {
                    globalSosBtn.click();
                }
            });
        }
    }

    // Public method to refresh sidebar (call this when profile updates)
    refreshSidebar() {
        this.updateSidebarUserInfo();
    }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.sidebarManager = new SidebarManager();
});