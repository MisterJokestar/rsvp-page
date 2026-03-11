"use client";

import { useEffect, useState } from "react";
import { EventComponent, EventComponentProps } from "./event_component";
import { useParams } from "next/navigation";
import Image from "next/image";
import loadingIcon from "@/public/loading-svgrepo-com.svg";

interface Reservation {
  id: number;
  numberOfChildren: number;
}

export default function Home() {
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [eventData, setEventData] = useState<EventComponentProps | undefined>(
    undefined,
  );
  const [totalReservations, setTotalReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);

  // Event id from route
  const { id } = useParams();
  // Key for local storage of reservations.
  const localKey = `elevation_rsvp_list_${id}`;

  async function fetchEventData() {
    try {
      const response = await fetch(`/api/events/${id}`);
      let data = await response.json();
      if (response.ok) {
        //recieved the event data
        setEventData({
          ...data.result,
          submission: newReservation,
        });
      } else {
        setError(data.message);
        if (response.status === 500) {
          console.log(data.error);
        }
      }
    } catch (err) {
      setError("Something went wrong while fetching event data.");
      console.log(err);
    } finally {
      setPageLoading(false);
    }
  }

  // get event data
  useEffect(() => {
    fetchEventData();
  }, []);

  // get any reservations
  useEffect(() => {
    let savedRsvps = localStorage.getItem(localKey);
    if (savedRsvps) {
      setTotalReservations(JSON.parse(savedRsvps));
    }
  }, []);

  async function newReservation(
    numOfChildren: number,
    acknowledgement: boolean,
  ) {
    try {
      // Check for valid response.
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, numOfChildren, acknowledgement }),
      });
      if (response.ok) {
        // store reservation on a valid response
        const rsvp: Reservation = {
          id: totalReservations.length + 1,
          numberOfChildren: numOfChildren,
        };
        const newTotal: Reservation[] = [...totalReservations, rsvp];
        setTotalReservations(newTotal);
        localStorage.setItem(localKey, JSON.stringify(newTotal));
      } else {
        const { errors } = await response.json();
        console.log(errors);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const resetReservations = () => {
    setTotalReservations([]);
    localStorage.removeItem(localKey);
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-full md:w-100 p-4 md:m-4 bg-gray-200 md:rounded-lg">
          <h1> Page is Loading </h1>
          <Image src={loadingIcon} alt="Hour Glass Loading Icon" width={40} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-full md:w-100 p-4 md:m-4 bg-gray-200 md:rounded-lg">
          <h1> Uh, oh! </h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:flex">
      <div className="m-4">
        <button
          onClick={resetReservations}
          className="rounded-full outline p-2 bg-gray-200 hover:bg-gray-400 hover:cursor-pointer"
        >
          Reset RSVPS
        </button>
        <h1>Total RSVPs: {totalReservations.length}</h1>
        <ul>
          {totalReservations.map((rsvp) => (
            <li key={rsvp.id}>
              RSVP {rsvp.id} - Children: {rsvp.numberOfChildren}
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute bottom-0 md:relative md:ml-auto">
        {eventData && <EventComponent {...eventData} />}
      </div>
    </div>
  );
}
