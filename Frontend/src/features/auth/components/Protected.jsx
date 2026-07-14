import { useAuth } from "../hooks/useAuth";
import { Navigate, Link } from "react-router";
import React, { useState } from 'react'
import "./Protected.scss"

const Protected = ({children}) => {
    const { loading, user, handleLogout, handleChangePassword } = useAuth()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [passwordSuccess, setPasswordSuccess] = useState("")

    if(loading){
        return (<main><h1>Loading...</h1></main>)
    }

    if(!user){
        return <Navigate to={'/login'} />
    }

    const onPasswordSubmit = async (e) => {
        e.preventDefault()
        setPasswordError("")
        setPasswordSuccess("")
        if(newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match")
            return
        }
        try {
            await handleChangePassword({ oldPassword, newPassword })
            setPasswordSuccess("Password updated successfully!")
            setTimeout(() => {
                setIsModalOpen(false)
                setPasswordSuccess("")
                setOldPassword("")
                setNewPassword("")
                setConfirmPassword("")
            }, 2000)
        } catch (err) {
            setPasswordError("Failed to update password. Check old password.")
        }
    }
    
    return (
        <div className="protected-layout">
            <nav className="navbar">
                <div className="navbar__logo">
                    <Link to="/">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px', color: '#60a5fa'}}>
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                        Prepify
                    </Link>
                </div>
                <div className="navbar__profile" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <div className="navbar__profile-trigger">
                        <span className="navbar__username">{user.username || user.email}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#94a3b8'}}>
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                    
                    {isDropdownOpen && (
                        <div className="navbar__dropdown">
                            <button onClick={() => { setIsModalOpen(true); setIsDropdownOpen(false) }}>Change Password</button>
                            <button className="text-danger" onClick={handleLogout}>Log Out</button>
                        </div>
                    )}
                </div>
            </nav>

            {isModalOpen && (
                <div className="modal-overlay" onClick={(e) => { if (e.target.className === 'modal-overlay') setIsModalOpen(false) }}>
                    <div className="modal">
                        <div className="modal__header">
                            <h2>Change Password</h2>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
                        </div>
                        <form className="modal__form" onSubmit={onPasswordSubmit}>
                            {passwordError && <div className="alert error">{passwordError}</div>}
                            {passwordSuccess && <div className="alert success">{passwordSuccess}</div>}
                            
                            <div className="form-group">
                                <label>Old Password</label>
                                <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                            </div>
                            <div className="modal__footer">
                                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? "Updating..." : "Update Password"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <main className="protected-content">
                {children}
            </main>
        </div>
    )
}

export default Protected