import { HandCoins, MessageCircle, Users } from "lucide-react";
import { FC } from "react";


const About: FC = () => {
  const icon_size = 20;

  const about_items = [
    {
      icon:  <MessageCircle size={icon_size} className="text-neutral-300"/>,
      title: "Community Driven Forums",
      about: "Unique to Cardano, Finbyte's Forums is a Web3 social platform that uses your browser wallet to verify your actions at no cost, ensuring a seamless and secure experience.",
    },
    {
      icon:  <HandCoins size={icon_size} className="text-neutral-300"/>,
      title: "User Curated Projects",
      about: "You don't need to pay to request or modify your favorite tokenized projects on Finbyte. The process is as simple as creating a forum post with a request tag and waiting for the community to vote.",
    },
    {
      icon:  <Users size={icon_size} className="text-neutral-300"/>,
      title: "Finbyte Curators",
      about: "Curators play a significant role on Finbyte, and to express our appreciation, we have created dedicated curator pages. These pages can serve as valuable references to enhance your presence within the Cardano community.",
    },
  ];

  return (
<div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
  <div className="grid md:grid-cols-2 gap-12" style={{ placeItems: 'center' }}>
    <div className="lg:w-3/4">
      <h2 className="text-3xl text-gray-800 font-bold lg:text-4xl dark:text-white">
        For Cardano Users, Built by Cardano Users.
      </h2>
      <p className="mt-3 text-gray-800 dark:text-neutral-400">
        If you have a passion for Cardano, the Finbyte Platform is an ideal place for you.
        Whether that means helping curate projects or engaging with the community, you will
        find numerous opportunities to contribute and grow.
      </p>

      <p className="mt-5">
        <a className="inline-flex items-center gap-x-1 text-sm text-blue-400 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium" href="#">
          Find out about getting started on Finbyte
          <svg className="shrink-0 size-4 transition ease-in-out group-hover:translate-x-1 group-focus:translate-x-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </a>
      </p>
    </div>

    <div className="space-y-6 lg:space-y-10">
      {about_items.map((item, index) => (
      <div key={index} className="flex gap-x-5 sm:gap-x-8">
        <span className="m-auto shrink-0 inline-flex justify-center items-center size-11 rounded-full border-2 border-blue-400 bg-neutral-800 text-gray-800 shadow-2xs">
          {item.icon}
        </span>
        <div className="grow">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-neutral-200">
            {item.title}
          </h3>
          <p className="mt-1 text-gray-600 dark:text-neutral-400">
            {item.about}
          </p>
        </div>
      </div>
      ))}
    </div>
  </div>
</div>
  )
}

export default About;