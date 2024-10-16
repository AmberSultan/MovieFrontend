'use client';

import React, { useEffect, useState } from 'react';

interface MovieSchedule {
  date: string;
  showtiming: string;
}

interface Movie {
  _id: string;
  title: string;
  schedule: MovieSchedule[];
}

interface Hall {
  _id: string;
  hallname: string;
}

interface Ticket {
  _id: string;
  movie: Movie;
  hall: Hall;
  seat: string[];
  totalSeats: number;
  totalPrice: number;
}

const Dashboard: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:4001/api/tickets/get-ticket");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTickets(data.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

 

  return (
    <div className="p-4">
      <h1 className="px-2 text-lg mb-4">Tickets Booking Data</h1>
      <table className="min-w-full bg-transparent border border-black-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Movie Title</th>
            <th className="py-2 px-4 border-b">Schedule</th>
            <th className="py-2 px-4 border-b">Hall Name</th>
            <th className="py-2 px-4 border-b">Seats</th>
            <th className="py-2 px-4 border-b">Total Price</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length > 0 ? (
            tickets.map(ticket => (
              <tr key={ticket._id}>
                <td className="py-2 font-light px-4 border-b">{ticket.movie.title}</td>
                <td className="py-2 font-light px-4 border-b">
                  {ticket.movie.schedule.map((sched, index) => (
                    <div key={index}>
                      {sched.date} {sched.showtiming}
                    </div>
                  ))}
                </td>
                <td className="py-2 font-light px-4 border-b">{ticket.hall.hallname}</td>
                <td className="py-2 font-light px-4 border-b">
                  {ticket.seat.join(', ')}
                </td>
                <td className="py-2 font-light px-4 border-b">{ticket.totalPrice}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-2 px-4 text-sm text-center">No tickets found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
