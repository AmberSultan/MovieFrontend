"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { useRouter } from "next/navigation";

interface Ticket {
  _id: string;
  movie: Movie;
  hall: Hall;
  seat: string[];
  totalSeats: number;
  totalPrice: number;
}

interface Movie {
  _id: string;
  title: string;
  schedule: {
    date: string;
    showtiming: string;
  }[];
}

interface Hall {
  _id: string;
  hallname: string;
}

const Page = () => {
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const router = useRouter();

  // Dummy data for tickets
  const dummyTickets: Ticket[] = [
    {
      _id: "ticket1",
      movie: {
        _id: "1",
        title: "The Amazing Spiderman",
        schedule: [
          { date: "10/03/2025", showtiming: "2:00 PM" },
          { date: "10/03/2025", showtiming: "6:00 PM" }
        ]
      },
      hall: {
        _id: "hall1",
        hallname: "Hall A"
      },
      seat: ["A1", "A2", "A3"],
      totalSeats: 3,
      totalPrice: 2100
    },
    {
      _id: "ticket2",
      movie: {
        _id: "2",
        title: "Jungle Jamboree",
        schedule: [
          { date: "10/03/2025", showtiming: "1:00 PM" },
          { date: "10/03/2025", showtiming: "4:00 PM" }
        ]
      },
      hall: {
        _id: "hall2",
        hallname: "IMAX Theater"
      },
      seat: ["B4", "B5"],
      totalSeats: 2,
      totalPrice: 1400
    }
  ];

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const seatsFromUrl = queryParams.get("seats");
    const hallIdFromUrl = queryParams.get("hallId");
    const totalPriceFromUrl = queryParams.get("total");

    if (seatsFromUrl) {
      const seatsArray = seatsFromUrl.split(",");
      setSelectedSeats(seatsArray);
      generateDummyTicket(seatsArray, hallIdFromUrl, totalPriceFromUrl);
    }
  }, []);

  const generateDummyTicket = (seatsArray: string[], hallId: string | null, totalPrice: string | null) => {
    // Create a dummy ticket based on the selected seats
    const dummyHall = hallId 
      ? { _id: hallId, hallname: `Hall ${hallId.charAt(hallId.length - 1).toUpperCase()}` }
      : { _id: "hall1", hallname: "Hall A" };

    const calculatedTotalPrice = totalPrice ? parseInt(totalPrice) : seatsArray.length * 700;

    const dummyTicket: Ticket = {
      _id: `ticket_${Date.now()}`,
      movie: {
        _id: "1",
        title: "The Amazing Spiderman",
        schedule: [
          { date: new Date().toLocaleDateString(), showtiming: "6:00 PM" },
          { date: new Date(Date.now() + 86400000).toLocaleDateString(), showtiming: "2:00 PM" }
        ]
      },
      hall: dummyHall,
      seat: seatsArray,
      totalSeats: seatsArray.length,
      totalPrice: calculatedTotalPrice
    };

    setFilteredTickets([dummyTicket]);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const newErrors: { name?: string; email?: string; phone?: string } = {};

    if (!name) {
      newErrors.name = "Name is required.";
    }
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10,15}$/.test(phone)) {
      newErrors.phone = "Phone number is invalid.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});

      if (filteredTickets.length > 0) {
        const ticket = filteredTickets[0];
        
        // Build the query string manually
        const queryString = new URLSearchParams({
          seats: selectedSeats.join(","),
          name,
          email,
          phone,
          movieTitle: ticket.movie.title,
          hallName: ticket.hall.hallname,
          totalSeats: ticket.totalSeats.toString(),
          totalPrice: ticket.totalPrice.toString(),
          bookingDate: new Date().toLocaleDateString(),
          showtime: `${ticket.movie.schedule[0].date} at ${ticket.movie.schedule[0].showtiming}`,
        }).toString();

        // Navigate using router.push with a string
        router.push(`/ticket/recipient?${queryString}`);
      }
    }
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <div className="bg-black text-center py-4 text-white text-sm">
        UNLIMITED MOVIES OF YOUR CHOICE
      </div>
      <h1 className="font-bold text-3xl md:text-3xl text-center py-10">Your Ticket</h1>
      <div className="grid gap-4 md:grid-cols-2 max-w-6xl mx-auto">
        <div className="p-4 mt-4 w-full">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket: Ticket) => (
              <div key={ticket._id} className="mb-4 p-6 border border-gray-500 rounded-lg  shadow-lg">
                <h2 className="text-2xl font-bold text-center text-white-800 mb-4">
                  {ticket.movie.title}
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold text-white-700">Hall:</span>
                    <span className="text-white-700">{ticket.hall.hallname}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold text-white-700">Seats:</span>
                    <span className="text-white-700font-mono">{ticket.seat.join(", ")}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold text-white-700">Total Seats:</span>
                    <span className="text-white-700">{ticket.totalSeats}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold text-white-700">Show Time:</span>
                    <span className="text-white-700">
                      {ticket.movie.schedule[0].date} at {ticket.movie.schedule[0].showtiming}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold text-white-700">Booking Date:</span>
                    <span className="text-green-600 font-semibold">{new Date().toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-lg text-white-800">Total Price:</span>
                    <span className="text-xl font-bold text-red-700">Rs. {ticket.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8 border border-gray-300 rounded-lg">
              <p className="text-gray-600">No ticket information available</p>
              <p className="text-sm text-gray-500 mt-2">Please select seats first</p>
            </div>
          )}
        </div>

        <div className="p-4 w-full">
          <div className=" p-6 rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-xl font-bold text-white-800 mb-6 text-center">Personal Information</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`mt-1 p-3 block w-full border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors`}
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                />
                {errors.name && (
                  <p className="mt-1 text-red-600 text-sm">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`mt-1 p-3 block w-full border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors`}
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                />
                {errors.email && (
                  <p className="mt-1 text-red-600 text-sm">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`mt-1 p-3 block w-full border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors`}
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                />
                {errors.phone && (
                  <p className="mt-1 text-red-600 text-sm">{errors.phone}</p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={filteredTickets.length === 0}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
              
              {filteredTickets.length === 0 && (
                <p className="text-center text-sm text-gray-500">
                  Please select seats first to proceed with booking
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Page;