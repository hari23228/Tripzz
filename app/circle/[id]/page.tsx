"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Users, Target, Calendar, CreditCard, Share2, Settings, Clock, TrendingUp, Gift, UserPlus } from "lucide-react"
import { PaymentButton } from "@/lib/payment-context"
import { useRouter } from "next/navigation"

interface CircleMember {
  id: string
  name: string
  email: string
  joinedAt: string
  totalContributed: number
  isAdmin: boolean
  profileImage?: string
  lastPayment?: string
}

interface Circle {
  id: string
  name: string
  destination: string
  target: number
  saved: number
  members: CircleMember[]
  duration: number
  frequency: string
  contributionAmount: number
  createdAt: string
  endDate: string
  status: string
  image?: string
  description?: string
}

export default function CircleDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [circle, setCircle] = useState<Circle | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'payments' | 'settings'>('overview')
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    // Mock circle data
    const mockCircle: Circle = {
      id: params.id,
      name: "Goa Beach Trip",
      destination: "Goa, India",
      target: 100000,
      saved: 65000,
      duration: 12,
      frequency: "monthly",
      contributionAmount: 8500,
      createdAt: "2024-01-01T00:00:00Z",
      endDate: "2024-12-31T23:59:59Z",
      status: "active",
      description: "Join us for an amazing beach vacation in Goa! We'll stay at a beautiful resort, enjoy water sports, and explore local culture.",
      image: "/goa-beach.jpg",
      members: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          joinedAt: '2024-01-01T00:00:00Z',
          totalContributed: 25500,
          isAdmin: true,
          lastPayment: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          joinedAt: '2024-01-02T00:00:00Z',
          totalContributed: 17000,
          isAdmin: false,
          lastPayment: '2024-01-12T00:00:00Z'
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          joinedAt: '2024-01-03T00:00:00Z',
          totalContributed: 22500,
          isAdmin: false,
          lastPayment: '2024-01-14T00:00:00Z'
        }
      ]
    }
    setCircle(mockCircle)
  }, [params.id])

  if (!circle) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-lg">Loading...</div>
    </div>
  }

  const progress = (circle.saved / circle.target) * 100
  const daysRemaining = Math.ceil((new Date(circle.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const rewardAmount = Math.floor(circle.saved * 0.02) // 2% reward

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true)
    // Update circle saved amount
    setCircle(prev => prev ? { ...prev, saved: prev.saved + circle.contributionAmount } : null)
    setTimeout(() => setPaymentSuccess(false), 5000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="p-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{circle.name}</h1>
              <p className="text-sm text-muted-foreground">{circle.destination}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      {paymentSuccess && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <p className="text-green-800 font-medium">✅ Payment successful! Your contribution has been added to the circle.</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative h-64 rounded-lg overflow-hidden mb-8">
          <img 
            src={circle.image || "/placeholder.svg"} 
            alt={circle.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-end">
            <div className="p-6 text-white">
              <h2 className="text-3xl font-bold mb-2">{circle.destination}</h2>
              <p className="text-lg opacity-90">{circle.description}</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-0 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">₹{circle.saved.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">of ₹{circle.target.toLocaleString()}</div>
              </div>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">{Math.round(progress)}% complete</div>
          </Card>

          <Card className="p-6 border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{circle.members.length}</div>
                <div className="text-sm text-muted-foreground">Members</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{daysRemaining}</div>
                <div className="text-sm text-muted-foreground">Days left</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">₹{rewardAmount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Rewards earned</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Contribution Card */}
            <Card className="p-6 border-0 shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-4">Make Your Contribution</h3>
              <div className="bg-primary/5 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-foreground">Monthly Contribution</span>
                  <span className="text-2xl font-bold text-primary">₹{circle.contributionAmount.toLocaleString()}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Next payment due: {new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </div>
              </div>
              <PaymentButton
                amount={circle.contributionAmount}
                circleId={circle.id}
                description={`Monthly contribution to ${circle.name}`}
                onSuccess={handlePaymentSuccess}
                onError={(error) => console.error('Payment error:', error)}
                className="w-full"
              />
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 border-0 shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {circle.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{member.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{member.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.lastPayment ? `Last payment: ${new Date(member.lastPayment).toLocaleDateString()}` : 'No payments yet'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">₹{member.totalContributed.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">total contributed</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Invite Members */}
            <Card className="p-6 border-0 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">Invite Friends</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Invite friends to join your circle and save together!
              </p>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Send Invites
              </Button>
            </Card>

            {/* Circle Info */}
            <Card className="p-6 border-0 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">Circle Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{circle.duration} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frequency</span>
                  <span className="font-medium capitalize">{circle.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">{new Date(circle.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium text-green-600 capitalize">{circle.status}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
