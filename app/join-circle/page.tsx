"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, LinkIcon, Search } from "lucide-react"

export default function JoinCirclePage() {
  const [inviteCode, setInviteCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inviteCode.trim()) {
      setError("Please enter an invite code")
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      window.location.href = "/dashboard"
    }, 1000)
  }

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
          <h1 className="text-2xl font-bold text-foreground">Join a Circle</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 border-0 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <LinkIcon className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Join an Existing Circle</h2>
            <p className="text-muted-foreground">Enter the invite code shared by a circle member to join</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" /> Invite Code
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => {
                  setInviteCode(e.target.value)
                  setError("")
                }}
                placeholder="Enter the 6-digit code (e.g., AB12CD)"
                required
                className="w-full px-4 py-3 border-2 border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none uppercase"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-red-700 text-sm">{error}</div>
            )}

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <p className="text-sm text-blue-900">
                Ask a circle member to share their invite code with you. You can usually find it in the circle settings.
              </p>
            </div>

            <div className="flex gap-4">
              <Link href="/dashboard" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/5 bg-transparent"
                >
                  Go Back
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 text-lg rounded-lg"
              >
                {loading ? "Joining..." : "Join Circle"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Alternative */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">Don't have an invite code?</p>
          <Link href="/create-circle">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 bg-transparent">
              Create Your Own Circle
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
