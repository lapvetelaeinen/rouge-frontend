import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Times from "../components/svg/Times";

export default function Create() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [date, setDate] = useState(new Date());
  // const [selectedDate, setSelectedDate] = useState(new Date());

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const createBooking = async (params) => {
    await axios.post(
      "https://vi35lyfbyc.execute-api.eu-west-2.amazonaws.com/bookin/book",
      params
    );
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data, "DATE: ", date);
    const stringDate = date.toString();
    setMessage("Tack för ditt meddelande!");
    createBooking({
      name: data.name,
      email: data.email,
      date: stringDate.substring(0, 10),
      description: data.description,
      phone: data.phone,
    });
    reset();
  };

  return (
    <div className="min-h-screen w-full bg-neutral-900">
      <div className="pt-14 pb-20 flex flex-col items-center">
        <h1 className="text-4xl text-center text-neutral-100 font-bold">
          Boka sittning?
        </h1>
        <p className="text-center pt-6 px-4 text-neutral-400 max-w-[600px]">
          Klart att ni ska boka er sittning hos oss på Rouge! Med tre bokbara
          rum, all tänkbar utrustning och härlig personal så ska vi se till att
          ni får uppleva läsårets galnaste sittning!
        </p>
      </div>
      <div id="boka" className="p-4 flex justify-center">
        <div className="bg-neutral-800 px-2 py-10 max-w-[600px] flex-1 rounded-lg">
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
              selected={date}
              onChange={(date) => setDate(date)}
              className="p-4 bg-neutral-700 placeholder-neutral-500 text-neutral-300 rounded-md shadow-sm text-sm w-full"
            />
            <div className="flex pb-1 mt-4">
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
            <div className="flex pb-1 mt-4">
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
            <div className="flex pb-1 mt-4">
              <div className="flex flex-col justify-end">
                <p className="text-neutral-400 text-lg pl-1 text-center">
                  Mobil{" "}
                </p>
              </div>

              <p className="inline text-2xl ml-2">📞</p>
            </div>
            <input
              type="text"
              placeholder="073-XXXXXXX"
              name="phone"
              {...register("phone")}
              className="p-4 text-sm bg-neutral-700 placeholder-neutral-500 text-neutral-300 rounded-md shadow-sm"
            />
            <div className="flex pb-1 mt-4">
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
              className="p-4 text-sm bg-neutral-700 placeholder-neutral-500 text-neutral-300 rounded-md shadow-sm mb-8"
            />

            <input
              type="submit"
              className="p-4 bg-[#D57187] placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm cursor-pointer hover:bg-violet-300"
              value="Begär offert"
            />
            {message ? (
              <div className="flex justify-center text-lg text-violet-300 mt-5">
                <p>{message}</p>
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}
