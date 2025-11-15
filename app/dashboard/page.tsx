"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Users, Target, TrendingUp, LogOut, Menu, User, MapPin, Plane, Hotel } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { NotificationBell } from "@/lib/notification-context"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-lg">Loading...</div>
    </div>
  }

  if (!user) {
    return null
  }

  const circles = [
    {
      id: 1,
      name: "Goa Beach Trip",
      destination: "Goa, India",
      target: 100000,
      saved: 65000,
      members: 5,
      image: "/beach-goa.jpg",
    },
    {
      id: 2,
      name: "Thailand Adventure",
      destination: "Bangkok & Phuket",
      target: 250000,
      saved: 120000,
      members: 8,
      image: "/thailand-temple.jpg",
    },
    {
      id: 3,
      name: "Kerala Backwaters",
      destination: "Kerala, India",
      target: 80000,
      saved: 45000,
      members: 4,
      image: "/kerala-backwaters.jpg",
    },
  ]

  const stats = [
    { label: "Active Circles", value: user.activeCircles.toString(), icon: Users },
    { label: "Total Saved", value: `₹${user.totalSavings.toLocaleString()}`, icon: TrendingUp },
    { label: "Rewards Earned", value: `₹${user.rewardsEarned.toLocaleString()}`, icon: Target },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-muted rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-foreground">TravelCircle</h1>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <Link href="/book-transport">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <Plane className="w-5 h-5 mr-2" />
                Transport
              </Button>
            </Link>
            <Link href="/book-hotel">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <Hotel className="w-5 h-5 mr-2" />
                Hotels
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <User className="w-5 h-5 mr-2" />
                Profile
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="text-foreground hover:text-destructive">
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h2>
          <p className="text-muted-foreground">Manage your savings circles and track your progress</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card key={i} className="p-6 border-0 bg-white shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Main Action Cards */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-foreground mb-6">What would you like to do?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Create Circle Card */}
            <Link href="/create-circle">
              <Card className="p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary cursor-pointer h-full">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground">Create Circle</h3>
                  <p className="text-muted-foreground mb-6">
                    Start a savings circle with friends and save together for your dream vacation
                  </p>
                  <Button className="bg-primary hover:bg-primary/90 text-white w-full">
                    Create New Circle
                  </Button>
                </div>
              </Card>
            </Link>

            {/* Travel Booking Card */}
            <Link href="/book-transport">
              <Card className="p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary cursor-pointer h-full">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Plane className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground">Book Transport</h3>
                  <p className="text-muted-foreground mb-6">
                    Book trains, buses, or flights to India's top tourist destinations
                  </p>
                  <Button className="bg-primary hover:bg-primary/90 text-white w-full">
                    Search Transport
                  </Button>
                </div>
              </Card>
            </Link>

            {/* Hotel Booking Card */}
            <Link href="/book-hotel">
              <Card className="p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary cursor-pointer h-full">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Hotel className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground">Book Hotel</h3>
                  <p className="text-muted-foreground mb-6">
                    Find and book hotels at top destinations with 10-12 options per city
                  </p>
                  <Button className="bg-primary hover:bg-primary/90 text-white w-full">
                    Search Hotels
                  </Button>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Circles Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-foreground">Your Circles</h3>
            <Link href="/create-circle">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <Plus className="w-5 h-5 mr-2" />
                New Circle
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {circles.map((circle) => {
              const progress = (circle.saved / circle.target) * 100
              return (
                <Card
                  key={circle.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow border-0 cursor-pointer group"
                >
                  <div className="relative h-48 bg-muted overflow-hidden">
                    <img
                      src={circle.image || "/placeholder.svg"}
                      alt={circle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {Math.round(progress)}%
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="font-bold text-lg text-foreground mb-1">{circle.name}</h4>
                    <p className="text-muted-foreground text-sm mb-4">{circle.destination}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">₹{circle.saved.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">₹{circle.target.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Members */}
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Users className="w-4 h-4 mr-1" />
                      {circle.members} members
                    </div>

                    <Link href={`/circle/${circle.id}`}>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white">View Details</Button>
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
