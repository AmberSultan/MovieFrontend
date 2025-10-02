"use client";

import { useState } from "react";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { ThemeProvider } from "@/components/theme-provider";

export default function CardHoverEffectDemo() {
  const [movies] = useState([
    {
      id: "1",
      _id: "1",
      title: "The Amazing Spiderman",
      description: "Peter Parker embraces his destiny as Spider-Man and faces powerful new enemies in this action-packed adventure.",
      thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnJVVe4mO4XpxS_e5CaY4dYJIXQf5XUkOs6w&s",
      rating: 8.5,
    },
    {
      id: "2",
      _id: "2",
      title: "Jungle Jamboree",
      description: "A lively cartoon about animals throwing a musical party in the jungle.",
      thumbnail: "https://i.ytimg.com/vi/HtUHy276Wq0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBa7VmLbbol7L6EfOJKpx6cHNNTfg",
      rating: 6.8,
    },
    {
      id: "3",
      _id: "3",
      title: "Pixie Pals",
      description: "Tiny fairies team up to save their magical forest from a grumpy troll.",
      thumbnail: "https://w0.peakpx.com/wallpaper/997/608/HD-wallpaper-pixie-pals-yellow-green-pink-blue.jpg",
      rating: 7.5,
    },
    {
      id: "4",
      _id: "4",
      title: "Dino Dash",
      description: "A young dinosaur races to reunite with his family in a colorful prehistoric world.",
      thumbnail: "https://i.ytimg.com/vi/HjHkIZ8UYnU/maxresdefault.jpg",
      rating: 8.0,
    },

    {
      id: "5",
      _id: "5",
      title: "Minions",
      description: "The Minions set out on a hilarious adventure to find a new supervillain master.",
      thumbnail: "https://play-lh.googleusercontent.com/proxy/2tj1HTTkxfLUCHMYCMY7Ik_u9Dv-ctrQ7tteluo8MkL9bUzSFutbEcvkGroJxU6PTS84IHjfzCYjRsCflXcZ5k_CV2OAD2Al4i_fUCrb6cBVNvtB4TZhu97Z=s3840-w3840-h2160",
      rating: 7.3
    },

    {
      id: "6",
      _id: "6",
      title: "Space Puppies",
      description: "A pack of adventurous puppies explores the galaxy in a colorful spaceship.",
      thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY0oo0rYEA5qq2t-xaIBxCY8sC8hkypOWd-g&s",
      rating: 7.0,
    },
  ]);

  const items = movies.map((movie) => ({
    thumbnail: movie.thumbnail,
    title: movie.title,
    description: movie.description,
    link: `/now-playing/${movie._id}`,
    rating: movie.rating,
    _id: movie._id,
  }));

  return (
    <ThemeProvider>
      <div className="max-w-5xl mx-auto px-0">
        <h1 className="font-bold text-3xl md:text-3xl text-center py-10">
          Now Playing
        </h1>
        <HoverEffect items={items} />
      </div>
    </ThemeProvider>
  );
}