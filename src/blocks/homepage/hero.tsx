import { FC } from "react";
import Link from "next/link";

import { MessageCircle, Search, ShieldQuestion } from "lucide-react";

const Hero: FC = () => (
  <>
    <div className="bg-neutral-950 min-h-screen text-center">
      <div className="max-w-5xl mx-auto xl:px-0 pt-24 lg:pt-32 pb-12 lg:pb-24">
        <span className="font-semibold text-white text-2xl md:text-4xl">
          <span className="text-blue-400 text-5xl md:text-6xl">Finbyte:</span>
          <br/> Helping users get engaged with <span className="text-blue-700">Cardano</span>.
        </span>

        <div>
          <p className="mt-5 text-neutral-400 text-sm lg:text-lg">
            Finbyte offers a secure platform for tokenized projects on the Cardano blockchain,
            allowing everyday users to contribute to project curation.
            Additionally, it provides a robust, free-to-use forum powered by Cardano's CIP-8
            technology, ensuring verified actions.
          </p>
        </div>

        <div className="mt-4 lg:mt-6 inline-flex flex-wrap px-2 justify-center gap-2 text-sm">
          <Link href='/forums'>
            <button className="inline-flex gap-2 items-center font-semibold bg-neutral-900 border border-neutral-700 p-1 px-4 rounded-lg text-neutral-200 opacity-80 hover:opacity-100 duration-300">
              <MessageCircle size={18}/>
              Forums
            </button>
          </Link>

          <Link href='/explore'>
            <button className="inline-flex gap-2 items-center font-semibold bg-neutral-900 border border-neutral-700 p-1 px-4 rounded-lg text-neutral-200 opacity-80 hover:opacity-100 duration-300">
              <Search size={18}/>
              Explore
            </button>
          </Link>
        </div>
        <img src="/finbyte.png" className="size-28 mx-auto mt-10"/>
      </div>
    </div>
  </>
)

export default Hero;