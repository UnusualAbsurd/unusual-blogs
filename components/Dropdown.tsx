import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { BsCheckLg as CheckIcon } from "react-icons/bs";
import { HiSelector as SelectorIcon } from "react-icons/hi";
import { User } from "../typings";
import { IoNotificationsSharp } from "react-icons/io5";

const people = [{ name: "Notifications", icon: <IoNotificationsSharp /> }];

interface Props {
  user: User;
}

export default function Dropdown({ user }: Props) {
  const [selected, setSelected] = useState({ name: user.username });

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative mt-1">
        <Listbox.Button className="relative  py-2 px-10 text-left bg-transparent rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
          <span className="block truncate text-white text-xl">
            {selected.name}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <SelectorIcon
              className="w-5 h-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {people.map((person, personIdx) => (
              <Listbox.Option
                key={personIdx}
                className={({ active }) =>
                  `cursor-default select-none relative py-2 pl-10 pr-4 ${
                    active
                      ? "text-amber-900 bg-gray-400 hover:text-white"
                      : "text-gray-900"
                  }`
                }
                value={
                  <>
                    <div className="flex items-center space-x-2">
                      <IoNotificationsSharp /> <span>{person.name}</span>
                    </div>
                  </>
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate text-black hover:text-white ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {person.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                        {person.icon}
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
