"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface TicketDetails {
  name: string | null;
  email: string | null;
  phone: string | null;
  movieTitle: string | null;
  hallName: string | null;
  totalSeats: string | null;
  totalPrice: string | null;
  bookingDate: string | null;
  showtime: string | null;
  seats: string[];
}

const TicketClient = () => {
  const searchParams = useSearchParams();
  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const ticketData = {
      name: searchParams.get("name"),
      email: searchParams.get("email"),
      phone: searchParams.get("phone"),
      movieTitle: searchParams.get("movieTitle"),
      hallName: searchParams.get("hallName"),
      totalSeats: searchParams.get("totalSeats"),
      totalPrice: searchParams.get("totalPrice"),
      bookingDate: searchParams.get("bookingDate"),
      showtime: searchParams.get("showtime"),
      seats: searchParams.getAll("seats")
    };
    setTicketDetails(ticketData);
  }, [searchParams]);

  useEffect(() => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    setCurrentDate(formattedDate);
  }, []);

  const downloadTicket = () => {
    const ticketElement = document.getElementById('ticket');
    if (ticketElement) {
      html2canvas(ticketElement, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [ticketElement.offsetWidth * 0.264583, ticketElement.offsetHeight * 0.264583],
          putOnlyUsedFonts: true,
          floatPrecision: 16
        });

        const imgWidth = ticketElement.offsetWidth * 0.264583;
        const imgHeight = ticketElement.offsetHeight * 0.264583;
        const xOffset = 0;
        const yOffset = 0;

        pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
        pdf.save('movie_ticket.pdf');
        toast.success("Ticket downloaded successfully!");
      });
    } else {
      toast.error("Ticket element not found!");
    }
  };

  return (
    <>
      <Toaster />
      <div className="bg-black text-center py-4 text-white text-sm">
        UNLIMITED MOVIES OF YOUR CHOICE
      </div>
      <div className="flex items-center justify-center">
        <div id="ticket" className="ticket-container space-y-4 mt-2 bg-neutral-900 p-6 rounded shadow-md">
          <img src="/images/logo.png" alt="logo" className="w-36 h-auto mx-auto" />
          <h1 className="font-bold mb-20 text-3xl md:text-2xl text-center">Your Recipient</h1>
          <p>Invoice Date # {currentDate}</p>
          <p>Name: {ticketDetails?.name || "Loading..."}</p>
          <p>Email: {ticketDetails?.email || "Loading..."}</p>
          <p>Phone: {ticketDetails?.phone || "Loading..."}</p>
          <hr />
          <p>
            <strong>Movie:</strong> {ticketDetails?.movieTitle || "Loading..."}
          </p>
          <p>
            <strong>Hall:</strong> {ticketDetails?.hallName || "Loading..."}
          </p>
          <p>
            <strong>Total Seats:</strong> {ticketDetails?.totalSeats || "0"}
          </p>
          <p className="text-white">
            <strong>Seats:</strong> {ticketDetails?.seats.join(", ") || "Loading..."}
          </p>
          <p>
            <strong>Total Price:</strong> Rs. {ticketDetails?.totalPrice || "0"}
          </p>
          <p>
            <strong>Showtime:</strong> {ticketDetails?.showtime || "Loading..."}
          </p>
        </div>
      </div>
      <div className="flex gap-[10px] justify-center items-center mt-2 mb-2">
        <button
          onClick={downloadTicket}
          className="w-1/5 bg-red-900 text-center text-white py-2 px-4 rounded hover:bg-red-950"
        >
          Print Ticket
        </button>
         <button
          onClick={() => window.location.href = '/'}
          className="w-1/5 bg-red-900 text-center text-white py-2 px-4 rounded hover:bg-red-950"
        >
          Back to Home
        </button>
      </div>
    </>
  );
};

export default TicketClient;