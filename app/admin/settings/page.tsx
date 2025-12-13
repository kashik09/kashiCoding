'use client'

import { useState } from 'react'
import { Save, User, Bell, Shield, Globe, Palette } from 'lucide-react'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)

  const [settings, setSettings] = useState({
    name: 'Ashanti Kweyu',
    email: 'kashi@example.com',
    bio: 'Junior Developer from Kampala, Uganda',
    notifications: {
      email: true,
      requests: true,
      comments: false
    },
    security: {
      twoFactor: false,
      sessionTimeout: '30'
    },
    site: {
      maintenanceMode: false,
      allowRegistration: false
    }
  })

  const handleSave = async () => {
    setSaving(true)
    // TODO: Save to database
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    alert('Settings saved successfully!')
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'site', label: 'Site Settings', icon: Globe }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-foreground/70">Manage your account and site settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-secondary rounded-2xl border border-border p-4 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === tab.id
                    ? 'bg-primary text-accent border-l-2 border-accent'
                    : 'text-foreground/70 hover:bg-primary/50'
                }`}
              >
                <tab.icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-secondary rounded-2xl border border-border p-6 space-y-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground">Profile Settings</h2>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    className="w-full px-4 py-2 bg-primary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-4 py-2 bg-primary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bio
                  </label>
                  <textarea
                    value={settings.bio}
                    onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-primary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition resize-none"
                  />
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground">Notification Preferences</h2>

                <label className="flex items-center justify-between p-4 bg-primary rounded-lg cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-foreground/70">Receive email updates</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, email: e.target.checked }
                    })}
                    className="w-5 h-5 rounded border-border"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-primary rounded-lg cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">Request Notifications</p>
                    <p className="text-sm text-foreground/70">Get notified of new service requests</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.requests}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, requests: e.target.checked }
                    })}
                    className="w-5 h-5 rounded border-border"
                  />
                </label>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground">Security Settings</h2>

                <label className="flex items-center justify-between p-4 bg-primary rounded-lg cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-foreground/70">Add an extra layer of security</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactor}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, twoFactor: e.target.checked }
                    })}
                    className="w-5 h-5 rounded border-border"
                  />
                </label>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, sessionTimeout: e.target.value }
                    })}
                    className="w-full px-4 py-2 bg-primary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* Site Settings Tab */}
            {activeTab === 'site' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground">Site Settings</h2>

                <label className="flex items-center justify-between p-4 bg-primary rounded-lg cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">Maintenance Mode</p>
                    <p className="text-sm text-foreground/70">Make site unavailable to visitors</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.site.maintenanceMode}
                    onChange={(e) => setSettings({
                      ...settings,
                      site: { ...settings.site, maintenanceMode: e.target.checked }
                    })}
                    className="w-5 h-5 rounded border-border"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-primary rounded-lg cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">Allow Registration</p>
                    <p className="text-sm text-foreground/70">Allow new users to register</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.site.allowRegistration}
                    onChange={(e) => setSettings({
                      ...settings,
                      site: { ...settings.site, allowRegistration: e.target.checked }
                    })}
                    className="w-5 h-5 rounded border-border"
                  />
                </label>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-6 border-t border-border">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition disabled:opacity-50"
              >
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
