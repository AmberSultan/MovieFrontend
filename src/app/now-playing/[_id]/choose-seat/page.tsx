"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useParams } from 'next/navigation';
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';

interface Organization {
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
  const searchParams = useSearchParams();
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";

  const [movie, setMovie] = useState<Movie | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);
  const [seats, setSeats] = useState<Seat[][]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const [hallId, setHallId] = useState<string | null>(null);

  // Dummy data
  const dummyOrganizations: Organization[] = [
    { _id: "org1", name: "Cineplex Corporation" },
    { _id: "org2", name: "MovieMax Theaters" },
    { _id: "org3", name: "Starlight Cinemas" }
  ];

  const dummyBranches: Branch[] = [
    { _id: "branch1", branchname: "Downtown Cinema", city: "New York", noOfHalls: 5, organization: "org1" },
    { _id: "branch2", branchname: "Mall Theater", city: "Los Angeles", noOfHalls: 4, organization: "org1" },
    { _id: "branch3", branchname: "City Center", city: "Chicago", noOfHalls: 6, organization: "org2" },
    { _id: "branch4", branchname: "Riverside Complex", city: "Miami", noOfHalls: 3, organization: "org3" }
  ];

  const dummyHalls: Hall[] = [
    { _id: "hall1", hallname: "Hall A", capacity: 50, branch: "branch1", organization: "org1" },
    { _id: "hall2", hallname: "Hall B", capacity: 60, branch: "branch1", organization: "org1" },
    { _id: "hall3", hallname: "Premium Hall", capacity: 40, branch: "branch2", organization: "org1" },
    { _id: "hall4", hallname: "IMAX Theater", capacity: 80, branch: "branch3", organization: "org2" },
    { _id: "hall5", hallname: "VIP Lounge", capacity: 30, branch: "branch4", organization: "org3" }
  ];

  const dummyMovies: Movie[] = [
    {
      _id: "1",
      title: "The Amazing Spiderman",
      description: "Peter Parker discovers his extraordinary powers and takes on the mantle of Spider-Man to protect New York from dangerous new threats.",
      thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnJVVe4mO4XpxS_e5CaY4dYJIXQf5XUkOs6w&s",
      rating: 8.5,
      genre: "Action, Superhero",
      duration: "2h 16m",
      releaseDate: "07/03/2012",
      language: "English",
      schedule: [
        { date: "10/03/2025", showtiming: "2:00 PM" },
        { date: "10/03/2025", showtiming: "6:00 PM" }
      ],
      trailer: "https://youtu.be/-tnxzJ0SSOw?si=_xpH5gL1AbofacTj"
    },
    {
      _id: "2",
      title: "Jungle Jamboree",
      description: "A lively cartoon about animals throwing a musical party in the jungle.",
      thumbnail: "https://i.ytimg.com/vi/HtUHy276Wq0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBa7VmLbbol7L6EfOJKpx6cHNNTfg",
      rating: 6.8,
      genre: "Animation, Family",
      duration: "1h 30m",
      releaseDate: "09/15/2025",
      language: "English",
      schedule: [
        { date: "10/03/2025", showtiming: "1:00 PM" },
        { date: "10/03/2025", showtiming: "4:00 PM" },
      ],
      trailer: "https://youtu.be/kj38H-KjWK4?si=JkCkAfKZSl2nvhik",
    }
  ];

  // Initialize with dummy data
  useEffect(() => {
    setOrganizations(dummyOrganizations);
    
    // Set movie from dummy data
    const foundMovie = dummyMovies.find(m => m._id === params._id);
    if (foundMovie) {
      setMovie(foundMovie);
    }
  }, [params._id]);

  const fetchOrganization = () => {
    setOrganizations(dummyOrganizations);
  };

  const fetchBranches = (organizationId: string) => {
    const filteredBranches = dummyBranches.filter(branch => branch.organization === organizationId);
    setBranches(filteredBranches);
  };

  const fetchHalls = (branchId: string) => {
    const filteredHalls = dummyHalls.filter(hall => hall.branch === branchId);
    setHalls(filteredHalls);
  };

  const handleOrganizationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const organizationId = event.target.value;
    setSelectedOrganization(organizationId);
    fetchBranches(organizationId);
    setSelectedBranch(''); // Reset branch selection
  };

  const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const branchId = event.target.value;
    setSelectedBranch(branchId);
    
    if (branchId) {
      setSelectedHall(null);
      setSeats([]);
      setSelectedSeats([]);
      fetchHalls(branchId);
    } else {
      setHalls([]);
    }
  };

  const handleHallChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const hallId = event.target.value;
    const hall = halls.find((h) => h._id === hallId) || null;
    setSelectedHall(hall);
    setSelectedSeats([]);
  
    if (hall) {
      // Generate random seat statuses for demo
      const seatStatusData = Array.from({ length: hall.capacity }, (_, index) => ({
        id: index.toString(),
        status: Math.random() > 0.3 ? "available" : "booked" // 70% available, 30% booked
      }));
      
      generateSeats(hall.capacity, seatStatusData);
    }
  };

  const generateSeats = (capacity: number, seatStatusData: { id: string; status: string }[] = []) => {
    const seatsPerRow = 10;
    const totalRows = Math.ceil(capacity / seatsPerRow);
    const rows: Seat[][] = [];
  
    for (let row = 0; row < totalRows; row++) {
      const rowSeats: Seat[] = [];
      const rowLabel = String.fromCharCode(65 + row);
  
      for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
        const seatIndex = row * seatsPerRow + seatNumber;
        if (seatIndex > capacity) break;
  
        const seatId = `${rowLabel}${seatNumber}`;
        const seatStatus = seatStatusData[seatIndex - 1]?.status || "available";
        
        rowSeats.push({
          id: seatId,
          row: rowLabel,
          number: seatNumber,
          status: seatStatus,
          price: 700,
        });
      }
      rows.push(rowSeats);
    }
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

  const updateSeatStatus = (seatId: string, status: string) => {
    setSeats((prevSeats) =>
      prevSeats.map((row) =>
        row.map((seat) => (seat.id === seatId ? { ...seat, status } : seat))
      )
    );
  };

  const handleConfirmBooking = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat.");
      return;
    }

    if (!selectedHall) {
      toast.error("Please select a hall.");
      return;
    }

    toast.success(`Booking confirmed for ${selectedSeats.length} seat(s)!`);
    
    // Reset selected seats after booking
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
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  return (
    <>
      <div className="bg-black text-center py-4 text-white text-sm">
        UNLIMITED MOVIES OF YOUR CHOICE
      </div>
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl text-center mt-5 uppercase font-bold mb-6">
          Select your Seats
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="ms-6 left">
            <div className="flex flex-col gap-4">
              <div className="w-64 mt-1">
                <label htmlFor="organization" className="block font-medium ms-1 mb-2">
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
              
              {selectedOrganization && (
                <div className="w-64">
                  <label htmlFor="branch" className="block font-medium ms-1 mb-2">
                    Branch
                  </label>
                  <select
                    id="branch"
                    value={selectedBranch}
                    onChange={handleBranchChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
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
              
              {selectedBranch && (
                <div className="mb-5 w-64">
                  <label htmlFor="hall" className="block font-medium ms-1 mb-2">
                    Hall
                  </label>
                  <select
                    id="hall"
                    value={selectedHall?._id || ""}
                    onChange={handleHallChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
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

                    <Link 
                      href={`/ticket?seats=${selectedSeats.map((seat) => seat.id).join(',')}&hallId=${selectedHall?._id}&total=${calculateTotalPrice()}`}
                    >
                      <button
                        onClick={handleConfirmBooking}
                        className="mt-4 px-2 py-2 bg-red-900 text-white text-sm rounded-md hover:bg-red-800 disabled:bg-red-950"
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
                      <span className="w-6 mr-2">{row[0].row}</span>
                      <div className="grid grid-cols-10 gap-2">
                        {row.map((seat) => {
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
              <p className="text-center">Select a hall to see the seating layout.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}