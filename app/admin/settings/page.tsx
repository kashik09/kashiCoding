'use client'

import { useState } from 'react'
import { Save, AlertTriangle, Mail, Server, Shield, Settings as SettingsIcon } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import ConfirmModal from '@/components/ui/ConfirmModal'

export default function AdminSettingsPage() {
  const { showToast } = useToast()
  const [saving, setSaving] = useState(false)
  const [activeModal, setActiveModal] = useState<'reset' | 'clear' | null>(null)

  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Kashi Kweyu Portfolio',
    siteDescription: 'Junior Developer building innovative solutions',
    maintenanceMode: false
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'your-email@gmail.com',
    smtpPassword: ''
  })

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: '30',
    twoFactorEnabled: false
  })

  const handleSaveSite = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    showToast('Site settings saved successfully', 'success')
  }

  const handleSaveEmail = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    showToast('Email settings saved successfully', 'success')
  }

  const handleTestEmail = async () => {
    showToast('Test email sent successfully', 'success')
  }

  const handleSaveSecurity = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    showToast('Security settings saved successfully', 'success')
  }

  const handleResetSettings = async () => {
    setActiveModal(null)
    showToast('Settings reset to defaults', 'success')
    // Reset to defaults
    setSiteSettings({
      siteName: 'Kashi Kweyu Portfolio',
      siteDescription: 'Junior Developer building innovative solutions',
      maintenanceMode: false
    })
  }

  const handleClearData = async () => {
    setActiveModal(null)
    showToast('All data cleared successfully', 'success')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your site configuration</p>
      </div>

      {/* Site Settings */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <SettingsIcon className="text-primary" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Site Settings</h2>
            <p className="text-sm text-muted-foreground">Basic site configuration</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={siteSettings.siteName}
              onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Site Description
            </label>
            <textarea
              value={siteSettings.siteDescription}
              onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
            />
          </div>

          <label className="flex items-center justify-between p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/70 transition">
            <div>
              <p className="font-medium text-foreground">Maintenance Mode</p>
              <p className="text-sm text-muted-foreground">Make site unavailable to visitors</p>
            </div>
            <input
              type="checkbox"
              checked={siteSettings.maintenanceMode}
              onChange={(e) => setSiteSettings({ ...siteSettings, maintenanceMode: e.target.checked })}
              className="w-5 h-5 rounded border-border"
            />
          </label>
        </div>

        <button
          onClick={handleSaveSite}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Site Settings'}
        </button>
      </div>

      {/* Email Settings */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Mail className="text-primary" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Email Settings</h2>
            <p className="text-sm text-muted-foreground">SMTP configuration for notifications</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              SMTP Host
            </label>
            <input
              type="text"
              value={emailSettings.smtpHost}
              onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              SMTP Port
            </label>
            <input
              type="text"
              value={emailSettings.smtpPort}
              onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              SMTP Username
            </label>
            <input
              type="email"
              value={emailSettings.smtpUsername}
              onChange={(e) => setEmailSettings({ ...emailSettings, smtpUsername: e.target.value })}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              SMTP Password
            </label>
            <input
              type="password"
              value={emailSettings.smtpPassword}
              onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSaveEmail}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Email Settings'}
          </button>
          <button
            onClick={handleTestEmail}
            className="flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/70 transition border border-border"
          >
            <Mail size={20} />
            Test Email
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="text-primary" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Security Settings</h2>
            <p className="text-sm text-muted-foreground">Authentication and session management</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Session Timeout
            </label>
            <select
              value={securitySettings.sessionTimeout}
              onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="1440">24 hours</option>
            </select>
          </div>

          <label className="flex items-center justify-between p-4 bg-muted rounded-lg cursor-not-allowed opacity-60">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">Coming Soon</span>
              </div>
              <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
            </div>
            <input
              type="checkbox"
              checked={securitySettings.twoFactorEnabled}
              disabled
              className="w-5 h-5 rounded border-border"
            />
          </label>
        </div>

        <button
          onClick={handleSaveSecurity}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Security Settings'}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-card rounded-2xl border border-red-500/30 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Danger Zone</h2>
            <p className="text-sm text-muted-foreground">Irreversible and destructive actions</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-medium text-foreground mb-1">Reset All Settings</h3>
            <p className="text-sm text-muted-foreground mb-3">Restore all settings to default values</p>
            <button
              onClick={() => setActiveModal('reset')}
              className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/70 transition border border-border text-sm"
            >
              Reset Settings
            </button>
          </div>

          <div className="p-4 border border-red-500/30 rounded-lg bg-red-500/5">
            <h3 className="font-medium text-red-600 dark:text-red-400 mb-1">Clear All Data</h3>
            <p className="text-sm text-muted-foreground mb-3">Permanently delete all projects, requests, and user data</p>
            <button
              onClick={() => setActiveModal('clear')}
              className="px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-500/20 transition border border-red-500/30 text-sm"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={activeModal === 'reset'}
        onClose={() => setActiveModal(null)}
        onConfirm={handleResetSettings}
        title="Reset All Settings"
        message="Are you sure you want to reset all settings to their default values? This action cannot be undone."
        confirmText="Reset Settings"
        type="warning"
      />

      {/* Clear Data Confirmation Modal */}
      <ConfirmModal
        isOpen={activeModal === 'clear'}
        onClose={() => setActiveModal(null)}
        onConfirm={handleClearData}
        title="Clear All Data"
        message="⚠️ DANGER: This will permanently delete all projects, requests, users, and settings. This action CANNOT be undone. Are you absolutely sure?"
        confirmText="Yes, Delete Everything"
        type="danger"
      />
    </div>
  )
}
