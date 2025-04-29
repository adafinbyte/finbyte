import { FC } from "react";
import Hero from "./hero";
import About from "./about";

const Homepage: FC = () => (
  <div className="py-4 lg:mt-6">
    <Hero/>

    <About/>
  </div>
)

export default Homepage;