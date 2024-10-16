"use client";

import Link from "next/link";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useParams } from 'next/navigation';
import { useRouter } from "next/navigation";
// import { useToast } from "@/components/ui/use-toast";
import toast, { Toaster } from 'react-hot-toast';

interface Organization{
  _id: string;
  name: string;
}

interface Branch {
  _id: string;
  branchname: string;
  city: string;
  noOfHalls: number;
  organization: string;
}

interface Hall {
  _id: string;
  hallname: string;
  capacity: number;
  branch: string;
  organization: string;
}

interface Seat {
  
  id: string;
  row: string;
  number: number;
  status: string;
  price: number;
}

interface ScheduleEntry {
  date: string;
  showtiming: string;
}

interface Movie {
  title: string;
  description: string;
  thumbnail?: string;
  rating?: number;
  _id: string;
  genre: string;
  duration: string;
  releaseDate: string;
  language: string;
  schedule: ScheduleEntry[];
  trailer: string;
}

interface MoviePageProps {
  params: {
    _id: string;
  };
}



export default function Page({ params }: MoviePageProps) {

  const router = useRouter();
  const { id } = useParams();

  const [movie, setMovie] = useState<Movie | null>(null);

  const searchParams = useSearchParams();
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";
  // const { toast } = useToast();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);
  const [seats, setSeats] = useState<Seat[][]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [seatStatusData, setSeatStatusData] = useState<{ id: string; status: string }[]>([]);

  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const [selectedOrganization, setSelectedOrganization] = useState<string>('');

  const [hallId, setHallId] = useState<string | null>(null);



  useEffect(() => {
    fetchOrganization();
  }, []);

  useEffect(() => {
    if (selectedOrganization) {
      fetchBranches(selectedOrganization);
    } else {
      setBranches([]);
    }
  }, [selectedOrganization]);

  useEffect(() => {
    if (selectedBranch) {
      fetchHalls(selectedBranch);
    } else {
      setHalls([]);
    }
  }, [selectedBranch]);
  
  const fetchOrganization = async () => {
    try {
      const response = await fetch(
        "http://localhost:4001/api/organizations/get-organization"
      );
      const data = await response.json();
      if (data.success) {
        setOrganizations(data.data);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const fetchBranches = async (organizationId: string) => {
    try {
      const response = await fetch(
        `http://localhost:4001/api/branches/get-branch?organization=${organizationId}`
      );
      const data = await response.json();
      if (data.success) {
        setBranches(data.data);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const fetchHalls = async (branchId: string) => {
    
    try {
      const response = await fetch(`http://localhost:4001/api/halls/get-hall?branch=${branchId}`);
      const data = await response.json();
      if (data.success) {
        console.log("Fetched halls data:", data);
        const filteredHalls = data.data.filter((hall: Hall) => hall.branch === branchId);
        setHalls(data.data);
      } else {
        console.error("Error fetching halls:", data.message);
      }
    } catch (error) {
      console.error("Error fetching halls:", error);
    }
  };

  const handleOrganizationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const organizationId = event.target.value;
    setSelectedOrganization(organizationId);
  
    // Filter branches based on selected organization
    const filtered = branches.filter(branch => branch.organization === organizationId);
    setBranches(filtered);
    setSelectedBranch(''); // Reset branch selection
    fetchBranches(organizationId);
  };

  const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const branchId = event.target.value;
    console.log("Selected branch ID:", branchId);
    setSelectedBranch(branchId);
 
    if(branchId){
      setSelectedHall(null);
      setSeats([]);
      setSelectedSeats([]);
      fetchHalls(branchId);
    }
    else{
      setHalls([]);
    }
   
  };

  const handleHallChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const hallId = event.target.value;
    console.log("Selected hall ID:", hallId);
    const hall = halls.find((h) => h._id === hallId) || null;
    setSelectedHall(hall);
    setSelectedSeats([]);
  
    if (hall) {
      try {
        // Wait for fetchSeats to complete
        await fetchSeats(hallId);
  
        // Ensure seatStatusData is updated before calling generateSeats
        console.log("before initializing var: ", seatStatusData);
        if (seatStatusData) {
          generateSeats(hall.capacity, seatStatusData);
        }
      } catch (error) {
        console.error("Error handling hall change:", error);
      }
    }
  };

  const generateSeats = (capacity: number, seatStatusData: { id: string; status: string }[]= []) => {
    const seatsPerRow = 10;
    const totalRows = Math.ceil(capacity / seatsPerRow);
    const rows: Seat[][] = [];
  
    for (let row = 0; row < totalRows; row++) {
      const rowSeats: Seat[] = [];
      const rowLabel = String.fromCharCode(65 + row);
  
      for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
        const seatIndex = row * seatsPerRow + seatNumber;
        if (seatIndex > capacity) break;
  
        // Generate seat ID
        const seatId = `${rowLabel}${seatNumber}`;
        console.log('seatId in genrate seats: ', seatStatusData[seatIndex-1]?.status);
        // Find the status for the current seat ID

        const seatStatus =  seatStatusData[seatIndex-1]?.status;

        rowSeats.push({
          id: seatId,
          row: rowLabel,
          number: seatNumber,
          status: seatStatus.toString(),
          price: 700, // Set the price if needed
        });
      }
      rows.push(rowSeats);
    }
    console.log(rows)
    setSeats(rows);
  };
  
  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "booked") return;

    const isSelected = selectedSeats.some((s) => s.id === seat.id);

    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
      updateSeatStatus(seat.id, "available");
    } else {
      setSelectedSeats([...selectedSeats, seat]);
      updateSeatStatus(seat.id, "selected");
    }
  };

  const updateSeatStatus = (
    seatId: string,
    status: string
  ) => {
    setSeats((prevSeats) =>
      prevSeats.map((row) =>
        row.map((seat) => (seat.id === seatId ? { ...seat, status } : seat))
      )
    );
  };

  const fetchSeats = async (hallId: string) => {

    try {
      const response = await fetch(`http://localhost:4001/api/seats/get-seat?hall=${hallId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("fetched seats data: ", data);
    
      // Ensure that the response data is an array of seats
      if (Array.isArray(data.data)) {
        // Assuming data is an array of seat objects
        const fetchedSeats = data.data.map((seat: any, index: number) => ({
          // Ensure status is one of the expected values
          id: index.toString(),
          status: ["available", "booked", "selected"].includes(seat.status)
            ? seat.status
            : "available",
        }));
        
        // Create an array with IDs as keys (0, 1, 2, ...)
        const seatStatuses = fetchedSeats.map((seat: { id: { toString: () => any; }; status: any; }) => ({
          id: seat.id?.toString(),
          status: seat.status
        }));
        generateSeats(data.data.length, seatStatuses);
  
      } else {
        
        console.log("No booked seats found. Generating seats as 'available'.");
       
      }
    } catch (error) {
      console.error("Error fetching seats:", error);
    }
    
  };

  
  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) {
        
        toast.error("Please select at least one seat.");
        return;
    }

    if (!selectedHall) {
       
        toast.error("Please select a hall.");
        return;
    }

    const movieId = "66cef67bff2efbeff664590a";

    
    const bookingData = {
        seatNumbers: selectedSeats.map((seat) => seat.id), 
        status: "booked" as "booked",
        price: selectedSeats[0].price,
        hallId: selectedHall._id,
    };

    const ticketData = {
        movie: movieId,
        hall: selectedHall._id,
        seat: selectedSeats.map((seat) => seat.id),
        totalSeats: selectedSeats.length,
        totalPrice: selectedSeats[0].price * selectedSeats.length,
    };

    try {
        console.log("Sending booking data:", bookingData);

        // Save seat data
        const seatResponse = await fetch("http://localhost:4001/api/seats/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bookingData),
        });

        const seatResult = await seatResponse.json();
        console.log("Seat API response:", seatResult);

        if (seatResult.success) {
            // Save ticket data
            const ticketResponse = await fetch("http://localhost:4001/api/tickets/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ticketData),
            });

            const ticketResult = await ticketResponse.json();
            console.log("Ticket API response:", ticketResult);

            if (ticketResult.success) {
                const updatedSeats = seats.map((row) =>
                    row.map((seat) => {
                        if (selectedSeats.some((selectedSeat) => selectedSeat.id === seat.id)) {
                            return { ...seat, status: "booked" as "booked" };
                        }
                        return seat;
                    })
                );

                setSeats(updatedSeats);
                setSelectedSeats([]);
               
                toast.success("Booking confirmed!");
            } else {
            
                toast.error("Error creating ticket. Please try again.");
            }
        } else {
          
            toast.error("Error confirming booking. Please try again.");
        }
    } catch (error) {
        console.error("Error confirming booking:", error);
        
        toast.error("An error occurred while confirming the booking.");
    }
};

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };


  useEffect(() => {
    if (hallId) {
      console.log("Current URL:", `/ticket?seats=${selectedSeats.map((seat) => seat.id).join(',')}&hallId=${hallId}`);
    }
  }, [hallId, selectedSeats]);
  


  return (
    <>
      <div className="bg-black text-center py-4 text-white text-sm">
        UNLIMITED MOVIES OF YOUR CHOICE
      </div>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl text-center mt-5 uppercase font-bold mb-6">
          Select your Seats
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="ms-6 left">
        <div className="flex flex-col gap-4">
  <div className="w-64 mt-1">
    <label
      htmlFor="organization"
      className="block font-medium ms-1 mb-2 "
    >
      Organization
    </label>
    <select
      id="organization"
      value={selectedOrganization}
      onChange={handleOrganizationChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md"
    >
      <option value="">Select an organization</option>
      {organizations.map((organization) => (
        <option key={organization._id} value={organization._id}>
          {organization.name}
        </option>
      ))}
    </select>
  </div>
  
  {/* Only show branch dropdown if an organization is selected */}
  {selectedOrganization && (
    <div className="w-64" >
      <label
        htmlFor="branch"
        className="block font-medium ms-1 mb-2"
      >
        Branch
      </label>
      <select
        id="branch"
        value={selectedBranch}
        onChange={handleBranchChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
        disabled={!selectedOrganization}
      >
        <option value="">Select a branch</option>
        {branches.map((branch) => (
          <option key={branch._id} value={branch._id}>
            {branch.branchname}
          </option>
        ))}
      </select>
    </div>
  )}
  
  {/* Only show hall dropdown if a branch is selected */}
  {selectedBranch && (
    <div className="mb-5 w-64">
      <label
        htmlFor="hall"
        className="block font-medium ms-1 mb-2"
      >
        Hall
      </label>
      <select
        id="hall"
        value={selectedHall?._id || ""}
        onChange={handleHallChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
        disabled={!selectedBranch}
      >
        <option value="">Select a hall</option>
        {halls.map((hall) => (
          <option key={hall._id} value={hall._id}>
            {hall.hallname}
          </option>
        ))}
      </select>
    </div>
  )}
</div>

  <div className="border mt-3 py-6 px-6 w-64 justify-center shadow">
              <h3 className="mb-2">Booking Details</h3>
              <div className="text-gray-400">
                {selectedSeats.length > 0 ? (
                  <div>
                    {selectedSeats.map((seat) => (
                      <div className="flex gap-6" key={seat.id}>
                        <p>Seat # {seat.id}</p>
                        <p>Rs. {seat.price}</p>
                      </div>
                    ))}
                    <div className="flex gap-6 mt-2 font-bold">
                      <p>Total Price:</p>
                      <p>Rs. {calculateTotalPrice()}</p>
                    </div>

                    <Link href={`/ticket?seats=${selectedSeats.map((seat) => seat.id).join(',')}`}>
            {/* <Link href={`/now-playing/${movie?._id}/choose-seat/ticket`}> */}
              <button
                onClick={handleConfirmBooking}
                className="mt-4 px-2 py-2 bg-red-900 text-white text-sm rounded-md hover:bg-red-900 disabled:bg-red-950"
                disabled={selectedSeats.length === 0}
              >
                View Ticket
              </button>
              </Link>

                  </div>
                ) : (
                  <p>No seats selected.</p>
                )}
              </div>
             
           
            </div>
</div>


          <div className="right">
            {seats.length > 0 ? (
              <div className="flex flex-col items-center">
                <div className="py-5 mt-2 shadow-[0_35px_60px_-15px_rgba(255,255,255,0.5)] w-80 justify-center bg-slate-300 mb-8 rounded-sm"></div>

                <div className="flex flex-col gap-4">
                  {seats.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-center">
                      <span className="w-6 mr-2 ">{row[0].row}</span>
                      <div className="grid grid-cols-10 gap-2">
                        {row.map((seat) => {
                          // console.log(
                          //   `Seat ID: ${seat.id}, Status: ${seat.status}`
                          // );
                          const isSelected = selectedSeats.some(
                            (s) => s.id === seat.id
                          );
                          const buttonClass =
                            seat.status === "available"
                              ? isSelected
                                ? "bg-green-600"
                                : "border-2 border-gray-300"
                              : seat.status === "booked"
                              ? "bg-red-900 cursor-not-allowed"
                              : "bg-green-600";
                          return (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatClick(seat)}
                              className={`w-8 h-8 rounded ${buttonClass}`}
                              title={`Seat ${seat.id} - Rs. ${seat.price}`}
                              disabled={seat.status === "booked"}
                            >
                              {seat.number}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 rounded-sm shadow-md">
                  <div className="flex gap-4">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-green-600 rounded mr-2"></div>
                      <span className="text-md">Selected</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 border-2 border-gray-400 rounded mr-2"></div>
                      <span className="text-md">Available</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-red-900 rounded mr-2"></div>
                      <span className="text-md">Booked</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p>Select a hall to see the seating layout.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
