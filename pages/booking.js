import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Times from "../components/svg/Times";

export default function Booking() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date());
  // const [selectedDate, setSelectedDate] = useState(new Date());

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const createBooking = async (params) => {
    await axios.post(
      "https://vi35lyfbyc.execute-api.eu-west-2.amazonaws.com/bookin/book",
      params
    );
  };

  const onSubmit = async (data) => {
    console.log(data, "DATE: ", date);
    const stringDate = date.toString();
    createBooking({
      name: data.name,
      email: data.email,
      date: stringDate.substring(0, 10),
      desc: data.description,
    });
  };

  return (
    <>
      <div className="bg-neutral-800 flex justify-center">
        <div className="bg-neutral-800 min-h-screen px-2 pt-10 max-w-[600px] flex-1">
          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
            className="flex flex-col"
          >
            <div className="flex pb-1">
              <div className="flex flex-col justify-end">
                <p className="text-neutral-400 text-lg pl-1 text-center">
                  När vill ni slänga klackarna i taket?{" "}
                </p>
              </div>

              <p className="inline text-2xl ml-2">💃</p>
            </div>
            <DatePicker
              selected={new Date()}
              className="p-4 bg-neutral-700 placeholder-neutral-500 text-neutral-300 rounded-md shadow-sm text-sm w-full"
            />
            <div className="flex pb-1">
              <div className="flex flex-col justify-end">
                <p className="text-neutral-400 text-lg pl-1 text-center">
                  Kontaktperson{" "}
                </p>
              </div>

              <p className="inline text-2xl ml-2">🕺🏼</p>
            </div>

            <input
              type="text"
              placeholder="Lasse Larsson"
              name="name"
              {...register("name")}
              className="p-4 bg-neutral-700 placeholder-neutral-500 text-sm text-neutral-300 rounded-md shadow-sm"
            />
            <div className="flex pb-1">
              <div className="flex flex-col justify-end">
                <p className="text-neutral-400 text-lg pl-1 text-center">
                  Email{" "}
                </p>
              </div>

              <p className="inline text-2xl ml-2">📨</p>
            </div>
            <input
              type="text"
              placeholder="lambolasse@gmail.com"
              name="email"
              {...register("email")}
              className="p-4 text-sm bg-neutral-700 placeholder-neutral-500 text-neutral-300 rounded-md shadow-sm"
            />
            <div className="flex pb-1">
              <div className="flex flex-col justify-end">
                <p className="text-neutral-400 text-lg pl-1 text-center">
                  Vilken typ av sittning?{" "}
                </p>
              </div>

              <p className="inline text-2xl ml-2">🪩</p>
            </div>

            <input
              type="text"
              placeholder="Vi ska fira en tisdag mitt i livet!"
              name="description"
              {...register("description")}
              className="p-4 text-sm bg-neutral-700 placeholder-neutral-500 text-neutral-300 rounded-md shadow-sm"
            />

            <input
              type="submit"
              className="p-4 bg-[#D57187] placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm"
              value="Begär offert"
            />
          </form>
        </div>
      </div>
    </>
  );
}
