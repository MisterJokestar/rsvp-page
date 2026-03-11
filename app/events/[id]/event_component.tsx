"use client";

import { useState } from "react";
import { JSX } from "react";
import Image from "next/image";
import calIcon from "@/public/calendar-svgrepo-com.svg";
import clockIcon from "@/public/clock-five-svgrepo-com.svg";
import copyIcon from "@/public/copy-svgrepo-com.svg";
import pinIcon from "@/public/map-pin-alt-svgrepo-com.svg";
import mapIcon from "@/public/map-svgrepo-com.svg";
import checkIcon from "@/public/check-circle-svgrepo-com.svg";
import { maxNumberOfChildren, minNumberOfChildren } from "@/app/shared/constants";

// Interface for needed information for component, and function to return data.
export interface EventComponentProps {
  venue: string;
  address: string;
  city: string;
  state: string;
  zip: number;
  date: Date | string;
  submission: (numOfChildren: number, acknowledgement: boolean) => Promise<void>;
}

// Used for formating date.
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function EventComponent(props: EventComponentProps): JSX.Element {
  // Logic for Terms agreement
  const [termsIsChecked, setTermsIsChecked] = useState<boolean>(false);
  const handleTermsCheckChange = () => {
    setTermsIsChecked(!termsIsChecked);
  };

  // Logic for number of children
  const [numOfChildren, setNumOfChildren] = useState<number>(0);
  const handleIncrementNumberOfChildren = () => {
    if (numOfChildren < maxNumberOfChildren) {
      setNumOfChildren(numOfChildren + 1);
    }
  };
  const handleDecrementNumberOfChildren = () => {
    if (numOfChildren > minNumberOfChildren) {
      setNumOfChildren(numOfChildren - 1);
    }
  };
  const maxAge = 12; // Max age for children

  // Form Submission Logic
  const [attemptedSubmission, setAttemptedSubmission] =
    useState<boolean>(false);
  const handleSubmission = () => {
    if (!termsIsChecked) {
      setAttemptedSubmission(true); // displays a warning message.
      return;
    }
    props.submission(numOfChildren, termsIsChecked);
    setAttemptedSubmission(false);
  };

  // Copy logic for address.
  const [coppiedToClipboard, setCoppiedToClipboard] = useState<boolean>(false);
  const handleCopyToClipboard = async () => {
    let fullAddress = `${props.address}\n${props.city} ${props.state}, ${props.zip}`;
    await navigator.clipboard.writeText(fullAddress);
    setCoppiedToClipboard(true);
    // reset state, so message is temporary.
    setTimeout(setCoppiedToClipboard, 3000, false);
  };

  // Date and Time formatting.
  const propsDate = new Date(props.date);
  const month = monthNames[propsDate.getMonth()]; // Want the word as a string, not number.
  const day = `${propsDate.getDate()}`.padStart(2, "0");
  const date = `${month} ${day}, ${propsDate.getFullYear()}`;
  const hour = propsDate.getHours() % 12; // Keep it in 12 hour format need a case for 12 0r 24 though
  const minute = `${propsDate.getMinutes()}`.padStart(2, "0");
  const time = `${hour !== 0 ? hour : 12}:${minute}`;

  const iconSize = 25; // Width Size for Icons

  const termsLink =
    "https://www.elevationchurch.org/acknowledgements-and-release";

  const cleanAddress = props.address.replaceAll(" ", "+");
  const cleanCity = props.city.replaceAll(" ", "+");
  const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${cleanAddress}+${cleanCity}+${props.state}`;

  return (
    <div className="w-full md:w-100 p-4 md:m-4 bg-gray-200 md:rounded-lg">
      <h1 className="font-bold text-lg">Event Details</h1>
      <div className="flex flex-grid w-full">
        <div className="my-2">
          <Image src={mapIcon} alt="Map Icon" width={iconSize} />
        </div>
        <div className="mx-2">
          <p>{props.venue}</p>
          <div className="text-xs">
            <p>{props.address}</p>
            <p>
              {props.city}, {props.state} {props.zip}
            </p>
          </div>
        </div>
        <div>
          <div className="flex ml-auto">
            <div className="items-center mx-2">
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={pinIcon}
                  alt="Map-Pin Icon"
                  width={iconSize}
                  className="mx-[25%] hover:cursor-pointer"
                />
              </a>
              <p className="text-xs">Directions</p>
            </div>
            <div className="items-center mx-2">
              <Image
                src={copyIcon}
                alt="Copy Icon"
                width={iconSize}
                onClick={handleCopyToClipboard}
                className="hover:cursor-pointer"
              />
              <p className="text-xs">Copy</p>
            </div>
          </div>
          <div className="text-xs w-full">
            <p className="">
              {coppiedToClipboard ? "Coppied to clipboard!" : ""}
            </p>
          </div>
        </div>
      </div>
      <div className="flex my-2 py-2">
        <Image src={calIcon} alt="Calender Icon" width={iconSize} />
        <p className="mx-2">{date}</p>
      </div>
      <div className="flex">
        <Image src={clockIcon} alt="Calender Icon" width={iconSize} />
        <p className="mx-2">{time}</p>
      </div>
      <div className="flex my-2">
        <p>Additional Children (0 - {maxAge}yrs)</p>
        <div className="flex rounded-full outline mr-2 ml-auto overflow-hidden">
          <button
            className="px-2 hover:bg-gray-400 hover:cursor-pointer"
            onClick={handleDecrementNumberOfChildren}
          >
            -
          </button>
          <p className="outline px-2">{numOfChildren}</p>
          <button
            className="px-2 hover:bg-gray-400 hover:cursor-pointer"
            onClick={handleIncrementNumberOfChildren}
          >
            +
          </button>
        </div>
      </div>
      <div className="flex my-2">
        <input
          type="checkbox"
          checked={termsIsChecked}
          onChange={handleTermsCheckChange}
          className="hover:cursor-pointer"
        />
        <p className="text-red-500 ml-2">{!termsIsChecked ? "*" : ""}</p>
        <p className="text-xs">
          By checking this box, you agree to the terms outlined in this&nbsp;
          <a
            href={termsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Acknowledgement & Release
          </a>
          &nbsp;form.
        </p>
      </div>
      <p className="text-red-500">
        {!termsIsChecked && attemptedSubmission
          ? "Must Accept Terms as stated above to RSVP"
          : ""}
      </p>
      <button
        className="flex rounded-full justify-center w-[80%] my-2 mx-[10%] p-2 bg-gray-800 hover:bg-black hover:cursor-pointer"
        onClick={handleSubmission}
      >
        <p className="text-white mx-2">RSVP</p>
        <Image
          src={checkIcon}
          alt="Copy Icon"
          width={iconSize}
          color="#ffffff"
        />
      </button>
    </div>
  );
}
