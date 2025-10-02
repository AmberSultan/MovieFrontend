"use client";

import Footer from "@/components/footer";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";

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

export default function MoviePage({ params }: MoviePageProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const playerRef = useRef<ReactPlayer | null>(null);

  const movies: Movie[] = [
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
    },
    {

      _id: "3",
      title: "Pixie Pals",
      description: "Tiny fairies team up to save their magical forest from a grumpy troll.",
      thumbnail: "https://w0.peakpx.com/wallpaper/997/608/HD-wallpaper-pixie-pals-yellow-green-pink-blue.jpg",
      rating: 7.5,
      genre: "Animation, Fantasy",
      duration: "1h 20m",
      releaseDate: "08/20/2025",
      language: "English",
      schedule: [
        { date: "10/03/2025", showtiming: "3:00 PM" },
        { date: "10/03/2025", showtiming: "7:00 PM" },
      ],
      trailer: "https://youtu.be/jwwQR4Y4d_E?si=pfSgm0lMj05LYFZ2",
    },
    {

      _id: "4",
      title: "Dino Dash",
      description: "A young dinosaur races to reunite with his family in a colorful prehistoric world.",
      thumbnail: "https://i.ytimg.com/vi/HjHkIZ8UYnU/maxresdefault.jpg",
      rating: 8.0,
      genre: "Animation, Adventure",
      duration: "1h 35m",
      releaseDate: "07/10/2025",
      language: "English",
      schedule: [
        { date: "10/03/2025", showtiming: "12:00 PM" },
        { date: "10/03/2025", showtiming: "5:00 PM" },
      ],
      trailer: "https://youtu.be/AIgF0NJFm50?si=Xzavd2gqk2vYwkDj",
    },
    {

      _id: "5",
      title: "Minions",
      description: "The Minions set out on a hilarious adventure to find a new supervillain master.",
      thumbnail: "https://play-lh.googleusercontent.com/proxy/2tj1HTTkxfLUCHMYCMY7Ik_u9Dv-ctrQ7tteluo8MkL9bUzSFutbEcvkGroJxU6PTS84IHjfzCYjRsCflXcZ5k_CV2OAD2Al4i_fUCrb6cBVNvtB4TZhu97Z=s3840-w3840-h2160",
      rating: 7.3,
      genre: "Animation, Comedy",
      duration: "1h 31m",
      releaseDate: "06/25/2025",
      language: "English",
      schedule: [
        { date: "10/03/2025", showtiming: "11:00 AM" },
        { date: "10/03/2025", showtiming: "3:30 PM" },
      ],
      trailer: "https://youtu.be/VPtcAtAuuQE?si=hNmVZLfTxumD7r3G",
    },
    {

      _id: "6",
      title: "Space Puppies",
      description: "A pack of adventurous puppies explores the galaxy in a colorful spaceship.",
      thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY0oo0rYEA5qq2t-xaIBxCY8sC8hkypOWd-g&s",
      rating: 7.0,
      genre: "Animation, Sci-Fi",
      duration: "1h 28m",
      releaseDate: "05/30/2025",
      language: "English",
      schedule: [
        { date: "10/03/2025", showtiming: "2:30 PM" },
        { date: "10/03/2025", showtiming: "6:30 PM" },
      ],
      trailer: "https://youtu.be/xQJbxkunO1s?si=6d6XOcK088BxrvSl",
    },
  ];

  useEffect(() => {
    const foundMovie = movies.find((m) => m._id === params._id);
    if (foundMovie) {
      setMovie(foundMovie);
      if (foundMovie.trailer) {
        setTrailerUrl(foundMovie.trailer);
      }
    } else {
      setError("Movie not found.");
    }
  }, [params._id]);

  const handleClose = () => {
    setTrailerUrl(null);
  };

  const handleEnded = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0); // Restart the video
    }
  };

  return (
    <>
      <div>
        <div className="top bg-black text-white text-center py-4 sm:text-xs">
          UNLIMITED MOVIES OF YOUR CHOICE
        </div>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : movie ? (
          <div className="selected-movie flex flex-col h-full relative bg-black">
            {trailerUrl && (
              <div className="relative">
                <ReactPlayer
                  url={trailerUrl}
                  width="100%"
                  height="90vh"
                  playing
                  controls
                  muted
                  ref={playerRef}
                  onEnded={handleEnded}
                />
                <button
                  onClick={handleClose}
                  className="absolute top-2 right-3 text-white text-2xl p-2 rounded-full bg-black/50 hover:bg-black/75"
                >
                  ×
                </button>
              </div>
            )}
            <div className="flex-grow w-full md:w-3/5 lg:w-2/5 absolute left-5 md:left-10 lg:left-20 top-2 md:top-10 lg:top-20 text-left  px-4 md:px-0">
              <h1 className="text-3xl md:text-5xl mt-10 font-bold mb-2 font-mono text-white">
                {movie.title}
              </h1>
              <div className="mt-5 font-semibold text-sm md:text-base text-gray-400 flex flex-wrap">
                <p>
                  {movie.releaseDate} | {movie.duration} | {movie.rating}+ |{" "}
                  {movie.language} | {movie.genre}
                </p>
              </div>
              <p className="mb-2 mt-5 w-full md:w-4/5 font-light text-white">
                {movie.description}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-white text-center">Loading...</p>
        )}
      </div>

      <div className="schedule py-[70px]  px-8 bg-black">
        <h2 className="text-2xl font-bold text-white mb-4 ms-2">Show Timings</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {movie?.schedule && movie.schedule.length > 0 ? (
            movie.schedule.map((entry, index) => (
              <div
                key={index}
                className="p-6 bg-black text-white shadow-md rounded-lg border border-red-800 transform transition-transform duration-300 hover:scale-102 hover:shadow-red-950 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-md font-light">Date: {entry.date}</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12h.01M12 15h.01M9 12h.01M12 9h.01M19 12a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <p className="text-md mt-0 font-light">Time: {entry.showtiming}</p>
                <Link href={`/now-playing/${movie._id}/choose-seat`}>
                  <button className="mt-4 w-full py-2 bg-red-900 text-white font-medium rounded-md hover:bg-red-950 transition-colors duration-300">
                    Choose Seat
                  </button>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-400">No Schedule</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}