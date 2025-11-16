"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, MapPin, DollarSign, Users, Clock, Mail, Calculator } from "lucide-react"

export default function CreateCirclePage() {
  const [formData, setFormData] = useState({
    circleName: "",
    destination: "",
    targetAmount: "",
    memberLimit: "",
    frequency: "monthly",
    duration: "12",
    contributionAmount: "",
    inviteEmails: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const calculateContribution = () => {
    const target = parseInt(formData.targetAmount)
    const members = parseInt(formData.memberLimit)
    const duration = parseInt(formData.duration)
    
    if (target && members && duration) {
      const totalContributions = duration * (formData.frequency === 'monthly' ? 1 : formData.frequency === 'weekly' ? 4.33 : 0.33)
      const perPersonPerPeriod = Math.ceil(target / (members * totalContributions))
      return perPersonPerPeriod
    }
    return 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.circleName || !formData.destination || !formData.targetAmount || !formData.memberLimit) {
      return
    }
    
    setLoading(true)
    
    // Create circle data
    const circleId = Date.now().toString()
    const circleData = {
      ...formData,
      id: circleId,
      createdBy: '1', // Current user ID
      createdAt: new Date().toISOString(),
      contributionAmount: calculateContribution(),
      status: 'active',
      currentAmount: 0,
      members: [
        {
          id: '1',
          name: 'Current User',
          email: 'user@example.com',
          joinedAt: new Date().toISOString(),
          totalContributed: 0,
          isAdmin: true
        }
      ]
    }
    
    // Save circle data to localStorage for demo
    const circles = JSON.parse(localStorage.getItem('circles') || '[]')
    circles.push(circleData)
    localStorage.setItem('circles', JSON.stringify(circles))
    
    console.log('Creating circle:', circleData)
    
    setTimeout(() => {
      setLoading(false)
      // Redirect to the newly created circle's detail page
      window.location.href = `/circle/${circleId}`
    }, 1500)
  }

  const destinations = [
    "Goa, India",
    "Kerala, India",
    "Manali, India",
    "Thailand",
    "Bali, Indonesia",
    "Singapore",
    "Dubai",
    "Maldives",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="p-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create New Circle</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 border-0 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Circle Name</label>
              <input
                type="text"
                name="circleName"
                value={formData.circleName}
                onChange={handleChange}
                placeholder="e.g., Summer Beach Trip"
                required
                className="w-full px-4 py-3 border-2 border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Destination
              </label>
              <select
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Select a destination</option>
                {destinations.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Target Savings Amount (₹)
              </label>
              <input
                type="number"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                placeholder="100,000"
                required
                min="0"
                className="w-full px-4 py-3 border-2 border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Member Limit
                </label>
                <input
                  type="number"
                  name="memberLimit"
                  value={formData.memberLimit}
                  onChange={handleChange}
                  placeholder="5"
                  required
                  min="2"
                  max="100"
                  className="w-full px-4 py-3 border-2 border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Duration (Months)
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="6">6 Months</option>
                  <option value="9">9 Months</option>
                  <option value="12">12 Months</option>
                  <option value="18">18 Months</option>
                  <option value="24">24 Months</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Contribution Frequency</label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>

            {/* Calculated Contribution Amount */}
            {formData.targetAmount && formData.memberLimit && formData.duration && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Calculated Contribution</span>
                </div>
                <div className="text-2xl font-bold text-primary mb-1">
                  ₹{calculateContribution().toLocaleString()} per person
                </div>
                <div className="text-sm text-muted-foreground">
                  Per {formData.frequency} payment • Total {formData.duration} months
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Invite Members (Optional)
              </label>
              <textarea
                name="inviteEmails"
                value={formData.inviteEmails}
                onChange={handleChange}
                placeholder="Enter email addresses separated by commas&#10;e.g., friend1@email.com, friend2@email.com"
                rows={3}
                className="w-full px-4 py-3 border-2 border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can invite members later from the circle dashboard
              </p>
            </div>

            <div className="bg-primary/5 border-l-4 border-primary p-4 rounded">
              <p className="text-sm text-foreground">
                <strong>Pro Tip:</strong> Create a circle with friends, set a realistic target amount, and enjoy saving
                together!
              </p>
            </div>

            <div className="flex gap-4">
              <Link href="/dashboard" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/5 bg-transparent"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 text-lg rounded-lg"
              >
                {loading ? "Creating..." : "Create Circle"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
