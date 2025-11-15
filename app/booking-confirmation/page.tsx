"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Train, Bus, Plane, Calendar, MapPin, Clock, IndianRupee, Download, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { TransportOption, Destination } from "@/lib/tourist-destinations"

interface BookingData {
  transport: TransportOption
  destination: Destination
  from: string
  travelDate: string
  bookedAt: string
}

export default function BookingConfirmationPage() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [bookingId] = useState(() => `TRP${Date.now().toString().slice(-8)}`)

  useEffect(() => {
    const data = sessionStorage.getItem("bookingData")
    if (data) {
      setBookingData(JSON.parse(data))
    } else {
      // Redirect if no booking data
      router.push("/book-transport")
    }
  }, [router])

  if (!bookingData) {
    return null
  }

  const getTransportIcon = (type: string) => {
    switch (type) {
      case "train":
        return <Train className="w-6 h-6" />
      case "bus":
        return <Bus className="w-6 h-6" />
      case "flight":
        return <Plane className="w-6 h-6" />
    }
  }

  const handleDownloadTicket = () => {
    // In production, this would generate a PDF ticket
    alert("Ticket download functionality will be implemented with PDF generation")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Your {bookingData.transport.type} booking has been successfully confirmed
          </p>
          <div className="mt-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Booking ID: {bookingId}
            </Badge>
          </div>
        </div>

        {/* Booking Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getTransportIcon(bookingData.transport.type)}
              Booking Details
            </CardTitle>
            <CardDescription>
              Please save this information for your travel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Transport Information */}
            <div>
              <h3 className="font-semibold mb-3">Transport Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Transport Type</div>
                  <div className="font-medium capitalize">{bookingData.transport.type}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Service Name</div>
                  <div className="font-medium">{bookingData.transport.name}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Operator</div>
                  <div className="font-medium">{bookingData.transport.operator}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {bookingData.transport.duration}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Journey Details */}
            <div>
              <h3 className="font-semibold mb-3">Journey Details</h3>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Departure</div>
                  <div className="text-2xl font-bold">{bookingData.transport.departureTime}</div>
                  <div className="text-sm text-muted-foreground mt-1 capitalize">{bookingData.from}</div>
                </div>
                
                <div className="flex-1 flex items-center justify-center px-4">
                  <div className="w-full border-t-2 border-dashed border-primary relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2">
                      {getTransportIcon(bookingData.transport.type)}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Arrival</div>
                  <div className="text-2xl font-bold">{bookingData.transport.arrivalTime}</div>
                  <div className="text-sm text-muted-foreground mt-1">{bookingData.destination.name}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Travel Date
                  </div>
                  <div className="font-medium">
                    {format(new Date(bookingData.travelDate), "PPPP")}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Destination
                  </div>
                  <div className="font-medium">
                    {bookingData.destination.name}, {bookingData.destination.state}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Details */}
            <div>
              <h3 className="font-semibold mb-3">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Fare</span>
                  <span className="font-medium flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {bookingData.transport.price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes & Fees</span>
                  <span className="font-medium flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {Math.round(bookingData.transport.price * 0.05)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount Paid</span>
                  <span className="flex items-center gap-1 text-green-600">
                    <IndianRupee className="w-5 h-5" />
                    {Math.round(bookingData.transport.price * 1.05)}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Booking Timestamp */}
            <div className="text-sm text-muted-foreground">
              Booked on: {format(new Date(bookingData.bookedAt), "PPpp")}
            </div>
          </CardContent>
        </Card>

        {/* Destination Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>About {bookingData.destination.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{bookingData.destination.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookingData.destination.trainStations.length > 0 && (
                <div>
                  <div className="text-sm font-semibold mb-2 flex items-center gap-1">
                    <Train className="w-4 h-4" />
                    Railway Stations
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {bookingData.destination.trainStations.map((station, idx) => (
                      <li key={idx}>• {station}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {bookingData.destination.busStands.length > 0 && (
                <div>
                  <div className="text-sm font-semibold mb-2 flex items-center gap-1">
                    <Bus className="w-4 h-4" />
                    Bus Stands
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {bookingData.destination.busStands.map((stand, idx) => (
                      <li key={idx}>• {stand}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleDownloadTicket} size="lg" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download Ticket
          </Button>
          <Link href="/book-transport" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Book Another Trip
            </Button>
          </Link>
        </div>

        {/* Important Notes */}
        <Card className="mt-6 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2">Important Notes:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Please arrive at the {bookingData.transport.type === "flight" ? "airport" : "station"} at least {bookingData.transport.type === "flight" ? "2 hours" : "30 minutes"} before departure</li>
              <li>• Carry a valid government-issued ID proof</li>
              <li>• Download or take a screenshot of this confirmation</li>
              <li>• Check {bookingData.transport.operator} website for any schedule changes</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
