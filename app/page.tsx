'use client'

import {useEffect, useState} from 'react';
import {EventComponent, EventComponentProps} from "./event_component";

interface Reservation {
  id: number,
  numberOfChildren: number
}

// Key for local storage of reservations.
const localKey = "elevation_rsvp_list";

export default function Home() {
  const [totalReservations, setTotalReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    let savedRsvps = localStorage.getItem(localKey);
    if (savedRsvps) {
      setTotalReservations(JSON.parse(savedRsvps));
    }
  }, []);

  function newReservation(numOfChildren: number) {
    let rsvp: Reservation = {
      id: totalReservations.length + 1,
      numberOfChildren: numOfChildren
    }
    let newTotal: Reservation[] = [...totalReservations, rsvp];
    setTotalReservations(newTotal);
    localStorage.setItem(localKey, JSON.stringify(newTotal));
  }

  const information: EventComponentProps = {
    venue: "Elevation Church Ballantyne",
    address: "11701 Elevation Pt Dr",
    city: "Charlotte",
    state: "NC",
    zip: 28277,
    date: new Date(),
    submission: newReservation
  }

  return (
    <div className="flex w-full">
      <div>
        <h1>Total RSVPs: {totalReservations.length}</h1>
        <ul>
          {totalReservations.map((rsvp) => (
              <li key={rsvp.id}>RSVP {rsvp.id} - Children: {rsvp.numberOfChildren}</li>
          ))}
        </ul>
      </div>
      <div className="ml-auto">
        <EventComponent {...information} />
      </div>
    </div>
  );
}