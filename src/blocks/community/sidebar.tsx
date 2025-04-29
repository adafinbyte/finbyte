import CuratorsModal from "@/components/modals/curators";
import RepCommunityModal from "@/components/modals/rep-community";
import SocialIcon from "@/components/social-icons";
import { FinbyteContext } from "@/contexts";
import useThemedProps from "@/contexts/themed-props";
import { fetch_author_data } from "@/utils/api/account/fetch";
import { update_representing_community } from "@/utils/api/account/push";
import { format_long_string } from "@/utils/string-tools";
import { verified_token } from "@/verified/interfaces";
import { checkSignature, generateNonce } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { ArrowRight } from "lucide-react";
import { Dispatch, FC, SetStateAction, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface custom_props {
  token: verified_token;

  tab_list:   string[];
  active_tab: number;
  set_tab:    Dispatch<SetStateAction<number>>

  post_length: number;
}

const CommunitySidebar: FC <custom_props> = ({
  token, tab_list, active_tab, set_tab, post_length
}) => {
  const { theme } = useContext(FinbyteContext);
  const themed = useThemedProps();
  const use_wallet = useWallet();
  const wallet = use_wallet.wallet;

  const [finbyte_user, set_finbyte_user] = useState(false);
  const [show_curators, set_show_curators] = useState(false);
  const [community_badge, set_community_badge] = useState<string | undefined>(undefined);

  const get_user_details = async () => {
    const account_details = await fetch_author_data(use_wallet.address);
    console.log(account_details)
    if (account_details) {
      set_finbyte_user(true);
      set_community_badge(account_details.accountData?.community_badge)
    }
  }

  useEffect(() => {
    if (use_wallet.connected) {
      get_user_details();
    }
  }, [use_wallet.connected]);

  const [show_rep_community_modal, set_show_rep_community_modal] = useState(false);

  const themed_ext = {
    Neutral: {
      active_sidebar: 'bg-neutral-800/40 text-neutral-200 italic',
    },
    Slate: {
      active_sidebar: 'bg-slate-800/40 text-slate-200 italic',
    },
  }

  const represent_community = async () => {
    if (!use_wallet.connected || !finbyte_user) { return; } else {
      const timestamp = Math.floor(Date.now() / 1000);
      try {
        const signing_data = `${format_long_string(use_wallet.address)} is updating their community badge at ${timestamp}`;
        const nonce = generateNonce(signing_data);
        const signature = await wallet.signData(nonce, use_wallet.address);
        if (signature) {
          const is_valid_sig = await checkSignature(nonce, signature, use_wallet.address);
          if (is_valid_sig) {
            await update_representing_community(use_wallet.address, timestamp, '$' + token.token_details.ticker);
            await get_user_details();
          } else {
            toast.error('Signature verification failed! Whoops.');
            return;
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          throw error;
        }
      }
    }
    set_show_rep_community_modal(false)
  }

  return (
    <>
      <div style={{ placeSelf: 'start'}} className={`w-full lg:w-64 flex flex-col text-right rounded-lg border ${themed['700'].border}`}>
        <div className={`flex gap-2 items-center justify-between p-2 border-b ${themed['700'].border}`}>
          <img src={token.images.logo} className="size-12 rounded-lg"/>

          <div className="flex flex-col">
            <h1 className={`text-lg font-semibold ${themed['300'].text}`}>
              {token.name}
            </h1>

            <span className={`cursor-default border ${themed['800'].border} p-0.5 px-2 text-xs rounded inline-flex`}>
              <sub className="text-[8px] mt-1 mr-0.5 text-green-400">$</sub>
              <span className={`${themed['300'].text}`}>
                {token.token_details.ticker}
              </span>
            </span>
          </div>
        </div>

        <div className={`flex flex-wrap gap-1 items-center p-2 border-b ${themed['700'].border}`}>
          {Object.entries(token.links).map(([key, value], index) => key !== 'website' && (
            <SocialIcon key={index} name={key} link={value}/>
          ))}
        </div>

        <div className={`flex flex-col ${themed['300'].text}`}>
          {tab_list.map((tab, index) => (
            <button key={index} onClick={() => set_tab(index)} className={`w-full text-left inline-flex items-center p-2 ${themed.effects.transparent_button.hover} text-sm ${active_tab === index ? themed_ext[theme].active_sidebar : ''}`}>
              {tab}

              {tab === 'Community' && (
                <span className="text-blue-400 text-xs ml-auto">
                  {post_length.toLocaleString()}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className={`border-t ${themed['700'].border} p-2 flex flex-col gap-2 text-left`}>
          <h1 className={`${themed['400'].text} font-semibold text-[10px]`}>
            Finbyte
          </h1>

          <div className="flex flex-wrap gap-2">
            <button
              title={!finbyte_user ? 'Registered user not found' : community_badge === '$' + token.token_details.ticker ? "You're already representing this community! Kudos." : 'Represent Community'}
              onClick={() => set_show_rep_community_modal(true)} disabled={(!finbyte_user || community_badge === '$' + token.token_details.ticker || !use_wallet.connected)}
              className={`${(!finbyte_user || community_badge === '$' + token.token_details.ticker || !use_wallet.connected) ? 'opacity-50' : themed.effects.transparent_button.hover} duration-150 ${themed['300'].text} text-xs inline-flex ${themed['900'].bg} px-2 py-1 rounded-lg border ${themed['700'].border}`}>
              Represent ${token.token_details.ticker}
            </button>

            <button onClick={() => set_show_curators(true)} className={`${themed.effects.transparent_button.hover} duration-150 ${themed['300'].text} text-xs inline-flex ${themed['900'].bg} px-2 py-1 rounded-lg border ${themed['700'].border}`}>
              Curators
            </button>
          </div>
        </div>

        {token.links.website && (
          <div className={`flex flex-col w-full p-2 text-xs border-t ${themed['700'].border}`}>
            <a href={token.links.website} target="_blank" className="group text-blue-400 inline-flex items-center ml-auto gap-1">
              Learn more about {token.name}
              <ArrowRight size={12} className="group-hover:translate-x-0.5 duration-300 mr-1"/>
            </a>
          </div>
        )}
      </div>

      <RepCommunityModal
        is_modal_open={show_rep_community_modal}
        close_modal={() => set_show_rep_community_modal(false)}
        token_ticker={token.token_details.ticker}
        token_image={token.images.logo}
        on_confirm={represent_community}
      />

      <CuratorsModal
        is_modal_open={show_curators}
        close_modal={() => set_show_curators(false)}
        curators={token.finbyte.curators}
      />
    </>
  )
}

export default CommunitySidebar;