import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Camera, Save, X, RotateCcw } from 'lucide-react';
import { useToast } from '../../components/Toast';

// Role specific components
import AdminProfile from './components/AdminProfile';
import DoctorProfile from './components/DoctorProfile';
import PatientProfile from './components/PatientProfile';
import ReceptionistProfile from './components/ReceptionistProfile';
import NurseProfile from './components/NurseProfile';

function getInitials(name) {
    return name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';
}

export default function ProfileSettings() {
    const { currentUser } = useSelector(state => state.auth);
    const [searchParams, setSearchParams] = useSearchParams();
    const { addToast } = useToast();

    const defaultTab = searchParams.get('tab') || 'personal';
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // Handle unsaved changes warning (simple version for demo)
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setHasUnsavedChanges(false);
            addToast('success', 'Changes Saved Successfully!', 'Your profile settings have been updated.');
        }, 800);
    };

    const handleCancel = () => {
        if (hasUnsavedChanges) {
            if (window.confirm('You have unsaved changes! If you leave, your changes will be lost. Leave anyway?')) {
                setHasUnsavedChanges(false);
                // In a real app we might reset state here
            }
        }
    };

    const roleColor = {
        admin: 'avatar-blue',
        doctor: 'avatar-teal',
        patient: 'avatar-purple',
        receptionist: 'avatar-orange',
        nurse: 'avatar-green',
        pharmacist: 'avatar-red'
    }[currentUser?.role] || 'avatar-blue';

    const renderRoleComponent = () => {
        const props = { activeTab, setActiveTab, setHasUnsavedChanges };
        switch (currentUser?.role) {
            case 'admin': return <AdminProfile {...props} />;
            case 'doctor': return <DoctorProfile {...props} />;
            case 'patient': return <PatientProfile {...props} />;
            case 'receptionist': return <ReceptionistProfile {...props} />;
            case 'nurse': return <NurseProfile {...props} />;
            // For pharmacist, we can fallback to receptionist/staff style settings for now if not explicitly requested, or we can add it later
            case 'pharmacist': return <ReceptionistProfile {...props} />; // reusing receptionist as generic staff
            default: return <div>Unknown role</div>;
        }
    };

    // Helper for profile details based on role
    const getRoleSpecificDetails = () => {
        switch (currentUser?.role) {
            case 'admin': return <><div>System Administrator</div><div>ID: ADM-2024-001</div><div className="status-badge status-active">🟢 Active</div></>;
            case 'doctor': return <><div>Cardiologist</div><div>ID: EMP-2024-0089</div><div className="status-badge status-active">🟢 Available Now</div></>;
            case 'patient': return <><div>Patient</div><div>ID: PAT-2024-05678</div><div>Member Since: Jan 2024</div></>;
            case 'receptionist': return <><div>Front Desk Receptionist</div><div>ID: EMP-2024-0201</div><div className="status-badge status-active">🟢 On Duty</div></>;
            case 'nurse': return <><div>Registered Nurse</div><div>ID: EMP-2024-0145</div><div className="status-badge status-active">🟢 Morning Shift</div></>;
            default: return <div>{currentUser?.role}</div>;
        }
    };

    return (
        <div className="profile-settings-page animation-fade-in">
            <div className="page-header">
                <h2>⚙️ Profile Settings [{currentUser?.role.charAt(0).toUpperCase() + currentUser?.role.slice(1)}]</h2>
            </div>

            <div className="profile-settings-container">
                <div className="profile-header-card panel">
                    <div className="profile-photo-section">
                        <div className={`avatar-large ${roleColor}`}>
                            {getInitials(currentUser?.name)}
                        </div>
                        <div className="profile-photo-actions">
                            <button className="btn btn-outline btn-sm"><Camera size={14} /> Change Photo</button>
                            <div className="photo-action-links">
                                <span className="text-primary cursor-pointer">Upload</span> • <span className="text-danger cursor-pointer">Remove</span>
                            </div>
                        </div>
                    </div>
                    <div className="profile-info-section">
                        <h2>{currentUser?.name}</h2>
                        <div className="profile-role-details text-secondary">
                            {getRoleSpecificDetails()}
                        </div>
                    </div>
                    <div className="profile-completion-section">
                        <div className="completion-bar-header">
                            <span>Profile Completion:</span>
                            <span className="font-medium">82%</span>
                        </div>
                        <div className="completion-bar-bg">
                            <div className="completion-bar-fill" style={{ width: '82%' }}></div>
                        </div>
                        <div className="missing-info text-sm text-secondary mt-2">
                            <div>Missing:</div>
                            <ul>
                                <li>• Profile Photo</li>
                                <li>• Alternate Phone Number</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {hasUnsavedChanges && (
                    <div className="alert alert-warning unsaved-warning">
                        <strong>⚠️ You have unsaved changes!</strong> If you leave this page, your changes will be lost.
                        <div className="alert-actions mt-2">
                            <button className="btn btn-primary btn-sm" onClick={handleSave}>Stay & Save</button>
                        </div>
                    </div>
                )}

                <div className="profile-content">
                    {renderRoleComponent()}
                </div>

                <div className="profile-actions-footer panel">
                    <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                        <Save size={16} /> {isSaving ? 'Saving...' : '💾 Save Changes'}
                    </button>
                    <button className="btn btn-outline" onClick={handleCancel}>
                        <X size={16} /> ↩️ Cancel
                    </button>
                    {currentUser?.role === 'admin' && (
                        <button className="btn btn-outline text-secondary" style={{ marginLeft: 'auto' }}>
                            <RotateCcw size={16} /> 🔄 Reset to Default
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
