"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { TrendingUp, Users, Target, Plane, MapPin, Hotel } from "lucide-react"

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card">
      {/* Navigation */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-transparent"}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground">TravelCircle</span>
          </div>
          <div className="flex gap-4">
            <Link href="/book-transport">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <MapPin className="w-4 h-4 mr-2" />
                Book Transport
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="text-foreground hover:text-primary">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 leading-tight">
            Save Together,
            <span className="text-primary"> Travel Together</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create savings circles with friends or book your next adventure to India's top destinations
          </p>
        </div>

        {/* Main Options Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
          {/* Create Circle Card */}
          <Link href="/create-circle">
            <Card className="p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary cursor-pointer h-full">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">Create Circle</h2>
                <p className="text-muted-foreground mb-6">
                  Start a savings circle with friends and family. Save together for your dream vacation and reach your goals faster.
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg w-full">
                  Go to Circle Dashboard
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
                <h2 className="text-3xl font-bold mb-4 text-foreground">Travel Booking</h2>
                <p className="text-muted-foreground mb-6">
                  Book trains, buses, or flights to India's top 10 tourist destinations. Quick, easy, and convenient booking.
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg w-full">
                  Go to Booking Dashboard
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
                <h2 className="text-3xl font-bold mb-4 text-foreground">Hotel Booking</h2>
                <p className="text-muted-foreground mb-6">
                  Find and book hotels at top destinations. Choose from 10-12 options per city with great prices and amenities.
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg w-full">
                  Search Hotels
                </Button>
              </div>
            </Card>
          </Link>
        </div>

        {/* Learn More Button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={scrollToFeatures}
            className="px-8 py-3 text-lg rounded-full border-foreground/20 text-foreground hover:bg-foreground/5"
          >
            Learn More About How It Works
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Active Circles", value: "2.5K+" },
            { label: "Members Saving", value: "15K+" },
            { label: "Trips Funded", value: "8.2K" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 text-foreground">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Users,
              title: "Create a Circle",
              description: "Invite friends and family to join your savings group",
            },
            {
              icon: Target,
              title: "Set Your Goal",
              description: "Define your dream destination and target amount",
            },
            {
              icon: TrendingUp,
              title: "Save Together",
              description: "Track progress as everyone contributes regularly",
            },
            {
              icon: Plane,
              title: "Travel Together",
              description: "Reach your goal and book that amazing trip",
            },
          ].map((feature, i) => {
            const Icon = feature.icon
            return (
              <Card key={i} className="p-6 hover:shadow-lg transition-shadow border-0 bg-white">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Why Choose TravelCircle?</h2>
              <ul className="space-y-4">
                {[
                  "Secure, transparent transactions",
                  "Real-time progress tracking",
                  "Flexible contribution schedules",
                  "Automated reminders and updates",
                  "Community rewards and bonuses",
                  "Multiple destination options",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <Card className="p-8 bg-white text-foreground border-0">
              <h3 className="text-2xl font-bold mb-4">Ready to start saving?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of travelers already saving for their dream vacations with TravelCircle.
              </p>
              <Link href="/signup">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg rounded-lg">
                  Create Your First Circle
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Start Your Travel Savings Circle Today</h2>
          <p className="text-muted-foreground mb-8">No credit card required. Free to join.</p>
          <Link href="/signup">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg rounded-full">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
