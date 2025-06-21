import finbyte_constributors from "@/verified/contributors";
import { FC } from "react";
import SocialIcon from "../social-icons";
import { Plus } from "lucide-react";


const TokenIntroduction: FC = ({

}) => {

  return (
    <div>
      <h1 className="text-xl font-semibold mt-6 lg:mt-12">
        A New Kind of Social Network
      </h1>

      <p>
        Finbyte is not just a social media platform, it's a community-powered network.
        Our goal is to build a space where your voice, support, and contributions carry
        real value. On Finbyte, engagement is currency. You can:
      </p>

      <div className="mt-2">
        <ol className="list-disc list-inside space-y-1">
          <li><span className="font-semibold">Earn tokens</span> by liking, posting, commenting, or participating in verified Cardano initiatives.</li>
          <li><span className="font-semibold">Support other communities or creators</span> by tipping or donating tokens, helping them grow their presence.</li>
          <li><span className="font-semibold">Stake your tokens</span> to earn passive rewards and unlock additional benefits over time.</li>
          <li><span className="font-semibold">Participate in governance</span> and help shape the future of Finbyte.</li>
        </ol>
      </div>

      <h1 className="text-xl font-semibold mt-6">
        Why Own $FIN?
      </h1>

      <p>
        While you can earn $FIN through engagement, there are powerful reasons to hold and buy the token too:
      </p>

      <div className="mt-2">
        <ol className="list-disc list-inside space-y-1">
          <li><span className="font-semibold">Access exclusive features</span> and tools on the platform (priority feeds, advanced analytics, creator boosts).</li>
          <li><span className="font-semibold">Participate in project funding</span> or unlock badges and support roles within other communities.</li>
          <li><span className="font-semibold">Earn staking rewards</span> by locking up your $FIN in the protocol.</li>
          <li><span className="font-semibold">Support the broader Cardano ecosystem</span> by empowering verified projects directly through your Finbyte activity.</li>
        </ol>
      </div>

      <p>Every transaction on Finbyte fuels a circular economy where value stays with the community, not with centralized platforms.</p>

      <div className="mt-6" />
      <h1 className="text-xl font-semibold">
        Meet The Contributors & Team
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full mt-2">
        {finbyte_constributors.map((user, index) => (
          <div key={index} className="w-full p-4 bg-secondary rounded-xl">
            <img src={user.image} className="mx-auto rounded-lg" />

            <h1 className="text-sm text-muted-foreground text-center mt-2">
              {user.name}
            </h1>

            <div className="flex flex-wrap gap-1 items-center justify-center mt-2">
              {user.roles.map((item) => (
                <div key={item} className="text-xs font-medium px-2 p-1 rounded-lg border dark:border-slate-700">
                  {item}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1 items-center justify-center mt-2">
              {Object.entries(user.links).map(([key, value]) => (
                <SocialIcon key={key} only_icon={false} name={key} link={value} />
              ))}
            </div>
          </div>
        ))}

        <div className="w-full h-full p-4 bg-secondary rounded-xl flex flex-col justify-center">
          <Plus className="w-24 mx-auto rounded-lg" />

          <div className="text-sm text-muted-foreground text-center mt-2">
            <span className="text-primary font-semibold text-base">This could be you!</span>
            <br />
            Get in touch now to learn how.
          </div>

          <div className="flex flex-wrap gap-1 items-center justify-center mt-2">
            <div className="text-xs font-medium px-2 p-1 rounded-lg border dark:border-slate-700">
              Contributor
            </div>
          </div>

          <div className="flex flex-wrap gap-1 items-center justify-center mt-2">
            <SocialIcon only_icon={false} name={'discord'} link={'https://discord.gg/EVawcspwyp'} />
            <SocialIcon only_icon={false} name={'x'} link={'https://www.x.com/adaFinbyte'} />
            <SocialIcon only_icon={false} name={'website'} link={'https://finbyte.network/'} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenIntroduction;