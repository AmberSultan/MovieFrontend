"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { useRouter } from "next/navigation"; // Import from next/navigation for the App Router

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
  const router = useRouter(); // Initialize the router using next/navigation

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const seatsFromUrl = queryParams.get("seats");

    if (seatsFromUrl) {
      const seatsArray = seatsFromUrl.split(",");
      setSelectedSeats(seatsArray);
      fetchTickets(seatsArray);
    }
  }, []);

  const fetchTickets = async (seatsArray: string[]) => {
    try {
      const seatQuery = seatsArray.join(",");
      const response = await fetch(`http://localhost:4001/api/tickets/get-ticket?seatNumber=${seatQuery}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        const filtered = result.data.filter((ticket: Ticket) =>
          seatsArray.every((seat) => ticket.seat.includes(seat))
        );
        setFilteredTickets(filtered);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  
    const newErrors: { name?: string; email?: string; phone?: string } = {};
  
    if (!name) {
      newErrors.name = "Name is required.";
    }
    if (!email) {
      newErrors.email = "Email is required.";
    }
    if (!phone) {
      newErrors.phone = "Phone number is required.";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
  
      // Build the query string manually
      const queryString = new URLSearchParams({
        seats: selectedSeats.join(","),
        name,
        email,
        phone,
        movieTitle: filteredTickets[0].movie.title,
        hallName: filteredTickets[0].hall.hallname,
        totalSeats: filteredTickets[0].totalSeats.toString(),
        totalPrice: filteredTickets[0].totalPrice.toString(),
        bookingDate: new Date().toLocaleDateString(),
        showtime: `${filteredTickets[0].movie.schedule[0].date} at ${filteredTickets[0].movie.schedule[0].showtiming}`,
      }).toString();
  
      // Navigate using router.push with a string
      router.push(`/ticket/recipient?${queryString}`);
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
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 mt-4 px-11 w-full md:w-96">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket: Ticket) => (
              <div key={ticket._id} className="mb-4 px-12 p-4 border border-gray-500 rounded-md">
                <h2 className="text-lg font-light">
                  <span className="text-red-900 font-bold">{ticket.movie.title}</span>
                </h2>
                <div className="mt-2 font-light">
                  {ticket.movie.schedule.map((sched, index) => (
                    <p key={index}>
                      <span className="font-light">
                        Movie timings: <br />
                        {sched.date} at {sched.showtiming}
                      </span>
                    </p>
                  ))}
                </div>
                <div className="mb-2">
                  <p className="mt-2 font-light">Hall Name: {ticket.hall.hallname}</p>
                </div>
                <div className="mb-2">
                  <p className="font-light">Seat Number: {ticket.seat.join(", ")}</p>
                </div>
                <div className="mb-2">
                  <h3 className="font-light">Total Seats: {ticket.totalSeats}</h3>
                </div>
                <div>
                  <h3 className="font-light">Total Price: Rs. {ticket.totalPrice.toFixed(2)}</h3>
                </div>
                <div className="mb-2">
                  <h3 className="font-light text-green-600">Booking Date: {new Date().toLocaleDateString()}</h3>
                </div>
              </div>
            ))
          ) : (
            <p>No matching tickets found</p>
          )}
        </div>

        <div className="p-4 w-full md:w-96">
          <h2 className="text-lg font-light">Personal Info</h2>
          <form className="space-y-4 w-full">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className={`mt-1 p-2 block w-full border ${errors.name ? "border-red-600" : "border-gray-300"} rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm`}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: undefined })); // Clear error on change
                }}
              />
              {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className={`mt-1 p-2 block w-full border ${errors.email ? "border-red-600" : "border-gray-300"} rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined })); // Clear error on change
                }}
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={`mt-1 p-2 block w-full border ${errors.phone ? "border-red-600" : "border-gray-300"} rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm`}
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((prev) => ({ ...prev, phone: undefined })); // Clear error on change
                }}
              />
              {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Page;
