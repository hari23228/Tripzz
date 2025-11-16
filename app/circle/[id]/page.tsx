"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, Users, Target, Calendar, CreditCard, Share2, Settings, Clock, TrendingUp, Gift, UserPlus, Mail, Copy, Check, Plus, Wallet, History, UserMinus, Edit, IndianRupee } from "lucide-react"
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

interface Payment {
  id: string
  memberId: string
  memberName: string
  amount: number
  date: string
  type: 'online' | 'manual'
  note?: string
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
  payments?: Payment[]
}

export default function CircleDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [circle, setCircle] = useState<Circle | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'payments'>('overview')
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteCode] = useState(() => `TRIP${Math.random().toString(36).substring(2, 8).toUpperCase()}`)
  const [copied, setCopied] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showManualPaymentDialog, setShowManualPaymentDialog] = useState(false)
  const [manualPaymentAmount, setManualPaymentAmount] = useState("")
  const [manualPaymentMember, setManualPaymentMember] = useState("")
  const [manualPaymentNote, setManualPaymentNote] = useState("")

  useEffect(() => {
    // Ensure we're on the client side before accessing localStorage
    if (typeof window === 'undefined') return
    
    // Load circle from localStorage
    const savedCircles = JSON.parse(localStorage.getItem('circles') || '[]')
    const savedCircle = savedCircles.find((c: any) => c.id === params.id)
    
    if (savedCircle) {
      const endDate = new Date(savedCircle.createdAt)
      endDate.setMonth(endDate.getMonth() + parseInt(savedCircle.duration))
      
      // Get current user info (in real app, this would come from auth context)
      const currentUser = {
        id: '1',
        name: 'You',
        email: 'user@example.com'
      }
      
      // Parse invited emails if any
      const invitedMembers = savedCircle.inviteEmails
        ? savedCircle.inviteEmails.split(',').map((email: string, index: number) => ({
            id: `invited-${index + 2}`,
            name: email.trim().split('@')[0],
            email: email.trim(),
            joinedAt: new Date().toISOString(),
            totalContributed: 0,
            isAdmin: false,
            lastPayment: undefined
          }))
        : []
      
      setCircle({
        id: savedCircle.id,
        name: savedCircle.circleName,
        destination: savedCircle.destination,
        target: parseInt(savedCircle.targetAmount),
        saved: 0,
        duration: parseInt(savedCircle.duration),
        frequency: savedCircle.frequency,
        contributionAmount: savedCircle.contributionAmount,
        createdAt: savedCircle.createdAt,
        endDate: endDate.toISOString(),
        status: 'active',
        description: `Save together for an amazing trip to ${savedCircle.destination}! Target: ₹${parseInt(savedCircle.targetAmount).toLocaleString()} over ${savedCircle.duration} months.`,
        image: '/placeholder.svg',
        members: [
          {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            joinedAt: savedCircle.createdAt,
            totalContributed: 0,
            isAdmin: true,
            lastPayment: undefined
          },
          ...invitedMembers
        ],
        payments: []
      })
    } else {
      // Fallback to mock data if circle not found
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
        image: "/placeholder.svg",
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
        ],
        payments: [
          {
            id: '1',
            memberId: '1',
            memberName: 'John Doe',
            amount: 8500,
            date: '2024-01-15T00:00:00Z',
            type: 'online'
          },
          {
            id: '2',
            memberId: '2',
            memberName: 'Jane Smith',
            amount: 8500,
            date: '2024-01-12T00:00:00Z',
            type: 'manual',
            note: 'Cash payment'
          }
        ]
      }
      setCircle(mockCircle)
    }
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
    if (typeof window === 'undefined') return
    
    setPaymentSuccess(true)
    const updatedCircle = { ...circle, saved: circle.saved + circle.contributionAmount }
    setCircle(prev => prev ? updatedCircle : null)
    
    // Update localStorage
    const savedCircles = JSON.parse(localStorage.getItem('circles') || '[]')
    const updatedCircles = savedCircles.map((c: any) => 
      c.id === circle.id ? { ...c, currentAmount: updatedCircle.saved } : c
    )
    localStorage.setItem('circles', JSON.stringify(updatedCircles))
    
    setTimeout(() => setPaymentSuccess(false), 5000)
  }

  const handleInviteByEmail = () => {
    if (!inviteEmail) return
    alert(`Invitation sent to ${inviteEmail}!`)
    setInviteEmail("")
    setShowInviteDialog(false)
  }

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleManualPayment = () => {
    if (typeof window === 'undefined') return
    
    if (!manualPaymentAmount || !manualPaymentMember) {
      alert('Please fill in all required fields')
      return
    }

    const amount = parseFloat(manualPaymentAmount)
    const newPayment: Payment = {
      id: Date.now().toString(),
      memberId: manualPaymentMember,
      memberName: circle.members.find(m => m.id === manualPaymentMember)?.name || 'Unknown',
      amount,
      date: new Date().toISOString(),
      type: 'manual',
      note: manualPaymentNote
    }

    const updatedCircle = {
      ...circle,
      saved: circle.saved + amount,
      members: circle.members.map(m => 
        m.id === manualPaymentMember 
          ? { ...m, totalContributed: m.totalContributed + amount, lastPayment: new Date().toISOString() }
          : m
      ),
      payments: [...(circle.payments || []), newPayment]
    }

    setCircle(updatedCircle)

    // Update localStorage
    const savedCircles = JSON.parse(localStorage.getItem('circles') || '[]')
    const updatedCircles = savedCircles.map((c: any) => 
      c.id === circle.id ? { ...c, currentAmount: updatedCircle.saved, members: updatedCircle.members, payments: updatedCircle.payments } : c
    )
    localStorage.setItem('circles', JSON.stringify(updatedCircles))

    setManualPaymentAmount("")
    setManualPaymentMember("")
    setManualPaymentNote("")
    setShowManualPaymentDialog(false)
    alert('Manual payment recorded successfully!')
  }

  const handleRemoveMember = (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      setCircle(prev => prev ? { ...prev, members: prev.members.filter(m => m.id !== memberId) } : null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
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
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Members</DialogTitle>
                  <DialogDescription>
                    Invite friends to join your circle via email or share the invite code
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Invite by Email</label>
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="friend@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                      <Button onClick={handleInviteByEmail}>
                        <Mail className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium mb-2 block">Share Invite Code</label>
                    <div className="flex gap-2">
                      <Input value={inviteCode} readOnly className="font-mono" />
                      <Button onClick={handleCopyInviteCode} variant="outline">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Share this code with friends to join your circle
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
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
                style={{ width: `${Math.min(progress, 100)}%` }}
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
                <div className="text-2xl font-bold text-foreground">{Math.max(daysRemaining, 0)}</div>
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

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  <div className="grid grid-cols-2 gap-3">
                    <PaymentButton
                      amount={circle.contributionAmount}
                      circleId={circle.id}
                      description={`Monthly contribution to ${circle.name}`}
                      onSuccess={handlePaymentSuccess}
                      onError={(error) => console.error('Payment error:', error)}
                      className="w-full"
                    />
                    <Dialog open={showManualPaymentDialog} onOpenChange={setShowManualPaymentDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Wallet className="w-4 h-4 mr-2" />
                          Manual Payment
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Record Manual Payment</DialogTitle>
                          <DialogDescription>
                            Add a cash or offline payment to the circle
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Select Member</label>
                            <select
                              className="w-full px-3 py-2 border border-border rounded-md"
                              value={manualPaymentMember}
                              onChange={(e) => setManualPaymentMember(e.target.value)}
                            >
                              <option value="">Select member</option>
                              {circle.members.map(member => (
                                <option key={member.id} value={member.id}>{member.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Amount (₹)</label>
                            <Input
                              type="number"
                              placeholder="Enter amount"
                              value={manualPaymentAmount}
                              onChange={(e) => setManualPaymentAmount(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Note (Optional)</label>
                            <Input
                              placeholder="e.g., Cash payment, Bank transfer"
                              value={manualPaymentNote}
                              onChange={(e) => setManualPaymentNote(e.target.value)}
                            />
                          </div>
                          <Button onClick={handleManualPayment} className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Record Payment
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card className="p-6 border-0 shadow-sm">
                  <h3 className="text-xl font-bold text-foreground mb-4">Member Contributions</h3>
                  <div className="space-y-3">
                    {circle.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">{member.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium text-foreground flex items-center gap-2">
                              {member.name}
                              {member.isAdmin && <Badge variant="secondary" className="text-xs">Admin</Badge>}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {member.lastPayment ? `Last: ${new Date(member.lastPayment).toLocaleDateString()}` : 'No payments yet'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">₹{member.totalContributed.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round((member.totalContributed / circle.target) * 100)}% of target
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
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
                      <Badge variant={circle.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                        {circle.status}
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Progress Chart */}
                <Card className="p-6 border-0 shadow-sm">
                  <h3 className="text-lg font-bold text-foreground mb-4">Savings Progress</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Target</span>
                      <span className="font-medium">₹{circle.target.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Saved</span>
                      <span className="font-medium text-green-600">₹{circle.saved.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className="font-medium">₹{Math.max(circle.target - circle.saved, 0).toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <Card className="p-6 border-0 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-foreground">Circle Members ({circle.members.length})</h3>
                <Button onClick={() => setShowInviteDialog(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {circle.members.map((member) => (
                  <Card key={member.id} className="p-4 border">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium text-primary">{member.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-foreground flex items-center gap-2">
                            {member.name}
                            {member.isAdmin && <Badge variant="secondary" className="text-xs">Admin</Badge>}
                          </div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Joined: {new Date(member.joinedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      {!member.isAdmin && (
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id)}>
                          <UserMinus className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <Separator className="my-3" />
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Contributed</div>
                        <div className="font-bold text-green-600">₹{member.totalContributed.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Progress</div>
                        <div className="font-bold">{Math.round((member.totalContributed / circle.target) * 100)}%</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="p-6 border-0 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-foreground">Payment History</h3>
                <Button onClick={() => setShowManualPaymentDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Manual Payment
                </Button>
              </div>
              {circle.payments && circle.payments.length > 0 ? (
                <div className="space-y-3">
                  {circle.payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          payment.type === 'online' ? 'bg-blue-50' : 'bg-green-50'
                        }`}>
                          {payment.type === 'online' ? (
                            <CreditCard className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Wallet className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{payment.memberName}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(payment.date).toLocaleDateString()} • {payment.type === 'online' ? 'Online Payment' : 'Manual Payment'}
                          </div>
                          {payment.note && (
                            <div className="text-xs text-muted-foreground mt-1">Note: {payment.note}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600 flex items-center gap-1">
                          <IndianRupee className="w-4 h-4" />
                          {payment.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No payment history yet</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
