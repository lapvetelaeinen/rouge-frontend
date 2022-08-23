import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Times from "./svg/Times";
import styles from "../styles/Booking.module.css";

export default function Create() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const openModal = () => {
    setShowModal(true);
    reset();
  };

  const sendBooking = async (params) => {
    await axios.post("/api/booking", params);
  };

  const onSubmit = async (data) => {
    const bookingDetails = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      desc: data.desc,
      date: selectedDate.toString(),
    };
    console.log(bookingDetails);

    sendBooking(bookingDetails);
    openModal();
  };

  return (
    <div className="w-full bg-violet-200 flex flex-col items-center">
      {showModal ? (
        <div
          className={`bg-neutral-800 absolute z-50 h-full w-full flex justify-center items-center bg-opacity-80 no-scroll ${styles.noscroll}`}
        >
          <div className="bg-neutral-200 w-full min-h-[300px] m-4 rounded-3xl mb-40 max-w-[400px]">
            <div className="flex flex-col">
              <div className="flex justify-between p-1">
                <p></p>
                <Times
                  width={50}
                  height={50}
                  fill="#f57971"
                  onClick={() => setShowModal(!showModal)}
                  className="cursor-pointer"
                />
              </div>
              <h2 className="text-xl text-center mb-4">Super!</h2>
              <p className="text-center text-neutral-600 mb-4">
                Tack för ditt meddelande! <br /> Vi återkommer strax till dig
                med mer info.
              </p>
              <div className="mx-5">
                <button
                  className="bg-violet-400 w-full text-2xl text-neutral-700 rounded-lg py-6 shadow-lg cursor-pointer hover:bg-violet-300"
                  onClick={() => setShowModal(false)}
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="pt-14 pb-20 flex flex-col items-center align-center">
        <h1 className="text-4xl text-center text-neutral-700 font-bold">
          Boka sittning?
        </h1>
        <p className="text-center pt-6 px-4 text-neutral-500 max-w-[600px]">
          Självklart ska ni boka in er sittning hos oss på Rouge! Vi kommer göra
          allt i vår makt för att ge er den galnaste festen som ni nätt och
          jämnt ska komma ihåg men sent ska glömma! Fyll i formuläret nedan så
          återkommer våran fest-fixare till er.
        </p>
      </div>

      <div className="bg-violet-300 rounded-lg shadow-md p-4 mx-2 w-full md:min-w-[300px] md:max-w-[500px] mb-40">
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="flex flex-col gap-3"
        >
          <input
            type="text"
            placeholder="Förnamn"
            name="firstName"
            {...register("firstName")}
            className="p-4 bg-violet-300 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm bg-neutral-200"
          />

          <input
            type="text"
            placeholder="Efternamn"
            name="lastName"
            {...register("lastName")}
            className="p-4 bg-violet-300 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm bg-neutral-200"
          />

          <input
            type="text"
            placeholder="Email"
            name="email"
            {...register("email")}
            className="p-4 bg-violet-300 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm bg-neutral-200"
          />
          <DatePicker
            className="bg-neutral-100 rounded-md p-4 text-neutral-700 shadow-sm w-full"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />
          <input
            type="text"
            placeholder="Vilken typ av fest har ni tänkt?"
            name="desc"
            {...register("desc")}
            className="p-4 bg-violet-300 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm bg-neutral-200"
          />

          <input
            type="submit"
            className="p-4 bg-violet-600 placeholder-neutral-700 text-neutral-300 rounded-md shadow-sm cursor-pointer hover:bg-violet-500"
            value="Skicka"
          />
        </form>
      </div>
    </div>
  );
}
