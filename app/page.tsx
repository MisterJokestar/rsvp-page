import {EventComponent, EventComponentProps} from "./event_component";


export default function Home() {
  let information: EventComponentProps = {
    venue: "Elevation Church Ballantyne",
    address: "11701 Elevation Pt Dr",
    city: "Charlotte",
    state: "NC",
    zip: 28277,
    date: new Date()
  }

  return (
    <div className="w-full h-full b-green">
      Hello World
      <EventComponent {...information} />
    </div>
  );
}